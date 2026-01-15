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
       WHERE email = ?
       AND status IN ('PENDIENTE', 'EN_REVISION')
       LIMIT 1`,
      [responsableCorreoInstitucional]
    );

    if (existingSolicitud.length > 0) {
      await conn.rollback();
      return res.status(409).json({
        success: false,
        message: "Ya tienes una solicitud pendiente para esta institución. Por favor espera la respuesta del administrador antes de enviar otra solicitud.",
        code: "SOLICITUD_DUPLICADA",
        data: {
          status: existingSolicitud[0].status,
          mensaje: "Tu solicitud está siendo revisada. Recibirás una respuesta por correo electrónico."
        }
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
        institucionExistente,
        institucionNombre,
        institucionTipo,
        institucionNivel,
        institucionDireccion,
        institucionCiudad,
        institucionEstado,
        institucionTelefono,
        institucionEmail,
        cedulaProfesional,
        cargoInstitucion,
        esResponsableInstitucion,
        motivoSolicitud,
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
        NOW(), NOW()
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

/**
 * Obtener todas las solicitudes de instituciones (Solo Super Admin)
 */
const obtenerSolicitudes = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const pageNum = Math.max(
      parseInt(String(req.query.page || "1"), 10) || 1,
      1
    );
    const limitNum = Math.min(
      Math.max(parseInt(String(req.query.limit || "10"), 10) || 10, 1),
      100
    );
    const offsetNum = (pageNum - 1) * limitNum;

    const status = String(req.query.status || "").trim();
    const search = String(req.query.search || "").trim();

    const allowedSortBy = new Set([
      "createdAt",
      "status",
      "institucionNombre",
      "email",
    ]);
    const sortBy = allowedSortBy.has(String(req.query.sortBy || "createdAt"))
      ? String(req.query.sortBy)
      : "createdAt";
    const sortOrder =
      String(req.query.sortOrder || "desc").toLowerCase() === "asc"
        ? "asc"
        : "desc";

    let baseQuery = `
      FROM solicitudes_acceso s
      WHERE s.rolSolicitado = 'ADMIN_INSTITUCION'
    `;

    const queryParams = [];

    if (status) {
      baseQuery += ` AND s.status = ?`;
      queryParams.push(status);
    }

    if (search) {
      baseQuery += ` AND (
        s.institucionNombre LIKE ? OR
        s.nombre LIKE ? OR
        s.email LIKE ? OR
        s.institucionCiudad LIKE ? OR
        s.institucionEstado LIKE ?
      )`;
      const t = `%${search}%`;
      queryParams.push(t, t, t, t, t);
    }

    const [totalResult] = await conn.execute(
      `SELECT COUNT(*) as total ${baseQuery}`,
      queryParams
    );
    const total = Number(totalResult?.[0]?.total || 0);

    let orderClause = "";
    if (sortBy === "status") {
      orderClause = ` ORDER BY
        CASE s.status
          WHEN 'PENDIENTE' THEN 1
          WHEN 'EN_REVISION' THEN 2
          WHEN 'APROBADA' THEN 3
          WHEN 'RECHAZADA' THEN 4
          ELSE 5
        END ${sortOrder},
        s.createdAt DESC
      `;
    } else {
      // sortBy viene de whitelist, seguro interpolar
      orderClause = ` ORDER BY s.${sortBy} ${sortOrder}`;
    }

    const dataQuery = `
      SELECT
        s.id,
        s.nombre,
        s.apellidoPaterno,
        s.apellidoMaterno,
        s.email,
        s.telefono,
        s.institucionNombre,
        s.institucionCiudad,
        s.institucionEstado,
        s.institucionTelefono,
        s.institucionEmail,
        s.cargoInstitucion,
        s.cedulaProfesional,
        s.motivoSolicitud,
        s.status,
        s.notasAdmin,
        s.motivoRechazo,
        s.procesadoAt,
        s.createdAt,
        s.updatedAt
      ${baseQuery}
      ${orderClause}
      LIMIT ${limitNum} OFFSET ${offsetNum}
    `;

    const [solicitudes] = await conn.execute(dataQuery, queryParams);

    const [statsResult] = await conn.execute(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'PENDIENTE' THEN 1 END) as pendientes,
        COUNT(CASE WHEN status = 'EN_REVISION' THEN 1 END) as enRevision,
        COUNT(CASE WHEN status = 'APROBADA' THEN 1 END) as aprobadas,
        COUNT(CASE WHEN status = 'RECHAZADA' THEN 1 END) as rechazadas
      FROM solicitudes_acceso
      WHERE rolSolicitado = 'ADMIN_INSTITUCION'
    `);

    res.json({
      success: true,
      data: {
        solicitudes,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
        stats: statsResult?.[0] || {},
      },
    });
  } catch (error) {
    console.error("Error obteniendo solicitudes:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo solicitudes",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    conn.release();
  }
};

/**
 * Obtener detalles de una solicitud específica
 */
const obtenerSolicitudPorId = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;

    const [solicitudResult] = await conn.execute(`
      SELECT
        s.*,
        u.nombre as procesadoPorNombre,
        u.email as procesadoPorEmail
      FROM solicitudes_acceso s
      LEFT JOIN usuarios u ON s.procesadoPor = u.id
      WHERE s.id = ? AND s.rolSolicitado = 'ADMIN_INSTITUCION'
    `, [id]);

    if (solicitudResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada"
      });
    }

    const solicitud = solicitudResult[0];

    // Verificar si ya existe una institución con datos similares
    const [institucionSimilar] = await conn.execute(`
      SELECT id, nombre, codigo, status
      FROM instituciones
      WHERE (
        nombre LIKE ? OR
        codigo = ? OR
        emailInstitucional = ?
      )
      LIMIT 1
    `, [
      `%${solicitud.institucionNombre}%`,
      solicitud.cedulaProfesional, // Se usó este campo para la clave institucional
      solicitud.institucionEmail
    ]);

    res.json({
      success: true,
      data: {
        solicitud,
        institucionExistente: institucionSimilar[0] || null
      }
    });

  } catch (error) {
    console.error("Error obteniendo solicitud:", error.message);
    res.status(500).json({
      success: false,
      message: "Error obteniendo solicitud"
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Aprobar una solicitud de institución
 */
const aprobarSolicitud = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    const { notasAdmin } = req.body;
    const adminId = req.user.id;

    await conn.beginTransaction();

    // Obtener la solicitud
    const [solicitudResult] = await conn.execute(`
      SELECT * FROM solicitudes_acceso WHERE id = ? AND status IN ('PENDIENTE', 'EN_REVISION')
    `, [id]);

    if (solicitudResult.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada o ya procesada"
      });
    }

    const solicitud = solicitudResult[0];

    // Crear la institución
    const institucionId = crypto.randomUUID();

    await conn.execute(`
      INSERT INTO instituciones (
        id, codigo, nombre, nombreCorto, tipoInstitucion, nivelEducativo,
        direccion, ciudad, estado, codigoPostal, telefono, emailInstitucional,
        responsableNombre, responsableEmail, responsableTelefono, responsableCargo,
        status, fechaActivacion, maxUsuarios, createdAt, updatedAt
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        'ACTIVA', NOW(), 100, NOW(), NOW()
      )
    `, [
      institucionId,
      solicitud.cedulaProfesional, // Se usó para clave institucional
      solicitud.institucionNombre,
      solicitud.institucionNombre.substring(0, 50), // nombreCorto
      solicitud.institucionTipo || 'UNIVERSIDAD',
      solicitud.institucionNivel || 'SUPERIOR',
      solicitud.institucionDireccion,
      solicitud.institucionCiudad,
      solicitud.institucionEstado,
      null, // codigoPostal se extraerá después
      solicitud.institucionTelefono,
      solicitud.institucionEmail,
      solicitud.nombre + ' ' + (solicitud.apellidoPaterno || ''),
      solicitud.email,
      solicitud.telefono,
      solicitud.cargoInstitucion,
    ]);

    // Actualizar la solicitud
    await conn.execute(`
      UPDATE solicitudes_acceso
      SET
        status = 'APROBADA',
        notasAdmin = ?,
        procesadoAt = NOW(),
        institucionId = ?,
        updatedAt = NOW()
      WHERE id = ?
    `, [notasAdmin, adminId, institucionId, id]);

    await conn.commit();

    // TODO: Enviar email de aprobación

    console.log(`✅ Solicitud aprobada: ${solicitud.institucionNombre} por admin ${adminId}`);

    res.json({
      success: true,
      message: "Solicitud aprobada e institución creada exitosamente",
      data: {
        solicitudId: id,
        institucionId,
        status: 'APROBADA'
      }
    });

  } catch (error) {
    try {
      await conn.rollback();
    } catch (rollbackError) {
      console.error('Error en rollback:', rollbackError.message);
    }

    console.error("Error aprobando solicitud:", error.message);
    res.status(500).json({
      success: false,
      message: "Error aprobando solicitud: " + error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Rechazar una solicitud de institución
 */
const rechazarSolicitud = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    const { motivoRechazo, notasAdmin } = req.body;
    const adminId = req.user.id;

    if (!motivoRechazo || motivoRechazo.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "El motivo de rechazo debe tener al menos 10 caracteres"
      });
    }

    const [result] = await conn.execute(`
      UPDATE solicitudes_acceso
      SET
        status = 'RECHAZADA',
        motivoRechazo = ?,
        notasAdmin = ?,
        procesadoAt = NOW(),
        updatedAt = NOW()
      WHERE id = ? AND status IN ('PENDIENTE', 'EN_REVISION')
    `, [motivoRechazo, notasAdmin, adminId, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada o ya procesada"
      });
    }

    // TODO: Enviar email de rechazo

    console.log(`❌ Solicitud rechazada: ID ${id} por admin ${adminId}`);

    res.json({
      success: true,
      message: "Solicitud rechazada exitosamente",
      data: { solicitudId: id, status: 'RECHAZADA' }
    });

  } catch (error) {
    console.error("Error rechazando solicitud:", error.message);
    res.status(500).json({
      success: false,
      message: "Error rechazando solicitud"
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Poner solicitud en revisión
 */
const ponerEnRevision = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    const { notasAdmin } = req.body;
    const adminId = req.user.id;

    const [result] = await conn.execute(`
      UPDATE solicitudes_acceso
      SET
        status = 'EN_REVISION',
        notasAdmin = ?,
        procesadoAt = NOW(),
        updatedAt = NOW()
      WHERE id = ? AND status = 'PENDIENTE'
    `, [notasAdmin, adminId, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Solicitud no encontrada o no está pendiente"
      });
    }

    res.json({
      success: true,
      message: "Solicitud puesta en revisión",
      data: { solicitudId: id, status: 'EN_REVISION' }
    });

  } catch (error) {
    console.error("Error poniendo solicitud en revisión:", error.message);
    res.status(500).json({
      success: false,
      message: "Error poniendo solicitud en revisión"
    });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  crearSolicitudInstitucion,
  obtenerEstados,
  obtenerCiudades,
  validarCodigoPostal,
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  aprobarSolicitud,
  rechazarSolicitud,
  ponerEnRevision
};