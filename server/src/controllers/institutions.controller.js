// controllers/institutions.controller.js
const { validationResult } = require("express-validator");
const { pool } = require("../db");

/**
 * Obtener todas las instituciones con filtros y búsqueda
 */
// controllers/institutions.controller.js
const getInstitutions = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    console.log("🏛️ [CONTROLLER] Getting institutions with params:", req.query);

    // ✅ Normaliza números (evita NaN y strings raros)
    const pageNum = Math.max(
      Number.parseInt(String(req.query.page || "1"), 10) || 1,
      1
    );
    const limitNum = Math.min(
      Math.max(Number.parseInt(String(req.query.limit || "10"), 10) || 10, 1),
      100
    );
    const offsetNum = (pageNum - 1) * limitNum;

    // Log por si vuelve a fallar
    console.log("🏛️ [DEBUG] page/limit/offset:", pageNum, limitNum, offsetNum);

    // ✅ Normaliza strings
    const search = String(req.query.search || "").trim();
    const status = String(req.query.status || "").trim();
    const estado = String(req.query.estado || "").trim();

    // ✅ Whitelist de sortBy (evita SQL injection y columnas invalidas)
    const allowedSortBy = new Set(["status", "createdAt", "nombre"]);
    const sortBy = allowedSortBy.has(String(req.query.sortBy || "status"))
      ? String(req.query.sortBy)
      : "status";
    const sortOrder =
      String(req.query.sortOrder || "asc").toLowerCase() === "desc"
        ? "desc"
        : "asc";

    let baseQuery = `
      FROM instituciones i
      WHERE 1=1
    `;

    const queryParams = [];

    if (search) {
      baseQuery += ` AND (
        i.nombre LIKE ? OR
        i.codigo LIKE ? OR
        i.responsableNombre LIKE ? OR
        i.responsableEmail LIKE ?
      )`;
      const s = `%${search}%`;
      queryParams.push(s, s, s, s);
    }

    if (status) {
      baseQuery += ` AND i.status = ?`;
      queryParams.push(status);
    }

    if (estado) {
      baseQuery += ` AND i.estado = ?`;
      queryParams.push(estado);
    }

    // ORDER BY seguro
    let orderClause = "";
    if (sortBy === "status") {
      orderClause = ` ORDER BY
        CASE
          WHEN i.status = 'PENDIENTE_APROBACION' THEN 1
          WHEN i.status = 'ACTIVA' THEN 2
          WHEN i.status = 'SUSPENDIDA' THEN 3
          WHEN i.status = 'INACTIVA' THEN 4
          ELSE 5
        END ${sortOrder},
        i.createdAt DESC
      `;
    } else if (sortBy === "createdAt") {
      orderClause = ` ORDER BY i.createdAt ${sortOrder}`;
    } else {
      orderClause = ` ORDER BY i.nombre ${sortOrder}`;
    }

    // Total
    const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
    const [totalResult] = await conn.execute(countQuery, queryParams);
    const total = Number(totalResult?.[0]?.total || 0);

    // ✅ IMPORTANTE:
    // Para evitar "Incorrect arguments to mysqld_stmt_execute" con LIMIT/OFFSET placeholders,
    // metemos LIMIT/OFFSET como números interpolados (ya sanitizados) en vez de "?".
    // (Porque algunos drivers/configs de MySQL se ponen estrictos con LIMIT ? OFFSET ?)
    const dataQuery = `
      SELECT
        i.id,
        i.codigo,
        i.nombre,
        i.nombreCorto,
        i.tipoInstitucion,
        i.nivelEducativo,
        i.direccion,
        i.ciudad,
        i.estado,
        i.codigoPostal,
        i.telefono,
        i.emailInstitucional,
        i.sitioWeb,
        i.responsableNombre,
        i.responsableEmail,
        i.responsableTelefono,
        i.responsableCargo,
        i.status,
        i.fechaActivacion,
        i.fechaVencimiento,
        i.maxUsuarios,
        i.createdAt,
        i.updatedAt,
        NULL as descripcion,
        NULL as logoUrl,
        0 as totalUsuarios,
        0 as admins,
        0 as psicologos,
        0 as estudiantes
      ${baseQuery}
      ${orderClause}
      LIMIT ${limitNum} OFFSET ${offsetNum}
    `;

    console.log("🏛️ [DEBUG] dataQuery:", dataQuery);
    console.log("🏛️ [DEBUG] queryParams:", queryParams);

    const [institutions] = await conn.execute(dataQuery, queryParams);

    // Stats
    const [statsResult] = await conn.execute(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'ACTIVA' THEN 1 END) as activas,
        COUNT(CASE WHEN status = 'PENDIENTE_APROBACION' THEN 1 END) as pendientes,
        COUNT(CASE WHEN status = 'SUSPENDIDA' THEN 1 END) as suspendidas,
        COUNT(CASE WHEN status = 'INACTIVA' THEN 1 END) as inactivas
      FROM instituciones
    `);

    const stats = statsResult?.[0] || {};

    res.json({
      success: true,
      data: {
        institutions,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
        stats,
      },
    });
  } catch (error) {
    console.error("🏛️ [CONTROLLER] Error obteniendo instituciones:", error);
    res.status(500).json({
      success: false,
      message: "Error obteniendo instituciones",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  } finally {
    conn.release();
  }
};


/**
 * Obtener detalles de una institución específica
 */
const getInstitutionById = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;

    // Obtener información de la institución
    const [institutionResult] = await conn.execute(`
      SELECT
        i.*,
        (SELECT COUNT(*) FROM usuarios WHERE institucionId = i.id) as totalUsuarios,
        (SELECT COUNT(*) FROM usuarios WHERE institucionId = i.id AND rol = 'ADMIN_INSTITUCION') as admins,
        (SELECT COUNT(*) FROM usuarios WHERE institucionId = i.id AND rol = 'PSICOLOGO') as psicologos,
        (SELECT COUNT(*) FROM usuarios WHERE institucionId = i.id AND rol = 'ESTUDIANTE') as estudiantes,
        (SELECT COUNT(*) FROM carreras WHERE institucionId = i.id AND activa = true) as carrerasActivas
      FROM instituciones i
      WHERE i.id = ?
    `, [id]);

    if (institutionResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Institución no encontrada"
      });
    }

    const institution = institutionResult[0];

    // Obtener usuarios de la institución
    const [users] = await conn.execute(`
      SELECT
        id,
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        rol,
        status,
        matricula,
        numeroEmpleado,
        createdAt,
        lastLogin
      FROM usuarios
      WHERE institucionId = ?
      ORDER BY
        CASE rol
          WHEN 'ADMIN_INSTITUCION' THEN 1
          WHEN 'PSICOLOGO' THEN 2
          WHEN 'ORIENTADOR' THEN 3
          WHEN 'ESTUDIANTE' THEN 4
          ELSE 5
        END,
        createdAt DESC
      LIMIT 50
    `, [id]);

    // Obtener carreras
    const [carreras] = await conn.execute(`
      SELECT
        id,
        codigo,
        nombre,
        nombreCorto,
        areaConocimiento,
        duracionSemestres,
        modalidad,
        activa,
        (SELECT COUNT(*) FROM usuarios WHERE carreraId = c.id) as estudiantes
      FROM carreras c
      WHERE c.institucionId = ?
      ORDER BY c.nombre
    `, [id]);

    // Obtener historial de cambios (solicitudes relacionadas)
    const [history] = await conn.execute(`
      SELECT
        id,
        status as historyStatus,
        notasAdmin,
        createdAt,
        updatedAt,
        motivoRechazo
      FROM solicitudes_acceso
      WHERE institucionNombre LIKE ? OR institucionId = ?
      ORDER BY createdAt DESC
      LIMIT 10
    `, [`%${institution.nombre}%`, id]);

    res.json({
      success: true,
      data: {
        institution,
        users,
        carreras,
        history
      }
    });

  } catch (error) {
    console.error("Error obteniendo detalles de institución:", error.message);
    res.status(500).json({
      success: false,
      message: "Error obteniendo detalles de institución"
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Aprobar una institución (cambiar de PENDIENTE_APROBACION a ACTIVA)
 */
const approveInstitution = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    const { notas } = req.body;
    const adminId = req.user.id; // Del middleware de autenticación

    await conn.beginTransaction();

    // Verificar que la institución existe y está pendiente
    const [institutionResult] = await conn.execute(`
      SELECT * FROM instituciones WHERE id = ? AND status = 'PENDIENTE_APROBACION'
    `, [id]);

    if (institutionResult.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Institución no encontrada o no está pendiente de aprobación"
      });
    }

    const institution = institutionResult[0];

    // Actualizar status a ACTIVA
    await conn.execute(`
      UPDATE instituciones
      SET
        status = 'ACTIVA',
        fechaActivacion = NOW(),
        updatedAt = NOW()
      WHERE id = ?
    `, [id]);

    // Buscar solicitud relacionada para actualizarla también
    await conn.execute(`
      UPDATE solicitudes_acceso
      SET
        status = 'APROBADA',
        notasAdmin = ?,
        procesadoAt = NOW(),
        updatedAt = NOW()
      WHERE institucionNombre LIKE ? OR institucionId = ?
    `, [notas || 'Institución aprobada automáticamente', adminId, `%${institution.nombre}%`, id]);

    await conn.commit();

    // TODO: Enviar email de aprobación al responsable
    console.log(`✅ Institución aprobada: ${institution.nombre} por admin ${adminId}`);

    res.json({
      success: true,
      message: "Institución aprobada exitosamente",
      data: { id, status: 'ACTIVA' }
    });

  } catch (error) {
    try {
      await conn.rollback();
    } catch (rollbackError) {
      console.error('Error en rollback:', rollbackError.message);
    }

    console.error("Error aprobando institución:", error.message);
    res.status(500).json({
      success: false,
      message: "Error aprobando institución"
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Suspender una institución
 */
const suspendInstitution = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    const { razon, temporal } = req.body;
    const adminId = req.user.id;

    await conn.beginTransaction();

    // Verificar que la institución existe
    const [institutionResult] = await conn.execute(`
      SELECT * FROM instituciones WHERE id = ?
    `, [id]);

    if (institutionResult.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Institución no encontrada"
      });
    }

    const institution = institutionResult[0];

    // Actualizar status a SUSPENDIDA
    await conn.execute(`
      UPDATE instituciones
      SET
        status = 'SUSPENDIDA',
        updatedAt = NOW()
      WHERE id = ?
    `, [id]);

    // Desactivar usuarios de la institución temporalmente
    await conn.execute(`
      UPDATE usuarios
      SET
        status = 'INACTIVO',
        updatedAt = NOW()
      WHERE institucionId = ? AND status = 'ACTIVO'
    `, [id]);

    // Registrar la acción en el historial
    await conn.execute(`
      INSERT INTO solicitudes_acceso (
        id, nombre, apellidoPaterno, email, rolSolicitado,
        institucionExistente, institucionId, institucionNombre,
        motivoSolicitud, status, notasAdmin, procesadoPor, procesadoAt,
        createdAt, updatedAt
      ) VALUES (
        ?, 'SISTEMA', 'AUDITORIA', 'sistema@neuroflora.com', 'SISTEMA',
        TRUE, ?, ?, ?, 'PROCESADA', ?, ?, NOW(), NOW(), NOW()
      )
    `, [
      `SUSP-${Date.now()}`,
      id,
      institution.nombre,
      `Institución suspendida. Razón: ${razon}`,
      `Suspensión ${temporal ? 'temporal' : 'indefinida'}: ${razon}`,
      adminId
    ]);

    await conn.commit();

    console.log(`⚠️ Institución suspendida: ${institution.nombre} por admin ${adminId}`);

    res.json({
      success: true,
      message: "Institución suspendida exitosamente",
      data: { id, status: 'SUSPENDIDA' }
    });

  } catch (error) {
    try {
      await conn.rollback();
    } catch (rollbackError) {
      console.error('Error en rollback:', rollbackError.message);
    }

    console.error("Error suspendiendo institución:", error.message);
    res.status(500).json({
      success: false,
      message: "Error suspendiendo institución"
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Reactivar una institución suspendida
 */
const reactivateInstitution = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;
    const { notas } = req.body;
    const adminId = req.user.id;

    await conn.beginTransaction();

    // Verificar que la institución existe y está suspendida
    const [institutionResult] = await conn.execute(`
      SELECT * FROM instituciones WHERE id = ? AND status = 'SUSPENDIDA'
    `, [id]);

    if (institutionResult.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: "Institución no encontrada o no está suspendida"
      });
    }

    const institution = institutionResult[0];

    // Reactivar institución
    await conn.execute(`
      UPDATE instituciones
      SET
        status = 'ACTIVA',
        updatedAt = NOW()
      WHERE id = ?
    `, [id]);

    // Reactivar usuarios que estaban activos antes de la suspensión
    await conn.execute(`
      UPDATE usuarios
      SET
        status = 'ACTIVO',
        updatedAt = NOW()
      WHERE institucionId = ? AND status = 'INACTIVO'
    `, [id]);

    await conn.commit();

    console.log(`✅ Institución reactivada: ${institution.nombre} por admin ${adminId}`);

    res.json({
      success: true,
      message: "Institución reactivada exitosamente",
      data: { id, status: 'ACTIVA' }
    });

  } catch (error) {
    try {
      await conn.rollback();
    } catch (rollbackError) {
      console.error('Error en rollback:', rollbackError.message);
    }

    console.error("Error reactivando institución:", error.message);
    res.status(500).json({
      success: false,
      message: "Error reactivando institución"
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Actualizar información de una institución
 */
const updateInstitution = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { id } = req.params;

    const {
      nombre,
      nombreCorto,
      telefono,
      emailInstitucional,
      sitioWeb,
      responsableNombre,
      responsableEmail,
      responsableTelefono,
      responsableCargo,
      maxUsuarios,
      direccion,
      ciudad,
      estado,
      codigoPostal,
      mision,
      vision,
      valores,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const [result] = await conn.execute(
      `
      UPDATE instituciones
      SET
        nombre = ?,
        nombreCorto = ?,
        telefono = ?,
        emailInstitucional = ?,
        sitioWeb = ?,
        responsableNombre = ?,
        responsableEmail = ?,
        responsableTelefono = ?,
        responsableCargo = ?,
        maxUsuarios = ?,
        direccion = ?,
        ciudad = ?,
        estado = ?,
        codigoPostal = ?,
        mision = ?,
        vision = ?,
        valores = ?,
        updatedAt = NOW(3)
      WHERE id = ?
    `,
      [
        nombre,
        nombreCorto,
        telefono || null,
        emailInstitucional || null,
        sitioWeb || null,
        responsableNombre,
        responsableEmail,
        responsableTelefono || null,
        responsableCargo || null,
        Number.parseInt(maxUsuarios, 10) || 1000,
        direccion || null,
        ciudad || null,
        estado || null,
        codigoPostal || null,
        mision || null,
        vision || null,
        valores || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Institución no encontrada" });
    }

    res.json({
      success: true,
      message: "Institución actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error actualizando institución:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Error actualizando institución" });
  } finally {
    conn.release();
  }
};

/**
 * Obtener estados únicos para filtros
 */
const getStates = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const [states] = await conn.execute(`
      SELECT DISTINCT estado as value, estado as label
      FROM instituciones
      WHERE estado IS NOT NULL AND estado != ''
      ORDER BY estado
    `);

    res.json({
      success: true,
      data: states
    });

  } catch (error) {
    console.error("Error obteniendo estados:", error.message);
    res.status(500).json({
      success: false,
      message: "Error obteniendo estados"
    });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  getInstitutions,
  getInstitutionById,
  approveInstitution,
  suspendInstitution,
  reactivateInstitution,
  updateInstitution,
  getStates
};