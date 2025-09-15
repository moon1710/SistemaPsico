// app.js (servidor Express)
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const quizzesRoutes = require("./routes/quizzes.routes");
const citasRoutes = require("./routes/citas.routes");

const app = express();

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "x-institution-id", // ⬅️ necesario para tus requests
    "x-institucion-id", // ⬅️ alias que usas en el middleware
    "Origin",
    "Accept",
  ],
};

app.use(cors(corsOptions));
// Maneja explícitamente preflight por si acaso
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    // Log útil para depurar preflight
    if (req.method === "OPTIONS") {
      console.log("Preflight from:", req.headers.origin);
      console.log("Req-Method:", req.headers["access-control-request-method"]);
      console.log(
        "Req-Headers:",
        req.headers["access-control-request-headers"]
      );
    }
    next();
  });
}

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/citas", citasRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("Error no capturado:", error.message);
  if (error.message === "No permitido por CORS") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso bloqueado por CORS" });
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res
      .status(400)
      .json({
        success: false,
        message: "JSON inválido en el cuerpo de la petición",
      });
  }
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV !== "production" && { error: error.message }),
  });
});

module.exports = app;
