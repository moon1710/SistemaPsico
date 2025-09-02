// routes/profile.routes.js
const express = require("express");
const { body } = require("express-validator");
const { authenticateToken } = require("../middlewares/auth.middleware");
const profileCtrl = require("../controllers/profile.controller");

const router = express.Router();

// Validaciones básicas (opcionales)
const completeValidations = [
  body("telefono").optional().isString().isLength({ min: 7, max: 20 }).trim(),
  body("direccion").optional().isString().isLength({ min: 3, max: 255 }).trim(),
  body("genero").optional().isString().isIn(["F", "M", "NB", "OTRO", "ND"]),
  body("fechaNacimiento")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("fechaNacimiento debe ser YYYY-MM-DD"),
];

router.get("/status", authenticateToken, profileCtrl.getStatus);
router.post(
  "/complete",
  authenticateToken,
  completeValidations,
  profileCtrl.complete
);

module.exports = router;
