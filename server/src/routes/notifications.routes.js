// routes/notifications.routes.js
const express = require('express');
const router = express.Router();
const {
  obtenerNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
  obtenerContadorNoLeidas
} = require('../controllers/notifications.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

/**
 * @route GET /api/notifications
 * @desc Obtener notificaciones del usuario
 * @access Private
 */
router.get('/', obtenerNotificaciones);

/**
 * @route GET /api/notifications/unread-count
 * @desc Obtener contador de notificaciones no leídas
 * @access Private
 */
router.get('/unread-count', obtenerContadorNoLeidas);

/**
 * @route PUT /api/notifications/:notificationId/read
 * @desc Marcar notificación como leída
 * @access Private
 */
router.put('/:notificationId/read', marcarComoLeida);

/**
 * @route PUT /api/notifications/mark-all-read
 * @desc Marcar todas las notificaciones como leídas
 * @access Private
 */
router.put('/mark-all-read', marcarTodasComoLeidas);

/**
 * @route DELETE /api/notifications/:notificationId
 * @desc Eliminar notificación
 * @access Private
 */
router.delete('/:notificationId', eliminarNotificacion);

module.exports = router;