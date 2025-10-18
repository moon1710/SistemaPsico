// app.js (servidor Express)
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const quizzesRoutes = require("./routes/quizzes.routes");
const citasRoutes = require("./routes/citas.routes");
const onboardingRoutes = require("./routes/onboarding.routes");
const recommendationsRoutes = require("./routes/recommendations.routes");
const usersRoutes = require("./routes/users.routes");
const archivosRoutes = require("./routes/archivos.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const notificationsRoutes = require("./routes/notifications.routes");
const estudiantesRoutes = require("./routes/estudiantes.routes");
const reportsRoutes = require("./routes/reports.routes");
const chatRoutes = require("./routes/chat.routes");
const canalizacionesRoutes = require("./routes/canalizaciones.routes");

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Parse allowed origins from environment (comma-separated)
    const envAllowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
      : [];

    // Default allowed origins
    const defaultAllowedOrigins = [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ];

    const allowedOrigins = [...defaultAllowedOrigins, ...envAllowedOrigins];

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In production, only allow specific domains if CORS_STRICT is enabled
    if (process.env.NODE_ENV === 'production' && process.env.CORS_STRICT === 'true') {
      // Only allow explicitly configured origins in strict mode
      const msg = `Origin not allowed in strict mode: ${origin}`;
      console.warn(`CORS: ${msg}`);
      return callback(new Error(msg), false);
    }

    // Allow common development and tunneling patterns
    const developmentPatterns = [
      /^https?:\/\/localhost:\d+$/,
      /^https?:\/\/127\.0\.0\.1:\d+$/,
      /^https?:\/\/0\.0\.0\.0:\d+$/,
      /^https?:\/\/.*\.ngrok\.io$/,
      /^https?:\/\/.*\.tunnelmole\.com$/,
      /^https?:\/\/.*\.localtunnel\.me$/,
      /^https?:\/\/.*\.serveo\.net$/,
      /^https?:\/\/.*\.pagekite\.me$/,
      /^https?:\/\/.*\.devtunnels\.ms$/,
      /^https?:\/\/.*\.githubpreview\.dev$/,
      /^https?:\/\/.*\.cloudflare\.com$/,
      /^https?:\/\/.*\.vercel\.app$/,
      /^https?:\/\/.*\.netlify\.app$/,
      /^https?:\/\/.*\.herokuapp\.com$/,
      /^https?:\/\/.*\.railway\.app$/,
      /^https?:\/\/.*\.render\.com$/,
    ];

    // Check against development patterns
    for (const pattern of developmentPatterns) {
      if (pattern.test(origin)) {
        console.log(`CORS: Allowing development origin: ${origin}`);
        return callback(null, true);
      }
    }

    // Log rejected origins for debugging
    const msg = `Origin not allowed: ${origin}`;
    console.warn(`CORS: ${msg}`);

    // In development, log but allow
    if (process.env.NODE_ENV !== 'production') {
      console.log(`CORS: Allowing development mode origin: ${origin}`);
      return callback(null, true);
    }

    // Reject in production if not matched
    return callback(new Error(msg), false);
  },
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
    console.log(`${req.method} ${req.path}`);
    if (req.method === "OPTIONS") {
      console.log(`CORS Preflight: ${req.headers.origin} -> ${req.headers["access-control-request-method"]} ${req.path}`);
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

app.get("/api/health", (req, res) => {
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
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/recommendations", recommendationsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/archivos", archivosRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/estudiantes", estudiantesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/canalizaciones", canalizacionesRoutes);

// Serve static files from uploads
app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    path: req.originalUrl,
  });
});

app.use((error, req, res, next) => {
  console.error("💥 Uncaught error:", error.stack || error);
  if (error.message === "No permitido por CORS") {
    return res
      .status(403)
      .json({ success: false, message: "Acceso bloqueado por CORS" });
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "JSON inválido en el cuerpo de la petición",
    });
  }
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    ...(process.env.NODE_ENV !== "production" && {
      error: String(error.message || error),
    }),
  });
});

module.exports = app;
