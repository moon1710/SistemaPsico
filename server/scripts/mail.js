require("dotenv").config();
console.log("ENV CHECK:", {
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  MAILGUN_REGION: process.env.MAILGUN_REGION,
  MAIL_FROM: process.env.MAIL_FROM,
});

const Mailgun = require("mailgun.js");
const formData = require("form-data");

const mailgun = new Mailgun(formData);

// Endpoint por región
const url =
  process.env.MAILGUN_REGION === "eu"
    ? "https://api.eu.mailgun.net"
    : "https://api.mailgun.net";

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url,
});

async function testMailgun() {
  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.MAIL_FROM,
      to: ["moncab.dev@gmail.com"],
      subject: "Prueba Mailgun (CommonJS)",
      text: "Si recibes este correo, Mailgun funciona correctamente ✅",
    });

    console.log("✅ Mail enviado correctamente");
    console.log(response);
  } catch (error) {
    console.error("❌ Error al enviar correo");
    console.error(error?.message || error);
  }
}

testMailgun();
