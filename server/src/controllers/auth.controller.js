const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { pool } = require("../db");

/**
 * Generar JWT con payload estándar
 */
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

/**
 * Sanitizar datos de usuario para respuesta
 */
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
  lastLoginAt: user.lastLoginAt,
});

/**
 * LOGIN - Autenticación de usuario
 */
const login = async (req, res) => {
  try {
    // Validar entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const { email, password, institucionId } = req.body;

    // Buscar usuario con validaciones de seguridad
    const [userRows] = await pool.execute(
      `SELECT u.id, u.institucionId, u.carreraId, u.nombre, u.apellidoPaterno, 
              u.apellidoMaterno, u.nombreCompleto, u.email, u.passwordHash, 
              u.rol, u.status, u.emailVerificado, u.createdAt, u.lastLoginAt,
              i.nombre as institucionNombre, i.status as institucionStatus
       FROM usuarios u
       LEFT JOIN instituciones i ON u.institucionId = i.id
       WHERE u.email = ? AND u.status = 'ACTIVO'
       ${institucionId ? "AND u.institucionId = ?" : ""}`,
      institucionId ? [email, institucionId] : [email]
    );

    if (userRows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
      });
    }

    const user = userRows[0];

    // Verificar institución activa (excepto SUPER_ADMIN_NACIONAL)
    if (
      user.rol !== "SUPER_ADMIN_NACIONAL" &&
      user.institucionStatus !== "ACTIVO"
    ) {
      return res.status(403).json({
        success: false,
        message: "Institución inactiva",
        code: "INSTITUTION_INACTIVE",
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
      });
    }

    // Generar token
    const token = generateToken(user);

    // Actualizar último login
    await pool.execute(
      "UPDATE usuarios SET lastLoginAt = NOW(), updatedAt = NOW() WHERE id = ?",
      [user.id]
    );

    // Respuesta exitosa
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

    // Log de seguridad
    console.log(
      `✅ Login exitoso: ${user.email} [${user.rol}] desde IP: ${req.ip}`
    );
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    });
  }
};

/**
 * LOGOUT - Cerrar sesión
 */
const logout = async (req, res) => {
  try {
    // En una implementación más avanzada, aquí podrías:
    // 1. Agregar el token a una blacklist
    // 2. Registrar el logout en logs de auditoría

    res.json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });

    // Log de seguridad
    console.log(`✅ Logout: ${req.user.email} [${req.user.rol}]`);
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

/**
 * PROFILE - Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Obtener datos actualizados del usuario
    const [userRows] = await pool.execute(
      `SELECT u.id, u.institucionId, u.carreraId, u.nombre, u.apellidoPaterno, 
              u.apellidoMaterno, u.nombreCompleto, u.email, u.rol, u.status,
              u.emailVerificado, u.requiereCambioPassword, u.createdAt, u.lastLoginAt,
              i.nombre as institucionNombre, i.codigo as institucionCodigo
       FROM usuarios u
       LEFT JOIN instituciones i ON u.institucionId = i.id
       WHERE u.id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const user = userRows[0];

    res.json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

/**
 * VERIFY_TOKEN - Verificar si el token actual es válido
 */
const verifyToken = async (req, res) => {
  try {
    // Si llegamos aquí, el token es válido (pasó por authenticateToken)
    res.json({
      success: true,
      message: "Token válido",
      data: {
        user: sanitizeUser(req.user),
        isValid: true,
      },
    });
  } catch (error) {
    console.error("Error verificando token:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

module.exports = {
  login,
  logout,
  getProfile,
  verifyToken,
  generateToken,
  sanitizeUser,
};
