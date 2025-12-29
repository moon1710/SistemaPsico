// routes/public.routes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const solicitudesController = require("../controllers/solicitudes.controller");

// Validaciones para solicitud de institución
const validateSolicitudInstitucion = [
  // Datos de institución
  body("nombreCampus")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Nombre del campus debe tener entre 3 y 255 caracteres"),

  body("estado")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Estado es requerido"),

  body("ciudad")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Ciudad es requerida"),

  body("codigoPostal")
    .optional()
    .isLength({ min: 5, max: 5 })
    .withMessage("Código postal debe tener 5 dígitos"),

  body("claveInstitucional")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Clave institucional es requerida"),

  body("telefonoInstitucion")
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage("Teléfono institucional es requerido"),

  body("extension")
    .optional()
    .isLength({ max: 10 })
    .withMessage("Extensión no puede exceder 10 caracteres"),

  body("nombreDirector")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Nombre del director es requerido"),

  body("correoInstitucional")
    .trim()
    .isEmail()
    .withMessage("Correo institucional debe ser válido"),

  // Datos del responsable
  body("responsableNombre")
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage("Nombre completo del responsable es requerido"),

  body("responsableCargo")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Cargo del responsable es requerido"),

  body("responsableCorreoInstitucional")
    .trim()
    .isEmail()
    .withMessage("Correo institucional del responsable debe ser válido"),

  body("responsableCorreoPersonal")
    .trim()
    .isEmail()
    .withMessage("Correo personal del responsable debe ser válido"),

  body("responsableTelefonoPersonal")
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage("Teléfono personal del responsable es requerido"),

  // Confirmación
  body("autorizacionConfirmada")
    .isBoolean()
    .custom(value => {
      if (!value) {
        throw new Error("Debe confirmar que cuenta con autorización institucional");
      }
      return true;
    })
];

// Rutas públicas
router.post(
  "/solicitar-institucion",
  validateSolicitudInstitucion,
  solicitudesController.crearSolicitudInstitucion
);

// Ruta para obtener estados/ciudades (opcional, para autocompletado)
router.get("/estados", solicitudesController.obtenerEstados);
router.get("/ciudades/:estado", solicitudesController.obtenerCiudades);

// Ruta para validar código postal
router.get("/codigo-postal/:cp", solicitudesController.validarCodigoPostal);

module.exports = router;