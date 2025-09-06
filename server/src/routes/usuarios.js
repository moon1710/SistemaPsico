const express = require("express");
const router = express.Router();
const { pool } = require("../db"); // importa la conexión

// POST /api/usuarios/updatePerfil
router.post("/updatePerfil", async (req, res) => {
  const { userId, ...data } = req.body;

  try {
    // Se construyeron los SET dinámicamente
    const campos = Object.keys(data).map((key) => `${key} = ?`).join(", ");
    const valores = Object.values(data);

    const sql = `UPDATE usuarios SET ${campos}, perfilCompletado = 1 WHERE id = ?`;

    const [result] = await pool.query(sql, [...valores, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error al actualizar perfil:", err);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
});

module.exports = router;
