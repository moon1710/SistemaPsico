// routes/institutions.routes.js
const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const {
  getInstitutions,
  getInstitutionById,
  approveInstitution,
  suspendInstitution,
  reactivateInstitution,
  updateInstitution,
  getStates
} = require("../controllers/institutions.controller");

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

const updateInstitutionValidator = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre de la institución es requerido')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres'),

  body('nombreCorto')
    .notEmpty()
    .withMessage('El nombre corto es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre corto debe tener entre 2 y 100 caracteres'),

  body('responsableNombre')
    .notEmpty()
    .withMessage('El nombre del responsable es requerido')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre del responsable debe tener entre 3 y 255 caracteres'),

  body('responsableEmail')
    .isEmail()
    .withMessage('Debe proporcionar un email válido para el responsable'),

  body('emailInstitucional')
    .optional()
    .isEmail()
    .withMessage('El email institucional debe ser válido'),

  body('telefono')
    .optional()
    .matches(/^[\d\s\-\+\(\)ext\.]{7,20}$/)
    .withMessage('El teléfono debe tener un formato válido'),

  body('responsableTelefono')
    .optional()
    .matches(/^[\d\s\-\+\(\)]{7,20}$/)
    .withMessage('El teléfono del responsable debe tener un formato válido'),

  body('maxUsuarios')
    .optional()
    .isInt({ min: 1, max: 50000 })
    .withMessage('El máximo de usuarios debe ser entre 1 y 50,000')
];

const approveInstitutionValidator = [
  body('notas')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las notas no pueden exceder 1000 caracteres')
];

const suspendInstitutionValidator = [
  body('razon')
    .notEmpty()
    .withMessage('La razón de suspensión es requerida')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La razón debe tener entre 10 y 1000 caracteres'),

  body('temporal')
    .optional()
    .isBoolean()
    .withMessage('El campo temporal debe ser verdadero o falso')
];

// ============================================
// RUTAS PRINCIPALES
// ============================================

/**
 * GET /api/institutions
 * Obtener lista de instituciones con filtros y búsqueda
 * Query params: page, limit, search, status, estado, sortBy, sortOrder
 */
router.get('/', getInstitutions);

/**
 * GET /api/institutions/states
 * Obtener lista de estados únicos para filtros
 */
router.get('/states', getStates);

/**
 * GET /api/institutions/:id
 * Obtener detalles completos de una institución específica
 */
router.get('/:id', getInstitutionById);

/**
 * PUT /api/institutions/:id
 * Actualizar información básica de una institución
 */
router.put('/:id', updateInstitutionValidator, updateInstitution);

/**
 * POST /api/institutions/:id/approve
 * Aprobar una institución (cambiar de PENDIENTE_APROBACION a ACTIVA)
 */
router.post('/:id/approve', approveInstitutionValidator, approveInstitution);

/**
 * POST /api/institutions/:id/suspend
 * Suspender una institución activa
 */
router.post('/:id/suspend', suspendInstitutionValidator, suspendInstitution);

/**
 * POST /api/institutions/:id/reactivate
 * Reactivar una institución suspendida
 */
router.post('/:id/reactivate', reactivateInstitution);

// ============================================
// RUTAS ADICIONALES (Para futuras implementaciones)
// ============================================

/**
 * POST /api/institutions/:id/resend-credentials
 * Reenviar credenciales de acceso al responsable
 * TODO: Implementar en el futuro
 */
// router.post('/:id/resend-credentials', resendCredentials);

/**
 * GET /api/institutions/:id/users
 * Obtener usuarios paginados de una institución específica
 * TODO: Implementar si se necesita paginación independiente
 */
// router.get('/:id/users', getInstitutionUsers);

/**
 * POST /api/institutions/:id/users/:userId/role
 * Cambiar el rol de un usuario específico en la institución
 * TODO: Implementar gestión granular de usuarios
 */
// router.post('/:id/users/:userId/role', changeUserRole);

module.exports = router;