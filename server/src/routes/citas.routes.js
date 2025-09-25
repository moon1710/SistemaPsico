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

// Student creates appointment request
router.post("/", authenticateToken, async (req, res) => {
  try {
    const instId = await getActiveInstitutionId(req);
    if (!instId)
      return res.status(400).json({ success: false, message: "Sin institución" });

    const {
      psicologoId,
      fechaHora,
      duracion = 60,
      modalidad = "PRESENCIAL",
      motivo,
      ubicacion,
      notas
    } = req.body;

    // Validate required fields
    if (!psicologoId || !fechaHora || !motivo) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: psicologoId, fechaHora, motivo"
      });
    }

    // Verify the psychologist exists and is available
    const [psychologist] = await pool.execute(
      `SELECT u.id FROM usuarios u
       INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
       WHERE u.id = ?
         AND ui.institucionId = ?
         AND ui.activo = 1
         AND ui.rolInstitucion IN ('PSICOLOGO', 'ORIENTADOR')
         AND u.status = 'ACTIVO'`,
      [psicologoId, String(instId)]
    );

    if (!psychologist.length) {
      return res.status(400).json({
        success: false,
        message: "Psicólogo no disponible"
      });
    }

    // Check for overlaps with existing appointments
    if (await hasOverlap(psicologoId, fechaHora, duracion)) {
      return res.status(409).json({
        success: false,
        message: "El horario seleccionado no está disponible"
      });
    }

    // Create the appointment request
    const [result] = await pool.execute(
      `INSERT INTO citas (
        id, institucionId, usuarioId, psicologoId, estado, source,
        fechaHora, duracion, modalidad, motivo, ubicacion, notas,
        fechaCreacion
      ) VALUES (UUID(), ?, ?, ?, 'SOLICITADA', 'STUDENT', ?, ?, ?, ?, ?, ?, NOW(3))`,
      [
        String(instId),
        String(req.user.id),
        String(psicologoId),
        new Date(fechaHora),
        Number(duracion),
        modalidad,
        motivo,
        ubicacion || null,
        notas || null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Solicitud de cita enviada exitosamente",
      appointmentId: result.insertId
    });

  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

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

/* ----------------- Psicólogos disponibles para estudiantes ----------------- */

// Obtener psicólogos disponibles para estudiantes
router.get("/psicologos", authenticateToken, async (req, res) => {
  try {
    const instId = await getActiveInstitutionId(req);
    if (!instId)
      return res.status(400).json({ success: false, message: "Sin institución" });

    const [psychologists] = await pool.execute(
      `SELECT DISTINCT u.id, u.nombre, u.apellidoPaterno, u.apellidoMaterno,
              CONCAT(u.nombre, ' ', u.apellidoPaterno, ' ', COALESCE(u.apellidoMaterno, '')) as nombreCompleto,
              u.cedulaProfesional, u.especialidades
       FROM usuarios u
       INNER JOIN usuario_institucion ui ON u.id = ui.usuarioId
       INNER JOIN disponibilidad_psicologo dp ON u.id = dp.psicologoId
       WHERE ui.institucionId = ?
         AND ui.activo = 1
         AND ui.rolInstitucion IN ('PSICOLOGO', 'ORIENTADOR')
         AND dp.activo = 1
         AND u.status = 'ACTIVO'
       ORDER BY u.nombre, u.apellidoPaterno`,
      [String(instId)]
    );

    res.json({ success: true, data: psychologists });
  } catch (error) {
    console.error("Error getting psychologists:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// Obtener disponibilidad de un psicólogo por fecha
router.get("/disponibilidad/:psicologoId", authenticateToken, async (req, res) => {
  try {
    const instId = await getActiveInstitutionId(req);
    if (!instId)
      return res.status(400).json({ success: false, message: "Sin institución" });

    const { psicologoId } = req.params;
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({
        success: false,
        message: "Fecha requerida"
      });
    }

    const fechaObj = new Date(fecha);
    const diaSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'][fechaObj.getDay()];

    // Obtener horarios configurados para ese día
    const [disponibilidad] = await pool.execute(
      `SELECT horaInicio, horaFin FROM disponibilidad_psicologo
       WHERE psicologoId = ? AND diaSemana = ? AND activo = 1`,
      [psicologoId, diaSemana]
    );

    if (!disponibilidad.length) {
      return res.json({ success: true, data: [] });
    }

    // Obtener citas ya programadas para esa fecha
    const [citasOcupadas] = await pool.execute(
      `SELECT TIME(fechaHora) as hora, duracion FROM citas
       WHERE psicologoId = ?
         AND DATE(fechaHora) = ?
         AND estado IN ('PROGRAMADA', 'CONFIRMADA', 'EN_PROGRESO')
       ORDER BY fechaHora`,
      [psicologoId, fecha]
    );

    // Generar slots disponibles
    const slotsDisponibles = [];
    const duracionSlot = 60; // minutos por defecto

    for (const horario of disponibilidad) {
      const [horaInicioHour, horaInicioMin] = horario.horaInicio.split(':').map(Number);
      const [horaFinHour, horaFinMin] = horario.horaFin.split(':').map(Number);

      const inicioMinutos = horaInicioHour * 60 + horaInicioMin;
      const finMinutos = horaFinHour * 60 + horaFinMin;

      for (let minutos = inicioMinutos; minutos < finMinutos; minutos += duracionSlot) {
        const hora = Math.floor(minutos / 60);
        const min = minutos % 60;
        const horaStr = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

        // Verificar si el slot está ocupado
        const estaOcupado = citasOcupadas.some(cita => {
          const citaHora = cita.hora;
          const citaMinutos = parseInt(citaHora.split(':')[0]) * 60 + parseInt(citaHora.split(':')[1]);
          const citaFin = citaMinutos + (cita.duracion || 60);
          const slotFin = minutos + duracionSlot;

          // Verificar si hay solapamiento
          return (minutos < citaFin && slotFin > citaMinutos);
        });

        if (!estaOcupado) {
          slotsDisponibles.push(horaStr);
        }
      }
    }

    res.json({ success: true, data: slotsDisponibles });
  } catch (error) {
    console.error("Error getting availability:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

/* ----------------- Disponibilidad ----------------- */

// Obtener disponibilidad del psicólogo actual
router.get(
  "/disponibilidad",
  authenticateToken,
  async (req, res) => {
    try {
      // Verificar que el usuario tenga rol de psicólogo en alguna institución
      const userRoles = req.user.instituciones?.map(inst => inst.rol) || [];
      if (!userRoles.includes('PSICOLOGO') && !userRoles.includes('ORIENTADOR')) {
        return res.status(403).json({
          success: false,
          message: "Solo psicólogos y orientadores pueden gestionar disponibilidad"
        });
      }

      const psicologoId = req.user.id;

      const [disponibilidad] = await pool.execute(
        `SELECT * FROM disponibilidad_psicologo
         WHERE psicologoId = ? AND activo = 1
         ORDER BY FIELD(diaSemana, 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'), horaInicio`,
        [psicologoId]
      );

      res.json({
        success: true,
        data: disponibilidad,
      });
    } catch (error) {
      console.error("Error obteniendo disponibilidad:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
);

// Actualizar disponibilidad del psicólogo
router.put(
  "/disponibilidad",
  authenticateToken,
  async (req, res) => {
    try {
      // Verificar que el usuario tenga rol de psicólogo en alguna institución
      const userRoles = req.user.instituciones?.map(inst => inst.rol) || [];
      if (!userRoles.includes('PSICOLOGO') && !userRoles.includes('ORIENTADOR')) {
        return res.status(403).json({
          success: false,
          message: "Solo psicólogos y orientadores pueden gestionar disponibilidad"
        });
      }

      const psicologoId = req.user.id;
      const { horarios = {}, configuracion = {} } = req.body;

      console.log('🔥 [DISPONIBILIDAD] Actualizando para psicólogo:', psicologoId);
      console.log('📅 [DISPONIBILIDAD] Horarios recibidos:', JSON.stringify(horarios, null, 2));
      console.log('⚙️ [DISPONIBILIDAD] Configuración recibida:', JSON.stringify(configuracion, null, 2));

      // Convertir horarios del frontend al formato que esperamos
      const disponibilidad = [];
      for (const [diaSemana, horario] of Object.entries(horarios)) {
        // Verificar que horario no sea null/undefined y tenga las propiedades necesarias
        if (horario && horario.activo && horario.horaInicio && horario.horaFin) {
          disponibilidad.push({
            diaSemana,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            activo: true
          });
        }
      }

      console.log('🔄 [DISPONIBILIDAD] Disponibilidad convertida:', JSON.stringify(disponibilidad, null, 2));

      // Iniciar transacción
      const conn = await pool.getConnection();
      await conn.beginTransaction();

      try {
        // Primero, desactivar toda la disponibilidad existente
        await conn.execute(
          `UPDATE disponibilidad_psicologo SET activo = 0 WHERE psicologoId = ?`,
          [psicologoId]
        );

        console.log('✅ [DISPONIBILIDAD] Disponibilidad anterior desactivada');

        // Procesar nueva disponibilidad
        for (const item of disponibilidad) {
          const { diaSemana, horaInicio, horaFin, activo = true } = item;

          if (!diaSemana || !horaInicio || !horaFin) {
            console.log('⚠️ [DISPONIBILIDAD] Saltando item incompleto:', item);
            continue;
          }

          // Verificar si ya existe un registro para este psicólogo y día
          const [existingRecord] = await conn.execute(
            `SELECT id FROM disponibilidad_psicologo
             WHERE psicologoId = ? AND diaSemana = ?`,
            [psicologoId, diaSemana]
          );

          if (existingRecord.length > 0) {
            // Actualizar registro existente
            await conn.execute(
              `UPDATE disponibilidad_psicologo
               SET horaInicio = ?, horaFin = ?, activo = ?
               WHERE psicologoId = ? AND diaSemana = ?`,
              [horaInicio, horaFin, activo ? 1 : 0, psicologoId, diaSemana]
            );
            console.log('🔄 [DISPONIBILIDAD] Actualizado:', { diaSemana, horaInicio, horaFin, activo });
          } else {
            // Insertar nuevo registro
            await conn.execute(
              `INSERT INTO disponibilidad_psicologo (psicologoId, diaSemana, horaInicio, horaFin, activo)
               VALUES (?, ?, ?, ?, ?)`,
              [psicologoId, diaSemana, horaInicio, horaFin, activo ? 1 : 0]
            );
            console.log('➕ [DISPONIBILIDAD] Insertado:', { diaSemana, horaInicio, horaFin, activo });
          }
        }

        await conn.commit();
        console.log('✅ [DISPONIBILIDAD] Transacción completada exitosamente');

        res.json({
          success: true,
          message: "Disponibilidad actualizada exitosamente",
        });

      } catch (error) {
        await conn.rollback();
        console.error("❌ [DISPONIBILIDAD] Error en transacción:", error);
        throw error;
      } finally {
        conn.release();
      }

    } catch (error) {
      console.error("❌ [DISPONIBILIDAD] Error actualizando disponibilidad:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor: " + error.message,
      });
    }
  }
);

module.exports = router;
