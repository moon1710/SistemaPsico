const express = require("express");
const { pool } = require("../db");
const { authenticateToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// GET /api/chat/conversations - Obtener conversaciones del usuario
router.get("/conversations", async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.rol;

    let conversations;

    const userRoleInstitution = req.user.instituciones?.[0]?.rol;

    if (userRoleInstitution === 'PSICOLOGO') {
      // Psicólogos ven todas sus conversaciones con estudiantes
      [conversations] = await pool.execute(
        `SELECT c.*,
                u.nombreCompleto as estudianteNombre,
                u.email as estudianteEmail,
                u.matricula,
                (SELECT COUNT(*) FROM mensajes m WHERE m.conversacionId = c.id AND m.remitenteId != ? AND m.leido = 0) as mensajesNoLeidos,
                (SELECT m.mensaje FROM mensajes m WHERE m.conversacionId = c.id ORDER BY m.fechaEnvio DESC LIMIT 1) as ultimoMensaje
         FROM conversaciones c
         JOIN usuarios u ON c.estudianteId = u.id
         WHERE c.psicologoId = ?
         ORDER BY c.fechaUltimoMensaje DESC NULLS LAST, c.fechaCreacion DESC`,
        [userId, userId]
      );
    } else {
      // Estudiantes ven sus conversaciones con psicólogos
      [conversations] = await pool.execute(
        `SELECT c.*,
                u.nombreCompleto as psicologoNombre,
                u.email as psicologoEmail,
                (SELECT COUNT(*) FROM mensajes m WHERE m.conversacionId = c.id AND m.remitenteId != ? AND m.leido = 0) as mensajesNoLeidos,
                (SELECT m.mensaje FROM mensajes m WHERE m.conversacionId = c.id ORDER BY m.fechaEnvio DESC LIMIT 1) as ultimoMensaje
         FROM conversaciones c
         JOIN usuarios u ON c.psicologoId = u.id
         WHERE c.estudianteId = ?
         ORDER BY c.fechaUltimoMensaje DESC NULLS LAST, c.fechaCreacion DESC`,
        [userId, userId]
      );
    }

    res.json({
      success: true,
      data: conversations
    });

  } catch (error) {
    console.error("Error obteniendo conversaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// POST /api/chat/conversations - Crear nueva conversación (solo estudiantes)
router.post("/conversations", async (req, res) => {
  try {
    const userId = req.user.id;
    const userInstitution = req.user.instituciones?.[0]?.institucionId;
    const { psicologoId, titulo = "Nueva consulta" } = req.body;

    // Verificar que el usuario puede crear conversaciones (cualquier usuario no psicólogo)
    const userRoleInstitution = req.user.instituciones?.[0]?.rol;
    if (userRoleInstitution === 'PSICOLOGO') {
      return res.status(403).json({
        success: false,
        message: "Los psicólogos no pueden iniciar conversaciones"
      });
    }

    if (!psicologoId) {
      return res.status(400).json({
        success: false,
        message: "ID del psicólogo es requerido"
      });
    }

    // Verificar que el psicólogo existe
    const [psicologo] = await pool.execute(
      `SELECT id FROM usuarios WHERE id = ? AND rol = 'PSICOLOGO' AND status = 'ACTIVO'`,
      [psicologoId]
    );

    if (!psicologo.length) {
      return res.status(404).json({
        success: false,
        message: "Psicólogo no encontrado"
      });
    }

    // Verificar si ya existe una conversación activa
    const [existingConv] = await pool.execute(
      `SELECT id FROM conversaciones
       WHERE psicologoId = ? AND estudianteId = ? AND estado = 'ACTIVA'`,
      [psicologoId, userId]
    );

    if (existingConv.length) {
      return res.json({
        success: true,
        message: "Ya existe una conversación activa",
        conversacionId: existingConv[0].id
      });
    }

    // Crear nueva conversación
    const conversacionId = require("crypto").randomUUID();
    await pool.execute(
      `INSERT INTO conversaciones (id, psicologoId, estudianteId, titulo, creadoPor)
       VALUES (?, ?, ?, ?, ?)`,
      [conversacionId, psicologoId, userId, titulo, userId]
    );

    res.status(201).json({
      success: true,
      message: "Conversación creada exitosamente",
      conversacionId
    });

  } catch (error) {
    console.error("Error creando conversación:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// GET /api/chat/conversations/:id/messages - Obtener mensajes de una conversación
router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const userId = req.user.id;
    const conversacionId = req.params.id;
    const { page = 1, limit = 50 } = req.query;

    // Verificar que el usuario participa en la conversación
    const [conversation] = await pool.execute(
      `SELECT * FROM conversaciones
       WHERE id = ? AND (psicologoId = ? OR estudianteId = ?)`,
      [conversacionId, userId, userId]
    );

    if (!conversation.length) {
      return res.status(404).json({
        success: false,
        message: "Conversación no encontrada"
      });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Obtener mensajes con información del remitente
    const [messages] = await pool.execute(
      `SELECT m.*, u.nombreCompleto as remitenteNombre, u.rol as remitenteRol
       FROM mensajes m
       JOIN usuarios u ON m.remitenteId = u.id
       WHERE m.conversacionId = ?
       ORDER BY m.fechaEnvio DESC
       LIMIT ? OFFSET ?`,
      [conversacionId, parseInt(limit), offset]
    );

    // Marcar mensajes como leídos (solo los que no son del usuario actual)
    await pool.execute(
      `UPDATE mensajes
       SET leido = 1, fechaLectura = NOW(3)
       WHERE conversacionId = ? AND remitenteId != ? AND leido = 0`,
      [conversacionId, userId]
    );

    res.json({
      success: true,
      data: {
        conversacion: conversation[0],
        mensajes: messages.reverse(), // Mostrar del más antiguo al más reciente
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: messages.length
        }
      }
    });

  } catch (error) {
    console.error("Error obteniendo mensajes:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// POST /api/chat/conversations/:id/messages - Enviar mensaje
router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const userId = req.user.id;
    const conversacionId = req.params.id;
    const { mensaje, tipoMensaje = 'TEXTO' } = req.body;

    if (!mensaje || mensaje.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "El mensaje no puede estar vacío"
      });
    }

    // Verificar que el usuario participa en la conversación
    const [conversation] = await pool.execute(
      `SELECT * FROM conversaciones
       WHERE id = ? AND (psicologoId = ? OR estudianteId = ?) AND estado = 'ACTIVA'`,
      [conversacionId, userId, userId]
    );

    if (!conversation.length) {
      return res.status(404).json({
        success: false,
        message: "Conversación no encontrada o inactiva"
      });
    }

    // Insertar mensaje
    const mensajeId = require("crypto").randomUUID();
    await pool.execute(
      `INSERT INTO mensajes (id, conversacionId, remitenteId, mensaje, tipoMensaje)
       VALUES (?, ?, ?, ?, ?)`,
      [mensajeId, conversacionId, userId, mensaje.trim(), tipoMensaje]
    );

    // Actualizar fecha del último mensaje en la conversación
    await pool.execute(
      `UPDATE conversaciones
       SET fechaUltimoMensaje = NOW(3)
       WHERE id = ?`,
      [conversacionId]
    );

    // Obtener el mensaje creado con información del remitente
    const [newMessage] = await pool.execute(
      `SELECT m.*, u.nombreCompleto as remitenteNombre, u.rol as remitenteRol
       FROM mensajes m
       JOIN usuarios u ON m.remitenteId = u.id
       WHERE m.id = ?`,
      [mensajeId]
    );

    res.status(201).json({
      success: true,
      message: "Mensaje enviado exitosamente",
      data: newMessage[0]
    });

  } catch (error) {
    console.error("Error enviando mensaje:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// GET /api/chat/psychologists - Obtener lista de psicólogos disponibles (para estudiantes)
router.get("/psychologists", async (req, res) => {
  try {
    const userId = req.user.id;
    const userInstitution = req.user.instituciones?.[0]?.institucionId;

    // Solo permitir a usuarios de la misma institución o psicólogos
    if (!userInstitution) {
      return res.status(403).json({
        success: false,
        message: "Usuario sin institución asignada"
      });
    }

    // Buscar psicólogos de la misma institución
    const [psychologists] = await pool.execute(
      `SELECT u.id, u.nombreCompleto, u.email, u.especialidades,
              COUNT(c.id) as conversacionesActivas
       FROM usuarios u
       LEFT JOIN usuario_institucion ui ON u.id = ui.usuarioId
       LEFT JOIN conversaciones c ON u.id = c.psicologoId AND c.estado = 'ACTIVA'
       WHERE ui.rolInstitucion = 'PSICOLOGO'
       AND ui.institucionId = ?
       AND ui.activo = 1
       AND u.status = 'ACTIVO'
       GROUP BY u.id, u.nombreCompleto, u.email, u.especialidades
       ORDER BY u.nombreCompleto`,
      [userInstitution]
    );

    res.json({
      success: true,
      data: psychologists
    });

  } catch (error) {
    console.error("Error obteniendo psicólogos:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// PATCH /api/chat/conversations/:id/close - Cerrar conversación
router.patch("/conversations/:id/close", async (req, res) => {
  try {
    const userId = req.user.id;
    const conversacionId = req.params.id;

    // Verificar que el usuario participa en la conversación
    const [conversation] = await pool.execute(
      `SELECT * FROM conversaciones
       WHERE id = ? AND (psicologoId = ? OR estudianteId = ?)`,
      [conversacionId, userId, userId]
    );

    if (!conversation.length) {
      return res.status(404).json({
        success: false,
        message: "Conversación no encontrada"
      });
    }

    // Cerrar conversación
    await pool.execute(
      `UPDATE conversaciones
       SET estado = 'CERRADA'
       WHERE id = ?`,
      [conversacionId]
    );

    // Insertar mensaje de sistema
    const mensajeId = require("crypto").randomUUID();
    await pool.execute(
      `INSERT INTO mensajes (id, conversacionId, remitenteId, mensaje, tipoMensaje)
       VALUES (?, ?, ?, ?, ?)`,
      [mensajeId, conversacionId, userId, 'Conversación cerrada', 'SISTEMA']
    );

    res.json({
      success: true,
      message: "Conversación cerrada exitosamente"
    });

  } catch (error) {
    console.error("Error cerrando conversación:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

module.exports = router;