const express = require("express");
const {
  login,
  logout,
  getProfile,
  verifyToken,
} = require("../controllers/auth.controller");

const {
  authenticateToken,
  requireRoles,
  requireSuperAdminNacional,
  requireInstitutionAdmin,
} = require("../middlewares/auth.middleware");

const {
  loginValidation,
  institutionParamValidation,
} = require("../validators/auth.validators");

const router = express.Router();

// ===============================================
// RUTAS PÚBLICAS (Sin autenticación)
// ===============================================

/**
 * POST /api/auth/login
 * Autenticación de usuario
 */
router.post("/login", loginValidation, login);

// ===============================================
// RUTAS PROTEGIDAS (Requieren autenticación)
// ===============================================

/**
 * POST /api/auth/logout
 * Cerrar sesión del usuario autenticado
 */
router.post("/logout", authenticateToken, logout);

/**
 * GET /api/auth/profile
 * Obtener perfil del usuario autenticado
 */
router.get("/profile", authenticateToken, getProfile);

/**
 * GET /api/auth/verify
 * Verificar si el token actual es válido
 */
router.get("/verify", authenticateToken, verifyToken);

// ===============================================
// RUTAS ADMINISTRATIVAS
// ===============================================

/**
 * GET /api/auth/test-roles/super-admin
 * Ruta de prueba para SUPER_ADMIN_NACIONAL
 */
router.get("/test-roles/super-admin", requireSuperAdminNacional, (req, res) => {
  res.json({
    success: true,
    message: "Acceso autorizado para Super Admin Nacional",
    user: req.user,
  });
});

/**
 * GET /api/auth/test-roles/institution-admin/:institucionId
 * Ruta de prueba para admins de institución
 */
router.get(
  "/test-roles/institution-admin/:institucionId",
  institutionParamValidation,
  requireInstitutionAdmin,
  (req, res) => {
    res.json({
      success: true,
      message: "Acceso autorizado para Admin de Institución",
      institucionId: req.params.institucionId,
      user: req.user,
    });
  }
);

/**
 * GET /api/auth/test-roles/psychologist
 * Ruta de prueba para psicólogos
 */
router.get(
  "/test-roles/psychologist",
  authenticateToken,
  requireRoles([
    "PSICOLOGO",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  (req, res) => {
    res.json({
      success: true,
      message: "Acceso autorizado para Psicólogo",
      user: req.user,
    });
  }
);

module.exports = router;
