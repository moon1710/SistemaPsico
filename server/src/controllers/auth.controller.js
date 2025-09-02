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
    rol: user.rol,
    institucionId: user.institucionId,
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });
};

/** Sanitizar user para respuesta */
const sanitizeUser = (user) => ({
  id: user.id,
  institucionId: user.institucionId,
  institucionNombre: user.institucionNombre,
  carreraId: user.carreraId,
  nombre: user.nombre,
  apellidoPaterno: user.apellidoPaterno,
  apellidoMaterno: user.apellidoMaterno,
  nombreCompleto: user.nombreCompleto,
  email: user.email,
  rol: user.rol,
  status: user.status,
  emailVerificado: user.emailVerificado,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
  perfilCompletado: user.perfilCompletado,
});

/** REGISTER */
/** REGISTER */
const register = async (req, res) => {
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
      rol,
      institucionId,
      carreraId = null,
    } = req.body;

    // 1) Verificar institución existe
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

    // 2) Si NO es super admin nacional, institución debe estar activa (ACTIVA/ACTIVO/ACTIVE)
    if (rol !== "SUPER_ADMIN_NACIONAL" && !isInstitutionActive(instRows[0].status)) {
      return res.status(400).json({
        success: false,
        message: "Institución inactiva",
        code: "INSTITUTION_INACTIVE",
      });
    }

    // 3) Unicidad por (institucionId, email)
    const [existsRows] = await pool.execute(
      "SELECT id FROM usuarios WHERE institucionId = ? AND email = ?",
      [String(institucionId), email]
    );
    if (existsRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un usuario con ese email en la institución",
        code: "DUPLICATE_EMAIL",
      });
    }

    // 4) Insert
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const nombreCompleto = `${nombre} ${apellidoPaterno}${apellidoMaterno ? " " + apellidoMaterno : ""}`;

    await pool.execute(
      `INSERT INTO usuarios 
        (id, institucionId, carreraId, email, emailVerificado, passwordHash, 
         nombre, apellidoPaterno, apellidoMaterno, nombreCompleto, 
         rol, status, requiereCambioPassword, perfilCompletado, lastLogin, createdAt, updatedAt)
       VALUES
        (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, 'ACTIVO', 0, 0, NULL, NOW(3), NOW(3))`,
      [
        id,
        String(institucionId),
        carreraId,
        email,
        passwordHash,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nombreCompleto,
        rol,
      ]
    );

    // 5) Volver a leer el usuario (con datos de institución)
    const [userRows] = await pool.execute(
      `SELECT u.id, u.institucionId, u.carreraId, u.nombre, u.apellidoPaterno, 
              u.apellidoMaterno, u.nombreCompleto, u.email, u.rol, u.status, 
              u.emailVerificado, u.createdAt, u.lastLogin, u.perfilCompletado,
              i.nombre AS institucionNombre, i.status AS institucionStatus
       FROM usuarios u
       LEFT JOIN instituciones i ON u.institucionId = i.id
       WHERE u.id = ?`,
      [id]
    );

    if (!userRows.length) {
      return res.status(500).json({
        success: false,
        message: "No se pudo leer el usuario recién creado",
        code: "READ_BACK_FAILED",
      });
    }

    const user = userRows[0]; // 👈 AHORA sí definimos user
    const token = generateToken(user); // 👈 y recién aquí lo usamos

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
    // Log útil en dev sin romper formato de respuesta
    console.error("❌ Error en register:", error?.sqlMessage || error?.message || error, error?.code || "");
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    });
  }
};

/** LOGIN */
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

    const { email, password, institucionId } = req.body;

    const [userRows] = await pool.execute(
      `SELECT u.id, u.institucionId, u.carreraId, u.nombre, u.apellidoPaterno, 
              u.apellidoMaterno, u.nombreCompleto, u.email, u.passwordHash, 
              u.rol, u.status, u.emailVerificado, u.createdAt,
              u.lastLogin, u.perfilCompletado,
              i.nombre AS institucionNombre, i.status AS institucionStatus
       FROM usuarios u
       LEFT JOIN instituciones i ON u.institucionId = i.id
       WHERE u.email = ? AND u.status = 'ACTIVO'
       ${institucionId ? "AND u.institucionId = ?" : ""}`,
      institucionId ? [email, String(institucionId)] : [email]
    );

    if (userRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
      });
    }

    const user = userRows[0];

    // (Debug opcional)
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEBUG login] institucionId:', user.institucionId, 'institucionStatus:', user.institucionStatus);
    }

    // Institución debe estar ACTIVA/ACTIVO/ACTIVE salvo SUPER_ADMIN_NACIONAL
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

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
      });
    }

    const token = generateToken(user);

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
        user: sanitizeUser(user),
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ Login exitoso: ${user.email} [${user.rol}] desde IP: ${req.ip}`);
    }
  } catch (error) {
    console.error("Error en login:", error?.sqlMessage || error?.message || error);
    res.status(500).json({
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
    console.log(`✅ Logout: ${req.user?.email} [${req.user?.rol}]`);
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
      `SELECT u.id, u.institucionId, u.carreraId, u.nombre, u.apellidoPaterno, 
              u.apellidoMaterno, u.nombreCompleto, u.email, u.rol, u.status,
              u.emailVerificado, u.requiereCambioPassword, u.createdAt,
              u.lastLogin, u.perfilCompletado,
              i.nombre AS institucionNombre
       FROM usuarios u
       LEFT JOIN instituciones i ON u.institucionId = i.id
       WHERE u.id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    const user = userRows[0];

    res.json({ success: true, data: sanitizeUser(user) });
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
