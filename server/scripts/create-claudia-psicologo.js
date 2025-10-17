require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { pool } = require("../src/db");

const createClaudiaPsychologist = async () => {
  const conn = await pool.getConnection();
  try {
    console.log("🔄 Creando usuario psicólogo para Claudia Ortiz Reyes...");

    await conn.beginTransaction();

    // Información del usuario
    const userData = {
      nombre: "Claudia",
      apellidoPaterno: "Ortiz",
      apellidoMaterno: "Reyes",
      email: "claudia.or@tuxtepec.tecnm.mx",
      rol: "PSICOLOGO"
    };

    const nombreCompleto = `${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}`;

    // Contraseña temporal (se le pedirá cambiarla en el primer login)
    const tempPassword = "NeuroFlora*25";
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    console.log(`👤 Creando usuario: ${nombreCompleto}`);
    console.log(`📧 Email: ${userData.email}`);
    console.log(`🔑 Contraseña temporal: ${tempPassword}`);

    // Verificar si ya existe el usuario
    const [existing] = await conn.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      [userData.email]
    );

    if (existing.length > 0) {
      console.log(`⚠️  Usuario ya existe: ${userData.email}`);
      await conn.rollback();
      return;
    }

    // Verificar/crear institución TECNM Tuxtepec
    let [instituciones] = await conn.execute(
      `SELECT id FROM instituciones WHERE codigo = 'TECNM_TUXTEPEC' OR nombre LIKE '%tuxtepec%' OR nombre LIKE '%TECNM%'`
    );

    let institucionId;
    if (instituciones.length === 0) {
      // Crear la institución TECNM Tuxtepec
      const institucionInsertId = crypto.randomUUID();
      await conn.execute(
        `INSERT INTO instituciones (id, nombre, codigo, email, telefono, direccion, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, 'ACTIVO', NOW(), NOW())`,
        [
          institucionInsertId,
          "Instituto Tecnológico Nacional de México Campus Tuxtepec",
          "TECNM_TUXTEPEC",
          "contacto@tuxtepec.tecnm.mx",
          "287-875-1640",
          "Calzada Dr. Víctor Bravo Ahuja No. 561, Villa Universidad, 68350 San Juan Bautista Tuxtepec, Oax.",
        ]
      );
      institucionId = institucionInsertId;
      console.log("✅ Institución TECNM Tuxtepec creada");
    } else {
      institucionId = instituciones[0].id;
      console.log("✅ Institución TECNM encontrada");
    }

    // Generar ID único para el usuario
    const userId = crypto.randomUUID();

    // Crear usuario principal
    await conn.execute(
      `INSERT INTO usuarios (
        id, institucionId, nombre, apellidoPaterno, apellidoMaterno, nombreCompleto,
        email, passwordHash, status, emailVerificado, requiereCambioPassword,
        perfilCompletado, telefono, genero,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVO', true, true, false, NULL, NULL, NOW(), NOW())`,
      [
        userId,
        institucionId,
        userData.nombre,
        userData.apellidoPaterno,
        userData.apellidoMaterno,
        nombreCompleto,
        userData.email,
        hashedPassword
      ]
    );

    console.log("✅ Usuario base creado");

    // Crear relación usuario-institución (sin especificar ID si es auto_increment)
    await conn.execute(
      `INSERT INTO usuario_institucion (
        usuarioId, institucionId, rolInstitucion, activo
      ) VALUES (?, ?, ?, 1)`,
      [userId, institucionId, userData.rol]
    );

    console.log("✅ Relación usuario-institución creada");

    await conn.commit();

    console.log("\n🎉 ¡Usuario psicólogo creado exitosamente!");
    console.log("\n📋 Información de acceso:");
    console.log(`👤 Nombre: ${nombreCompleto}`);
    console.log(`📧 Email: ${userData.email}`);
    console.log(`🔑 Contraseña temporal: ${tempPassword}`);
    console.log(`🏢 Institución: Instituto Tecnológico Nacional de México Campus Tuxtepec`);
    console.log(`👩‍⚕️ Rol: PSICÓLOGO`);
    console.log("\n⚠️  IMPORTANTE: El usuario deberá cambiar su contraseña en el primer login");

  } catch (error) {
    await conn.rollback();
    console.error("❌ Error creando usuario psicólogo:", error);
    process.exit(1);
  } finally {
    conn.release();
    process.exit(0);
  }
};

createClaudiaPsychologist();