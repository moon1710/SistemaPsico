// src/routes/quizzes.routes.js
const express = require("express");
const { pool } = require("../db"); // Asegúrate de que '../db' exporta el pool de MySQL (mysql2/promise)
const {
  authenticateToken,
  requirePsychologist,
  resolveInstitutionId,
  requireRolesWithInstitution,
} = require("../middlewares/auth.middleware"); // Ajusta la ruta si tu middleware está en otro directorio
const { randomUUID } = require("crypto");

const router = express.Router();

/* ------------------------- Helpers de cálculo de severidad ------------------------- */
/**
 * Determina la categoría de severidad en función del puntaje total y el código del quiz.
 * Soporta BAI (Inventario de Ansiedad de Beck) y BDI-II (Inventario de Depresión de Beck II).
 */
function mapSeveridad(codigo, score) {
  if (String(codigo).toUpperCase() === "BAI") {
    // Categorías para BAI (0–63)
    if (score <= 7) return "MINIMA";
    if (score <= 15) return "LEVE";
    if (score <= 25) return "MODERADA";
    return "SEVERA";
  }
  // Categorías para BDI-II (0–63)
  if (score <= 13) return "MINIMA";
  if (score <= 19) return "LEVE";
  if (score <= 28) return "MODERADA";
  return "SEVERA";
}

/**
 * Verifica si el usuario autenticado tiene acceso al quiz especificado (por ID).
 * - Quizzes públicos y activos: accesibles para cualquier usuario autenticado.
 * - Quizzes no públicos: solo accesibles por SUPER_ADMIN_NACIONAL (por ejemplo, para fines de administración).
 * - (En caso de implementar quizzes privados por institución, aquí se validaría la pertenencia a la institución dueña del quiz).
 */
async function ensureQuizAccessForUser(quizId, user) {
  const [rows] = await pool.execute(
    `SELECT q.id, q.institucionId, q.titulo, q.codigo, q.version, q.activo, q.publico
     FROM quizzes q
     WHERE q.id = ?`,
    [quizId]
  );
  if (!rows.length) return null;
  const quiz = rows[0];

  // Si el quiz es público y está activo, cualquier usuario autenticado puede acceder
  if (quiz.publico === 1 && quiz.activo === 1) {
    return quiz;
  }
  // Acceso para súper administradores nacionales aunque el quiz no sea público/activo
  if (user?.rol === "SUPER_ADMIN_NACIONAL") {
    return quiz;
  }
  // Si quisieras manejar quizzes privados por institución, validar aquí (ej: user.institucionId === quiz.institucionId)
  return null;
}

/* ----------------------------- Definición de Rutas ----------------------------- */

/**
 * GET /api/quizzes/public
 * Lista todos los quizzes públicos y activos disponibles globalmente.
 * (Requiere token JWT válido para verificar rol e institución del usuario, aunque todos los usuarios autenticados pueden ver estos quizzes).
 */
router.get("/public", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT q.id, q.titulo, q.descripcion, q.codigo, q.version
       FROM quizzes q
       WHERE q.activo = 1 AND q.publico = 1
       ORDER BY q.codigo, q.version DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET /api/quizzes/public error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});
/**
 * GET /api/quizzes/me/results
 * Obtiene todos los resultados (intentos enviados) del usuario autenticado (estudiante).
 * Devuelve la lista de intentos con información básica del quiz y la puntuación obtenida.
 */
router.get("/me/results", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT rq.id, rq.quizId, q.titulo, q.codigo, q.version,
              rq.puntajeTotal, rq.severidad, rq.fechaEnvio
       FROM respuestas_quiz rq
       JOIN quizzes q ON q.id = rq.quizId
       WHERE rq.usuarioId = ?
       ORDER BY rq.fechaEnvio DESC`,
      [req.user.id]
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("GET /api/quizzes/me/results error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});
/**
 * GET /api/quizzes/resultados
 * Listado de resultados de quizzes (intentos) para personal autorizado (psicólogos, orientadores, administradores).
 * Parámetros query opcionales para filtrar:
 *   - institucionId: filtra los resultados de alumnos de esa institución (requerido para roles que no sean superadmin).
 *   - codigo: filtra por código de cuestionario (p.ej., "BAI" o "BDI2").
 *   - severidad: filtra por nivel de severidad (MINIMA, LEVE, MODERADA, SEVERA).
 *   - page, pageSize: para paginación (valores por defecto 1 y 20).
 * Requiere estar autenticado y tener rol de PSICOLOGO, ORIENTADOR, ADMIN_INSTITUCION o SUPER_ADMIN_NACIONAL.
 */
router.get(
  "/resultados",
  ...requireRolesWithInstitution([
    "PSICOLOGO",
    "ORIENTADOR",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  async (req, res) => {
    try {
      // requireInstitutionAccess ya puso esto:
      const institucionId = req.institucionId; // viene de header/query/body
      const {
        codigo = null,
        severidad = null,
        page = 1,
        pageSize = 20,
      } = req.query;

      const limit = Math.max(1, Number(pageSize) || 20);
      const offset = Math.max(0, (Number(page) - 1 || 0) * limit);

      const params = [String(institucionId)];
      let extra = "";

      if (codigo) {
        extra += " AND q.codigo = ? ";
        params.push(String(codigo));
      }
      if (severidad) {
        extra += " AND rq.severidad = ? ";
        params.push(String(severidad));
      }

      // 👇 Filtra por membresía del ESTUDIANTE en esa institución
      const sql = `
        SELECT
          rq.id,
          rq.fechaEnvio,
          rq.puntajeTotal,
          rq.severidad,
          q.id   AS quizId,
          q.titulo,
          q.codigo,
          q.version,
          u.id   AS estudianteId,
          u.nombre AS estudianteNombre,
          u.apellidoPaterno,
          u.apellidoMaterno
        FROM respuestas_quiz rq
        JOIN quizzes q ON q.id = rq.quizId
        JOIN usuarios u ON u.id = rq.usuarioId
        JOIN usuario_institucion ui
          ON ui.usuarioId = u.id
         AND ui.institucionId = ?
         AND ui.activo = 1
        WHERE 1=1
          ${extra}
        ORDER BY rq.fechaEnvio DESC
        LIMIT ? OFFSET ?`;

      const [rows] = await pool.execute(sql, [...params, limit, offset]);

      return res.json({
        success: true,
        data: rows,
        page: Number(page) || 1,
        pageSize: limit,
      });
    } catch (err) {
      // Logs útiles para depurar si vuelve a ocurrir
      console.error("[/quizzes/resultados] error:", {
        code: err?.code,
        errno: err?.errno,
        sqlState: err?.sqlState,
        message: err?.message,
        sql: err?.sql?.slice?.(0, 300),
      });
      return res
        .status(500)
        .json({ success: false, message: "Error interno del servidor" });
    }
  }
);

/**
 * GET /api/quizzes/:quizId
 * Devuelve los metadatos del quiz especificado (si el usuario tiene acceso) junto con su lista de preguntas.
 */
router.get("/:quizId", authenticateToken, async (req, res) => {
  try {
    const quiz = await ensureQuizAccessForUser(req.params.quizId, req.user);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz no encontrado o sin acceso",
        code: "QUIZ_NOT_FOUND",
      });
    }
    // Obtener preguntas del quiz
    const [preguntas] = await pool.execute(
      `SELECT p.id, p.orden, p.texto, p.tipo, p.opciones, p.obligatoria
       FROM preguntas p
       WHERE p.quizId = ?
       ORDER BY p.orden ASC`,
      [quiz.id]
    );
    return res.json({
      success: true,
      data: {
        quiz: {
          id: quiz.id,
          titulo: quiz.titulo,
          codigo: quiz.codigo,
          version: quiz.version,
          descripcion: quiz.descripcion,
        },
        preguntas: preguntas,
      },
    });
  } catch (err) {
    console.error("GET /api/quizzes/:quizId error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});

/**
 * POST /api/quizzes/:quizId/submit
 * Guarda un intento de quiz (las respuestas de un usuario) en la base de datos.
 * Body esperado: { respuestas: [{ preguntaId, valor } ...], consentimientoAceptado?: boolean, tiempoInicio?: ISOString }
 * - Calcula el puntaje total sumando los valores (0–3) de cada respuesta.
 * - Determina la severidad según el puntaje total y el código del quiz (BAI o BDI-II).
 * - Guarda el registro en la tabla respuestas_quiz (con JSON de respuestas, puntajeTotal, severidad, etc).
 */
router.post("/:quizId/submit", authenticateToken, async (req, res) => {
  try {
    const quiz = await ensureQuizAccessForUser(req.params.quizId, req.user);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz no encontrado o sin acceso",
        code: "QUIZ_NOT_FOUND",
      });
    }
    const { respuestas = [], consentimientoAceptado, tiempoInicio } = req.body;

    // 1) Calcular puntaje total sumando los valores numéricos de las respuestas
    let score = 0;
    for (const r of respuestas) {
      const valor = Number(r?.valor ?? 0);
      if (!Number.isFinite(valor)) continue;
      score += valor;
    }
    const severidad = mapSeveridad(quiz.codigo, score);

    // 2) Insertar el intento en la base de datos
    const attemptId = randomUUID();
    const respuestasJSON = JSON.stringify({
      consentimientoAceptado: !!consentimientoAceptado,
      items: respuestas,
    });
    const inicio = tiempoInicio ? new Date(tiempoInicio) : null;
    const fin = new Date(); // marca el momento de envío actual

    await pool.execute(
      `INSERT INTO respuestas_quiz
       (id, usuarioId, quizId, respuestas, puntajeTotal, severidad, completado, tiempoInicio, tiempoFin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        attemptId,
        req.user.id,
        quiz.id,
        respuestasJSON,
        score,
        severidad,
        1, // completado = 1 (true)
        inicio,
        fin,
      ]
    );

    return res.status(201).json({
      success: true,
      data: {
        attemptId: attemptId,
        quiz: {
          id: quiz.id,
          codigo: quiz.codigo,
          titulo: quiz.titulo,
          version: quiz.version,
        },
        puntajeTotal: score,
        severidad: severidad,
        fechaEnvio: fin, // opcional: se puede devolver la fecha/hora de envío
      },
    });
  } catch (err) {
    console.error("POST /api/quizzes/:quizId/submit error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor" });
  }
});


module.exports = router;
