// 1. Cargar las variables del .env
require('dotenv').config();

// 2. Importar tu servicio de correo
// Nota: La ruta asume que este archivo está en la RAÍZ del proyecto
const enviarCorreo = require('./server/services/mailer');

// 3. Función para ejecutar la prueba

async function ejecutarPrueba() {
    console.log("⏳ Iniciando prueba de envío...");
    console.log(`🔑 Usando API Key: ${process.env.MAILGUN_API_KEY ? 'OK (Cargada)' : '❌ ERROR: No encontrada'}`);

    const destinatario = 'moncaballero1710@gmail.com'; // Tu correo personal
    const asunto = 'mon nub';
    const html = `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd;">
            <h1 style="color: #2ecc71;">¡El sistema funciona!</h1>
            <p>Este es un correo de prueba enviado manualmente desde <b>prueba-mail.js</b>.</p>
            <p>Si lees esto, tu configuración de Mailgun y Node.js es correcta. MONSE NUBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</p>
            <p>MONSE NUBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</p>
            <p>MONSE NUBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</p>
            <p>MONSE NUBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</p>
            <p>MONSE NUBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</p>
            <p>MONSE NUBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</p>
            <p>MONSE NUBbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</p>
        </div>
    `;

    try {
        const resultado = await enviarCorreo(destinatario, asunto, html);
        
        if (resultado) {
            console.log("✅ ¡CORREO ENVIADO CON ÉXITO!");
            console.log("👉 Revisa tu bandeja de entrada (y SPAM) en: " + destinatario);
        } else {
            console.log("❌ El servicio devolvió 'false'. Algo falló internamente.");
        }
    } catch (error) {
        console.error("❌ Ocurrió un error inesperado:", error);
    }
}

// Ejecutar
ejecutarPrueba();