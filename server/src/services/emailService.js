// server/src/services/emailService.js
const FormData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

// Configuración de Mailgun
const mailgun = new Mailgun(FormData);
const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY, 
});

const DOMAIN = process.env.MAILGUN_DOMAIN;

/**
 * Enviar notificación al Super Admin cuando llega una nueva solicitud
 */
const enviarNotificacionNuevaSolicitud = async (data) => {
    const { solicitudId, nombreCampus, responsableNombre, ciudad, estado } = data;

    const subject = `Nueva Solicitud: ${nombreCampus}`;
    const html = `
        <h1>Nueva Solicitud Recibida</h1>
        <p>Se ha recibido una solicitud para registrar una nueva institución.</p>
        <ul>
            <li><strong>Institución:</strong> ${nombreCampus}</li>
            <li><strong>Responsable:</strong> ${responsableNombre}</li>
            <li><strong>Ubicación:</strong> ${ciudad}, ${estado}</li>
            <li><strong>ID Solicitud:</strong> ${solicitudId}</li>
        </ul>
        <p>Ingresa al panel administrativo para aprobar o rechazar esta solicitud.</p>
    `;

    try {
        const result = await client.messages.create(DOMAIN, {
            from: `Sistema NeuroFlora <noreply@${DOMAIN}>`,
            to: process.env.SUPER_ADMIN_EMAIL || 'angel_tux@hotmail.com', // Fallback si no hay env
            subject: subject,
            html: html
        });
        console.log("📧 Email de notificación enviado:", result.id);
        return result;
    } catch (error) {
        console.error("❌ Error enviando email de notificación:", error);
        // No lanzamos error para no romper el flujo de la app, solo logueamos
        return null;
    }
};

/**
 * Enviar el enlace de configuración (Setup) al responsable de la institución
 */
const enviarEmailSetup = async (data) => {
    const { email, token, responsableNombre, nombreCampus } = data;
    
    // Construir el link apuntando al Frontend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const setupLink = `${frontendUrl}/setup?token=${token}`;

    const subject = `Aprobado: Configura tu acceso para ${nombreCampus}`;
    const html = `
        <h1>¡Solicitud Aprobada!</h1>
        <p>Hola ${responsableNombre},</p>
        <p>Nos complace informarte que la solicitud para <strong>${nombreCampus}</strong> ha sido aprobada.</p>
        <p>Para comenzar a utilizar la plataforma y registrar a tus usuarios, necesitas configurar tu contraseña de administrador institucional.</p>
        <div style="margin: 30px 0;">
            <a href="${setupLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px; font-weight: bold;">
                Completar Configuración
            </a>
        </div>
        <p>O copia y pega este enlace en tu navegador:</p>
        <p>${setupLink}</p>
        <p>Este enlace expirará en 7 días.</p>
    `;

    try {
        const result = await client.messages.create(DOMAIN, {
            from: `Sistema NeuroFlora <noreply@${DOMAIN}>`,
            to: email,
            subject: subject,
            html: html
        });
        console.log("📧 Email de setup enviado a:", email);
        return result;
    } catch (error) {
        console.error("❌ Error enviando email de setup:", error);
        throw error; // Aquí sí lanzamos error porque es crítico
    }
};

module.exports = {
    enviarNotificacionNuevaSolicitud,
    enviarEmailSetup
};