// controllers/onboarding.controller.js
const { pool } = require("../db");
const { validationResult } = require("express-validator");

/**
 * Completar perfil del usuario con datos reales de la tabla usuarios
 * Actualiza perfilCompletado = 1 y guarda los campos del formulario
 */
const completeProfile = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    console.log('🔥 [ONBOARDING] Iniciando completeProfile para userId:', req.user?.id);
    console.log('🔥 [ONBOARDING] Datos recibidos en req.body:', JSON.stringify(req.body, null, 2));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ [ONBOARDING] Errores de validación:', errors.array());
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const userId = req.user.id;
    const userRole = req.user?.instituciones?.[0]?.rol || "ESTUDIANTE";
    console.log('📋 [ONBOARDING] Usuario ID:', userId, 'Rol:', userRole);
    console.log('👤 [ONBOARDING] req.user completo:', JSON.stringify(req.user, null, 2));

    // Campos básicos que aplican a todos los roles
    const {
      telefono,
      fechaNacimiento,
      genero,
      ciudad,
      estado,
      // Campos específicos para estudiantes
      matricula,
      semestre,
      grupo,
      turno,
      carreraId,
      trabajaActualmente = false,
      lugarTrabajo,
      nombrePadre,
      telefonoPadre,
      nombreMadre,
      telefonoMadre,
      contactoEmergenciaNombre,
      contactoEmergenciaTelefono,
      contactoEmergenciaRelacion,
      tieneComputadora = false,
      tieneInternet = false,
      medioTransporte,
      nivelSocioeconomico,
      pasatiempos,
      deportesPractica,
      idiomasHabla,
      tieneBeca = false,
      tipoBeca,
      participaActividades = false,
      // Campos para personal
      numeroEmpleado,
      cedulaProfesional,
      departamento,
      especialidades,
      telefonoEmergencia,
    } = req.body;

    // Verificar estado actual del usuario antes de actualizar
    const [currentUserRows] = await conn.execute(
      'SELECT perfilCompletado, matricula, telefono FROM usuarios WHERE id = ?',
      [userId]
    );
    console.log('🔍 [ONBOARDING] Estado actual del usuario ANTES del update:', currentUserRows[0]);

    await conn.beginTransaction();
    console.log('🔄 [ONBOARDING] Transacción iniciada');

    // Construir la query dinámicamente según el rol
    let updateFields = [];
    let updateValues = [];
    console.log('🏗️ [ONBOARDING] Construyendo query dinámica...');

    // Campos básicos para todos
    if (telefono) {
      updateFields.push("telefono = ?");
      updateValues.push(telefono);
    }
    if (fechaNacimiento) {
      updateFields.push("fechaNacimiento = ?");
      updateValues.push(fechaNacimiento);
    }
    if (genero) {
      updateFields.push("genero = ?");
      updateValues.push(genero);
    }
    if (ciudad) {
      updateFields.push("ciudad = ?");
      updateValues.push(ciudad);
    }
    if (estado) {
      updateFields.push("estado = ?");
      updateValues.push(estado);
    }

    // Campos específicos para estudiantes
    if (userRole === "ESTUDIANTE") {
      if (matricula) {
        updateFields.push("matricula = ?");
        updateValues.push(matricula);
      }
      if (semestre) {
        updateFields.push("semestre = ?");
        updateValues.push(parseInt(semestre));
      }
      if (grupo) {
        updateFields.push("grupo = ?");
        updateValues.push(grupo);
      }
      if (turno) {
        updateFields.push("turno = ?");
        updateValues.push(turno);
      }
      if (carreraId) {
        updateFields.push("carreraId = ?");
        updateValues.push(carreraId);
      }

      updateFields.push("trabajaActualmente = ?");
      updateValues.push(trabajaActualmente ? 1 : 0);

      if (lugarTrabajo) {
        updateFields.push("lugarTrabajo = ?");
        updateValues.push(lugarTrabajo);
      }
      if (nombrePadre) {
        updateFields.push("nombrePadre = ?");
        updateValues.push(nombrePadre);
      }
      if (telefonoPadre) {
        updateFields.push("telefonoPadre = ?");
        updateValues.push(telefonoPadre);
      }
      if (nombreMadre) {
        updateFields.push("nombreMadre = ?");
        updateValues.push(nombreMadre);
      }
      if (telefonoMadre) {
        updateFields.push("telefonoMadre = ?");
        updateValues.push(telefonoMadre);
      }
      if (contactoEmergenciaNombre) {
        updateFields.push("contactoEmergenciaNombre = ?");
        updateValues.push(contactoEmergenciaNombre);
      }
      if (contactoEmergenciaTelefono) {
        updateFields.push("contactoEmergenciaTelefono = ?");
        updateValues.push(contactoEmergenciaTelefono);
      }
      if (contactoEmergenciaRelacion) {
        updateFields.push("contactoEmergenciaRelacion = ?");
        updateValues.push(contactoEmergenciaRelacion);
      }

      updateFields.push("tieneComputadora = ?");
      updateValues.push(tieneComputadora ? 1 : 0);

      updateFields.push("tieneInternet = ?");
      updateValues.push(tieneInternet ? 1 : 0);

      if (medioTransporte) {
        updateFields.push("medioTransporte = ?");
        updateValues.push(medioTransporte);
      }
      if (nivelSocioeconomico) {
        updateFields.push("nivelSocioeconomico = ?");
        updateValues.push(nivelSocioeconomico);
      }
      if (pasatiempos) {
        updateFields.push("pasatiempos = ?");
        updateValues.push(pasatiempos);
      }
      if (deportesPractica) {
        updateFields.push("deportesPractica = ?");
        updateValues.push(deportesPractica);
      }
      if (idiomasHabla) {
        updateFields.push("idiomasHabla = ?");
        updateValues.push(idiomasHabla);
      }

      updateFields.push("tieneBeca = ?");
      updateValues.push(tieneBeca ? 1 : 0);

      if (tipoBeca) {
        updateFields.push("tipoBeca = ?");
        updateValues.push(tipoBeca);
      }

      updateFields.push("participaActividades = ?");
      updateValues.push(participaActividades ? 1 : 0);
    }

    // Campos para personal (psicólogos, orientadores, admins)
    if (["PSICOLOGO", "ORIENTADOR", "ADMIN_INSTITUCION"].includes(userRole)) {
      if (numeroEmpleado) {
        updateFields.push("numeroEmpleado = ?");
        updateValues.push(numeroEmpleado);
      }
      if (cedulaProfesional) {
        updateFields.push("cedulaProfesional = ?");
        updateValues.push(cedulaProfesional);
      }
      if (departamento) {
        updateFields.push("departamento = ?");
        updateValues.push(departamento);
      }
      if (especialidades) {
        updateFields.push("especialidades = ?");
        updateValues.push(especialidades);
      }
      if (telefonoEmergencia) {
        updateFields.push("telefonoEmergencia = ?");
        updateValues.push(telefonoEmergencia);
      }
    }

    // Siempre marcar perfil como completado
    console.log('🔧 [ONBOARDING] Agregando perfilCompletado = 1 a updateFields');
    updateFields.push("perfilCompletado = 1");
    updateFields.push("updatedAt = NOW(3)");

    // Agregar el userId al final para el WHERE
    updateValues.push(userId);

    console.log('🔍 [ONBOARDING] Campos a actualizar:', updateFields);
    console.log('🔍 [ONBOARDING] Valores a insertar:', updateValues);

    if (updateFields.length > 0) {
      const updateQuery = `UPDATE usuarios SET ${updateFields.join(
        ", "
      )} WHERE id = ?`;

      console.log('📝 [ONBOARDING] Query SQL:', updateQuery);
      console.log('📝 [ONBOARDING] Parámetros:', updateValues);

      const result = await conn.execute(updateQuery, updateValues);
      console.log('✅ [ONBOARDING] Resultado de la actualización:', result[0]);
      console.log('✅ [ONBOARDING] Filas afectadas:', result[0].affectedRows);
      console.log('✅ [ONBOARDING] Changed rows:', result[0].changedRows);
    } else {
      console.log('⚠️ [ONBOARDING] No hay campos para actualizar');
    }

    await conn.commit();
    console.log('💾 [ONBOARDING] Transacción confirmada (commit)');

    // Verificar que los datos se guardaron correctamente
    const [verificationRows] = await conn.execute(
      'SELECT perfilCompletado, matricula, telefono, fechaNacimiento FROM usuarios WHERE id = ?',
      [userId]
    );
    console.log('🔍 [ONBOARDING] Verificación post-commit:', verificationRows[0]);

    console.log('🎉 [ONBOARDING] Perfil completado exitosamente para userId:', userId);

    res.json({
      success: true,
      message: "Perfil completado exitosamente",
      data: {
        perfilCompletado: true,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    try {
      await conn.rollback();
      console.log('🔄 [ONBOARDING] Rollback ejecutado debido a error');
    } catch (rollbackError) {
      console.error('❌ [ONBOARDING] Error al hacer rollback:', rollbackError);
    }

    console.error('❌ [ONBOARDING] Error completando perfil:', {
      userId: req.user?.id || 'unknown',
      error: error?.sqlMessage || error?.message || error,
      stack: error?.stack
    });

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Completar onboarding simple (para casos donde no se quiere llenar el perfil completo)
 */
const completeOnboarding = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user.id;

    await conn.beginTransaction();

    // Solo marcar perfil como completado
    await conn.execute(
      `UPDATE usuarios 
       SET perfilCompletado = 1, updatedAt = NOW(3)
       WHERE id = ?`,
      [userId]
    );

    await conn.commit();

    res.json({
      success: true,
      message: "Onboarding completado exitosamente",
      data: {
        perfilCompletado: true,
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    try {
      await conn.rollback();
    } catch {}

    console.error(
      "Error completando onboarding:",
      error?.sqlMessage || error?.message || error
    );

    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Obtener datos del perfil del usuario
 */
const getProfileData = async (req, res) => {
  try {
    const userId = req.user.id;

    const [userRows] = await pool.execute(
      `SELECT telefono, fechaNacimiento, genero, ciudad, estado, matricula, 
              semestre, grupo, turno, trabajaActualmente, lugarTrabajo,
              nombrePadre, telefonoPadre, nombreMadre, telefonoMadre,
              contactoEmergenciaNombre, contactoEmergenciaTelefono, contactoEmergenciaRelacion,
              tieneComputadora, tieneInternet, medioTransporte, nivelSocioeconomico,
              pasatiempos, deportesPractica, idiomasHabla, tieneBeca, tipoBeca,
              participaActividades, numeroEmpleado, cedulaProfesional, departamento,
              especialidades, telefonoEmergencia, perfilCompletado
       FROM usuarios 
       WHERE id = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      data: {
        profileData: userRows[0],
        hasCompletedProfile: userRows[0].perfilCompletado === 1,
      },
    });
  } catch (error) {
    console.error("Error obteniendo datos de perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

/**
 * Reiniciar onboarding (para testing o casos especiales)
 */
const resetOnboarding = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user.id;

    await conn.beginTransaction();

    // Marcar perfil como incompleto
    await conn.execute(
      `UPDATE usuarios
       SET perfilCompletado = 0, updatedAt = NOW(3)
       WHERE id = ?`,
      [userId]
    );

    await conn.commit();

    res.json({
      success: true,
      message: "Onboarding reiniciado exitosamente",
      data: {
        perfilCompletado: false,
      },
    });
  } catch (error) {
    try {
      await conn.rollback();
    } catch {}

    console.error("Error reiniciando onboarding:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Test directo para actualizar perfilCompletado (para debugging)
 */
const testUpdatePerfil = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const userId = req.user.id;

    console.log('🧪 [TEST] Probando UPDATE directo para userId:', userId);

    // Verificar estado actual
    const [before] = await pool.execute(
      'SELECT perfilCompletado, matricula, telefono FROM usuarios WHERE id = ?',
      [userId]
    );
    console.log('🧪 [TEST] Estado ANTES del test:', before[0]);

    await conn.beginTransaction();

    // UPDATE directo y simple
    const result = await conn.execute(
      'UPDATE usuarios SET perfilCompletado = 1 WHERE id = ?',
      [userId]
    );
    console.log('🧪 [TEST] Resultado del UPDATE:', result[0]);

    await conn.commit();

    // Verificar estado después
    const [after] = await pool.execute(
      'SELECT perfilCompletado, matricula, telefono FROM usuarios WHERE id = ?',
      [userId]
    );
    console.log('🧪 [TEST] Estado DESPUÉS del test:', after[0]);

    res.json({
      success: true,
      message: "Test completado",
      data: {
        before: before[0],
        after: after[0],
        affectedRows: result[0].affectedRows
      },
    });
  } catch (error) {
    try {
      await conn.rollback();
    } catch {}

    console.error('🧪 [TEST] Error en test:', error);
    res.status(500).json({
      success: false,
      message: "Error en test",
      error: error.message
    });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  completeProfile,
  completeOnboarding,
  getProfileData,
  resetOnboarding,
  testUpdatePerfil,
};
