// validators/onboarding.validators.js
const { body } = require("express-validator");

const profileValidation = [
  // Campos básicos
  body("telefono")
    .optional()
    .isString()
    .isLength({ min: 10, max: 15 })
    .withMessage("El teléfono debe tener entre 10 y 15 caracteres"),

  body("fechaNacimiento")
    .optional()
    .isISO8601()
    .withMessage("La fecha de nacimiento debe ser válida"),

  body("genero")
    .optional()
    .isIn(["MASCULINO", "FEMENINO", "NO_BINARIO", "PREFIERO_NO_DECIR"])
    .withMessage("Género inválido"),

  body("ciudad")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("La ciudad debe ser texto de máximo 100 caracteres"),

  body("estado")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("El estado debe ser texto de máximo 100 caracteres"),

  // Campos para estudiantes
  body("matricula")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("La matrícula debe ser texto de máximo 50 caracteres"),

  body("semestre")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("El semestre debe ser un número entre 1 y 12"),

  body("grupo")
    .optional()
    .isString()
    .isLength({ max: 10 })
    .withMessage("El grupo debe ser texto de máximo 10 caracteres"),

  body("turno")
    .optional()
    .isIn(["MATUTINO", "VESPERTINO", "NOCTURNO", "MIXTO"])
    .withMessage("Turno inválido"),

  body("trabajaActualmente")
    .optional()
    .isBoolean()
    .withMessage("Trabaja actualmente debe ser verdadero o falso"),

  body("lugarTrabajo")
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage("El lugar de trabajo debe ser texto de máximo 255 caracteres"),

  body("nombrePadre")
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage("El nombre del padre debe ser texto de máximo 255 caracteres"),

  body("telefonoPadre")
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage(
      "El teléfono del padre debe ser texto de máximo 20 caracteres"
    ),

  body("nombreMadre")
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage(
      "El nombre de la madre debe ser texto de máximo 255 caracteres"
    ),

  body("telefonoMadre")
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage(
      "El teléfono de la madre debe ser texto de máximo 20 caracteres"
    ),

  body("contactoEmergenciaNombre")
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage(
      "El nombre del contacto de emergencia debe ser texto de máximo 255 caracteres"
    ),

  body("contactoEmergenciaTelefono")
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage(
      "El teléfono del contacto de emergencia debe ser texto de máximo 20 caracteres"
    ),

  body("contactoEmergenciaRelacion")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage(
      "La relación del contacto de emergencia debe ser texto de máximo 50 caracteres"
    ),

  body("tieneComputadora")
    .optional()
    .isBoolean()
    .withMessage("Tiene computadora debe ser verdadero o falso"),

  body("tieneInternet")
    .optional()
    .isBoolean()
    .withMessage("Tiene internet debe ser verdadero o falso"),

  body("medioTransporte")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage(
      "El medio de transporte debe ser texto de máximo 50 caracteres"
    ),

  body("nivelSocioeconomico")
    .optional()
    .isIn(["BAJO", "MEDIO_BAJO", "MEDIO", "MEDIO_ALTO", "ALTO"])
    .withMessage("Nivel socioeconómico inválido"),

  body("pasatiempos")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("Los pasatiempos deben ser texto de máximo 1000 caracteres"),

  body("deportesPractica")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("Los deportes deben ser texto de máximo 1000 caracteres"),

  body("idiomasHabla")
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage("Los idiomas deben ser texto de máximo 255 caracteres"),

  body("tieneBeca")
    .optional()
    .isBoolean()
    .withMessage("Tiene beca debe ser verdadero o falso"),

  body("tipoBeca")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("El tipo de beca debe ser texto de máximo 100 caracteres"),

  body("participaActividades")
    .optional()
    .isBoolean()
    .withMessage("Participa en actividades debe ser verdadero o falso"),

  // Campos para personal
  body("numeroEmpleado")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage(
      "El número de empleado debe ser texto de máximo 50 caracteres"
    ),

  body("cedulaProfesional")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage(
      "La cédula profesional debe ser texto de máximo 50 caracteres"
    ),

  body("departamento")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("El departamento debe ser texto de máximo 100 caracteres"),

  body("especialidades")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage(
      "Las especialidades deben ser texto de máximo 1000 caracteres"
    ),

  body("telefonoEmergencia")
    .optional()
    .isString()
    .isLength({ max: 20 })
    .withMessage(
      "El teléfono de emergencia debe ser texto de máximo 20 caracteres"
    ),
];

const onboardingValidation = [
  body("objetivos")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("Los objetivos deben ser texto de máximo 1000 caracteres"),

  body("experienciaPrevia")
    .optional()
    .isIn(["nunca", "poco", "moderada", "mucha"])
    .withMessage(
      "La experiencia previa debe ser: nunca, poco, moderada o mucha"
    ),

  body("expectativas")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Las expectativas deben ser texto de máximo 500 caracteres"),

  body("notificaciones")
    .optional()
    .isBoolean()
    .withMessage("Las notificaciones deben ser verdadero o falso"),

  body("tutorialesAdicionales")
    .optional()
    .isBoolean()
    .withMessage("Los tutoriales adicionales deben ser verdadero o falso"),
];

module.exports = {
  profileValidation,
  onboardingValidation,
};
