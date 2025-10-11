const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../db");

const {
  generarEmailInstitucional,
  validarNumeroControl,
  mapearGenero,
  calcularEdad,
  generarUUID,
  CONTRASEÑA_INICIAL
} = require("../utils/emailInstitucional");

const router = express.Router();

/**
 * POST /api/estudiantes/registro
 * Registra un nuevo estudiante en el sistema
 */
router.post("/registro", async (req, res) => {
  let connection;

  try {
    const {
      numeroControl,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      genero,
      emailInstitucional
    } = req.body;

    // Validaciones básicas
    if (!numeroControl || !nombres || !apellidoPaterno || !fechaNacimiento || !genero) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: numeroControl, nombres, apellidoPaterno, fechaNacimiento, genero"
      });
    }

    // Validar número de control
    if (!validarNumeroControl(numeroControl)) {
      return res.status(400).json({
        success: false,
        message: "Número de control inválido. Debe tener 8 caracteres y puede empezar con letra o número."
      });
    }

    // Generar email institucional
    let email;
    try {
      email = generarEmailInstitucional(numeroControl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `Error generando email institucional: ${error.message}`
      });
    }

    // Verificar que el email generado coincida con el enviado (validación adicional)
    if (emailInstitucional && emailInstitucional !== email) {
      return res.status(400).json({
        success: false,
        message: "El email institucional generado no coincide con el esperado"
      });
    }

    connection = await pool.getConnection();

    // Verificar que el estudiante no exista ya
    const [existingUsers] = await connection.execute(
      `SELECT id, email, matricula FROM usuarios
       WHERE email = ? OR matricula = ? LIMIT 1`,
      [email, numeroControl]
    );

    if (existingUsers.length > 0) {
      const existing = existingUsers[0];
      let conflictMessage = "Ya existe un estudiante con ";

      if (existing.email === email && existing.matricula === numeroControl) {
        conflictMessage += "este número de control y email";
      } else if (existing.email === email) {
        conflictMessage += "este email institucional";
      } else {
        conflictMessage += "este número de control";
      }

      return res.status(409).json({
        success: false,
        message: conflictMessage
      });
    }

    // Usar institución TecNM Tuxtepec
    const institucionId = "3579387c-6c49-49c6-83ed-d1f33e79d8a6";

    // Hash de la contraseña inicial
    const passwordHash = await bcrypt.hash(CONTRASEÑA_INICIAL, 10);

    // Procesar fecha de nacimiento y calcular edad
    const fechaNac = new Date(fechaNacimiento);
    const edad = calcularEdad(fechaNac);

    // Crear nombre completo
    const nombreCompleto = `${nombres.trim()} ${apellidoPaterno.trim()} ${
      apellidoMaterno ? apellidoMaterno.trim() : ''
    }`.trim();

    // Crear usuario
    const usuarioId = generarUUID();
    const ahora = new Date();

    await connection.execute(
      `INSERT INTO usuarios (
        id, institucionId, email, emailVerificado, passwordHash,
        nombre, apellidoPaterno, apellidoMaterno, nombreCompleto,
        matricula, fechaNacimiento, edad, genero,
        rol, status, requiereCambioPassword, perfilCompletado,
        createdAt, updatedAt, createdBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuarioId,
        institucionId,
        email,
        false, // emailVerificado
        passwordHash,
        nombres.trim(),
        apellidoPaterno.trim(),
        apellidoMaterno ? apellidoMaterno.trim() : null,
        nombreCompleto,
        numeroControl,
        fechaNac,
        edad,
        mapearGenero(genero),
        'ESTUDIANTE',
        'ACTIVO',
        true, // requiereCambioPassword
        false, // perfilCompletado
        ahora,
        ahora,
        'REGISTRO_ESTUDIANTE'
      ]
    );

    // Crear entrada en usuario_institucion para que pueda hacer login
    // Usar un ID numérico simple ya que la columna parece ser más pequeña
    const usuarioInstitucionId = Math.floor(Math.random() * 1000000);
    await connection.execute(
      `INSERT INTO usuario_institucion (id, usuarioId, institucionId, rolInstitucion, activo, createdAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        usuarioInstitucionId,
        usuarioId,
        institucionId,
        'ESTUDIANTE',
        1 // activo
      ]
    );

    console.log(`✅ Estudiante registrado: ${numeroControl} - ${email}`);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: "Estudiante registrado exitosamente",
      data: {
        id: usuarioId,
        numeroControl: numeroControl,
        email: email,
        nombreCompleto: nombreCompleto,
        contraseñaInicial: CONTRASEÑA_INICIAL,
        requiereCambioPassword: true,
        perfilCompletado: false
      }
    });

  } catch (error) {
    console.error("Error en registro de estudiante:", error);

    // Análisis de errores específicos de MySQL
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: "Ya existe un estudiante con este número de control o email"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      ...(process.env.NODE_ENV !== "production" && { error: error.message })
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/**
 * GET /api/estudiantes/verificar-disponibilidad/:numeroControl
 * Verifica si un número de control está disponible
 */
router.get("/verificar-disponibilidad/:numeroControl", async (req, res) => {
  let connection;

  try {
    const { numeroControl } = req.params;

    // Validar formato del número de control
    if (!validarNumeroControl(numeroControl)) {
      return res.status(400).json({
        success: false,
        message: "Número de control inválido",
        disponible: false
      });
    }

    connection = await pool.getConnection();

    // Verificar disponibilidad
    const [existing] = await connection.execute(
      `SELECT matricula FROM usuarios WHERE matricula = ? LIMIT 1`,
      [numeroControl]
    );

    const disponible = existing.length === 0;
    const emailGenerado = disponible ? generarEmailInstitucional(numeroControl) : null;

    res.json({
      success: true,
      disponible: disponible,
      numeroControl: numeroControl,
      emailInstitucional: emailGenerado,
      message: disponible
        ? "Número de control disponible"
        : "Número de control ya está registrado"
    });

  } catch (error) {
    console.error("Error verificando disponibilidad:", error);
    res.status(500).json({
      success: false,
      message: "Error verificando disponibilidad",
      disponible: false
    });

  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/**
 * POST /api/estudiantes/validar-datos
 * Valida los datos antes del registro (sin crear el usuario)
 */
router.post("/validar-datos", (req, res) => {
  try {
    const {
      numeroControl,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      genero
    } = req.body;

    const errores = {};

    // Validar número de control
    if (!numeroControl) {
      errores.numeroControl = "Número de control es requerido";
    } else if (!validarNumeroControl(numeroControl)) {
      errores.numeroControl = "Número de control debe tener 8 caracteres";
    }

    // Validar nombres
    if (!nombres || !nombres.trim()) {
      errores.nombres = "Nombre(s) es requerido";
    } else if (nombres.trim().length < 2) {
      errores.nombres = "Nombre(s) debe tener al menos 2 caracteres";
    }

    // Validar apellido paterno
    if (!apellidoPaterno || !apellidoPaterno.trim()) {
      errores.apellidoPaterno = "Apellido paterno es requerido";
    }

    // Validar fecha de nacimiento
    if (!fechaNacimiento) {
      errores.fechaNacimiento = "Fecha de nacimiento es requerida";
    } else {
      const fecha = new Date(fechaNacimiento);
      const edad = calcularEdad(fecha);
      if (edad < 15 || edad > 100) {
        errores.fechaNacimiento = "Edad debe estar entre 15 y 100 años";
      }
    }

    // Validar género
    if (!genero) {
      errores.genero = "Género es requerido";
    }

    const esValido = Object.keys(errores).length === 0;
    let emailGenerado = null;

    if (esValido && numeroControl) {
      try {
        emailGenerado = generarEmailInstitucional(numeroControl);
      } catch (error) {
        errores.numeroControl = error.message;
      }
    }

    res.json({
      success: esValido,
      valido: esValido,
      errores: errores,
      emailInstitucional: emailGenerado,
      message: esValido ? "Datos válidos" : "Hay errores en los datos"
    });

  } catch (error) {
    console.error("Error validando datos:", error);
    res.status(500).json({
      success: false,
      message: "Error validando datos"
    });
  }
});

module.exports = router;