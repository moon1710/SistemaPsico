const { body, param, query } = require("express-validator");

/**
 * Validaciones para login
 */
const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Email debe tener un formato válido")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email debe tener máximo 100 caracteres"),

  body("password")
    .notEmpty()
    .withMessage("Contraseña es requerida")
    .isLength({ min: 1, max: 255 })
    .withMessage("Contraseña inválida"),

  body("institucionId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID de institución debe ser un número entero positivo")
    .toInt(),
];

/**
 * Validaciones para parámetros de institución
 */
const institutionParamValidation = [
  param("institucionId")
    .isInt({ min: 1 })
    .withMessage("ID de institución debe ser un número entero positivo")
    .toInt(),
];

/**
 * Validaciones para registro de usuario (usaremos después)
 */
const userRegistrationValidation = [
  body("institucionId")
    .isInt({ min: 1 })
    .withMessage("ID de institución es requerido y debe ser válido")
    .toInt(),

  body("carreraId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("ID de carrera debe ser un número entero positivo")
    .toInt(),

  body("rol")
    .isIn([
      "SUPER_ADMIN_NACIONAL",
      "SUPER_ADMIN_INSTITUCION",
      "PSICOLOGO",
      "ESTUDIANTE",
    ])
    .withMessage("Rol debe ser válido"),

  body("nombre")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("Nombre solo puede contener letras y espacios"),

  body("apellidoPaterno")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Apellido paterno debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .withMessage("Apellido paterno solo puede contener letras y espacios"),

  body("apellidoMaterno")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Apellido materno debe tener máximo 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/)
    .withMessage("Apellido materno solo puede contener letras y espacios"),

  body("email")
    .isEmail()
    .withMessage("Email debe tener un formato válido")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email debe tener máximo 100 caracteres"),

  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Contraseña debe tener entre 8 y 128 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial"
    ),
];

/**
 * Validación de paginación
 */
const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Página debe ser un número entero positivo")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Límite debe ser entre 1 y 100")
    .toInt(),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Búsqueda debe tener máximo 100 caracteres"),
];

module.exports = {
  loginValidation,
  institutionParamValidation,
  userRegistrationValidation,
  paginationValidation,
};
