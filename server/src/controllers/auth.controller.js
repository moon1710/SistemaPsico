// server/src/controllers/auth.controller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const { pool } = require("../db");
// Usamos el servicio que ya probamos y funciona
const emailService = require("../services/emailService"); 

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

        console.log(`✅ Psicólogo ${psychologistId} asignado automáticamente al estudiante ${studentId}`);
      }
    } else {
      console.log(`⚠️ No hay psicólogos disponibles en la institución ${institucionId} para asignar al estudiante ${studentId}`);
    }
  } catch (error) {
    console.error('❌ Error asignando psicólogo automáticamente:', error);
  }
};

/** Generar JWT */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    rol: user.rol, // Rol principal
    institucionId: user.institucionId || (user.instituciones && user.instituciones.length > 0 ? user.instituciones[0].institucionId : null),
    instituciones: user.instituciones || [], 
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "secreto_super_seguro", {
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
  rol: user.rol, // Asegurar que el rol va en la respuesta
  status: user.status,
  emailVerificado: user.emailVerificado,
  createdAt: user.createdAt,
  lastLogin: user.lastLogin,
  perfilCompletado: user.perfilCompletado,
  instituciones: user.instituciones || [], 
});

/** REGISTER */
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
      rol,
      institucionId = null,
      carreraId = null,
    } = req.body;

    // Validación de institución activa
    if (rol !== "SUPER_ADMIN_NACIONAL") {
      const [instRows] = await pool.execute(
        "SELECT id, status FROM instituciones WHERE id = ?",
        [String(institucionId)]
      );
      if (instRows.length === 0) {
        return res.status(400).json({ success: false, message: "Institución inválida", code: "INSTITUTION_INVALID" });
      }
      if (!isInstitutionActive(instRows[0].status)) {
        return res.status(400).json({ success: false, message: "Institución inactiva", code: "INSTITUTION_INACTIVE" });
      }
    }

    // Unicidad de email
    const [existsRows] = await pool.execute("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existsRows.length > 0) {
      return res.status(409).json({ success: false, message: "Ya existe un usuario con ese email", code: "DUPLICATE_EMAIL" });
    }

    await conn.beginTransaction();

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);
    const nombreCompleto = `${nombre} ${apellidoPaterno}${apellidoMaterno ? " " + apellidoMaterno : ""}`;

    // Insertar Usuario
    await conn.execute(
      `INSERT INTO usuarios 
        (id, institucionId, carreraId, email, emailVerificado, passwordHash, 
         nombre, apellidoPaterno, apellidoMaterno, nombreCompleto, rol,
         status, requiereCambioPassword, perfilCompletado, lastLogin, createdAt, updatedAt)
       VALUES
        (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, 'ACTIVO', 0, 0, NULL, NOW(3), NOW(3))`,
      [
        id,
        institucionId, // Guardamos también directo en la tabla
        carreraId,
        email,
        passwordHash,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nombreCompleto,
        rol // Guardamos el rol principal
      ]
    );

    // Crear relación en tabla intermedia
    if (rol !== "SUPER_ADMIN_NACIONAL" && institucionId) {
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

    // Traer instituciones
    const [instituciones] = await conn.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ? AND ui.activo = 1`,
      [id]
    );

    // Asignar psicólogo
    if (rol === "ESTUDIANTE" && institucionId) {
      await autoAssignPsychologist(conn, id, institucionId);
    }

    await conn.commit();

    // Enviar correo (usando el servicio simulado o real)
    // Nota: emailService no devuelve promesa en la versión simple, pero si la mejoraste sí.
    // Aquí asumimos un try-catch simple.
    try {
        // Puedes implementar enviarBienvenida en emailService o usar una genérica
        console.log(`📧 Simulando envío de correo de bienvenida a ${email}`);
    } catch (e) {
        console.error("Error envío correo", e);
    }

    const user = {
      id,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      nombreCompleto,
      email,
      rol,
      status: "ACTIVO",
      emailVerificado: 1,
      perfilCompletado: 0,
      institucionId, 
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
    if (conn) await conn.rollback();
    console.error("❌ Error en register:", error);
    return res.status(500).json({
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
    const { email, password } = req.body;
    console.log(`🔐 Login intento: ${email}`);

    // 1. Buscar usuario
    const [userRows] = await pool.execute(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );

    if (userRows.length === 0) {
      console.log("❌ Usuario no encontrado");
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    const user = userRows[0];

    // 2. Verificar password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      console.log("❌ Password incorrecto");
      return res.status(401).json({ success: false, message: "Credenciales inválidas" });
    }

    // 3. Verificar status
    if (user.status !== 'ACTIVO') {
         console.log(`❌ Status no activo: ${user.status}`);
         return res.status(403).json({ success: false, message: `Tu cuenta está ${user.status}` });
    }

    // 4. Obtener Instituciones (LÓGICA HÍBRIDA)
    // Primero buscamos en la tabla intermedia (Membresías normales)
    const [rows] = await pool.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion, i.status AS institucionStatus, ui.activo as membershipActiva
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ?`,
      [user.id]
    );

    let instituciones = rows.map((r) => ({
      institucionId: String(r.institucionId),
      institucionNombre: r.nombre,
      rol: r.rolInstitucion,
      institucionStatus: r.institucionStatus,
      membershipStatus: r.membershipActiva ? "ACTIVO" : "INACTIVO",
    }));

    // FALLBACK: Si no tiene registros en la tabla intermedia (ej. Admin creado por Setup),
    // revisamos si tiene institucionId en la tabla usuarios.
    if (instituciones.length === 0 && user.institucionId) {
        console.log("⚠️ Usando institución directa (fallback Setup)");
        const [instRows] = await pool.execute(
            "SELECT id, nombre, status FROM instituciones WHERE id = ?", 
            [user.institucionId]
        );
        if (instRows.length > 0) {
            instituciones.push({
                institucionId: String(instRows[0].id),
                institucionNombre: instRows[0].nombre,
                rol: user.rol, // Usamos el rol base del usuario
                institucionStatus: instRows[0].status,
                membershipStatus: "ACTIVO"
            });
        }
    }

    // Filtrar solo activas
    const activas = instituciones.filter(
      (x) => isInstitutionActive(x.institucionStatus) && x.membershipStatus === "ACTIVO"
    );

    // Si es super admin, puede no tener institución
    if (activas.length === 0 && user.rol !== 'SUPER_ADMIN_NACIONAL') {
      console.log("❌ Sin institución activa");
      return res.status(403).json({
        success: false,
        message: "Usuario sin institución activa o asignada",
        code: "NO_INSTITUTION",
      });
    }

    // Preparamos objeto user completo
    const shapedUser = {
      ...user,
      instituciones: activas.map(({ institucionStatus, membershipStatus, ...rest }) => rest),
    };

    const token = generateToken(shapedUser);

    // Actualizar lastLogin
    await pool.execute(
      "UPDATE usuarios SET lastLogin = NOW() WHERE id = ?",
      [user.id]
    );

    console.log("✅ Login exitoso");

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
    console.error("❌ Error en login:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

/** LOGOUT */
const logout = async (req, res) => {
  try {
    res.json({ success: true, message: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

/** PROFILE */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [userRows] = await pool.execute(
      `SELECT * FROM usuarios WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    const base = userRows[0];

    // Misma lógica híbrida para instituciones que en el login
    const [rows] = await pool.execute(
      `SELECT ui.institucionId, i.nombre, ui.rolInstitucion, i.status AS institucionStatus, ui.activo as membershipActiva
       FROM usuario_institucion ui
       JOIN instituciones i ON ui.institucionId = i.id
       WHERE ui.usuarioId = ?`,
      [userId]
    );

    let instituciones = rows.map((r) => ({
      institucionId: String(r.institucionId),
      institucionNombre: r.nombre,
      rol: r.rolInstitucion,
      institucionStatus: r.institucionStatus,
      membershipStatus: r.membershipActiva ? "ACTIVO" : "INACTIVO",
    }));

    if (instituciones.length === 0 && base.institucionId) {
        const [instRows] = await pool.execute(
            "SELECT id, nombre, status FROM instituciones WHERE id = ?", 
            [base.institucionId]
        );
        if (instRows.length > 0) {
            instituciones.push({
                institucionId: String(instRows[0].id),
                institucionNombre: instRows[0].nombre,
                rol: base.rol,
                institucionStatus: instRows[0].status,
                membershipStatus: "ACTIVO"
            });
        }
    }

    const shapedUser = {
      ...base,
      instituciones: instituciones.map(({ institucionStatus, membershipStatus, ...rest }) => rest),
    };

    res.json({ success: true, data: sanitizeUser(shapedUser) });
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

/** VERIFY_TOKEN */
const verifyToken = async (req, res) => {
  try {
    // req.user ya viene del middleware de auth
    res.json({
      success: true,
      message: "Token válido",
      data: { user: sanitizeUser(req.user), isValid: true },
    });
  } catch (error) {
    console.error("Error verificando token:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
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
      telefono,
      direccion,
      genero,
      fechaNacimiento,
    } = req.body;

    // Verificar que el usuario existe
    const [userRows] = await pool.execute("SELECT id FROM usuarios WHERE id = ?", [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // Construcción dinámica de la query
    const sets = [];
    const params = [];

    // Lista blanca de campos permitidos
    if (nombre) { sets.push("nombre = ?"); params.push(nombre.trim()); }
    if (apellidoPaterno) { sets.push("apellidoPaterno = ?"); params.push(apellidoPaterno.trim()); }
    if (apellidoMaterno !== undefined) { sets.push("apellidoMaterno = ?"); params.push(apellidoMaterno); }
    if (telefono !== undefined) { sets.push("telefono = ?"); params.push(telefono); }
    if (direccion !== undefined) { sets.push("direccion = ?"); params.push(direccion); }
    if (genero !== undefined) { sets.push("genero = ?"); params.push(genero); }
    
    if (fechaNacimiento !== undefined) {
      if (fechaNacimiento) {
        const d = new Date(fechaNacimiento);
        const ymd = !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : null;
        sets.push("fechaNacimiento = ?");
        params.push(ymd);
      } else {
        sets.push("fechaNacimiento = NULL");
      }
    }

    // Actualizar nombre completo si cambia nombre o apellidos
    if (nombre || apellidoPaterno) {
       // Necesitamos leer los valores actuales si no se enviaron todos
       const [current] = await pool.execute("SELECT nombre, apellidoPaterno, apellidoMaterno FROM usuarios WHERE id = ?", [userId]);
       const newNombre = nombre || current[0].nombre;
       const newPaterno = apellidoPaterno || current[0].apellidoPaterno;
       const newMaterno = apellidoMaterno !== undefined ? apellidoMaterno : current[0].apellidoMaterno;
       
       const completo = `${newNombre} ${newPaterno}${newMaterno ? " " + newMaterno : ""}`;
       sets.push("nombreCompleto = ?");
       params.push(completo.trim());
    }

    sets.push("updatedAt = NOW()");
    sets.push("perfilCompletado = 1");

    if (sets.length === 0) {
      return res.json({ success: true, message: "No hay cambios", data: sanitizeUser(req.user) });
    }

    const sql = `UPDATE usuarios SET ${sets.join(", ")} WHERE id = ?`;
    params.push(userId);

    await pool.execute(sql, params);

    // Retornar perfil actualizado llamando a getProfile internamente o reconstruyendo
    // Para simpleza, devolvemos éxito y el frontend puede recargar
    res.json({ success: true, message: "Perfil actualizado correctamente" });

  } catch (error) {
    console.error("Error actualizando perfil:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
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
};