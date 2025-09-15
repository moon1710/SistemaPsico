const express = require("express");
const { pool } = require("../db");
const {
  authenticateToken,
  requireRolesWithInstitution,
  resolveInstitutionId,
} = require("../middlewares/auth.middleware");

const router = express.Router();

async function getActiveInstitutionId(req) {
  return (
    resolveInstitutionId(req) ||
    (req.user.instituciones || []).find((m) => m.isMembershipActiva)
      ?.institucionId ||
    null
  );
}

// overlap check using fechaHora + duracion
async function hasOverlap(psicologoId, fechaHora, duracion, excludeId = null) {
  const [rows] = await pool.execute(
    `SELECT COUNT(*) AS n
       FROM citas
      WHERE psicologoId = ?
        AND estado IN ('ASIGNADA','PROGRAMADA','CONFIRMADA','EN_PROGRESO')
        AND fechaHora IS NOT NULL
        -- (A starts before B ends) AND (A ends after B starts)
        AND fechaHora < DATE_ADD(?, INTERVAL ? MINUTE)
        AND DATE_ADD(fechaHora, INTERVAL duracion MINUTE) > ?
        ${excludeId ? "AND id <> ?" : ""}`,
    excludeId
      ? [
          String(psicologoId),
          new Date(fechaHora),
          Number(duracion),
          new Date(fechaHora),
          String(excludeId),
        ]
      : [
          String(psicologoId),
          new Date(fechaHora),
          Number(duracion),
          new Date(fechaHora),
        ]
  );
  return Number(rows[0]?.n || 0) > 0;
}

/* ----------------- Lists ----------------- */

// Psych: open requests (to claim)
router.get(
  "/requests/open",
  ...requireRolesWithInstitution([
    "ORIENTADOR",
    "PSICOLOGO",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  async (req, res) => {
    const instId = req.institucionId;
    const [rows] = await pool.execute(
      `SELECT id, usuarioId, respuestaId, severidad, fechaCreacion
         FROM citas
        WHERE institucionId = ? AND estado = 'SOLICITADA' AND psicologoId IS NULL
        ORDER BY fechaCreacion DESC
        LIMIT 200`,
      [String(instId)]
    );
    res.json({ success: true, data: rows });
  }
);

// Psych: mine (claimed + booked)
router.get(
  "/mine",
  ...requireRolesWithInstitution([
    "ORIENTADOR",
    "PSICOLOGO",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  async (req, res) => {
    const instId = req.institucionId;
    const [rows] = await pool.execute(
      `SELECT *
         FROM citas
        WHERE institucionId = ?
          AND psicologoId = ?
          AND estado IN ('ASIGNADA','PROGRAMADA','CONFIRMADA','EN_PROGRESO')
        ORDER BY (fechaHora IS NULL) DESC, fechaHora ASC
        LIMIT 200`,
      [String(instId), String(req.user.id)]
    );
    res.json({ success: true, data: rows });
  }
);

// Student: see published OPEN slots
router.get("/slots", authenticateToken, async (req, res) => {
  const instId = await getActiveInstitutionId(req);
  if (!instId)
    return res.status(400).json({ success: false, message: "Sin institución" });

  const { from = null, to = null, psicologoId = null } = req.query;
  const where = ["institucionId = ?", "estado = 'ABIERTA'"];
  const params = [String(instId)];
  if (from) {
    where.push("fechaHora >= ?");
    params.push(new Date(from));
  }
  if (to) {
    where.push("DATE_ADD(fechaHora, INTERVAL duracion MINUTE) <= ?");
    params.push(new Date(to));
  }
  if (psicologoId) {
    where.push("psicologoId = ?");
    params.push(String(psicologoId));
  }

  const [rows] = await pool.execute(
    `SELECT id, psicologoId, fechaHora, duracion
         FROM citas
        WHERE ${where.join(" AND ")}
        ORDER BY fechaHora ASC
        LIMIT 500`,
    params
  );
  res.json({ success: true, data: rows });
});

/* ----------------- Actions ----------------- */

// Claim a request (first writer wins)
router.post(
  "/:id/claim",
  ...requireRolesWithInstitution([
    "ORIENTADOR",
    "PSICOLOGO",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  async (req, res) => {
    const instId = req.institucionId;
    const id = req.params.id;
    const [upd] = await pool.execute(
      `UPDATE citas
          SET estado='ASIGNADA', psicologoId=?, holdUntil=DATE_ADD(NOW(3), INTERVAL 30 MINUTE)
        WHERE id=? AND institucionId=? AND estado='SOLICITADA' AND psicologoId IS NULL`,
      [String(req.user.id), id, String(instId)]
    );
    if (upd.affectedRows === 0)
      return res
        .status(409)
        .json({
          success: false,
          message: "Ya fue tomada o no está SOLICITADA",
        });
    res.json({ success: true });
  }
);

// Release a claim (back to SOLICITADA)
router.post(
  "/:id/release",
  ...requireRolesWithInstitution([
    "ORIENTADOR",
    "PSICOLOGO",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  async (req, res) => {
    const instId = req.institucionId;
    const id = req.params.id;
    const [upd] = await pool.execute(
      `UPDATE citas
          SET estado='SOLICITADA', psicologoId=NULL, holdUntil=NULL
        WHERE id=? AND institucionId=? AND estado='ASIGNADA' AND psicologoId=?`,
      [id, String(instId), String(req.user.id)]
    );
    if (upd.affectedRows === 0)
      return res
        .status(409)
        .json({
          success: false,
          message: "No tienes el claim o ya cambió de estado",
        });
    res.json({ success: true });
  }
);

// Schedule a claimed request → PROGRAMADA
router.post(
  "/:id/schedule",
  ...requireRolesWithInstitution([
    "ORIENTADOR",
    "PSICOLOGO",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  async (req, res) => {
    const instId = req.institucionId;
    const id = req.params.id;
    const { fechaHora, duracion = 60 } = req.body;
    if (!fechaHora)
      return res
        .status(400)
        .json({ success: false, message: "fechaHora requerida" });

    // Verify ownership
    const [rows] = await pool.execute(
      `SELECT id, psicologoId FROM citas
        WHERE id=? AND institucionId=? AND estado='ASIGNADA'`,
      [id, String(instId)]
    );
    if (!rows.length || rows[0].psicologoId !== req.user.id)
      return res
        .status(403)
        .json({ success: false, message: "Debes tener el claim" });

    // No overlaps
    if (await hasOverlap(req.user.id, fechaHora, duracion, id))
      return res
        .status(409)
        .json({ success: false, message: "Conflicto de horario" });

    const [upd] = await pool.execute(
      `UPDATE citas
          SET estado='PROGRAMADA', fechaHora=?, duracion=?, holdUntil=NULL
        WHERE id=? AND institucionId=? AND estado='ASIGNADA' AND psicologoId=?`,
      [
        new Date(fechaHora),
        Number(duracion),
        id,
        String(instId),
        String(req.user.id),
      ]
    );
    if (upd.affectedRows === 0)
      return res
        .status(409)
        .json({ success: false, message: "No se pudo programar" });
    res.json({ success: true });
  }
);

// Psych publishes OPEN slots (ABIERTA)
router.post(
  "/slots",
  ...requireRolesWithInstitution([
    "ORIENTADOR",
    "PSICOLOGO",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  async (req, res) => {
    const instId = req.institucionId;
    const { blocks = [] } = req.body; // [{fechaHora, duracion}]
    if (!Array.isArray(blocks) || !blocks.length)
      return res.status(400).json({ success: false, message: "blocks vacío" });

    // (Optional) prevent overlaps here too if you want
    const values = [];
    for (const b of blocks) {
      if (!b.fechaHora) continue;
      values.push([
        String(instId),
        String(req.user.id),
        new Date(b.fechaHora),
        Number(b.duracion || 60),
      ]);
    }
    if (!values.length)
      return res
        .status(400)
        .json({ success: false, message: "blocks inválidos" });

    await pool.query(
      `INSERT INTO citas (id, institucionId, psicologoId, estado, source, fechaHora, duracion, fechaCreacion)
       VALUES ${values
         .map(() => "(UUID(), ?, ?, 'ABIERTA', 'STAFF', ?, ?, NOW(3))")
         .join(",")}`,
      values.flat()
    );
    res.status(201).json({ success: true, inserted: values.length });
  }
);

// Student books an OPEN slot → PROGRAMADA for that student
router.post("/slots/:id/book", authenticateToken, async (req, res) => {
  const instId = await getActiveInstitutionId(req);
  if (!instId)
    return res.status(400).json({ success: false, message: "Sin institución" });

  const id = req.params.id;
  const [slot] = await pool.execute(
    `SELECT id FROM citas WHERE id=? AND institucionId=? AND estado='ABIERTA'`,
    [id, String(instId)]
  );
  if (!slot.length)
    return res
      .status(404)
      .json({ success: false, message: "Slot no disponible" });

  const [upd] = await pool.execute(
    `UPDATE citas
          SET estado='PROGRAMADA', usuarioId=?
        WHERE id=? AND institucionId=? AND estado='ABIERTA'`,
    [String(req.user.id), id, String(instId)]
  );
  if (upd.affectedRows === 0)
    return res
      .status(409)
      .json({ success: false, message: "Otro usuario tomó el slot" });
  res.json({ success: true });
});

// Close / Cancel / No-show
router.post(
  "/:id/status",
  ...requireRolesWithInstitution([
    "ORIENTADOR",
    "PSICOLOGO",
    "ADMIN_INSTITUCION",
    "SUPER_ADMIN_INSTITUCION",
    "SUPER_ADMIN_NACIONAL",
  ]),
  async (req, res) => {
    const instId = req.institucionId;
    const id = req.params.id;
    const { estado } = req.body; // 'COMPLETADA'|'CANCELADA'|'NO_ASISTIO'|'EN_PROGRESO'|'CONFIRMADA'
    const allowed = [
      "COMPLETADA",
      "CANCELADA",
      "NO_ASISTIO",
      "EN_PROGRESO",
      "CONFIRMADA",
    ];
    if (!allowed.includes(String(estado)))
      return res
        .status(400)
        .json({ success: false, message: "estado inválido" });

    const [upd] = await pool.execute(
      `UPDATE citas SET estado=?, updatedAt=NOW(3) WHERE id=? AND institucionId=?`,
      [String(estado), id, String(instId)]
    );
    if (upd.affectedRows === 0)
      return res
        .status(409)
        .json({ success: false, message: "No se pudo cambiar el estado" });
    res.json({ success: true });
  }
);

module.exports = router;
