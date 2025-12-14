// app.js (servidor Express)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

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

/* =========================
   Helpers
========================= */

const toBool = (v) => String(v || "").toLowerCase() === "true";

function parseCsvEnv(name) {
  return (process.env[name] || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isPrivateLanHostname(hostname) {
  // localhost / loopback
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0"
  )
    return true;

  // 192.168.x.x
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;

  // 10.x.x.x
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;

  // 172.16.0.0 – 172.31.255.255
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname))
    return true;

  return false;
}

function isAllowedOrigin(origin, allowedList, allowLan) {
  try {
    const u = new URL(origin);
    const normalized = `${u.protocol}//${u.host}`; // protocol + host:port

    if (allowedList.includes(origin)) return true;
    if (allowedList.includes(normalized)) return true;

    if (!allowLan) return false;
    return isPrivateLanHostname(u.hostname);
  } catch {
    // si origin es raro, lo bloqueamos
    return false;
  }
}

/* =========================
   CORS (LAN friendly)
========================= */

const allowedOrigins = [
  // defaults (dev)
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...parseCsvEnv("ALLOWED_ORIGINS"),
];

const isProd = process.env.NODE_ENV === "production";
const corsStrict = toBool(process.env.CORS_STRICT);
const allowLan = !isProd || !corsStrict; // en prod+strict NO permitimos LAN por defecto

const corsOptions = {
  origin(origin, callback) {
    // Postman/curl o apps nativas pueden venir sin Origin
    if (!origin) return callback(null, true);

    const ok = isAllowedOrigin(origin, allowedOrigins, allowLan);

    if (ok) return callback(null, true);

    const msg = `CORS blocked: ${origin}`;
    console.warn(msg, {
      NODE_ENV: process.env.NODE_ENV,
      CORS_STRICT: process.env.CORS_STRICT,
      allowLan,
      allowedOrigins,
    });

    // Express-cors espera error para bloquear
    return callback(new Error(msg), false);
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "x-institution-id",
    "x-institucion-id",
    "Origin",
    "Accept",
  ],
  exposedHeaders: ["Content-Length"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* =========================
   Parsers
========================= */

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

/* =========================
   Basic security headers
========================= */

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  // Nota: X-XSS-Protection está obsoleto en navegadores modernos, pero no estorba.
  res.setHeader("X-XSS-Protection", "0");
  next();
});

/* =========================
   Dev logging
========================= */

if (!isProd) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    if (req.method === "OPTIONS") {
      console.log(
        `Preflight: origin=${req.headers.origin} -> ${req.headers["access-control-request-method"]} ${req.path}`
      );
    }
    next();
  });
}

/* =========================
   Health
========================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

/* =========================
   Routes
========================= */

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

/* =========================
   Static uploads
========================= */

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =========================
   404
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    path: req.originalUrl,
  });
});

/* =========================
   Error handler
========================= */

app.use((error, req, res, next) => {
  // CORS errors usually land here
  const msg = String(error?.message || "");

  if (msg.startsWith("CORS blocked:")) {
    return res.status(403).json({
      success: false,
      message: "Acceso bloqueado por CORS",
      detail: !isProd ? msg : undefined,
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "JSON inválido en el cuerpo de la petición",
    });
  }

  console.error("💥 Uncaught error:", error.stack || error);

  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    ...(isProd ? {} : { error: msg }),
  });
});

module.exports = app;
