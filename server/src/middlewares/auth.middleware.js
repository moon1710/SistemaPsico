const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const isInstitutionActive = (s) => ["ACTIVO", "ACTIVA", "ACTIVE"].includes(s);

/**
 * Middleware principal de autenticación JWT
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
        code: "NO_TOKEN",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({
            success: false,
            message: "Token expirado",
            code: "TOKEN_EXPIRED",
          });
      } else if (jwtError.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({
            success: false,
            message: "Token inválido",
            code: "TOKEN_INVALID",
          });
      }
      throw jwtError;
    }

    const [userRows] = await pool.execute(
      `SELECT u.id, u.institucionId, u.nombre, u.apellidoPaterno, u.apellidoMaterno, 
              u.nombreCompleto, u.email, u.rol, u.status, u.emailVerificado,
              u.perfilCompletado, u.lastLogin,
              i.nombre AS institucionNombre, i.status AS institucionStatus
       FROM usuarios u
       LEFT JOIN instituciones i ON u.institucionId = i.id
       WHERE u.id = ? AND u.status = 'ACTIVO'`,
      [decoded.id]
    );

    if (userRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Usuario no encontrado o inactivo",
        code: "USER_NOT_FOUND",
      });
    }

    const user = userRows[0];

    // Institución activa (excepto SUPER_ADMIN_NACIONAL)
    if (
      user.rol !== "SUPER_ADMIN_NACIONAL" &&
      !isInstitutionActive(user.institucionStatus)
    ) {
      return res.status(403).json({
        success: false,
        message: "Institución inactiva",
        code: "INSTITUTION_INACTIVE",
      });
    }

    req.user = {
      id: user.id,
      institucionId: user.institucionId,
      institucionNombre: user.institucionNombre,
      nombre: user.nombre,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      rol: user.rol,
      status: user.status,
      perfilCompletado: user.perfilCompletado,
      lastLogin: user.lastLogin,
    };

    next();
  } catch (error) {
    console.error("Error en middleware de autenticación:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error interno del servidor",
        code: "INTERNAL_ERROR",
      });
  }
};

/**
 * Middleware para verificar roles específicos
 */
const requireRoles = (allowedRoles) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Usuario no autenticado",
          code: "NOT_AUTHENTICATED",
        });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: "Permisos insuficientes",
        code: "INSUFFICIENT_PERMISSIONS",
        required: roles,
        current: req.user.rol,
      });
    }

    next();
  };
};

/**
 * Middleware para verificar acceso a institución específica
 * Solo SUPER_ADMIN_NACIONAL puede acceder a cualquier institución
 */
const requireInstitutionAccess = (req, res, next) => {
  const { institucionId } = req.params;
  if (!institucionId) {
    return res
      .status(400)
      .json({
        success: false,
        message: "ID de institución requerido",
        code: "INSTITUTION_ID_REQUIRED",
      });
  }

  if (req.user.rol === "SUPER_ADMIN_NACIONAL") return next();

  // IDs son VARCHAR en sistema_educativo
  if (req.user.institucionId !== institucionId) {
    return res.status(403).json({
      success: false,
      message: "Sin acceso a esta institución",
      code: "INSTITUTION_ACCESS_DENIED",
    });
  }

  next();
};

/**
 * Middleware combinado para roles con verificación de institución
 */
const requireRolesWithInstitution = (allowedRoles) => {
  return [
    authenticateToken,
    requireRoles(allowedRoles),
    requireInstitutionAccess,
  ];
};

/** Solo SUPER_ADMIN_NACIONAL */
const requireSuperAdminNacional = [
  authenticateToken,
  requireRoles("SUPER_ADMIN_NACIONAL"),
];

/** Admin de institución (compat temporal con ambos nombres) */
const requireInstitutionAdmin = (req, res, next) => {
  return requireRolesWithInstitution([
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ])(req, res, next);
};

/** Psicólogos (incluye admins) */
const requirePsychologist = [
  authenticateToken,
  requireRoles([
    "PSICOLOGO",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
];

module.exports = {
  authenticateToken,
  requireRoles,
  requireInstitutionAccess,
  requireRolesWithInstitution,
  requireSuperAdminNacional,
  requireInstitutionAdmin,
  requirePsychologist,
};
