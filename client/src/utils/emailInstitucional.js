/**
 * Utilidades para generar emails institucionales basados en número de control
 * Reglas específicas para NeuroFlora - TecNM Tuxtepec
 */

/**
 * Genera email institucional basado en el número de control
 * @param {string} numeroControl - Número de control del estudiante
 * @returns {string} Email institucional generado
 */
export function generarEmailInstitucional(numeroControl) {
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
export function validarNumeroControl(numeroControl) {
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
export function analizarNumeroControl(numeroControl) {
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
 * Mapea género del Excel al formato de la BD
 * @param {string} genero - Género desde Excel (M/F/etc)
 * @returns {string} Género normalizado
 */
export function mapearGenero(genero) {
  if (!genero) return 'NO_ESPECIFICADO';

  const generoNormalizado = genero.toString().toUpperCase().trim();

  const mapeo = {
    'M': 'MASCULINO',
    'MASCULINO': 'MASCULINO',
    'HOMBRE': 'MASCULINO',
    'F': 'FEMENINO',
    'FEMENINO': 'FEMENINO',
    'MUJER': 'FEMENINO',
    'NB': 'NO_BINARIO',
    'NO_BINARIO': 'NO_BINARIO',
    'NO BINARIO': 'NO_BINARIO',
    'OTRO': 'OTRO',
    'PREFIERO_NO_DECIR': 'PREFIERO_NO_DECIR',
    'PREFIERO NO DECIR': 'PREFIERO_NO_DECIR'
  };

  return mapeo[generoNormalizado] || 'NO_ESPECIFICADO';
}

/**
 * Calcula edad basada en fecha de nacimiento
 * @param {Date|string} fechaNacimiento - Fecha de nacimiento
 * @returns {number} Edad en años
 */
export function calcularEdad(fechaNacimiento) {
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
export function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Constantes
export const CONTRASEÑA_INICIAL = 'NeuroFlora*25';
export const DOMINIO_INSTITUCIONAL = '@tuxtepec.tecnm.mx';

// Ejemplos de uso para testing
export const EJEMPLOS = {
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