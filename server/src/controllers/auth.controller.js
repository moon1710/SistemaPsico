//controllers/auth.controller

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { pool } = require("../db");

const isInstitutionActive = (s) => ["ACTIVO", "ACTIVA", "ACTIVE"].includes(s);
/** Generar JWT */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    instituciones: user.instituciones || [], // 👈 arreglo de { institucionId, rol }
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
  status: user.status,
  emailVerificado: user.emailVerificado,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
  perfilCompletado: user.perfilCompletado,
  instituciones: user.instituciones || [], // 👈 arreglo
});

/** REGISTER */
const register = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
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
      rol,
      institucionId = null,
      carreraId = null,
    } = req.body;

    // Si NO es super admin nacional, debe venir institución válida y activa
    if (rol !== "SUPER_ADMIN_NACIONAL") {
      const [instRows] = await pool.execute(
        "SELECT id, status FROM instituciones WHERE id = ?",
        [String(institucionId)]
      );
      if (instRows.length === 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Institución inválida",
            code: "INSTITUTION_INVALID",
          });
      }
      if (!isInstitutionActive(instRows[0].status)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Institución inactiva",
            code: "INSTITUTION_INACTIVE",
          });
      }
    }

    // Unicidad de email
    const [existsRows] = await pool.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (existsRows.length > 0) {
      return res
        .status(409)
        .json({
          success: false,
          message: "Ya existe un usuario con ese email",
          code: "DUPLICATE_EMAIL",
        });
    }

    await conn.beginTransaction();

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const nombreCompleto = `${nombre} ${apellidoPaterno}${
      apellidoMaterno ? " " + apellidoMaterno : ""
    }`;

    await conn.execute(
      `INSERT INTO usuarios 
        (id, carreraId, email, emailVerificado, passwordHash, 
         nombre, apellidoPaterno, apellidoMaterno, nombreCompleto, 
         status, requiereCambioPassword, perfilCompletado, lastLogin, createdAt, updatedAt)
       VALUES
        (?, ?, ?, 1, ?, ?, ?, ?, ?, 'ACTIVO', 0, 0, NULL, NOW(3), NOW(3))`,
      [
        id,
        carreraId,
        email,
        passwordHash,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nombreCompleto,
      ]
    );

    // Solo crea membresía si aplica
    if (rol !== "SUPER_ADMIN_NACIONAL" && institucionId) {
      // Evitar duplicados por si el endpoint se reintenta
      const [dup] = await conn.execute(
        `SELECT 1 FROM usuario_institucion WHERE usuarioId = ? AND institucionId = ? AND activo = 1 LIMIT 1`,
        [id, institucionId]
      );
      if (dup.length === 0) {
        await conn.execute(
          `INSERT INTO usuario_institucion (usuarioId, institucionId, rolInstitucion, activo)
           VALUES (?, ?, ?, 1)`,
          [id, institucionId, rol]
        );
      }
    }

    // Traer instituciones (si el nacional no tiene, regresará array vacío — está bien)
    const [instituciones] = await conn.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ? AND ui.activo = 1`,
      [id]
    );

    await conn.commit();

    const user = {
      id,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      nombreCompleto,
      email,
      status: "ACTIVO",
      emailVerificado: 1,
      perfilCompletado: 0,
      instituciones: instituciones.map((i) => ({
        institucionId: String(i.institucionId),
        institucionNombre: i.nombre,
        rol: i.rolInstitucion,
      })),
    };

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      data: {
        accessToken: token,
        tokenType: "Bearer",
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
        user: sanitizeUser(user),
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
    return res
      .status(500)
      .json({
        success: false,
        message: "Error interno del servidor",
        code: "INTERNAL_ERROR",
      });
  } finally {
    if (conn) conn.release();
  }
};

/** LOGIN */
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Datos de entrada inválidos",
          errors: errors.array(),
        });
    }

    const { email, password } = req.body;

    const [userRows] = await pool.execute(
      `SELECT u.id, u.nombre, u.apellidoPaterno, u.apellidoMaterno, 
              u.nombreCompleto, u.email, u.passwordHash, 
              u.status, u.emailVerificado, u.createdAt,
              u.lastLogin, u.perfilCompletado
       FROM usuarios u
       WHERE u.email = ? AND u.status = 'ACTIVO'`,
      [email]
    );

    if (userRows.length === 0) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Credenciales inválidas",
          code: "INVALID_CREDENTIALS",
        });
    }

    const user = userRows[0];

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Credenciales inválidas",
          code: "INVALID_CREDENTIALS",
        });
    }

    // Membresías
    const [rows] = await pool.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion, i.status AS institucionStatus, ui.activo as membershipActiva
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ?`,
      [user.id]
    );

    const instituciones = rows.map((r) => ({
      institucionId: String(r.institucionId),
      institucionNombre: r.nombre,
      rol: r.rolInstitucion,
      institucionStatus: r.institucionStatus,
      membershipStatus: r.membershipActiva ? "ACTIVO" : "INACTIVO",
    }));

    const activas = instituciones.filter(
      (x) =>
        isInstitutionActive(x.institucionStatus) &&
        x.membershipStatus === "ACTIVO"
    );

    if (activas.length === 0) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Usuario sin institución activa",
          code: "NO_INSTITUTION",
        });
    }

    // Si prefieres no exponer inactivas a la UI, cámbialo a "const payloadInstituciones = activas;"
    const payloadInstituciones = instituciones.map(
      ({ institucionStatus, membershipStatus, ...rest }) => rest
    );

    const shapedUser = {
      id: user.id,
      nombre: user.nombre,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      status: user.status,
      emailVerificado: user.emailVerificado,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      perfilCompletado: user.perfilCompletado,
      instituciones: payloadInstituciones,
    };

    const token = generateToken(shapedUser);

    await pool.execute(
      "UPDATE usuarios SET lastLogin = NOW(), updatedAt = NOW() WHERE id = ?",
      [user.id]
    );

    res.json({
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
    res
      .status(500)
      .json({
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
    const roles = (req.user?.instituciones || []).map((m) => m.rol).join(", ");
    console.log(`✅ Logout: ${req.user?.email} [${roles || "sin-rol"}]`);
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
              u.lastLogin, u.perfilCompletado
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

    const [rows] = await pool.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion, i.status AS institucionStatus, ui.activo as membershipActiva
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ?`,
      [userId]
    );

    const instituciones = rows.map((r) => ({
      institucionId: String(r.institucionId),
      institucionNombre: r.nombre,
      rol: r.rolInstitucion,
      institucionStatus: r.institucionStatus,
      membershipStatus: r.membershipActiva ? "ACTIVO" : "INACTIVO",
    }));

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
      instituciones: instituciones.map(
        ({ institucionStatus, membershipStatus, ...rest }) => rest
      ),
    };

    res.json({ success: true, data: sanitizeUser(shapedUser) });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

/** VERIFY_TOKEN */
const verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Token válido",
      data: { user: sanitizeUser(req.user), isValid: true },
    });
  } catch (error) {
    console.error("Error verificando token:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
};

module.exports = {
  login,
  logout,
  getProfile,
  verifyToken,
  generateToken,
  sanitizeUser,
  register,
};
