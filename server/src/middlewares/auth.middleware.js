// server/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const { pool } = require("../db");

/* =========================
   Helpers
========================= */

const isActive = (s) =>
  ["ACTIVO", "ACTIVA", "ACTIVE"].includes(String(s || "").toUpperCase());

const uniq = (arr) => [...new Set((arr || []).filter(Boolean))];

function getUserRoles(user) {
  const rolesFromMemberships = (user?.instituciones || [])
    .filter((m) => m?.isMembershipActiva && m?.isInstitucionActiva)
    .map((m) => m?.rol);

  const globalRole = user?.rol; // SUPER_ADMIN_NACIONAL si aplica
  return uniq([globalRole, ...rolesFromMemberships]);
}

function hasAnyRole(user, allowedRoles = []) {
  const userRoles = user?.roles || getUserRoles(user);
  return (allowedRoles || []).some((r) => userRoles.includes(r));
}

/**
 * Resuelve el institucionId objetivo a partir de:
 * - params: :institucionId
 * - headers: x-institucion-id / x-institution-id
 * - query: ?institucionId=
 * - body: { institucionId }
 */
function resolveInstitutionId(req) {
  return (
    req?.params?.institucionId ||
    req?.headers?.["x-institucion-id"] ||
    req?.headers?.["x-institution-id"] ||
    req?.query?.institucionId ||
    req?.body?.institucionId ||
    null
  );
}

function getMembershipForInstitution(user, institucionId) {
  const instId = String(institucionId || "");
  return (user?.instituciones || []).find(
    (m) => String(m?.institucionId) === instId
  );
}

/* =========================
   Auth: verify JWT + load user
========================= */

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado",
        code: "NO_TOKEN",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const isExpired = err?.name === "TokenExpiredError";
      return res.status(401).json({
        success: false,
        message: isExpired ? "Token expirado" : "Token inválido",
        code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      });
    }

    // Cargar usuario base (incluye rol global si existe)
    const [userRows] = await pool.execute(
      `SELECT id, nombre, apellidoPaterno, apellidoMaterno, nombreCompleto,
              email, status, emailVerificado, perfilCompletado, lastLogin,
              rol
       FROM usuarios
       WHERE id = ?`,
      [decoded.id]
    );

    if (userRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado",
        code: "USER_NOT_FOUND",
      });
    }

    const base = userRows[0];

    // Usuario global super admin
    const isSuperAdminNacional =
      String(base.rol || decoded.rolGlobal || "") === "SUPER_ADMIN_NACIONAL";

    // Si no está activo y NO es super admin nacional => bloquear
    if (!isSuperAdminNacional && !isActive(base.status)) {
      return res.status(403).json({
        success: false,
        message: "Usuario inactivo",
        code: "USER_INACTIVE",
      });
    }

    // Cargar membresías (si aplica). Para super admin nacional puede venir vacío y está ok.
const [instRows] = await pool.execute(
  `SELECT
      ui.institucionId,
      ui.rolInstitucion AS rol,
      ui.activo AS membershipActiva,
      i.nombre AS institucionNombre,
      i.status AS institucionStatus
   FROM usuario_institucion ui
   JOIN instituciones i ON i.id = ui.institucionId
   WHERE ui.usuarioId = ?`,
  [base.id]
);


const instituciones = (instRows || []).map((r) => ({
  institucionId: String(r.institucionId),
  rol: r.rol,
  isMembershipActiva: Boolean(r.membershipActiva),
  isInstitucionActiva: isInstitutionActive(r.institucionStatus), // ✅
  institucionNombre: r.institucionNombre,
  institucionStatus: r.institucionStatus,
}));


    // Si NO es super admin nacional y no tiene instituciones, bloquear
    if (!isSuperAdminNacional && instituciones.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Usuario sin instituciones asignadas",
        code: "NO_INSTITUTIONS",
      });
    }

    // Construir req.user consistente
    const userObj = {
      id: base.id,
      nombre: base.nombre,
      apellidoPaterno: base.apellidoPaterno,
      apellidoMaterno: base.apellidoMaterno,
      nombreCompleto: base.nombreCompleto,
      email: base.email,
      status: base.status,
      emailVerificado: base.emailVerificado,
      perfilCompletado: base.perfilCompletado,
      lastLogin: base.lastLogin,

      // rol global SOLO si aplica
      rol: isSuperAdminNacional ? "SUPER_ADMIN_NACIONAL" : undefined,

      instituciones,
    };

    userObj.roles = getUserRoles(userObj);

    req.user = userObj;
    req.token = token;

    next();
  } catch (error) {
    console.error("💥 Error en authenticateToken:", error?.stack || error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "AUTH_INTERNAL_ERROR",
    });
  }
}

/* =========================
   Role checks (global + memberships)
========================= */

const requireRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "No autenticado",
        code: "NOT_AUTHENTICATED",
      });
    }

    if (!hasAnyRole(req.user, allowedRoles)) {
      return res.status(403).json({
        success: false,
        message: "Permisos insuficientes",
        code: "INSUFFICIENT_ROLE",
        required: allowedRoles,
        current: req.user.roles || [],
      });
    }

    next();
  };
};

function requireSuperAdminNacional(req, res, next) {
  if (req.user?.rol === "SUPER_ADMIN_NACIONAL") return next();
  return res.status(403).json({
    success: false,
    message: "Acceso denegado: requiere SUPER_ADMIN_NACIONAL",
    code: "REQUIRES_SUPER_ADMIN_NACIONAL",
  });
}

/* =========================
   Institution access checks
========================= */
function requireInstitutionAccess(req, res, next) {
  const institucionId = resolveInstitutionId(req);

  // ✅ SUPER_ADMIN_NACIONAL: acceso global
  // - no obliga a traer institucionId
  // - si viene, solo lo setea como "contexto"
  if (req.user?.rol === "SUPER_ADMIN_NACIONAL") {
    req.institucionId = institucionId ? String(institucionId) : null;
    req.membership = institucionId
      ? getMembershipForInstitution(req.user, institucionId) || null
      : null;
    return next();
  }

  // Resto de usuarios: sí requieren institución
  if (!institucionId) {
    return res.status(400).json({
      success: false,
      message: "Falta institucionId (params/header/query/body)",
      code: "MISSING_INSTITUTION_ID",
    });
  }

  const membership = getMembershipForInstitution(req.user, institucionId);

  if (!membership) {
    return res.status(403).json({
      success: false,
      message: "No perteneces a esta institución",
      code: "NO_INSTITUTION_MEMBERSHIP",
    });
  }

  if (!membership.isInstitucionActiva) {
    return res.status(403).json({
      success: false,
      message: "Institución inactiva",
      code: "INSTITUTION_INACTIVE",
    });
  }

  if (!membership.isMembershipActiva) {
    return res.status(403).json({
      success: false,
      message: "Membresía inactiva en la institución",
      code: "MEMBERSHIP_INACTIVE",
    });
  }

  req.institucionId = String(institucionId);
  req.membership = membership;

  next();
}


/**
 * Exige:
 * - token válido
 * - acceso a institución (via requireInstitutionAccess)
 * - rol específico EN ESA institución, o rol global permitido
 */
const requireRolesWithInstitution = (allowedRoles = []) => {
  return [
    authenticateToken,
    requireInstitutionAccess,
    (req, res, next) => {
      // SUPER_ADMIN_NACIONAL siempre pasa
      if (req.user?.rol === "SUPER_ADMIN_NACIONAL") return next();

      const membership =
        req.membership ||
        getMembershipForInstitution(req.user, req.institucionId);
      const roleHere = membership?.rol;

      if (!roleHere || !allowedRoles.includes(roleHere)) {
        return res.status(403).json({
          success: false,
          message: "Permisos insuficientes para la institución",
          code: "INSUFFICIENT_ROLE_FOR_INSTITUTION",
          required: allowedRoles,
          current: roleHere || null,
          institucionId: req.institucionId,
        });
      }

      next();
    },
  ];
};

/* =========================
   Ready-to-use composed middlewares
========================= */

// Miembro activo (cualquier rol) dentro de una institución
const requireInstitutionMember = [authenticateToken, requireInstitutionAccess];

// Admin institucional (solo admin roles dentro de esa institución, o super admin nacional)
const requireInstitutionAdmin = requireRolesWithInstitution([
  "ADMIN_INSTITUCION",
  "SUPER_ADMIN_INSTITUCION",
]);

function requirePsychologist(req, res, next) {
  const rolesPermitidos = ["PSICOLOGO", "ORIENTADOR", "SUPER_ADMIN_NACIONAL"];
  if (!req.user || !hasAnyRole(req.user, rolesPermitidos)) {
    return res.status(403).json({
      success: false,
      message: "Acceso no autorizado",
      code: "INSUFFICIENT_ROLE",
    });
  }
  next();
}

/* =========================
   Exports
========================= */

module.exports = {
  authenticateToken,
  requireRoles,
  requireSuperAdminNacional,

  resolveInstitutionId,
  getMembershipForInstitution,

  requireInstitutionAccess,
  requireRolesWithInstitution,

  requireInstitutionMember,
  requireInstitutionAdmin,

  requirePsychologist,
};
