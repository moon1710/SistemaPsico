const { pool } = require("../db");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const emailService = require("../services/emailService");

/**
 * Función auxiliar para generar códigos únicos cortos
 */
const generarCodigo = (prefijo) => {
    return `${prefijo}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
};

/**
 * Crear una nueva solicitud de acceso para institución
 */
const crearSolicitudInstitucion = async (req, res) => {
    const {
        nombreCampus,
        estado,
        ciudad,
        claveInstitucional,
        telefonoInstitucion,
        nombreDirector,
        correoInstitucional,
        responsableNombre,
        responsableCargo,
        responsableCorreoInstitucional,
        responsableCorreoPersonal,
        responsableTelefonoPersonal,
        autorizacionConfirmada
    } = req.body;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        const solicitudId = crypto.randomUUID();

        // Guardamos los datos extras en un JSON string
        const datosExtras = JSON.stringify({
            claveInstitucional,
            telefonoInstitucion,
            nombreDirector,
            correoInstitucional,
            responsableCargo,
            responsableCorreoPersonal,
            responsableTelefonoPersonal
        });

        // Insertar la solicitud 
        await conn.execute(`
            INSERT INTO solicitudes_acceso (
                id, nombre, apellidoPaterno, email, rolSolicitado, 
                institucionNombre, ciudad, estado, motivoSolicitud, 
                status, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDIENTE', NOW(), NOW())
        `, [
            solicitudId,
            responsableNombre, 
            '.', // Apellido paterno temporal (obligatorio en DB)
            responsableCorreoInstitucional, 
            'ADMIN_INSTITUCION', 
            nombreCampus,      
            ciudad,
            estado,
            datosExtras 
        ]);

        // Enviar notificación
        try {
            await emailService.enviarNotificacionNuevaSolicitud({
                solicitudId, nombreCampus, responsableNombre, 
                responsableCorreoInstitucional, ciudad, estado
            });
            
            await conn.execute(`
                INSERT INTO notificaciones_sistema (id, tipo, destinatario_email, asunto, mensaje)
                VALUES (?, 'NUEVA_SOLICITUD', ?, ?, ?)
            `, [
                crypto.randomUUID(),
                process.env.SUPER_ADMIN_EMAIL || 'admin@neuroflora.com',
                `Nueva solicitud: ${nombreCampus}`,
                `Solicitud recibida de ${responsableNombre} para ${nombreCampus}.`
            ]);
        } catch (e) { console.error("Error email:", e.message); }

        await conn.commit();
        res.status(201).json({ success: true, message: "Solicitud enviada", id: solicitudId });

    } catch (error) {
        await conn.rollback();
        console.error("Error creando solicitud:", error);
        res.status(500).json({ success: false, message: "Error al procesar solicitud" });
    } finally {
        conn.release();
    }
};

/**
 * Obtener todas las solicitudes
 */
const obtenerSolicitudes = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM solicitudes_acceso ORDER BY createdAt DESC");
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error obteniendo solicitudes:", error);
        res.status(500).json({ success: false, message: "Error al obtener solicitudes" });
    }
};

/**
 * Aprobar una solicitud
 */
const aprobarSolicitud = async (req, res) => {
    const { id } = req.params;
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1. Obtener datos de la solicitud
        const [solicitudes] = await conn.execute("SELECT * FROM solicitudes_acceso WHERE id = ?", [id]);
        
        if (solicitudes.length === 0) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: "Solicitud no encontrada" });
        }
        
        const solicitud = solicitudes[0];
        const institucionId = crypto.randomUUID();
        const adminUserId = crypto.randomUUID();

        // 2. Crear la Institución
        // Generamos código único para la institución
        const codigoInst = generarCodigo('INST');
        const nombreCorto = solicitud.institucionNombre.substring(0, 100); 

        await conn.execute(`
            INSERT INTO instituciones (
                id, codigo, nombre, nombreCorto, tipoInstitucion, nivelEducativo,
                ciudad, estado, responsableNombre, responsableEmail, 
                status, maxUsuarios, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVA', 100, NOW(), NOW())
        `, [
            institucionId,
            codigoInst,
            solicitud.institucionNombre,
            nombreCorto,
            'UNIVERSIDAD', 
            'SUPERIOR',    
            solicitud.ciudad,
            solicitud.estado,
            solicitud.nombre, // Nombre del responsable
            solicitud.email
        ]);

        // 3. Crear Usuario Admin
        // CORRECCIÓN: Eliminamos 'codigo' de esta inserción porque la tabla usuarios no lo tiene
        const setupToken = crypto.randomBytes(32).toString('hex');
        
        // Contraseña temporal
        const tempPassword = crypto.randomBytes(12).toString('hex');
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        await conn.execute(`
            INSERT INTO usuarios (
                id, institucionId, nombre, apellidoPaterno, nombreCompleto,
                email, emailVerificado, passwordHash, rol, status, 
                requiereCambioPassword, perfilCompletado, createdAt, updatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
            adminUserId,
            institucionId,
            solicitud.nombre, // Nombre
            '.',              // Apellido Paterno (Obligatorio, ponemos punto por ahora)
            solicitud.nombre, // Nombre Completo
            solicitud.email,
            1, // Email verificado (true)
            passwordHash,
            'ADMIN_INSTITUCION',
            'PENDIENTE', // Status
            1, // Requiere cambio password
            0  // Perfil no completado
        ]);

        // 4. Guardar Token de Setup
        const fechaExpiracion = new Date();
        fechaExpiracion.setDate(fechaExpiracion.getDate() + 7);

        await conn.execute(`
            INSERT INTO tokens_setup (id, solicitudId, token, email, fechaExpiracion, datosAdicionales)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            crypto.randomUUID(),
            id,
            setupToken,
            solicitud.email,
            fechaExpiracion,
            JSON.stringify({
                institucionId,
                adminUserId,
                institucionNombre: solicitud.institucionNombre,
                responsableNombre: solicitud.nombre
            })
        ]);

        // 5. Actualizar solicitud a APROBADA
        await conn.execute("UPDATE solicitudes_acceso SET status = 'APROBADA' WHERE id = ?", [id]);

        // 6. Enviar Email
        try {
            await emailService.enviarEmailSetup({
                email: solicitud.email,
                token: setupToken,
                responsableNombre: solicitud.nombre,
                nombreCampus: solicitud.institucionNombre
            });
            
            console.log('✅ Email enviado. Token:', setupToken);
        } catch (e) { console.error("Error email:", e.message); }

        await conn.commit();
        res.json({ success: true, message: "Aprobado correctamente", setupToken });

    } catch (error) {
        await conn.rollback();
        console.error("Error aprobando:", error);
        res.status(500).json({ success: false, message: "Error al aprobar", error: error.message });
    } finally {
        conn.release();
    }
};

const rechazarSolicitud = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute("UPDATE solicitudes_acceso SET status = 'RECHAZADA' WHERE id = ?", [id]);
        res.json({ success: true, message: "Solicitud rechazada" });
    } catch (error) {
        console.error("Error rechazando solicitud:", error);
        res.status(500).json({ success: false, message: "Error al rechazar solicitud" });
    }
};

module.exports = {
    crearSolicitudInstitucion,
    obtenerSolicitudes,
    aprobarSolicitud,
    rechazarSolicitud
};