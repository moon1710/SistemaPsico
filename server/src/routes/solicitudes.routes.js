// routes/solicitudes.routes.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  obtenerSolicitudes,
  obtenerSolicitudPorId,
  aprobarSolicitud,
  rechazarSolicitud,
  ponerEnRevision
} = require("../controllers/solicitudes.controller");

const { authenticateToken, requireRoles } = require("../middlewares/auth.middleware");

// ============================================
// MIDDLEWARES DE AUTENTICACIÓN
// ============================================

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// Solo Super Admin Nacional puede acceder a estas rutas
router.use(requireRoles(['SUPER_ADMIN_NACIONAL']));

// ============================================
// VALIDADORES
// ============================================

const aprobarSolicitudValidator = [
  body('notasAdmin')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las notas del administrador no pueden exceder 1000 caracteres')
];

const rechazarSolicitudValidator = [
  body('motivoRechazo')
    .notEmpty()
    .withMessage('El motivo de rechazo es requerido')
    .isLength({ min: 10, max: 1000 })
    .withMessage('El motivo de rechazo debe tener entre 10 y 1000 caracteres'),

  body('notasAdmin')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las notas del administrador no pueden exceder 1000 caracteres')
];

const ponerEnRevisionValidator = [
  body('notasAdmin')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las notas del administrador no pueden exceder 1000 caracteres')
];

// ============================================
// RUTAS PRINCIPALES
// ============================================

/**
 * GET /api/admin/solicitudes
 * Obtener lista de solicitudes de instituciones con filtros y búsqueda
 * Query params: page, limit, search, status, sortBy, sortOrder
 */
router.get('/', obtenerSolicitudes);

/**
 * GET /api/admin/solicitudes/:id
 * Obtener detalles completos de una solicitud específica
 */
router.get('/:id', obtenerSolicitudPorId);

/**
 * POST /api/admin/solicitudes/:id/aprobar
 * Aprobar una solicitud de institución y crear la institución
 */
router.post('/:id/aprobar', aprobarSolicitudValidator, aprobarSolicitud);

/**
 * POST /api/admin/solicitudes/:id/rechazar
 * Rechazar una solicitud de institución
 */
router.post('/:id/rechazar', rechazarSolicitudValidator, rechazarSolicitud);

/**
 * POST /api/admin/solicitudes/:id/revision
 * Poner una solicitud en estado de revisión
 */
router.post('/:id/revision', ponerEnRevisionValidator, ponerEnRevision);

module.exports = router;