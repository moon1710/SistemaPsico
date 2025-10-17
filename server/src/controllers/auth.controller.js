//controllers/auth.controller

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { pool } = require("../db");
const { crearNotificacionBienvenida } = require("./notifications.controller");

const isInstitutionActive = (s) => ["ACTIVO", "ACTIVA", "ACTIVE"].includes(s);

/** Asignar psicólogo automáticamente a estudiante */
const autoAssignPsychologist = async (conn, studentId, institucionId) => {
  try {
    // Buscar psicólogos activos en la institución
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

    if (psychologists.length > 0) {
      const psychologistId = psychologists[0].id;

      // Verificar que no exista ya una asignación
      const [existing] = await conn.execute(
        `SELECT 1 FROM tutores_alumnos
         WHERE alumnoId = ? AND activo = 1 LIMIT 1`,
        [studentId]
      );

      if (existing.length === 0) {
        // Crear la asignación
        const tutorAlumnoId = crypto.randomUUID();
        await conn.execute(
          `INSERT INTO tutores_alumnos (id, institucionId, alumnoId, tutorId, activo)
           VALUES (?, ?, ?, ?, 1)`,
          [tutorAlumnoId, institucionId, studentId, psychologistId]
        );

      }
    } else {
    }
  } catch (error) {
    console.error('Error auto-assigning psychologist:', error.message);
    // No lanzamos el error para que no afecte el registro del estudiante
  }
};
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

    // Asignar psicólogo automáticamente si es estudiante
    if (rol === "ESTUDIANTE" && institucionId) {
      try {
        await autoAssignPsychologist(conn, id, institucionId);
      } catch (error) {
        // No lanzamos el error para que no afecte el registro
      }
    }

    await conn.commit();

    // Crear notificación de bienvenida después del commit exitoso
    try {
      // await crearNotificacionBienvenida(id, nombreCompleto, rol);
    } catch (error) {
      console.error('Error creating welcome notification:', error.message);
      // No afecta el registro del usuario
    }

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


    // Permitir login con email O número de control
    const [userRows] = await pool.execute(
      `SELECT u.id, u.nombre, u.apellidoPaterno, u.apellidoMaterno,
              u.nombreCompleto, u.email, u.passwordHash,
              u.status, u.emailVerificado, u.createdAt,
              u.lastLogin, u.perfilCompletado, u.matricula,
              u.requiereCambioPassword
       FROM usuarios u
       WHERE (u.email = ? OR u.matricula = ?) AND u.status = 'ACTIVO'`,
      [email, email]
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
      matricula: user.matricula,
      status: user.status,
      emailVerificado: user.emailVerificado,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      perfilCompletado: user.perfilCompletado,
      requiereCambioPassword: user.requiereCambioPassword,
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
              u.genero, u.fechaNacimiento, u.foto
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
      telefono: base.telefono,
      direccion: base.direccion,
      genero: base.genero,
      fechaNacimiento: base.fechaNacimiento,
      foto: base.foto,
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

    // Verificar que el usuario existe
    const [userRows] = await pool.execute(
      "SELECT id, email FROM usuarios WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Si se está actualizando el email, verificar que no exista otro usuario con ese email
    if (email && email !== userRows[0].email) {
      const [existingEmailRows] = await pool.execute(
        "SELECT id FROM usuarios WHERE email = ? AND id != ?",
        [email, userId]
      );

      if (existingEmailRows.length > 0) {
        return res
          .status(409)
          .json({ success: false, message: "Ya existe un usuario con ese email" });
      }
    }

    // Detectar qué columnas existen
    const DB_NAME = process.env.MYSQL_DATABASE || "sistema_educativo";
    const [colsRows] = await pool.execute(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ?
         AND TABLE_NAME   = 'usuarios'
         AND COLUMN_NAME IN ('nombre','apellidoPaterno','apellidoMaterno','email','telefono','direccion','genero','fechaNacimiento','nombreCompleto','updatedAt')`,
      [DB_NAME]
    );
    const columns = new Set(colsRows.map((r) => r.COLUMN_NAME));

    // Construir SET dinámico
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
    if (columns.has("apellidoMaterno") && typeof apellidoMaterno !== "undefined") {
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
    if (columns.has("fechaNacimiento") && typeof fechaNacimiento !== "undefined") {
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

    // Actualizar nombreCompleto si existen nombre y apellidos
    if (columns.has("nombreCompleto") && nombre && apellidoPaterno) {
      const nombreCompleto = apellidoMaterno
        ? `${nombre} ${apellidoPaterno} ${apellidoMaterno}`
        : `${nombre} ${apellidoPaterno}`;
      sets.push("nombreCompleto = ?");
      params.push(nombreCompleto.trim());
    }

    if (columns.has("updatedAt")) {
      sets.push("updatedAt = NOW()");
    }

    // Marcar perfil como completado
    sets.push("perfilCompletado = 1");

    if (sets.length === 0) {
      return res.json({
        success: true,
        message: "No hay cambios que aplicar",
        data: sanitizeUser(req.user),
      });
    }

    const sql = `UPDATE usuarios SET ${sets.join(", ")} WHERE id = ? LIMIT 1`;
    params.push(userId);

    const [result] = await pool.execute(sql, params);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Obtener el usuario actualizado
    const [updatedUserRows] = await pool.execute(
      `SELECT u.id, u.nombre, u.apellidoPaterno, u.apellidoMaterno,
              u.nombreCompleto, u.email, u.status, u.emailVerificado,
              u.createdAt, u.lastLogin, u.perfilCompletado, u.telefono,
              u.direccion, u.genero, u.fechaNacimiento, u.foto
       FROM usuarios u WHERE u.id = ?`,
      [userId]
    );

    if (updatedUserRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Error obteniendo usuario actualizado" });
    }

    const updatedUser = updatedUserRows[0];

    // Obtener instituciones del usuario
    const [instRows] = await pool.execute(
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

    res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: sanitizeUser(updatedUser),
    });
  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Cambiar contraseña del usuario
 */
const cambiarPassword = async (req, res) => {
  let conn;

  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validaciones básicas
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Se requiere contraseña actual y nueva contraseña"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe tener al menos 8 caracteres"
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "La nueva contraseña debe ser diferente a la actual"
      });
    }

    conn = await pool.getConnection();

    // Obtener usuario actual
    const [userRows] = await conn.execute(
      `SELECT passwordHash, requiereCambioPassword FROM usuarios WHERE id = ? AND status = 'ACTIVO'`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const user = userRows[0];

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "La contraseña actual es incorrecta"
      });
    }

    // Hash de la nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña y marcar que ya no requiere cambio
    await conn.execute(
      `UPDATE usuarios
       SET passwordHash = ?, requiereCambioPassword = FALSE, updatedAt = NOW()
       WHERE id = ?`,
      [newPasswordHash, userId]
    );

    console.log(`Password changed for user: ${userId}`);

    res.json({
      success: true,
      message: "Contraseña cambiada exitosamente",
      data: {
        requiereCambioPassword: false
      }
    });

  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      ...(process.env.NODE_ENV !== "production" && { error: error.message })
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
