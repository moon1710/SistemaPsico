require("dotenv").config();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { pool } = require("./src/db");

(async () => {
  try {
    // ✅ usa tu TecNM como base (puedes cambiarlo)
    const institucionId =
      process.env.SUPERADMIN_INSTITUCION_ID ||
      "3579387c-6c49-49c6-83ed-d1f33e79d8a6";

    const email = "moncab.dev@gmail.com"; // 🔴 cámbialo si quieres
    const password = "superAdminSeguro123"; // 🔴 cámbialo SI O SI

    const [exists] = await pool.execute(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (exists.length > 0) {
      console.log("❌ Ya existe un usuario con ese email");
      process.exit(1);
    }

    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, 12);

    // ⚠️ OJO: tu tabla usuarios pide institucionId, por eso lo incluimos
    await pool.execute(
      `INSERT INTO usuarios (
        id,
        institucionId,
        carreraId,
        email,
        emailVerificado,
        passwordHash,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        nombreCompleto,
        status,
        requiereCambioPassword,
        perfilCompletado,
        lastLogin,
        rol,
        createdAt,
        updatedAt
      ) VALUES (
        ?, ?, NULL,
        ?, 1, ?,
        'Monse', 'Caballero', NULL, 'Monserrat Caballero',
        'ACTIVO',
        0,
        1,
        NULL,
        'SUPER_ADMIN_NACIONAL',
        NOW(3),
        NOW(3)
      )`,
      [id, String(institucionId), email, passwordHash]
    );

    console.log("✅ SUPER_ADMIN_NACIONAL creado correctamente");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("🏛️ institucionId (requerido por schema):", institucionId);

    console.log(
      "ℹ️ Nota: NO se creó membresía en usuario_institucion (global panel)."
    );
    process.exit(0);
  } catch (error) {
    console.error(
      "💥 Error creando super admin:",
      error?.sqlMessage || error?.message || error
    );
    process.exit(1);
  }
})();
