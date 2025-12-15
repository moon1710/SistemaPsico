// controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { pool } = require("../db");
// const { crearNotificacionBienvenida } = require("./notifications.controller");

const uniq = (arr) => [...new Set((arr || []).filter(Boolean))];

const isInstitutionActive = (s) =>
  ["ACTIVO", "ACTIVA", "ACTIVE"].includes(String(s || "").toUpperCase());

/** Asignar psicólogo automáticamente a estudiante */
const autoAssignPsychologist = async (conn, studentId, institucionId) => {
  try {
    const [psychologists] = await conn.execute(
      `SELECT u.id
       FROM usuarios u
       JOIN usuario_institucion ui ON u.id = ui.usuarioId
       WHERE ui.institucionId = ?
         AND ui.rolInstitucion = 'PSICOLOGO'
         AND ui.activo = 1
         AND u.status = 'ACTIVO'
       ORDER BY RAND()
       LIMIT 1`,
      [institucionId]
    );

    if (psychologists.length === 0) return;

    const psychologistId = psychologists[0].id;

    const [existing] = await conn.execute(
      `SELECT 1
       FROM tutores_alumnos
       WHERE alumnoId = ? AND activo = 1
       LIMIT 1`,
      [studentId]
    );

    if (existing.length > 0) return;

    const tutorAlumnoId = crypto.randomUUID();
    await conn.execute(
      `INSERT INTO tutores_alumnos (id, institucionId, alumnoId, tutorId, activo)
       VALUES (?, ?, ?, ?, 1)`,
      [tutorAlumnoId, institucionId, studentId, psychologistId]
    );
  } catch (error) {
    console.error("Error auto-assigning psychologist:", error.message);
  }
};

/** Generar JWT (compatible con SUPER_ADMIN_NACIONAL) */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    rolGlobal:
      user.rol === "SUPER_ADMIN_NACIONAL" ? "SUPER_ADMIN_NACIONAL" : undefined,
    instituciones: user.instituciones || [], // array de { institucionId, rol, ... }
    roles: user.roles || undefined, // opcional para UI
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });
};

/** Sanitizar user para respuesta */
const sanitizeUser = (user) => ({
  id: user.id,
  nombre: user.nombre,
  apellidoPaterno: user.apellidoPaterno,
  apellidoMaterno: user.apellidoMaterno,
  nombreCompleto: user.nombreCompleto,
  email: user.email,
  telefono: user.telefono,
  direccion: user.direccion,
  genero: user.genero,
  fechaNacimiento: user.fechaNacimiento,
  foto: user.foto,
  status: user.status,
  emailVerificado: user.emailVerificado,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
  perfilCompletado: user.perfilCompletado,
  requiereCambioPassword: user.requiereCambioPassword,

  // ✅ para super admin / permisos
  rol: user.rol, // "SUPER_ADMIN_NACIONAL" si aplica
  roles: user.roles || undefined,

  instituciones: user.instituciones || [],
});

/** REGISTER (por defecto: registro público SOLO ESTUDIANTE) */
const register = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno = null,
      email,
      password,
      institucionId = null,
      carreraId = null,
    } = req.body;

    // ✅ Seguridad: registro público NO debe permitir escoger rol admin
    // Si quieres permitirlo temporalmente en dev:
    // PUBLIC_REGISTER_ALLOW_ROLES=true
    let rol = "ESTUDIANTE";
    if (
      String(process.env.PUBLIC_REGISTER_ALLOW_ROLES || "").toLowerCase() ===
      "true"
    ) {
      // en dev puedes mandar rol, pero igual bloquea SUPER_ADMIN_NACIONAL por aquí
      if (req.body.rol && req.body.rol !== "SUPER_ADMIN_NACIONAL")
        rol = req.body.rol;
    }

    // Registro público requiere institución válida
    const [instRows] = await pool.execute(
      "SELECT id, status FROM instituciones WHERE id = ?",
      [String(institucionId)]
    );

    if (instRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Institución inválida",
        code: "INSTITUTION_INVALID",
      });
    }

    if (!isInstitutionActive(instRows[0].status)) {
      return res.status(400).json({
        success: false,
        message: "Institución inactiva",
        code: "INSTITUTION_INACTIVE",
      });
    }

    // Unicidad de email
    const [existsRows] = await pool.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      [String(email).trim()]
    );
    if (existsRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con ese email",
        code: "DUPLICATE_EMAIL",
      });
    }

    await conn.beginTransaction();

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const nombreCompleto = `${String(nombre).trim()} ${String(
      apellidoPaterno
    ).trim()}${
      apellidoMaterno ? " " + String(apellidoMaterno).trim() : ""
    }`.trim();

    // ✅ Importante: en registro público NO setear rol global.
    // rol global se reserva para SUPER_ADMIN_NACIONAL via proceso interno.
    await conn.execute(
      `INSERT INTO usuarios 
        (id, carreraId, email, emailVerificado, passwordHash, 
         nombre, apellidoPaterno, apellidoMaterno, nombreCompleto, 
         status, requiereCambioPassword, perfilCompletado, lastLogin, createdAt, updatedAt, rol)
       VALUES
        (?, ?, ?, 1, ?, ?, ?, ?, ?, 'ACTIVO', 0, 0, NULL, NOW(3), NOW(3), NULL)`,
      [
        id,
        carreraId,
        String(email).trim(),
        passwordHash,
        String(nombre).trim(),
        String(apellidoPaterno).trim(),
        apellidoMaterno ? String(apellidoMaterno).trim() : null,
        nombreCompleto,
      ]
    );

    // Crear membresía
    await conn.execute(
      `INSERT INTO usuario_institucion (usuarioId, institucionId, rolInstitucion, activo)
       VALUES (?, ?, ?, 1)`,
      [id, String(institucionId), rol]
    );

    // Traer instituciones
    const [instituciones] = await conn.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ? AND ui.activo = 1`,
      [id]
    );

    // Asignar psicólogo automáticamente si es estudiante
    if (rol === "ESTUDIANTE" && institucionId) {
      await autoAssignPsychologist(conn, id, institucionId);
    }

    await conn.commit();

    // Notificación bienvenida (opcional)
    // try { await crearNotificacionBienvenida(id, nombreCompleto, rol); } catch {}

    const shapedUser = {
      id,
      nombre: String(nombre).trim(),
      apellidoPaterno: String(apellidoPaterno).trim(),
      apellidoMaterno: apellidoMaterno ? String(apellidoMaterno).trim() : null,
      nombreCompleto,
      email: String(email).trim(),
      status: "ACTIVO",
      emailVerificado: 1,
      perfilCompletado: 0,
      requiereCambioPassword: 0,
      rol: undefined,
      instituciones: payloadInstituciones,
    };

    shapedUser.roles = shapedUser.instituciones.map((m) => m.rol);

    const token = generateToken(shapedUser);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: {
        accessToken: token,
        tokenType: "Bearer",
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
        user: sanitizeUser(shapedUser),
      },
    });
  } catch (error) {
    try {
      await conn.rollback();
    } catch {}
    console.error(
      "❌ Error en register:",
      error?.sqlMessage || error?.message || error
    );
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    });
  } finally {
    if (conn) conn.release();
  }
};

/** LOGIN (incluye SUPER_ADMIN_NACIONAL global) */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // ✅ Permitir login con email O matrícula
    // ✅ Traer rol global para SUPER_ADMIN_NACIONAL
    const [userRows] = await pool.execute(
      `SELECT u.id, u.nombre, u.apellidoPaterno, u.apellidoMaterno,
              u.nombreCompleto, u.email, u.passwordHash,
              u.status, u.emailVerificado, u.createdAt,
              u.lastLogin, u.perfilCompletado, u.matricula,
              u.requiereCambioPassword,
              u.rol AS rolGlobal
       FROM usuarios u
       WHERE (u.email = ? OR u.matricula = ?)`,
      [String(email).trim(), String(email).trim()]
    );

    if (userRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
      });
    }

    const user = userRows[0];

    // ✅ Bloqueo por status global (pero super admin también debe estar ACTIVO)
    if (String(user.status || "").toUpperCase() !== "ACTIVO") {
      return res.status(403).json({
        success: false,
        message: "Usuario inactivo",
        code: "USER_INACTIVE",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
      });
    }

    const isSuperAdminNacional =
      String(user.rolGlobal || "") === "SUPER_ADMIN_NACIONAL";

    // Membresías (puede ser vacío para super admin)
    const [rows] = await pool.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion,
              i.status AS institucionStatus,
              ui.activo as membershipActiva
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ?`,
      [user.id]
    );

    const institucionesFull = (rows || []).map((r) => ({
      institucionId: String(r.institucionId),
      institucionNombre: r.nombre,
      rol: r.rolInstitucion,
      institucionStatus: r.institucionStatus,
      membershipStatus: r.membershipActiva ? "ACTIVO" : "INACTIVO",
    }));

    const activas = institucionesFull.filter(
      (x) =>
        isInstitutionActive(x.institucionStatus) &&
        x.membershipStatus === "ACTIVO"
    );

    // ✅ Solo bloquear si NO es super admin nacional
    if (activas.length === 0 && !isSuperAdminNacional) {
      return res.status(403).json({
        success: false,
        message: "Usuario sin institución activa",
        code: "NO_INSTITUTION",
      });
    }

    // Si no quieres exponer inactivas a UI, usa activas aquí.
    const payloadInstituciones = institucionesFull.map(
      ({ institucionStatus, membershipStatus, ...rest }) => rest
    );

    // ✅ Rol principal para UI (evita "rol desconocido")
    const primaryRole =
      (isSuperAdminNacional ? "SUPER_ADMIN_NACIONAL" : null) ||
      payloadInstituciones?.[0]?.rol ||
      null;

    const shapedUser = {
      id: user.id,
      nombre: user.nombre,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      matricula: user.matricula,
      status: user.status,
      emailVerificado: user.emailVerificado,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      perfilCompletado: user.perfilCompletado,
      requiereCambioPassword: user.requiereCambioPassword,

      // ✅ rol global si aplica
      rol: primaryRole || undefined,

      instituciones: payloadInstituciones,
    };

    // ✅ roles agregados (útil para frontend y consistencia)
shapedUser.roles = uniq([
  ...(primaryRole ? [primaryRole] : []),
  ...payloadInstituciones.map((m) => m.rol),
]);


    const token = generateToken(shapedUser);

    await pool.execute(
      "UPDATE usuarios SET lastLogin = NOW(), updatedAt = NOW() WHERE id = ?",
      [user.id]
    );

    return res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        accessToken: token,
        tokenType: "Bearer",
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
        user: sanitizeUser(shapedUser),
      },
    });
  } catch (error) {
    console.error(
      "Error en login:",
      error?.sqlMessage || error?.message || error
    );
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    });
  }
};

/** LOGOUT */
const logout = async (req, res) => {
  try {
    res.json({ success: true, message: "Sesión cerrada exitosamente" });
    console.log(`User logged out: ${req.user?.email}`);
  } catch (error) {
    console.error("Error en logout:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

/** PROFILE */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [userRows] = await pool.execute(
      `SELECT u.id, u.carreraId, u.nombre, u.apellidoPaterno,
              u.apellidoMaterno, u.nombreCompleto, u.email, u.status,
              u.emailVerificado, u.requiereCambioPassword, u.createdAt,
              u.lastLogin, u.perfilCompletado, u.telefono, u.direccion,
              u.genero, u.fechaNacimiento, u.foto,
              u.rol AS rolGlobal
       FROM usuarios u
       WHERE u.id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const base = userRows[0];
    const isSuperAdminNacional =
      String(base.rolGlobal || "") === "SUPER_ADMIN_NACIONAL";

    const [rows] = await pool.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion,
              i.status AS institucionStatus,
              ui.activo as membershipActiva
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ?`,
      [userId]
    );

    const instituciones = (rows || []).map((r) => ({
      institucionId: String(r.institucionId),
      institucionNombre: r.nombre,
      rol: r.rolInstitucion,
      institucionStatus: r.institucionStatus,
      membershipStatus: r.membershipActiva ? "ACTIVO" : "INACTIVO",
    }));

    const payloadInstituciones = instituciones.map(
      ({ institucionStatus, membershipStatus, ...rest }) => rest
    );

    const primaryRole =
      (isSuperAdminNacional ? "SUPER_ADMIN_NACIONAL" : null) ||
      payloadInstituciones?.[0]?.rol ||
      null;


    const shapedUser = {
      id: base.id,
      nombre: base.nombre,
      apellidoPaterno: base.apellidoPaterno,
      apellidoMaterno: base.apellidoMaterno,
      nombreCompleto: base.nombreCompleto,
      email: base.email,
      status: base.status,
      emailVerificado: base.emailVerificado,
      requiereCambioPassword: base.requiereCambioPassword,
      createdAt: base.createdAt,
      lastLogin: base.lastLogin,
      perfilCompletado: base.perfilCompletado,
      telefono: base.telefono,
      direccion: base.direccion,
      genero: base.genero,
      fechaNacimiento: base.fechaNacimiento,
      foto: base.foto,

      rol: primaryRole || undefined,

      instituciones: instituciones.map(
        ({ institucionStatus, membershipStatus, ...rest }) => rest
      ),
    };

    shapedUser.roles = uniq([
      ...(primaryRole ? [primaryRole] : []),
      ...payloadInstituciones.map((m) => m.rol),
    ]);


    return res.json({ success: true, data: sanitizeUser(shapedUser) });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

/** VERIFY_TOKEN */
const verifyToken = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Token válido",
      data: { user: sanitizeUser(req.user), isValid: true },
    });
  } catch (error) {
    console.error("Error verificando token:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

/** UPDATE PROFILE */
const updateProfile = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user.id;
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      telefono,
      direccion,
      genero,
      fechaNacimiento,
    } = req.body;

    const [userRows] = await conn.execute(
      "SELECT id, email FROM usuarios WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    if (email && String(email).trim() !== String(userRows[0].email).trim()) {
      const [existingEmailRows] = await conn.execute(
        "SELECT id FROM usuarios WHERE email = ? AND id != ?",
        [String(email).trim(), userId]
      );

      if (existingEmailRows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Ya existe un usuario con ese email",
          code: "DUPLICATE_EMAIL",
        });
      }
    }

    // ✅ soporta DB_NAME o MYSQL_DATABASE
    const DB_NAME =
      process.env.DB_NAME || process.env.MYSQL_DATABASE || "sistema_educativo";

    const [colsRows] = await conn.execute(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME   = 'usuarios'
         AND COLUMN_NAME IN ('nombre','apellidoPaterno','apellidoMaterno','email','telefono','direccion','genero','fechaNacimiento','nombreCompleto','updatedAt','perfilCompletado')`,
      [DB_NAME]
    );

    const columns = new Set(colsRows.map((r) => r.COLUMN_NAME));

    const sets = [];
    const params = [];

    if (columns.has("nombre") && nombre) {
      sets.push("nombre = ?");
      params.push(String(nombre).trim());
    }
    if (columns.has("apellidoPaterno") && apellidoPaterno) {
      sets.push("apellidoPaterno = ?");
      params.push(String(apellidoPaterno).trim());
    }
    if (
      columns.has("apellidoMaterno") &&
      typeof apellidoMaterno !== "undefined"
    ) {
      sets.push("apellidoMaterno = ?");
      params.push(apellidoMaterno ? String(apellidoMaterno).trim() : null);
    }
    if (columns.has("email") && email) {
      sets.push("email = ?");
      params.push(String(email).trim());
    }
    if (columns.has("telefono") && typeof telefono !== "undefined") {
      sets.push("telefono = ?");
      params.push(telefono ? String(telefono).trim() : null);
    }
    if (columns.has("direccion") && typeof direccion !== "undefined") {
      sets.push("direccion = ?");
      params.push(direccion ? String(direccion).trim() : null);
    }
    if (columns.has("genero") && typeof genero !== "undefined") {
      sets.push("genero = ?");
      params.push(genero ? String(genero).trim() : null);
    }
    if (
      columns.has("fechaNacimiento") &&
      typeof fechaNacimiento !== "undefined"
    ) {
      if (fechaNacimiento) {
        const d = new Date(fechaNacimiento);
        const ymd = Number.isNaN(d.getTime())
          ? String(fechaNacimiento).slice(0, 10)
          : d.toISOString().slice(0, 10);
        sets.push("fechaNacimiento = ?");
        params.push(ymd);
      } else {
        sets.push("fechaNacimiento = NULL");
      }
    }

    if (
      columns.has("nombreCompleto") &&
      (nombre || apellidoPaterno || typeof apellidoMaterno !== "undefined")
    ) {
      // reconstruir usando los valores nuevos si vienen, o usando req.user
      const n = nombre ? String(nombre).trim() : req.user.nombre || "";
      const ap = apellidoPaterno
        ? String(apellidoPaterno).trim()
        : req.user.apellidoPaterno || "";
      const am =
        typeof apellidoMaterno !== "undefined"
          ? apellidoMaterno
            ? String(apellidoMaterno).trim()
            : null
          : req.user.apellidoMaterno || null;

      const nc = `${n} ${ap}${am ? " " + am : ""}`.trim();
      sets.push("nombreCompleto = ?");
      params.push(nc);
    }

    if (columns.has("perfilCompletado")) {
      sets.push("perfilCompletado = 1");
    }

    if (columns.has("updatedAt")) {
      sets.push("updatedAt = NOW()");
    }

    if (sets.length === 0) {
      return res.json({
        success: true,
        message: "No hay cambios que aplicar",
        data: sanitizeUser(req.user),
      });
    }

    const sql = `UPDATE usuarios SET ${sets.join(", ")} WHERE id = ? LIMIT 1`;
    params.push(userId);

    await conn.execute(sql, params);

    // Obtener el usuario actualizado
    const [updatedUserRows] = await conn.execute(
      `SELECT u.id, u.nombre, u.apellidoPaterno, u.apellidoMaterno,
              u.nombreCompleto, u.email, u.status, u.emailVerificado,
              u.createdAt, u.lastLogin, u.perfilCompletado, u.telefono,
              u.direccion, u.genero, u.fechaNacimiento, u.foto,
              u.requiereCambioPassword,
              u.rol AS rolGlobal
       FROM usuarios u
       WHERE u.id = ?`,
      [userId]
    );

    if (updatedUserRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Error obteniendo usuario actualizado",
      });
    }

    const updatedUser = updatedUserRows[0];
    const isSuperAdminNacional =
      String(updatedUser.rolGlobal || "") === "SUPER_ADMIN_NACIONAL";

    const [instRows] = await conn.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ?`,
      [userId]
    );

    updatedUser.instituciones = instRows.map((r) => ({
      institucionId: String(r.institucionId),
      institucionNombre: r.nombre,
      rol: r.rolInstitucion,
    }));

    updatedUser.rol = isSuperAdminNacional ? "SUPER_ADMIN_NACIONAL" : undefined;
    updatedUser.roles = [
      ...(isSuperAdminNacional ? ["SUPER_ADMIN_NACIONAL"] : []),
      ...updatedUser.instituciones.map((m) => m.rol),
    ];

    return res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
};

/** Cambiar contraseña del usuario */
const cambiarPassword = async (req, res) => {
  let conn;
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Se requiere contraseña actual y nueva contraseña",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe tener al menos 8 caracteres",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe ser diferente a la actual",
      });
    }

    conn = await pool.getConnection();

    const [userRows] = await conn.execute(
      `SELECT passwordHash, requiereCambioPassword
       FROM usuarios
       WHERE id = ? AND status = 'ACTIVO'`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const user = userRows[0];

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "La contraseña actual es incorrecta",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await conn.execute(
      `UPDATE usuarios
       SET passwordHash = ?, requiereCambioPassword = FALSE, updatedAt = NOW()
       WHERE id = ?`,
      [newPasswordHash, userId]
    );

    return res.json({
      success: true,
      message: "Contraseña cambiada exitosamente",
      data: { requiereCambioPassword: false },
    });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      ...(process.env.NODE_ENV !== "production" && { error: error.message }),
    });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  login,
  logout,
  getProfile,
  updateProfile,
  verifyToken,
  generateToken,
  sanitizeUser,
  register,
  cambiarPassword,
};
