const express = require("express");
const { pool } = require("../db");
const {
  authenticateToken,
  requireRolesWithInstitution,
} = require("../middlewares/auth.middleware");

const router = express.Router();

// Middleware de autenticación para todas las rutas
router.use(authenticateToken);

// GET /api/reports/dashboard - Reportes del dashboard general
router.get("/dashboard", async (req, res) => {
  try {
    const userRoles = req.user.instituciones?.map(inst => inst.rol) || [];
    const institucionId = req.user.instituciones?.[0]?.institucionId;

    // Verificar que tenga al menos algún rol administrativo o de psicólogo
    const hasAccess = userRoles.some(rol =>
      ['ADMIN_INSTITUCION', 'SUPER_ADMIN_INSTITUCION', 'SUPER_ADMIN_NACIONAL', 'PSICOLOGO', 'ORIENTADOR'].includes(rol)
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para ver reportes"
      });
    }

    let whereClause = "";
    let params = [];

    // Si no es super admin nacional, filtrar por institución
    if (!userRoles.includes('SUPER_ADMIN_NACIONAL')) {
      whereClause = "WHERE ui.institucionId = ?";
      params.push(institucionId);
    }

    // Estadísticas generales de usuarios
    const [userStats] = await pool.execute(
      `SELECT
         COUNT(*) as total_usuarios,
         SUM(CASE WHEN ui.rolInstitucion = 'ESTUDIANTE' THEN 1 ELSE 0 END) as estudiantes,
         SUM(CASE WHEN ui.rolInstitucion = 'PSICOLOGO' THEN 1 ELSE 0 END) as psicologos,
         SUM(CASE WHEN ui.rolInstitucion = 'ORIENTADOR' THEN 1 ELSE 0 END) as orientadores,
         SUM(CASE WHEN u.status = 'ACTIVO' THEN 1 ELSE 0 END) as usuarios_activos
       FROM usuarios u
       LEFT JOIN usuario_institucion ui ON u.id = ui.usuarioId
       ${whereClause}`,
      params
    );

    // Estadísticas de citas
    const [citasStats] = await pool.execute(
      `SELECT
         COUNT(*) as total_citas,
         SUM(CASE WHEN c.estado = 'SOLICITADA' THEN 1 ELSE 0 END) as pendientes,
         SUM(CASE WHEN c.estado = 'CONFIRMADA' THEN 1 ELSE 0 END) as confirmadas,
         SUM(CASE WHEN c.estado = 'COMPLETADA' THEN 1 ELSE 0 END) as completadas,
         SUM(CASE WHEN c.estado = 'CANCELADA' THEN 1 ELSE 0 END) as canceladas,
         SUM(CASE WHEN c.fechaHora >= CURDATE() - INTERVAL 7 DAY THEN 1 ELSE 0 END) as citas_semana
       FROM citas c
       ${whereClause ? `WHERE EXISTS (
         SELECT 1 FROM usuarios u
         JOIN usuario_institucion ui ON u.id = ui.usuarioId
         WHERE (u.id = c.usuarioId OR u.id = c.psicologoId) AND ui.institucionId = ?
       )` : ''}`,
      whereClause ? params : []
    );

    // Estadísticas de evaluaciones
    const [evalStats] = await pool.execute(
      `SELECT
         COUNT(*) as total_evaluaciones,
         SUM(CASE WHEN rq.completado = 1 THEN 1 ELSE 0 END) as completadas,
         AVG(CASE WHEN rq.completado = 1 THEN rq.puntajeTotal ELSE NULL END) as promedio_puntaje,
         SUM(CASE WHEN rq.fechaEnvio >= CURDATE() - INTERVAL 30 DAY THEN 1 ELSE 0 END) as evaluaciones_mes
       FROM respuestas_quiz rq
       ${whereClause ? `WHERE EXISTS (
         SELECT 1 FROM usuarios u
         JOIN usuario_institucion ui ON u.id = ui.usuarioId
         WHERE u.id = rq.usuarioId AND ui.institucionId = ?
       )` : ''}`,
      whereClause ? params : []
    );

    res.json({
      success: true,
      data: {
        usuarios: userStats[0],
        citas: citasStats[0],
        evaluaciones: evalStats[0],
        fecha_reporte: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Error generando reporte del dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

// GET /api/reports/monthly - Reporte mensual
router.get("/monthly",
  ...requireRolesWithInstitution([
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL"
  ]),
  async (req, res) => {
    try {
      const { mes, año } = req.query;
      const institucionId = req.institucionId;

      const currentDate = new Date();
      const targetMonth = mes ? parseInt(mes) : currentDate.getMonth() + 1;
      const targetYear = año ? parseInt(año) : currentDate.getFullYear();

      // Citas por día del mes
      const [citasPorDia] = await pool.execute(
        `SELECT
           DAY(c.fechaHora) as dia,
           COUNT(*) as total_citas,
           SUM(CASE WHEN c.estado = 'COMPLETADA' THEN 1 ELSE 0 END) as completadas
         FROM citas c
         WHERE MONTH(c.fechaHora) = ? AND YEAR(c.fechaHora) = ?
         ${institucionId ? 'AND EXISTS (SELECT 1 FROM usuarios u JOIN usuario_institucion ui ON u.id = ui.usuarioId WHERE u.id = c.psicologoId AND ui.institucionId = ?)' : ''}
         GROUP BY DAY(c.fechaHora)
         ORDER BY dia`,
        institucionId ? [targetMonth, targetYear, institucionId] : [targetMonth, targetYear]
      );

      // Evaluaciones por severidad
      const [evalPorSeveridad] = await pool.execute(
        `SELECT
           rq.severidad,
           COUNT(*) as cantidad
         FROM respuestas_quiz rq
         WHERE MONTH(rq.fechaEnvio) = ? AND YEAR(rq.fechaEnvio) = ? AND rq.completado = 1
         ${institucionId ? 'AND EXISTS (SELECT 1 FROM usuarios u JOIN usuario_institucion ui ON u.id = ui.usuarioId WHERE u.id = rq.usuarioId AND ui.institucionId = ?)' : ''}
         GROUP BY rq.severidad`,
        institucionId ? [targetMonth, targetYear, institucionId] : [targetMonth, targetYear]
      );

      // Top psicólogos por número de citas
      const [topPsicologos] = await pool.execute(
        `SELECT
           u.nombreCompleto,
           COUNT(*) as total_citas,
           SUM(CASE WHEN c.estado = 'COMPLETADA' THEN 1 ELSE 0 END) as completadas
         FROM citas c
         JOIN usuarios u ON c.psicologoId = u.id
         WHERE MONTH(c.fechaHora) = ? AND YEAR(c.fechaHora) = ?
         ${institucionId ? 'AND EXISTS (SELECT 1 FROM usuario_institucion ui WHERE ui.usuarioId = u.id AND ui.institucionId = ?)' : ''}
         GROUP BY c.psicologoId, u.nombreCompleto
         ORDER BY total_citas DESC
         LIMIT 10`,
        institucionId ? [targetMonth, targetYear, institucionId] : [targetMonth, targetYear]
      );

      res.json({
        success: true,
        data: {
          mes: targetMonth,
          año: targetYear,
          citas_por_dia: citasPorDia,
          evaluaciones_por_severidad: evalPorSeveridad,
          top_psicologos: topPsicologos
        }
      });

    } catch (error) {
      console.error("Error generando reporte mensual:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
);

// GET /api/reports/psychologist - Reporte específico para psicólogos (basado en evaluaciones/quizzes)
router.get("/psychologist",
  ...requireRolesWithInstitution([
    "PSICOLOGO",
    "ORIENTADOR",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL"
  ]),
  async (req, res) => {
    try {
      const { fechaInicio, fechaFin } = req.query;
      const userRoles = req.user.instituciones?.map(inst => inst.rol) || [];
      const institucionId = req.institucionId;

      let dateFilter = "";
      let params = [];

      // Filtro de fechas
      if (fechaInicio && fechaFin) {
        dateFilter = "AND rq.fechaEnvio BETWEEN ? AND ?";
        params.push(fechaInicio, fechaFin);
      } else {
        // Por defecto, último mes
        dateFilter = "AND rq.fechaEnvio >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
      }

      // Filtro por institución si no es super admin nacional
      let institutionFilter = "";
      if (!userRoles.includes('SUPER_ADMIN_NACIONAL') && institucionId) {
        institutionFilter = "AND ui.institucionId = ?";
        params.push(institucionId);
      }

      // Resumen de evaluaciones
      const [evaluacionesResumen] = await pool.execute(
        `SELECT
           COUNT(*) as total_evaluaciones,
           SUM(CASE WHEN rq.completado = 1 THEN 1 ELSE 0 END) as completadas,
           SUM(CASE WHEN rq.severidad = 'SEVERA' THEN 1 ELSE 0 END) as severas,
           SUM(CASE WHEN rq.severidad = 'MODERADA' THEN 1 ELSE 0 END) as moderadas,
           SUM(CASE WHEN rq.severidad = 'LEVE' THEN 1 ELSE 0 END) as leves,
           AVG(CASE WHEN rq.completado = 1 THEN rq.puntajeTotal ELSE NULL END) as puntaje_promedio,
           COUNT(DISTINCT rq.usuarioId) as estudiantes_evaluados
         FROM respuestas_quiz rq
         INNER JOIN usuarios u ON rq.usuarioId = u.id
         INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
         WHERE 1=1 ${dateFilter} ${institutionFilter}`,
        params
      );

      // Estudiantes evaluados con detalles
      const [estudiantesEvaluados] = await pool.execute(
        `SELECT
           u.nombreCompleto,
           u.carrera,
           u.semestre,
           u.matricula,
           COUNT(*) as total_evaluaciones,
           MAX(rq.fechaEnvio) as ultima_evaluacion,
           AVG(rq.puntajeTotal) as puntaje_promedio,
           MAX(rq.severidad) as mayor_severidad,
           SUM(CASE WHEN rq.severidad IN ('MODERADA', 'SEVERA') THEN 1 ELSE 0 END) as requiere_atencion
         FROM respuestas_quiz rq
         INNER JOIN usuarios u ON rq.usuarioId = u.id
         INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
         WHERE rq.completado = 1 ${dateFilter} ${institutionFilter}
         GROUP BY rq.usuarioId, u.nombreCompleto, u.carrera, u.semestre, u.matricula
         ORDER BY requiere_atencion DESC, puntaje_promedio DESC`,
        params
      );

      // Distribución por tipo de quiz
      const [distribucionQuiz] = await pool.execute(
        `SELECT
           q.titulo as quiz_tipo,
           q.tipo as categoria,
           COUNT(*) as cantidad,
           AVG(rq.puntajeTotal) as puntaje_promedio
         FROM respuestas_quiz rq
         INNER JOIN quizzes q ON rq.quizId = q.id
         INNER JOIN usuarios u ON rq.usuarioId = u.id
         INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
         WHERE rq.completado = 1 ${dateFilter} ${institutionFilter}
         GROUP BY q.id, q.titulo, q.tipo
         ORDER BY cantidad DESC`,
        params
      );

      // Distribución por severidad
      const [distribucionSeveridad] = await pool.execute(
        `SELECT
           rq.severidad,
           COUNT(*) as cantidad,
           ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM respuestas_quiz rq2
             INNER JOIN usuarios u2 ON rq2.usuarioId = u2.id
             INNER JOIN usuario_institucion ui2 ON u2.id = ui2.usuarioId
             WHERE rq2.completado = 1 ${dateFilter} ${institutionFilter})), 2) as porcentaje
         FROM respuestas_quiz rq
         INNER JOIN usuarios u ON rq.usuarioId = u.id
         INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
         WHERE rq.completado = 1 ${dateFilter} ${institutionFilter}
         GROUP BY rq.severidad
         ORDER BY
           CASE rq.severidad
             WHEN 'SEVERA' THEN 1
             WHEN 'MODERADA' THEN 2
             WHEN 'LEVE' THEN 3
             ELSE 4
           END`,
        params
      );

      // Evolución semanal de evaluaciones
      const [evolucionSemanal] = await pool.execute(
        `SELECT
           WEEK(rq.fechaEnvio, 1) as semana,
           YEAR(rq.fechaEnvio) as año,
           COUNT(*) as total_evaluaciones,
           SUM(CASE WHEN rq.completado = 1 THEN 1 ELSE 0 END) as completadas,
           SUM(CASE WHEN rq.severidad IN ('MODERADA', 'SEVERA') THEN 1 ELSE 0 END) as requieren_atencion
         FROM respuestas_quiz rq
         INNER JOIN usuarios u ON rq.usuarioId = u.id
         INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
         WHERE 1=1 ${dateFilter} ${institutionFilter}
         GROUP BY YEAR(rq.fechaEnvio), WEEK(rq.fechaEnvio, 1)
         ORDER BY año, semana`,
        params
      );

      // Casos que requieren canalización
      const [casosCanalizacion] = await pool.execute(
        `SELECT
           u.nombreCompleto,
           u.matricula,
           u.carrera,
           rq.severidad,
           q.titulo as evaluacion,
           rq.fechaEnvio,
           rq.puntajeTotal,
           COALESCE(c.estado, 'PENDIENTE') as estado_canalizacion
         FROM respuestas_quiz rq
         INNER JOIN usuarios u ON rq.usuarioId = u.id
         INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
         INNER JOIN quizzes q ON rq.quizId = q.id
         LEFT JOIN canalizaciones_psicologicas c ON rq.id = c.respuestaQuizId
         WHERE rq.completado = 1
           AND rq.severidad IN ('MODERADA', 'SEVERA')
           ${dateFilter} ${institutionFilter}
         ORDER BY
           CASE rq.severidad WHEN 'SEVERA' THEN 1 ELSE 2 END,
           rq.fechaEnvio DESC
         LIMIT 20`,
        params
      );

      res.json({
        success: true,
        data: {
          resumen: {
            ...evaluacionesResumen[0],
            casos_requieren_atencion: evaluacionesResumen[0].severas + evaluacionesResumen[0].moderadas,
            tasa_completion: evaluacionesResumen[0].total_evaluaciones > 0
              ? Math.round((evaluacionesResumen[0].completadas / evaluacionesResumen[0].total_evaluaciones) * 100)
              : 0
          },
          estudiantes_evaluados: estudiantesEvaluados,
          distribucion_quiz: distribucionQuiz,
          distribucion_severidad: distribucionSeveridad,
          evolucion_semanal: evolucionSemanal,
          casos_canalizacion: casosCanalizacion,
          periodo: {
            inicio: fechaInicio || "Últimos 30 días",
            fin: fechaFin || "Hoy"
          }
        }
      });

    } catch (error) {
      console.error("Error generando reporte de psicólogo:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
);

// GET /api/reports/export - Exportar datos en formato CSV
router.get("/export",
  ...requireRolesWithInstitution([
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL"
  ]),
  async (req, res) => {
    try {
      const { tipo = 'citas', fechaInicio, fechaFin } = req.query;
      const institucionId = req.institucionId;

      let query = "";
      let params = [];
      let filename = "";

      switch (tipo) {
        case 'citas':
          query = `SELECT
                     c.id,
                     c.fechaHora as fecha_hora,
                     c.duracion,
                     c.modalidad,
                     c.estado,
                     c.motivo,
                     u.nombreCompleto as estudiante,
                     u.matricula,
                     p.nombreCompleto as psicologo
                   FROM citas c
                   LEFT JOIN usuarios u ON c.usuarioId = u.id
                   LEFT JOIN usuarios p ON c.psicologoId = p.id
                   WHERE 1=1`;
          filename = 'reporte_citas';
          break;

        case 'evaluaciones':
          query = `SELECT
                     rq.id,
                     rq.fechaEnvio as fecha,
                     rq.puntajeTotal as puntaje,
                     rq.severidad,
                     q.titulo as evaluacion,
                     u.nombreCompleto as estudiante,
                     u.matricula
                   FROM respuestas_quiz rq
                   JOIN quizzes q ON rq.quizId = q.id
                   JOIN usuarios u ON rq.usuarioId = u.id
                   WHERE rq.completado = 1`;
          filename = 'reporte_evaluaciones';
          break;

        default:
          return res.status(400).json({
            success: false,
            message: "Tipo de exportación no válido"
          });
      }

      if (fechaInicio && fechaFin) {
        query += ` AND DATE(${tipo === 'citas' ? 'c.fechaHora' : 'rq.fechaEnvio'}) BETWEEN ? AND ?`;
        params.push(fechaInicio, fechaFin);
      }

      if (institucionId) {
        query += ` AND EXISTS (
          SELECT 1 FROM usuario_institucion ui
          WHERE ui.usuarioId = ${tipo === 'citas' ? 'p.id' : 'u.id'}
          AND ui.institucionId = ?
        )`;
        params.push(institucionId);
      }

      query += ` ORDER BY ${tipo === 'citas' ? 'c.fechaHora' : 'rq.fechaEnvio'} DESC`;

      const [data] = await pool.execute(query, params);

      // Convertir a CSV simple
      if (data.length === 0) {
        return res.json({
          success: true,
          data: [],
          message: "No hay datos para exportar en el período seleccionado"
        });
      }

      const headers = Object.keys(data[0]).join(',');
      const csvData = data.map(row =>
        Object.values(row).map(value =>
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      ).join('\n');

      const csv = headers + '\n' + csvData;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);

    } catch (error) {
      console.error("Error exportando datos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      });
    }
  }
);

module.exports = router;