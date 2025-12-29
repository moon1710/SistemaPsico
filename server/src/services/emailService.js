// services/emailService.js
// TODO: Implementar cuando esté listo el servicio de email (Brevo)

/**
 * Servicio de email usando Brevo (SendinBlue)
 * Configuración pendiente en .env:
 *
 * BREVO_API_KEY=tu_api_key
 * BREVO_FROM_EMAIL=noreply@tudominio.com
 * BREVO_FROM_NAME=Sistema Psicológico
 */

// const axios = require('axios');

/**
 * Enviar notificación de nueva solicitud al super admin
 */
const enviarNotificacionNuevaSolicitud = async (datos) => {
  try {
    console.log('📧 [EMAIL_SERVICE] Enviando notificación de nueva solicitud:', {
      solicitudId: datos.solicitudId,
      nombreCampus: datos.nombreCampus,
      responsable: datos.responsableNombre,
      ubicacion: `${datos.ciudad}, ${datos.estado}`
    });

    // TODO: Implementar envío real con Brevo
    /*
    const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', {
      sender: {
        email: process.env.BREVO_FROM_EMAIL,
        name: process.env.BREVO_FROM_NAME
      },
      to: [{
        email: process.env.SUPER_ADMIN_EMAIL || 'admin@tudominio.com',
        name: 'Super Administrador'
      }],
      subject: `Nueva solicitud de institución: ${datos.nombreCampus}`,
      htmlContent: `
        <h2>Nueva Solicitud de Institución</h2>
        <p><strong>Campus:</strong> ${datos.nombreCampus}</p>
        <p><strong>Ubicación:</strong> ${datos.ciudad}, ${datos.estado}</p>
        <p><strong>Responsable:</strong> ${datos.responsableNombre}</p>
        <p><strong>Correo:</strong> ${datos.responsableCorreoInstitucional}</p>
        <p><strong>ID Solicitud:</strong> ${datos.solicitudId}</p>

        <p>Revisa y procesa esta solicitud en el panel de administración.</p>
        <a href="${process.env.FRONTEND_URL}/admin/solicitudes" style="background: #3B82F6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Ver Solicitudes Pendientes
        </a>
      `
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Email enviado exitosamente:', response.data.messageId);
    return { success: true, messageId: response.data.messageId };
    */

    // Simulación por ahora
    console.log('✅ [SIMULACIÓN] Email enviado exitosamente');
    return { success: true, messageId: 'simulated_' + Date.now() };

  } catch (error) {
    console.error('❌ Error enviando email de notificación:', error.message);
    throw error;
  }
};

/**
 * Enviar email con link de setup a responsable aprobado
 */
const enviarEmailSetup = async (datos) => {
  try {
    console.log('📧 [EMAIL_SERVICE] Enviando email de setup:', {
      email: datos.email,
      nombreCampus: datos.nombreCampus,
      token: datos.token?.substring(0, 10) + '...' // Log parcial por seguridad
    });

    // TODO: Implementar envío real con Brevo
    /*
    const setupUrl = `${process.env.FRONTEND_URL}/setup?token=${datos.token}`;

    const response = await axios.post('https://api.sendinblue.com/v3/smtp/email', {
      sender: {
        email: process.env.BREVO_FROM_EMAIL,
        name: process.env.BREVO_FROM_NAME
      },
      to: [{
        email: datos.email,
        name: datos.responsableNombre
      }],
      subject: `Solicitud aprobada - Complete el registro de ${datos.nombreCampus}`,
      htmlContent: `
        <h2>¡Su solicitud ha sido aprobada!</h2>
        <p>Estimado/a ${datos.responsableNombre},</p>

        <p>Nos complace informarle que la solicitud para registrar <strong>${datos.nombreCampus}</strong> en nuestro sistema ha sido aprobada.</p>

        <p>Para completar el registro, haga clic en el siguiente enlace:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${setupUrl}" style="background: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Completar Registro Institucional
          </a>
        </div>

        <p><strong>Importante:</strong></p>
        <ul>
          <li>Este enlace es válido por 7 días</li>
          <li>Solo puede ser usado una vez</li>
          <li>Le permitirá configurar su cuenta de administrador y completar la información institucional</li>
        </ul>

        <p>Si tiene alguna duda, no dude en contactarnos.</p>

        <p>Saludos cordiales,<br>
        Equipo del Sistema Psicológico Educativo</p>

        <hr>
        <small>Si no puede hacer clic en el botón, copie y pegue este enlace en su navegador: ${setupUrl}</small>
      `
    }, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Email de setup enviado exitosamente:', response.data.messageId);
    return { success: true, messageId: response.data.messageId };
    */

    // Simulación por ahora
    const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/setup?token=${datos.token}`;
    console.log('✅ [SIMULACIÓN] Email de setup enviado exitosamente');
    console.log('🔗 [SIMULACIÓN] URL de setup:', setupUrl);

    return {
      success: true,
      messageId: 'simulated_setup_' + Date.now(),
      setupUrl // Para testing
    };

  } catch (error) {
    console.error('❌ Error enviando email de setup:', error.message);
    throw error;
  }
};

/**
 * Enviar email de bienvenida a nuevo administrador
 */
const enviarEmailBienvenida = async (datos) => {
  try {
    console.log('📧 [EMAIL_SERVICE] Enviando email de bienvenida:', {
      email: datos.email,
      nombreCompleto: datos.nombreCompleto,
      institucion: datos.institucion
    });

    // TODO: Implementar con template de bienvenida
    console.log('✅ [SIMULACIÓN] Email de bienvenida enviado');
    return { success: true, messageId: 'simulated_welcome_' + Date.now() };

  } catch (error) {
    console.error('❌ Error enviando email de bienvenida:', error.message);
    throw error;
  }
};

module.exports = {
  enviarNotificacionNuevaSolicitud,
  enviarEmailSetup,
  enviarEmailBienvenida
};

/*
Para implementar completamente este servicio:

1. Instalar dependencias:
   npm install axios

2. Configurar variables de entorno (.env):
   BREVO_API_KEY=tu_api_key_de_brevo
   BREVO_FROM_EMAIL=noreply@tudominio.com
   BREVO_FROM_NAME="Sistema Psicológico"
   SUPER_ADMIN_EMAIL=admin@tudominio.com

3. Descomentar el código de axios y las llamadas reales

4. Configurar templates en Brevo (opcional) para emails más profesionales

5. Agregar manejo de bounces y estadísticas de entrega
*/