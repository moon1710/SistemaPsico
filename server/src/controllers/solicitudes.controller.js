// controllers/solicitudes.controller.js
const { validationResult } = require("express-validator");
const { pool } = require("../db");
const crypto = require("crypto");
// const emailService = require("../services/emailService"); // Descomentar cuando esté listo

/**
 * Crear solicitud de institución (Ruta pública)
 */
const crearSolicitudInstitucion = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    // Validar datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const {
      // Datos de institución
      nombreCampus,
      estado,
      ciudad,
      codigoPostal,
      claveInstitucional,
      telefonoInstitucion,
      extension,
      nombreDirector,
      correoInstitucional,

      // Datos del responsable
      responsableNombre,
      responsableCargo,
      responsableCorreoInstitucional,
      responsableCorreoPersonal,
      responsableTelefonoPersonal,

      // Confirmación
      autorizacionConfirmada,

      // Datos adicionales opcionales
      comentarios
    } = req.body;

    await conn.beginTransaction();

    // Verificar que no exista una solicitud pendiente con el mismo correo
    const [existingSolicitud] = await conn.execute(
      `SELECT id, status
       FROM solicitudes_acceso
       WHERE (responsableCorreoInstitucional = ? OR responsableCorreoPersonal = ?)
       AND status IN ('PENDIENTE', 'EN_REVISION')
       LIMIT 1`,
      [responsableCorreoInstitucional, responsableCorreoPersonal]
    );

    if (existingSolicitud.length > 0) {
      await conn.rollback();
      return res.status(409).json({
        success: false,
        message: "Ya existe una solicitud pendiente con este correo electrónico",
        code: "SOLICITUD_DUPLICADA"
      });
    }

    // Verificar que no exista institución con la misma clave
    const [existingInstitucion] = await conn.execute(
      `SELECT id FROM instituciones WHERE codigo = ? LIMIT 1`,
      [claveInstitucional]
    );

    if (existingInstitucion.length > 0) {
      await conn.rollback();
      return res.status(409).json({
        success: false,
        message: "Ya existe una institución con esa clave institucional",
        code: "CLAVE_DUPLICADA"
      });
    }

    // Crear la solicitud
    const solicitudId = crypto.randomUUID();

    await conn.execute(
      `INSERT INTO solicitudes_acceso (
        id,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        telefono,
        rolSolicitado,

        -- Información de institución (nueva)
        institucionExistente,
        institucionNombre,
        institucionTipo,
        institucionNivel,
        institucionDireccion,
        institucionCiudad,
        institucionEstado,
        institucionTelefono,
        institucionEmail,

        -- Información específica del responsable
        cedulaProfesional,
        cargoInstitucion,
        esResponsableInstitucion,

        -- Datos adicionales
        motivoSolicitud,

        -- Control
        status,
        createdAt,
        updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        'ADMIN_INSTITUCION',
        FALSE,
        ?, ?, ?,
        CONCAT(?, ', ', ?, ', CP: ', IFNULL(?, 'N/A')),
        ?, ?, ?, ?,
        ?, ?, TRUE,
        ?,
        'PENDIENTE',
        NOW(3), NOW(3)
      )`,
      [
        solicitudId,
        // Datos personales del responsable
        responsableNombre.split(' ')[0] || responsableNombre, // nombre
        responsableNombre.split(' ')[1] || '', // apellidoPaterno
        responsableNombre.split(' ')[2] || null, // apellidoMaterno
        responsableCorreoInstitucional, // email principal
        responsableTelefonoPersonal, // telefono

        // Datos de institución
        nombreCampus, // institucionNombre
        'UNIVERSIDAD', // institucionTipo (default, se puede cambiar después)
        'SUPERIOR', // institucionNivel (default)
        nombreCampus, ciudad, codigoPostal, // para construir dirección
        ciudad, // institucionCiudad
        estado, // institucionEstado
        telefonoInstitucion + (extension ? ` ext. ${extension}` : ''), // institucionTelefono
        correoInstitucional, // institucionEmail

        // Datos del responsable
        claveInstitucional, // cedulaProfesional (reutilizamos el campo)
        responsableCargo, // cargoInstitucion

        // Comentarios
        comentarios || `Solicitud automática vía web. Director: ${nombreDirector}. Correo personal: ${responsableCorreoPersonal}`
      ]
    );

    await conn.commit();

    // TODO: Enviar notificación por email al super admin
    // try {
    //   await emailService.enviarNotificacionNuevaSolicitud({
    //     solicitudId,
    //     nombreCampus,
    //     responsableNombre,
    //     responsableCorreoInstitucional,
    //     ciudad,
    //     estado
    //   });
    // } catch (emailError) {
    //   console.error('Error enviando notificación por email:', emailError.message);
    //   // No afecta el flujo principal
    // }

    console.log(`📋 Nueva solicitud de institución creada: ${nombreCampus} - ${responsableNombre}`);

    res.status(201).json({
      success: true,
      message: "Solicitud enviada correctamente",
      data: {
        solicitudId,
        mensaje: "Hemos recibido tu información. Si la solicitud es aprobada, recibirás un correo con las instrucciones para completar el registro institucional.",
        nombreCampus,
        responsableNombre,
        status: "PENDIENTE"
      }
    });

  } catch (error) {
    try {
      await conn.rollback();
    } catch (rollbackError) {
      console.error('Error en rollback:', rollbackError.message);
    }

    console.error("❌ Error creando solicitud de institución:", error.message);

    res.status(500).json({
      success: false,
      message: "Error interno del servidor. Intente nuevamente.",
      code: "INTERNAL_ERROR"
    });

  } finally {
    if (conn) conn.release();
  }
};

/**
 * Obtener lista de estados para autocompletado
 */
const obtenerEstados = async (req, res) => {
  try {
    // Estados de México
    const estados = [
      "Aguascalientes", "Baja California", "Baja California Sur", "Campeche",
      "Chiapas", "Chihuahua", "Ciudad de México", "Coahuila", "Colima",
      "Durango", "Estado de México", "Guanajuato", "Guerrero", "Hidalgo",
      "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca",
      "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa",
      "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
    ];

    res.json({
      success: true,
      data: estados.map(estado => ({ nombre: estado, value: estado }))
    });

  } catch (error) {
    console.error("Error obteniendo estados:", error.message);
    res.status(500).json({
      success: false,
      message: "Error obteniendo lista de estados"
    });
  }
};

/**
 * Obtener ciudades por estado (implementación básica)
 */
const obtenerCiudades = async (req, res) => {
  try {
    const { estado } = req.params;

    // Implementación básica - en producción conectar con API de códigos postales
    const ciudadesEjemplo = {
      "Ciudad de México": ["Álvaro Obregón", "Azcapotzalco", "Benito Juárez", "Coyoacán", "Cuauhtémoc"],
      "Jalisco": ["Guadalajara", "Zapopan", "Puerto Vallarta", "Tlaquepaque", "Tonalá"],
      "Nuevo León": ["Monterrey", "Guadalupe", "San Nicolás de los Garza", "Apodaca", "Santa Catarina"],
      // Agregar más según necesidades
    };

    const ciudades = ciudadesEjemplo[estado] || [`${estado} Centro`];

    res.json({
      success: true,
      data: ciudades.map(ciudad => ({ nombre: ciudad, value: ciudad }))
    });

  } catch (error) {
    console.error("Error obteniendo ciudades:", error.message);
    res.status(500).json({
      success: false,
      message: "Error obteniendo lista de ciudades"
    });
  }
};

/**
 * Validar código postal (integración con archivo existente)
 */
const validarCodigoPostal = async (req, res) => {
  try {
    const { cp } = req.params;

    // Validación básica de formato
    if (!/^\d{5}$/.test(cp)) {
      return res.status(400).json({
        success: false,
        message: "Código postal debe tener 5 dígitos"
      });
    }

    // TODO: Integrar con tu archivo codigoPostal.js existente
    // const ubicacion = await obtenerUbicacionPorCP(cp);

    // Por ahora, respuesta básica
    res.json({
      success: true,
      data: {
        codigoPostal: cp,
        valido: true,
        // ciudad: ubicacion?.ciudad,
        // estado: ubicacion?.estado,
        mensaje: "Código postal válido"
      }
    });

  } catch (error) {
    console.error("Error validando código postal:", error.message);
    res.status(500).json({
      success: false,
      message: "Error validando código postal"
    });
  }
};

module.exports = {
  crearSolicitudInstitucion,
  obtenerEstados,
  obtenerCiudades,
  validarCodigoPostal
};