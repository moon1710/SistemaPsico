const express = require("express");
const { pool } = require("../db");
const {
  authenticateToken,
  requireRolesWithInstitution,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// GET /api/canalizaciones - Obtener todas las canalizaciones
router.get("/",
  ...requireRolesWithInstitution([
    "PSICOLOGO",
    "ORIENTADOR",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL"
  ]),
  async (req, res) => {
    try {
      console.log("🔍 GET /api/canalizaciones - Usuario:", req.user?.email);
      console.log("🔍 Usuario completo:", JSON.stringify(req.user, null, 2));

      const userRoles = req.user.instituciones?.map(inst => inst.rol) || [];
      const institucionId = req.institucionId;
      const { severidad, estado, fechaDesde, fechaHasta } = req.query;

      console.log("🔍 Roles de usuario:", userRoles);
      console.log("🔍 ID de institución:", institucionId);
      console.log("🔍 Filtros:", { severidad, estado, fechaDesde, fechaHasta });

      let whereClause = "WHERE 1=1";
      let params = [];

      // Filtrar por institución si no es super admin nacional
      if (!userRoles.includes('SUPER_ADMIN_NACIONAL') && institucionId) {
        whereClause += " AND ui.institucionId = ?";
        params.push(institucionId);
      }

      // Solo mostrar casos que requieren canalización (severidad moderada o severa)
      whereClause += " AND rq.severidad IN ('MODERADA', 'SEVERA')";

      // Filtros adicionales
      if (severidad) {
        whereClause += " AND rq.severidad = ?";
        params.push(severidad);
      }

      if (estado) {
        whereClause += " AND COALESCE(c.estado, 'PENDIENTE') = ?";
        params.push(estado);
      }

      if (fechaDesde && fechaHasta) {
        whereClause += " AND rq.fechaEnvio BETWEEN ? AND ?";
        params.push(fechaDesde, fechaHasta);
      }

      const query = `
        SELECT
          rq.id as quizId,
          rq.usuarioId,
          rq.quizId as evaluacionId,
          rq.puntajeTotal,
          rq.severidad,
          rq.fechaEnvio,
          rq.respuestas,
          u.nombreCompleto,
          u.email,
          u.matricula,
          u.carrera,
          u.semestre,
          u.telefono,
          u.contactoEmergenciaNombre,
          u.contactoEmergenciaTelefono,
          q.titulo as quizNombre,
          q.tipo as quizTipo,
          q.descripcion as quizDescripcion,
          i.nombre as institucionNombre,
          c.id as canalizacionId,
          c.estado as estadoCaso,
          c.prioridad,
          c.motivoCanalizacion,
          c.psicologoAsignado,
          c.fechaCreacion,
          c.ultimaActividad,
          c.proximaCita,
          c.fechaAlta,
          psic.nombreCompleto as psicologoNombre,
          psic.email as psicologoEmail,
          psic.cedulaProfesional,
          psic.especialidades
        FROM respuestas_quiz rq
        INNER JOIN usuarios u ON rq.usuarioId = u.id
        INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
        INNER JOIN instituciones i ON ui.institucionId = i.id
        INNER JOIN quizzes q ON rq.quizId = q.id
        LEFT JOIN canalizaciones_psicologicas c ON rq.id = c.respuestaQuizId
        LEFT JOIN usuarios psic ON c.psicologoAsignado = psic.id
        ${whereClause}
        AND rq.completado = 1
        ORDER BY
          CASE WHEN rq.severidad = 'SEVERA' THEN 1 ELSE 2 END,
          CASE WHEN COALESCE(c.estado, 'PENDIENTE') = 'PENDIENTE' THEN 1 ELSE 2 END,
          rq.fechaEnvio DESC
      `;

      console.log("🔍 Query SQL:", query);
      console.log("🔍 Parámetros:", params);

      const [canalizaciones] = await pool.execute(query, params);

      console.log("🔍 Resultados encontrados:", canalizaciones.length);

      // Obtener notas de seguimiento para cada canalización
      const canalizacionesConNotas = await Promise.all(
        canalizaciones.map(async (caso) => {
          if (caso.canalizacionId) {
            const [notas] = await pool.execute(`
              SELECT
                n.id,
                n.nota,
                n.tipo,
                n.fechaCreacion,
                u.nombreCompleto as psicologoNombre
              FROM notas_canalizacion n
              INNER JOIN usuarios u ON n.usuarioId = u.id
              WHERE n.canalizacionId = ?
              ORDER BY n.fechaCreacion DESC
            `, [caso.canalizacionId]);

            return { ...caso, notas };
          }
          return { ...caso, notas: [] };
        })
      );

      res.json({
        success: true,
        data: canalizacionesConNotas
      });

    } catch (error) {
      console.error("Error obteniendo canalizaciones:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
);

// POST /api/canalizaciones - Crear nueva canalización
router.post("/",
  ...requireRolesWithInstitution([
    "PSICOLOGO",
    "ORIENTADOR",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL"
  ]),
  async (req, res) => {
    try {
      const { respuestaQuizId, motivoCanalizacion, prioridad = 'MEDIA' } = req.body;

      // Verificar que la respuesta del quiz existe y requiere canalización
      const [respuesta] = await pool.execute(`
        SELECT rq.*, u.nombreCompleto, u.email
        FROM respuestas_quiz rq
        INNER JOIN usuarios u ON rq.usuarioId = u.id
        WHERE rq.id = ? AND rq.severidad IN ('MODERADA', 'SEVERA')
      `, [respuestaQuizId]);

      if (respuesta.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Respuesta de quiz no encontrada o no requiere canalización"
        });
      }

      // Verificar si ya existe una canalización para esta respuesta
      const [existente] = await pool.execute(`
        SELECT id FROM canalizaciones_psicologicas WHERE respuestaQuizId = ?
      `, [respuestaQuizId]);

      if (existente.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una canalización para esta evaluación"
        });
      }

      // Crear la canalización
      const [result] = await pool.execute(`
        INSERT INTO canalizaciones_psicologicas (
          respuestaQuizId,
          usuarioId,
          estado,
          prioridad,
          motivoCanalizacion,
          fechaCreacion,
          ultimaActividad
        ) VALUES (?, ?, 'PENDIENTE', ?, ?, NOW(), NOW())
      `, [respuestaQuizId, respuesta[0].usuarioId, prioridad, motivoCanalizacion]);

      res.status(201).json({
        success: true,
        message: "Canalización creada exitosamente",
        data: { canalizacionId: result.insertId }
      });

    } catch (error) {
      console.error("Error creando canalización:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
);

// PUT /api/canalizaciones/:id/estado - Actualizar estado de canalización
router.put("/:id/estado",
  ...requireRolesWithInstitution([
    "PSICOLOGO",
    "ORIENTADOR",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL"
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { estado, psicologoAsignado } = req.body;

      const estadosValidos = ['PENDIENTE', 'EN_SEGUIMIENTO', 'CONTACTADO', 'RESUELTO'];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          success: false,
          message: "Estado no válido"
        });
      }

      let updateFields = ["estado = ?", "ultimaActividad = NOW()"];
      let params = [estado];

      if (psicologoAsignado) {
        updateFields.push("psicologoAsignado = ?");
        params.push(psicologoAsignado);
      }

      if (estado === 'RESUELTO') {
        updateFields.push("fechaAlta = NOW()");
      }

      params.push(id);

      await pool.execute(`
        UPDATE canalizaciones_psicologicas
        SET ${updateFields.join(", ")}
        WHERE id = ?
      `, params);

      res.json({
        success: true,
        message: "Estado actualizado exitosamente"
      });

    } catch (error) {
      console.error("Error actualizando estado:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
);

// POST /api/canalizaciones/:id/notas - Agregar nota de seguimiento
router.post("/:id/notas",
  ...requireRolesWithInstitution([
    "PSICOLOGO",
    "ORIENTADOR",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL"
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nota, tipo = 'SEGUIMIENTO' } = req.body;
      const usuarioId = req.user.id;

      if (!nota || nota.trim() === '') {
        return res.status(400).json({
          success: false,
          message: "La nota no puede estar vacía"
        });
      }

      // Verificar que la canalización existe
      const [canalizacion] = await pool.execute(`
        SELECT id FROM canalizaciones_psicologicas WHERE id = ?
      `, [id]);

      if (canalizacion.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Canalización no encontrada"
        });
      }

      // Insertar la nota
      await pool.execute(`
        INSERT INTO notas_canalizacion (
          canalizacionId,
          usuarioId,
          nota,
          tipo,
          fechaCreacion
        ) VALUES (?, ?, ?, ?, NOW())
      `, [id, usuarioId, nota, tipo]);

      // Actualizar la última actividad de la canalización
      await pool.execute(`
        UPDATE canalizaciones_psicologicas
        SET ultimaActividad = NOW()
        WHERE id = ?
      `, [id]);

      res.status(201).json({
        success: true,
        message: "Nota agregada exitosamente"
      });

    } catch (error) {
      console.error("Error agregando nota:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
);

// GET /api/canalizaciones/estadisticas - Obtener estadísticas
router.get("/estadisticas",
  ...requireRolesWithInstitution([
    "PSICOLOGO",
    "ORIENTADOR",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL"
  ]),
  async (req, res) => {
    try {
      const userRoles = req.user.instituciones?.map(inst => inst.rol) || [];
      const institucionId = req.institucionId;

      let whereClause = "";
      let params = [];

      if (!userRoles.includes('SUPER_ADMIN_NACIONAL') && institucionId) {
        whereClause = "AND ui.institucionId = ?";
        params.push(institucionId);
      }

      const [stats] = await pool.execute(`
        SELECT
          COUNT(*) as totalCasos,
          SUM(CASE WHEN COALESCE(c.estado, 'PENDIENTE') = 'PENDIENTE' THEN 1 ELSE 0 END) as pendientes,
          SUM(CASE WHEN rq.severidad = 'SEVERA' THEN 1 ELSE 0 END) as severos,
          SUM(CASE WHEN rq.severidad = 'MODERADA' THEN 1 ELSE 0 END) as moderados,
          SUM(CASE WHEN COALESCE(c.estado, 'PENDIENTE') = 'RESUELTO' THEN 1 ELSE 0 END) as resueltos
        FROM respuestas_quiz rq
        INNER JOIN usuarios u ON rq.usuarioId = u.id
        INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
        LEFT JOIN canalizaciones_psicologicas c ON rq.id = c.respuestaQuizId
        WHERE rq.severidad IN ('MODERADA', 'SEVERA')
        AND rq.completado = 1
        ${whereClause}
      `, params);

      res.json({
        success: true,
        data: stats[0]
      });

    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
);

module.exports = router;