const express = require("express");
const cors = require("cors");
require("dotenv").config();

console.log("app.js: Iniciando configuración...");

// Importar rutas
const authRoutes = require("./routes/auth.routes");
const quizzesRoutes = require("./routes/quizzes.routes");

const app = express();

// Configuración de CORS básica y segura
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Middlewares básicos
app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Middleware de logging para desarrollo
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Headers de seguridad básica
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// ===============================================
// RUTAS
// ===============================================

// Ruta de health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Rutas de autenticación
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzesRoutes);

console.log("app.js: Rutas configuradas");

// ===============================================
// MANEJO DE ERRORES
// ===============================================

// 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    path: req.originalUrl,
  });
});

// Error handler global
app.use((error, req, res, next) => {
  console.error("Error no capturado:", error.message);

  // Error de CORS
  if (error.message === "No permitido por CORS") {
    return res.status(403).json({
      success: false,
      message: "Acceso bloqueado por CORS",
    });
  }

  // Error de JSON malformado
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "JSON inválido en el cuerpo de la petición",
    });
  }

  // Error genérico
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV !== "production" && { error: error.message }),
  });
});

console.log("app.js: Configuración completada");
module.exports = app;
