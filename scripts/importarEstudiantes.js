/**
 * Script para importación masiva de estudiantes desde Excel
 * NeuroFlora - Sistema de gestión psicológica educativa
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Importar funciones de utilidades del servidor
const {
  generarEmailInstitucional,
  mapearGenero,
  calcularEdad,
  validarNumeroControl,
  generarUUID,
  CONTRASEÑA_INICIAL
} = require('../server/src/utils/emailInstitucional');

// Configuración de base de datos
const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear conexión a la base de datos
const crearConexion = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'mon123',
      database: process.env.DB_NAME || 'sistema_educativo',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Conexión a base de datos establecida');
    return connection;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    throw error;
  }
};

/**
 * Busca institución por nombre
 * @param {object} connection - Conexión a BD
 * @param {string} nombreInstituto - Nombre del instituto
 * @returns {string|null} ID de la institución
 */
const buscarInstitucionPorNombre = async (connection, nombreInstituto) => {
  try {
    const [rows] = await connection.execute(
      'SELECT id FROM instituciones WHERE nombre LIKE ? OR nombreCorto LIKE ? LIMIT 1',
      [`%${nombreInstituto}%`, `%${nombreInstituto}%`]
    );

    if (rows.length > 0) {
      return rows[0].id;
    }

    // Si no existe, crear una nueva institución
    console.log(`⚠️  Institución "${nombreInstituto}" no encontrada. Creando nueva...`);

    const institucionId = generarUUID();
    await connection.execute(
      `INSERT INTO instituciones (id, nombre, nombreCorto, codigo, tipo, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'INSTITUTO_TECNOLOGICO', 'ACTIVO', NOW(), NOW())`,
      [institucionId, nombreInstituto, nombreInstituto.substring(0, 50), `TECH_${Date.now()}`]
    );

    console.log(`✅ Institución "${nombreInstituto}" creada con ID: ${institucionId}`);
    return institucionId;

  } catch (error) {
    console.error('❌ Error buscando/creando institución:', error);
    throw error;
  }
};

/**
 * Verifica si un estudiante ya existe
 * @param {object} connection - Conexión a BD
 * @param {string} numeroControl - Número de control
 * @param {string} email - Email institucional
 * @returns {boolean} true si ya existe
 */
const estudianteExiste = async (connection, numeroControl, email) => {
  try {
    const [rows] = await connection.execute(
      'SELECT id FROM usuarios WHERE matricula = ? OR email = ? LIMIT 1',
      [numeroControl, email]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('❌ Error verificando estudiante existente:', error);
    return false;
  }
};

/**
 * Procesa una fila del Excel y crea el objeto usuario
 * @param {object} fila - Fila del Excel
 * @param {object} connection - Conexión a BD
 * @returns {object} Objeto usuario para insertar
 */
const procesarEstudiante = async (fila, connection) => {
  // Validar campos requeridos
  if (!fila.NoControl || !fila.Nombres || !fila.ApellidoPaterno) {
    throw new Error('Campos requeridos faltantes: NoControl, Nombres, ApellidoPaterno');
  }

  // Convertir NoControl a string y validar
  const numeroControl = String(fila.NoControl).trim();
  console.log(`Debug: NoControl original: ${fila.NoControl} (tipo: ${typeof fila.NoControl})`);
  console.log(`Debug: NoControl convertido: ${numeroControl} (tipo: ${typeof numeroControl})`);

  if (!validarNumeroControl(numeroControl)) {
    throw new Error(`Número de control inválido: ${numeroControl} (original: ${fila.NoControl})`);
  }

  // Generar email institucional
  const email = generarEmailInstitucional(numeroControl);

  // Verificar si ya existe
  if (await estudianteExiste(connection, numeroControl, email)) {
    throw new Error(`Estudiante ya existe: ${numeroControl} / ${email}`);
  }

  // Usar institución fija (ID específico) - comentar la línea siguiente si quieres usar búsqueda por nombre
  const institucionId = "3579387c-6c49-49c6-83ed-d1f33e79d8a6"; // Institución fija
  // const institucionId = await buscarInstitucionPorNombre(connection, fila.NombreInstituto); // Búsqueda dinámica

  // Hash de la contraseña inicial
  const passwordHash = await bcrypt.hash(CONTRASEÑA_INICIAL, 10);

  // Procesar fecha de nacimiento
  let fechaNacimiento = null;
  let edad = null;
  if (fila.FechaNacimiento) {
    fechaNacimiento = new Date(fila.FechaNacimiento);
    edad = calcularEdad(fechaNacimiento);
  }

  // Mapear género de Excel (m/f) a formato válido del ENUM
  const generoMapeado = mapearGenero(fila.Genero);
  console.log(`Debug: Género original: "${fila.Genero}" -> mapeado: "${generoMapeado}"`);

  // Crear objeto usuario
  const usuario = {
    // IDs y relaciones
    id: generarUUID(),
    institucionId: institucionId,

    // Autenticación
    email: email,
    emailVerificado: false,
    passwordHash: passwordHash,

    // Datos personales
    nombre: fila.Nombres.trim(),
    apellidoPaterno: fila.ApellidoPaterno.trim(),
    apellidoMaterno: fila.ApellidoMaterno ? fila.ApellidoMaterno.trim() : null,
    nombreCompleto: `${fila.Nombres.trim()} ${fila.ApellidoPaterno.trim()} ${fila.ApellidoMaterno ? fila.ApellidoMaterno.trim() : ''}`.trim(),

    // Identificación
    matricula: numeroControl,
    rfc: fila.RFC ? fila.RFC.trim() : null,

    // Demográficos
    fechaNacimiento: fechaNacimiento,
    edad: edad,
    genero: generoMapeado,

    // Estado del sistema
    rol: 'ESTUDIANTE',
    status: 'ACTIVO',
    requiereCambioPassword: true,
    perfilCompletado: false,

    // Timestamps
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'SISTEMA_IMPORTACION'
  };

  return usuario;
};

/**
 * Inserta usuario directamente en la base de datos (método directo y confiable)
 * @param {object} connection - Conexión a BD
 * @param {object} usuario - Objeto usuario
 */
const insertarUsuario = async (connection, usuario) => {
  try {
    await connection.beginTransaction();

    // Verificar si ya existe
    const [existeUsuario] = await connection.execute(
      'SELECT id FROM usuarios WHERE email = ? OR matricula = ?',
      [usuario.email, usuario.matricula]
    );

    if (existeUsuario.length > 0) {
      console.log(`ℹ️  Usuario ya existe: ${usuario.email}`);
      await connection.rollback();
      return;
    }

    // 1. Insertar usuario con todos los campos requeridos
    const sqlUsuario = `
      INSERT INTO usuarios (
        id, institucionId, email, emailVerificado, passwordHash,
        nombre, apellidoPaterno, apellidoMaterno, nombreCompleto,
        matricula, rfc, fechaNacimiento, edad, genero,
        status, requiereCambioPassword, perfilCompletado,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))
    `;

    const valoresUsuario = [
      usuario.id, usuario.institucionId, usuario.email, 1, usuario.passwordHash,
      usuario.nombre, usuario.apellidoPaterno, usuario.apellidoMaterno, usuario.nombreCompleto,
      usuario.matricula, usuario.rfc, usuario.fechaNacimiento, usuario.edad, usuario.genero,
      'ACTIVO', 1, 0
    ];

    await connection.execute(sqlUsuario, valoresUsuario);

    // 2. Insertar membresía institucional
    const sqlMembresia = `
      INSERT INTO usuario_institucion (usuarioId, institucionId, rolInstitucion, activo)
      VALUES (?, ?, 'ESTUDIANTE', 1)
    `;
    await connection.execute(sqlMembresia, [usuario.id, usuario.institucionId]);

    await connection.commit();
    console.log(`✅ Usuario y membresía insertados directamente: ${usuario.matricula} - ${usuario.email}`);

  } catch (error) {
    await connection.rollback();
    console.error(`❌ Error insertando usuario ${usuario.matricula}:`, error);
    throw error;
  }
};

/**
 * Actualiza datos adicionales del usuario después del registro
 */
const actualizarDatosAdicionales = async (connection, userId, usuario) => {
  try {
    const updates = [];
    const params = [];

    if (usuario.matricula) {
      updates.push('matricula = ?');
      params.push(usuario.matricula);
    }
    if (usuario.rfc) {
      updates.push('rfc = ?');
      params.push(usuario.rfc);
    }
    if (usuario.fechaNacimiento) {
      updates.push('fechaNacimiento = ?');
      params.push(usuario.fechaNacimiento);
    }
    if (usuario.edad) {
      updates.push('edad = ?');
      params.push(usuario.edad);
    }
    if (usuario.genero) {
      updates.push('genero = ?');
      params.push(usuario.genero);
    }

    if (updates.length > 0) {
      updates.push('updatedAt = NOW()');
      const sql = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;
      params.push(userId);

      await connection.execute(sql, params);
      console.log(`✅ Datos adicionales actualizados para: ${usuario.matricula}`);
    }
  } catch (error) {
    console.error(`⚠️  Error actualizando datos adicionales:`, error);
    // No lanzamos error para que no falle el registro principal
  }
};

/**
 * Procesa archivo Excel y importa estudiantes
 * @param {string} rutaArchivo - Ruta al archivo Excel
 */
const importarEstudiantesDesdeExcel = async (rutaArchivo) => {
  let connection;

  try {
    // Verificar que el archivo existe
    if (!fs.existsSync(rutaArchivo)) {
      throw new Error(`Archivo no encontrado: ${rutaArchivo}`);
    }

    // Conectar a la base de datos
    connection = await crearConexion();

    // Leer archivo Excel (aquí usarías una librería como xlsx)
    console.log('📖 Leyendo archivo Excel...');

    // NOTA: Necesitas instalar: npm install xlsx
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(rutaArchivo);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const datos = XLSX.utils.sheet_to_json(worksheet);

    console.log(`📊 Encontrados ${datos.length} registros en el Excel`);

    // Contadores
    let exitosos = 0;
    let errores = 0;
    const erroresDetalle = [];

    // Procesar cada fila
    for (let i = 0; i < datos.length; i++) {
      const fila = datos[i];

      try {
        console.log(`\n⚠️  Procesando fila ${i + 1}/${datos.length}: ${fila.NoControl}`);

        const usuario = await procesarEstudiante(fila, connection);
        await insertarUsuario(connection, usuario);

        exitosos++;

      } catch (error) {
        errores++;
        const errorInfo = {
          fila: i + 1,
          numeroControl: fila.NoControl || 'N/A',
          error: error.message
        };
        erroresDetalle.push(errorInfo);
        console.error(`❌ Error en fila ${i + 1}:`, error.message);
      }
    }

    // Resumen final
    console.log('\n' + '='.repeat(50));
    console.log('📋 RESUMEN DE IMPORTACIÓN');
    console.log('='.repeat(50));
    console.log(`✅ Exitosos: ${exitosos}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`📊 Total procesados: ${datos.length}`);

    if (errores > 0) {
      console.log('\n❌ DETALLE DE ERRORES:');
      erroresDetalle.forEach(error => {
        console.log(`Fila ${error.fila} (${error.numeroControl}): ${error.error}`);
      });
    }

    // Guardar log de errores si hay alguno
    if (errores > 0) {
      const logPath = path.join(__dirname, 'importacion_errores.json');
      fs.writeFileSync(logPath, JSON.stringify(erroresDetalle, null, 2));
      console.log(`📝 Log de errores guardado en: ${logPath}`);
    }

  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔐 Conexión a base de datos cerrada');
    }
  }
};

/**
 * Función principal
 */
const main = async () => {
  try {
    // Obtener ruta del archivo desde argumentos de línea de comandos
    const rutaArchivo = process.argv[2];

    if (!rutaArchivo) {
      console.log('❌ Uso: node importarEstudiantes.js <ruta_archivo_excel>');
      console.log('📝 Ejemplo: node importarEstudiantes.js ./estudiantes.xlsx');
      process.exit(1);
    }

    console.log('🚀 Iniciando importación de estudiantes...');
    console.log(`📂 Archivo: ${rutaArchivo}`);

    await importarEstudiantesDesdeExcel(rutaArchivo);

    console.log('✅ Importación completada exitosamente');

  } catch (error) {
    console.error('❌ Error fatal:', error.message);
    process.exit(1);
  }
};

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  importarEstudiantesDesdeExcel,
  procesarEstudiante,
  insertarUsuario,
  buscarInstitucionPorNombre
};