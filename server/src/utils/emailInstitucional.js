/**
 * Utilidades para generar emails institucionales basados en número de control
 * Versión para Node.js (servidor)
 * Reglas específicas para NeuroFlora - TecNM Tuxtepec
 */

/**
 * Genera email institucional basado en el número de control
 * @param {string} numeroControl - Número de control del estudiante
 * @returns {string} Email institucional generado
 */
function generarEmailInstitucional(numeroControl) {
  if (!numeroControl || typeof numeroControl !== 'string') {
    throw new Error('Número de control debe ser un string válido');
  }

  const control = numeroControl.trim();

  // Validar longitud (debe ser 8 caracteres)
  if (control.length !== 8) {
    throw new Error('Número de control debe tener exactamente 8 caracteres');
  }

  // Verificar si empieza con número o letra
  const primerCaracter = control.charAt(0);
  const esNumero = /^[0-9]/.test(primerCaracter);

  if (esNumero) {
    // SI empieza con número: L{numeroControl}@tuxtepec.tecnm.mx
    return `L${control}@tuxtepec.tecnm.mx`;
  } else {
    // SI empieza con letra: {numeroControl}@tuxtepec.tecnm.mx
    return `${control}@tuxtepec.tecnm.mx`;
  }
}

/**
 * Valida formato de número de control
 * @param {string} numeroControl - Número de control a validar
 * @returns {boolean} true si es válido
 */
function validarNumeroControl(numeroControl) {
  if (!numeroControl || typeof numeroControl !== 'string') {
    return false;
  }

  const control = numeroControl.trim();

  // Debe tener exactamente 8 caracteres
  if (control.length !== 8) {
    return false;
  }

  // Puede empezar con letra o número, seguido de números
  const formatoValido = /^[A-Za-z0-9][0-9]{7}$/.test(control);
  return formatoValido;
}

/**
 * Extrae información del número de control
 * @param {string} numeroControl - Número de control
 * @returns {object} Información extraída
 */
function analizarNumeroControl(numeroControl) {
  if (!validarNumeroControl(numeroControl)) {
    throw new Error('Número de control inválido');
  }

  const control = numeroControl.trim().toUpperCase();
  const primerCaracter = control.charAt(0);
  const esNumero = /^[0-9]/.test(primerCaracter);

  // Extraer año (caracteres 1-2 si empieza con letra, 0-1 si empieza con número)
  let ano;
  if (esNumero) {
    ano = `20${control.substring(0, 2)}`;
  } else {
    ano = `20${control.substring(1, 3)}`;
  }

  return {
    numeroControl: control,
    empiezaConLetra: !esNumero,
    empiezaConNumero: esNumero,
    prefijo: esNumero ? null : primerCaracter,
    ano: ano,
    emailInstitucional: generarEmailInstitucional(control)
  };
}

/**
 * Mapea género del Excel al formato de la BD (ENUM válido)
 * @param {string} genero - Género desde Excel (M/F/etc)
 * @returns {string} Género normalizado
 */
function mapearGenero(genero) {
  if (!genero) return 'PREFIERO_NO_DECIR';

  // Normalizar: convertir a string, quitar espacios, y hacer uppercase
  const generoNormalizado = genero.toString().trim().toUpperCase();

  const mapeo = {
    // Formatos comunes de Excel (m/f)
    'M': 'MASCULINO',
    'F': 'FEMENINO',
    // Formatos completos
    'MASCULINO': 'MASCULINO',
    'HOMBRE': 'MASCULINO',
    'FEMENINO': 'FEMENINO',
    'MUJER': 'FEMENINO',
    // No binario
    'NB': 'NO_BINARIO',
    'NO_BINARIO': 'NO_BINARIO',
    'NO BINARIO': 'NO_BINARIO',
    // Otros casos
    'OTRO': 'PREFIERO_NO_DECIR',
    'PREFIERO_NO_DECIR': 'PREFIERO_NO_DECIR',
    'PREFIERO NO DECIR': 'PREFIERO_NO_DECIR'
  };

  return mapeo[generoNormalizado] || 'PREFIERO_NO_DECIR';
}

/**
 * Calcula edad basada en fecha de nacimiento
 * @param {Date|string} fechaNacimiento - Fecha de nacimiento
 * @returns {number} Edad en años
 */
function calcularEdad(fechaNacimiento) {
  const fecha = new Date(fechaNacimiento);
  const hoy = new Date();

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = fecha.getMonth();

  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  return edad;
}

/**
 * Genera UUID simple para IDs
 * @returns {string} UUID generado
 */
function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Constantes
const CONTRASEÑA_INICIAL = 'NeuroFlora*25';
const DOMINIO_INSTITUCIONAL = '@tuxtepec.tecnm.mx';

// Ejemplos de uso para testing
const EJEMPLOS = {
  conNumero: {
    input: '21350271',
    email: 'L21350271@tuxtepec.tecnm.mx'
  },
  conLetraE: {
    input: 'E13350161',
    email: 'E13350161@tuxtepec.tecnm.mx'
  },
  conLetraM: {
    input: 'M19350086',
    email: 'M19350086@tuxtepec.tecnm.mx'
  }
};

module.exports = {
  generarEmailInstitucional,
  validarNumeroControl,
  analizarNumeroControl,
  mapearGenero,
  calcularEdad,
  generarUUID,
  CONTRASEÑA_INICIAL,
  DOMINIO_INSTITUCIONAL,
  EJEMPLOS
};