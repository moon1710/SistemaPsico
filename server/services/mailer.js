// Carga las variables del archivo .env
require('dotenv').config(); 


// --- AGREGA ESTO PARA PROBAR ---
console.log("---- DEBUG DE VARIABLES ----");
console.log("Dominio:", process.env.MAILGUN_DOMAIN);
console.log("API Key (Primeros 5 caracteres):", process.env.MAILGUN_API_KEY ? process.env.MAILGUN_API_KEY.substring(0, 5) : "NO EXISTE");
console.log("----------------------------");
// -------------------------------

const FormData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(FormData);

// Verificación de seguridad (Opcional pero recomendado)
if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
  console.error('⚠️ ALERTA: Faltan variables de entorno de Mailgun en el archivo .env');
}

const client = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY // Lee la llave del .env
});

const enviarCorreo = async (destinatario, asunto, mensajeHtml) => {
  try {
    const messageData = {
      from: `Neuroflora <${process.env.MAILGUN_USER}>`,
      to: destinatario,
      subject: asunto,
      html: mensajeHtml
    };

    const res = await client.messages.create(process.env.MAILGUN_DOMAIN, messageData);
    console.log('✅ Correo enviado:', res.id); // Muestra el ID para confirmar
    return true;
  } catch (err) {
    console.error('❌ Error Mailgun:', err);
    return false;
  }
};

module.exports = enviarCorreo;