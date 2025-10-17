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

    // Validar dinámicamente según el rol del usuario
    const userRole = req.user?.instituciones?.[0]?.rol || "ESTUDIANTE";
    const { createProfileValidation } = require("../validators/onboarding.validators");
    const { validationResult } = require("express-validator");

    // Ejecutar validaciones dinámicas
    const validations = createProfileValidation(userRole);
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Datos de entrada inválidos",
        errors: errors.array(),
      });
    }

    const userId = req.user.id;

    // Campos básicos que aplican a todos los roles
    const {
      telefono,
      fechaNacimiento,
      genero,
      ciudad,
      estado,
      codigoPostal,
      colonia,
      // Campos específicos para estudiantes
      semestre,
      grupo,
      turno,
      carrera,
      // Campos para personal
      numeroEmpleado,
      cedulaProfesional,
      departamento,
      telefonoEmergencia,
      // Términos y condiciones
      aceptaTerminos,
    } = req.body;

    // Verificar estado actual del usuario antes de actualizar
    const [currentUserRows] = await conn.execute(
      'SELECT perfilCompletado, matricula, telefono FROM usuarios WHERE id = ?',
      [userId]
    );

    await conn.beginTransaction();

    // Construir la query dinámicamente según el rol
    let updateFields = [];
    let updateValues = [];

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
    if (codigoPostal) {
      updateFields.push("codigoPostal = ?");
      updateValues.push(codigoPostal);
    }
    if (colonia) {
      updateFields.push("colonia = ?");
      updateValues.push(colonia);
    }

    // Campos específicos para estudiantes
    if (userRole === "ESTUDIANTE") {
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
      if (carrera) {
        updateFields.push("carrera = ?");
        updateValues.push(carrera);
      }
    }

    // Campos para psicólogos
    if (userRole === "PSICOLOGO") {
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
      if (telefonoEmergencia) {
        updateFields.push("telefonoEmergencia = ?");
        updateValues.push(telefonoEmergencia);
      }
    }

    // Campos para orientadores y admins
    if (["ORIENTADOR", "ADMIN_INSTITUCION"].includes(userRole)) {
      if (departamento) {
        updateFields.push("departamento = ?");
        updateValues.push(departamento);
      }
      if (telefonoEmergencia) {
        updateFields.push("telefonoEmergencia = ?");
        updateValues.push(telefonoEmergencia);
      }
    }

    // Siempre marcar perfil como completado
    updateFields.push("perfilCompletado = 1");
    updateFields.push("updatedAt = NOW(3)");

    // Agregar el userId al final para el WHERE
    updateValues.push(userId);


    if (updateFields.length > 0) {
      const updateQuery = `UPDATE usuarios SET ${updateFields.join(
        ", "
      )} WHERE id = ?`;


      const result = await conn.execute(updateQuery, updateValues);
    } else {
    }

    await conn.commit();

    // Verificar que los datos se guardaron correctamente
    const [verificationRows] = await conn.execute(
      'SELECT perfilCompletado, matricula, telefono, fechaNacimiento FROM usuarios WHERE id = ?',
      [userId]
    );


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
      `SELECT telefono, fechaNacimiento, genero, ciudad, estado, codigoPostal, colonia, matricula,
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


    // Verificar estado actual
    const [before] = await pool.execute(
      'SELECT perfilCompletado, matricula, telefono FROM usuarios WHERE id = ?',
      [userId]
    );

    await conn.beginTransaction();

    // UPDATE directo y simple
    const result = await conn.execute(
      'UPDATE usuarios SET perfilCompletado = 1 WHERE id = ?',
      [userId]
    );

    await conn.commit();

    // Verificar estado después
    const [after] = await pool.execute(
      'SELECT perfilCompletado, matricula, telefono FROM usuarios WHERE id = ?',
      [userId]
    );

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

    console.error('Error in test endpoint:', error.message);
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
