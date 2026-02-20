const { Router } = require("express");
const router = Router();
const { pool } = require("../db");
const bcrypt = require("bcryptjs"); //
const crypto = require("crypto");   //
const solicitudesController = require("../controllers/solicitudes.controller");

// --- RUTAS DE SOLICITUDES ---

// 1. Crear nueva solicitud (Público)
router.post("/solicitar-institucion", solicitudesController.crearSolicitudInstitucion);

// --- RUTAS DE SETUP (CONFIGURACIÓN) ---

// 2. Validar token de setup (Cuando el usuario hace clic en el email)
router.get("/setup/:token", async (req, res) => {
    try {
        const { token } = req.params;
        
        // Buscar el token en la base de datos
        // Verificamos que no esté usado y que no haya expirado
        const [tokenResult] = await pool.execute(`
            SELECT t.*, s.institucionNombre, s.nombre as responsableNombre
            FROM tokens_setup t
            JOIN solicitudes_acceso s ON t.solicitudId = s.id
            WHERE t.token = ? AND t.usado = false AND t.fechaExpiracion > NOW()
        `, [token]);

        if (tokenResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "El enlace de configuración es inválido, ya fue usado o ha expirado."
            });
        }

        const tokenData = tokenResult[0];

        // Retornamos los datos para mostrar en el formulario (sin procesar nada aún)
        res.json({
            success: true,
            data: {
                email: tokenData.email,
                responsableNombre: tokenData.responsableNombre,
                institucionNombre: tokenData.institucionNombre,
                valid: true,
                tokenId: tokenData.id
            }
        });

    } catch (error) {
        console.error("Error validando token:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al validar el token."
        });
    }
});

// 3. Completar setup del administrador (Guardar password)
router.post("/complete-setup", async (req, res) => {
    try {
        const { token, password, telefono } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token y contraseña son requeridos"
            });
        }

        const conn = await pool.getConnection();

        try {
            await conn.beginTransaction();

            // Verificar token válido nuevamente por seguridad
            const [tokenResult] = await conn.execute(`
                SELECT t.*
                FROM tokens_setup t
                WHERE t.token = ? AND t.usado = false AND t.fechaExpiracion > NOW()
            `, [token]);

            if (tokenResult.length === 0) {
                await conn.rollback();
                return res.status(404).json({
                    success: false,
                    message: "Token inválido o expirado"
                });
            }

            const tokenData = tokenResult[0];
            const datosAdicionales = JSON.parse(tokenData.datosAdicionales || '{}');
            const adminUserId = datosAdicionales.adminUserId;

            if (!adminUserId) {
                throw new Error("No se encontró ID de usuario en el token");
            }

            // Hashear nueva contraseña
            const passwordHash = await bcrypt.hash(password, 10);

            // Actualizar usuario: Poner password, teléfono y activarlo
            await conn.execute(`
                UPDATE usuarios SET 
                    passwordHash = ?,
                    telefono = ?, 
                    status = 'ACTIVO',
                    requiereCambioPassword = false,
                    updatedAt = NOW()
                WHERE id = ?
            `, [passwordHash, telefono || null, adminUserId]);

            // Marcar token como usado
            await conn.execute(`
                UPDATE tokens_setup SET usado = true WHERE id = ?
            `, [tokenData.id]);

            // Crear notificación de éxito
            await conn.execute(`
                INSERT INTO notificaciones_sistema (id, tipo, destinatario_email, asunto, mensaje)
                VALUES (?, 'SETUP_COMPLETADO', ?, ?, ?)
            `, [
                crypto.randomUUID(),
                process.env.SUPER_ADMIN_EMAIL || 'admin@neuroflora.com',
                `Setup completado: ${datosAdicionales.institucionNombre}`,
                `${datosAdicionales.responsableNombre} ha completado la configuración de ${datosAdicionales.institucionNombre}.`
            ]);

            await conn.commit();

            res.json({
                success: true,
                message: "Configuración completada exitosamente",
                data: {
                    email: tokenData.email,
                    institucionNombre: datosAdicionales.institucionNombre
                }
            });

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }

    } catch (error) {
        console.error("Error completando setup:", error);
        res.status(500).json({
            success: false,
            message: "Error al completar la configuración"
        });
    }
});

// --- RUTA TEMPORAL DE PRUEBA (IMPORTANTE) ---
router.post("/test-aprobar/:id", solicitudesController.aprobarSolicitud);

module.exports = router;