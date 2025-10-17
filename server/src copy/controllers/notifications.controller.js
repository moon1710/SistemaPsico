// controllers/notifications.controller.js
const { pool } = require("../db");
const { validationResult } = require("express-validator");

/**
 * Crear una nueva notificación
 */
const crearNotificacion = async (usuarioId, tipo, titulo, mensaje, datos = null, prioridad = 'media', acciones = null, expiresAt = null) => {
  const conn = await pool.getConnection();
  try {
    const notificationId = require("crypto").randomUUID();

    await conn.execute(
      `INSERT INTO notificaciones
       (id, usuarioId, tipo, titulo, mensaje, datos, prioridad, acciones, expiresAt, fechaCreacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        notificationId,
        usuarioId,
        tipo,
        titulo,
        mensaje,
        datos ? JSON.stringify(datos) : null,
        prioridad,
        acciones ? JSON.stringify(acciones) : null,
        expiresAt
      ]
    );

    return notificationId;
  } finally {
    conn.release();
  }
};

/**
 * Obtener notificaciones del usuario
 */
const obtenerNotificaciones = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tipo, leida, limite = 50, pagina = 1 } = req.query;

    let whereClause = "WHERE n.usuarioId = ? AND n.activa = 1";
    let queryParams = [userId];

    // Filtrar notificaciones expiradas
    whereClause += " AND (n.expiresAt IS NULL OR n.expiresAt > NOW())";

    if (tipo) {
      whereClause += " AND n.tipo = ?";
      queryParams.push(tipo);
    }

    if (leida !== undefined) {
      whereClause += " AND n.leida = ?";
      queryParams.push(leida === 'true' ? 1 : 0);
    }

    const offset = (parseInt(pagina) - 1) * parseInt(limite);

    const [notificaciones] = await pool.execute(
      `SELECT
         n.id,
         n.tipo,
         n.titulo,
         n.mensaje,
         n.datos,
         n.leida,
         n.prioridad,
         n.acciones,
         n.fechaCreacion,
         n.fechaLectura
       FROM notificaciones n
       ${whereClause}
       ORDER BY n.fechaCreacion DESC
       LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limite), offset]
    );

    // Contar total para paginación
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM notificaciones n ${whereClause}`,
      queryParams
    );

    // Procesar datos JSON
    const notificacionesProcesadas = notificaciones.map(notif => ({
      ...notif,
      datos: notif.datos ? JSON.parse(notif.datos) : null,
      acciones: notif.acciones ? JSON.parse(notif.acciones) : []
    }));

    res.json({
      success: true,
      data: {
        notificaciones: notificacionesProcesadas,
        total: countResult[0].total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        totalPaginas: Math.ceil(countResult[0].total / parseInt(limite))
      }
    });
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

/**
 * Marcar notificación como leída
 */
const marcarComoLeida = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const [result] = await pool.execute(
      `UPDATE notificaciones
       SET leida = 1, fechaLectura = NOW()
       WHERE id = ? AND usuarioId = ?`,
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada"
      });
    }

    res.json({
      success: true,
      message: "Notificación marcada como leída"
    });
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
const marcarTodasComoLeidas = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.execute(
      `UPDATE notificaciones
       SET leida = 1, fechaLectura = NOW()
       WHERE usuarioId = ? AND leida = 0 AND activa = 1`,
      [userId]
    );

    res.json({
      success: true,
      message: "Todas las notificaciones marcadas como leídas"
    });
  } catch (error) {
    console.error('Error marcando todas las notificaciones como leídas:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

/**
 * Eliminar notificación
 */
const eliminarNotificacion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;

    const [result] = await pool.execute(
      `UPDATE notificaciones
       SET activa = 0
       WHERE id = ? AND usuarioId = ?`,
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada"
      });
    }

    res.json({
      success: true,
      message: "Notificación eliminada"
    });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

/**
 * Obtener contador de notificaciones no leídas
 */
const obtenerContadorNoLeidas = async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await pool.execute(
      `SELECT COUNT(*) as no_leidas
       FROM notificaciones
       WHERE usuarioId = ? AND leida = 0 AND activa = 1
       AND (expiresAt IS NULL OR expiresAt > NOW())`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        no_leidas: result[0].no_leidas
      }
    });
  } catch (error) {
    console.error('Error obteniendo contador de notificaciones no leídas:', error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

/**
 * Crear notificación de bienvenida para nuevos usuarios
 */
const crearNotificacionBienvenida = async (usuarioId, nombreCompleto, rol) => {
  try {
    const mensajePorRol = {
      'ESTUDIANTE': `¡Hola ${nombreCompleto}! Bienvenido/a al Sistema Psicológico. Aquí podrás agendar citas, realizar evaluaciones psicológicas y acceder a recursos de bienestar mental. ¡Explora todas las funcionalidades disponibles!`,
      'PSICOLOGO': `¡Bienvenido/a Dr./Dra. ${nombreCompleto}! Su cuenta de psicólogo ha sido activada. Puede gestionar su agenda, ver evaluaciones de estudiantes y brindar atención psicológica. ¡Gracias por ser parte de nuestro equipo!`,
      'ORIENTADOR': `¡Hola ${nombreCompleto}! Bienvenido/a como orientador al sistema. Puede guiar a los estudiantes y colaborar con el equipo psicológico para brindar el mejor apoyo posible.`,
      'SUPER_ADMIN_INSTITUCION': `¡Bienvenido/a ${nombreCompleto}! Como administrador de institución, tiene acceso completo para gestionar usuarios, configurar el sistema y supervisar las actividades de su institución.`,
      'SUPER_ADMIN_NACIONAL': `¡Bienvenido/a ${nombreCompleto}! Como super administrador nacional, tiene acceso total al sistema para gestionar todas las instituciones y configuraciones generales.`
    };

    const mensaje = mensajePorRol[rol] || `¡Bienvenido/a ${nombreCompleto}! Su cuenta ha sido activada exitosamente.`;

    const acciones = rol === 'ESTUDIANTE' ? [
      { label: 'Ver Dashboard', action: 'dashboard' },
      { label: 'Agendar Cita', action: 'book_appointment' },
      { label: 'Realizar Evaluación', action: 'take_quiz' }
    ] : [
      { label: 'Ver Dashboard', action: 'dashboard' },
      { label: 'Explorar Sistema', action: 'explore' }
    ];

    await crearNotificacion(
      usuarioId,
      'bienvenida',
      '¡Bienvenido/a al Sistema Psicológico!',
      mensaje,
      { rol, primerIngreso: true },
      'alta',
      acciones,
      null // No expira
    );
  } catch (error) {
    console.error('Error creando notificación de bienvenida:', error);
  }
};

/**
 * Crear notificación de cita programada
 */
const crearNotificacionCita = async (usuarioId, psicologoId, citaData, tipoCita) => {
  try {
    const mensajes = {
      'nueva': `Su cita con el/la psicólogo/a ha sido programada para el ${new Date(citaData.fechaHora).toLocaleDateString('es-ES')} a las ${new Date(citaData.fechaHora).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}.`,
      'confirmada': `Su cita ha sido confirmada para el ${new Date(citaData.fechaHora).toLocaleDateString('es-ES')} a las ${new Date(citaData.fechaHora).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}.`,
      'recordatorio': `Recordatorio: Tiene una cita programada para hoy a las ${new Date(citaData.fechaHora).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}.`,
      'cancelada': 'Su cita ha sido cancelada. Puede programar una nueva cita cuando lo desee.'
    };

    const titulos = {
      'nueva': 'Cita Programada',
      'confirmada': 'Cita Confirmada',
      'recordatorio': 'Recordatorio de Cita',
      'cancelada': 'Cita Cancelada'
    };

    const acciones = tipoCita === 'cancelada' ? [
      { label: 'Agendar Nueva Cita', action: 'book_appointment' }
    ] : [
      { label: 'Ver Cita', action: 'view_appointment' },
      { label: 'Mi Agenda', action: 'my_appointments' }
    ];

    await crearNotificacion(
      usuarioId,
      'cita',
      titulos[tipoCita] || 'Notificación de Cita',
      mensajes[tipoCita] || 'Información sobre su cita.',
      { citaId: citaData.id, psicologoId, tipoCita },
      tipoCita === 'recordatorio' ? 'alta' : 'media',
      acciones,
      tipoCita === 'recordatorio' ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null // Los recordatorios expiran en 24h
    );
  } catch (error) {
    console.error('Error creando notificación de cita:', error);
  }
};

/**
 * Crear notificación de evaluación completada
 */
const crearNotificacionEvaluacion = async (usuarioId, evaluacionData) => {
  try {
    const mensaje = `Su evaluación "${evaluacionData.titulo}" ha sido completada. Los resultados están disponibles para revisión.`;

    const acciones = [
      { label: 'Ver Resultados', action: 'view_results' },
      { label: 'Mis Evaluaciones', action: 'my_evaluations' }
    ];

    await crearNotificacion(
      usuarioId,
      'evaluacion',
      'Evaluación Completada',
      mensaje,
      { evaluacionId: evaluacionData.id, puntaje: evaluacionData.puntajeTotal },
      'media',
      acciones,
      null
    );
  } catch (error) {
    console.error('Error creando notificación de evaluación:', error);
  }
};

module.exports = {
  obtenerNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
  obtenerContadorNoLeidas,
  crearNotificacion,
  crearNotificacionBienvenida,
  crearNotificacionCita,
  crearNotificacionEvaluacion
};