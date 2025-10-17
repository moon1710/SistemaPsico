// client/src/utils/constants.js

// Detecta la URL base del backend según entorno
function getApiUrl() {
  const host = window.location.hostname;

  // Desarrollo local
  const isLocalhost = host === "localhost" || host === "127.0.0.1";
  if (isLocalhost) return "http://localhost:4000";

  // Túneles (dev)
  const isTunnel =
    host.includes("devtunnels.ms") ||
    host.includes("ngrok.io") ||
    host.includes("localtunnel.me") ||
    host.includes("tunnelmole.com") ||
    host.includes("serveo.net");

  // Si hay VITE_API_URL explícito, respétalo
  const envUrl = (import.meta.env.VITE_API_URL || "").trim();
  if (isTunnel && envUrl) return envUrl;
  if (envUrl) return envUrl;

  // Producción sin variable → usa proxy relativo por Nginx
  // (evita CORS y contenido mixto)
  return "/api";
}

const BACKEND_URL = getApiUrl().replace(/\/$/, "");

// Si BACKEND_URL es absoluto (http/https), agrega "/api".
// Si es relativo ("/api"), NO añadir otro "/api".
const API_BASE = BACKEND_URL.startsWith("http")
  ? `${BACKEND_URL}/api`
  : BACKEND_URL;

export const API_CONFIG = {
  BASE_URL: BACKEND_URL, // p.ej: "http://localhost:4000" o "/api"
  API_BASE: API_BASE, // p.ej: "http://localhost:4000/api" o "/api"
  TIMEOUT: 10000,
};

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  VERIFY: "/auth/verify",
};

// System roles
export const USER_ROLES = {
  SUPER_ADMIN_NACIONAL: "SUPER_ADMIN_NACIONAL",
  SUPER_ADMIN_INSTITUCION: "SUPER_ADMIN_INSTITUCION",
  ADMIN_INSTITUCION: "ADMIN_INSTITUCION",
  PSICOLOGO: "PSICOLOGO",
  ESTUDIANTE: "ESTUDIANTE",
  ORIENTADOR: "ORIENTADOR",
};

// Appointment statuses
export const APPOINTMENT_STATUSES = {
  ABIERTA: "ABIERTA",
  SOLICITADA: "SOLICITADA",
  ASIGNADA: "ASIGNADA",
  PROGRAMADA: "PROGRAMADA",
  CONFIRMADA: "CONFIRMADA",
  EN_PROGRESO: "EN_PROGRESO",
  COMPLETADA: "COMPLETADA",
  CANCELADA: "CANCELADA",
  NO_ASISTIO: "NO_ASISTIO",
};

// Appointment modalities
export const APPOINTMENT_MODALITIES = {
  PRESENCIAL: "PRESENCIAL",
  VIRTUAL: "VIRTUAL",
};

// Local Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
};

// Application routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  CONFIGURATION: "/configuracion",
  NOTIFICATIONS: "/notificaciones",
  SUPPORT: "/soporte",
  CAMBIAR_PASSWORD: "/cambiar-password",
  HELP: "/help",
  ABOUTUS: "/aboutUs",
  TERMINOS: "/terminos",
  PRIVACIDAD: "/privacidad",
  DOCUMENTACION: "/docs",
  CONFINDENCIALIDAD: "/confidencialidad",

  // Super Admin Nacional
  INSTITUCIONES: "/instituciones",
  ESTADISTICAS_GLOBALES: "/estadisticas-globales",

  // Super Admin Institución
  USUARIOS: "/usuarios",
  PSICOLOGOS: "/psicologos",
  ESTUDIANTES: "/estudiantes",
  MODULOS: "/modulos",

  // Psicólogo
  QUIZ_APLICAR: "/quiz/aplicar",
  CANALIZACIONES: "/canalizaciones",
  CITAS: "/citas",
  SESIONES: "/sesiones",
  CHAT: "/chat",
  REPORTES_PSICOLOGO: "/reportes/psicologo",

  // Estudiante
  QUIZ_CONTESTAR: "/quiz/contestar",
  MIS_CITAS: "/mis-citas",
  RECOMENDACIONES: "/recomendaciones",
  RECURSOS: "/recursos",
  CHAT_ESTUDIANTE: "/chat",

  // Recursos específicos
  CRISIS_INMEDIATA: "/recursos/crisis-inmediata",
  PRIMEROS_AUXILIOS: "/recursos/primeros-auxilios",
  RESPIRACION_GUIADA: "/recursos/respiracion-guiada",
  TECNICA_5432: "/recursos/tecnica-5432",
  RELAJACION_MUSCULAR: "/recursos/relajacion-muscular",
  COMO_PEDIR_AYUDA: "/recursos/como-pedir-ayuda",
  PROGRAMAS_AUTOGUIADOS: "/recursos/programas-autoguiados",
  HABITOS_SALUDABLES: "/recursos/habitos-saludables",
  APOYO_ACADEMICO: "/recursos/apoyo-academico",
  SEGURIDAD: "/recursos/seguridad",
  RED_APOYO: "/recursos/red-apoyo",
  DIVERSIDAD: "/recursos/diversidad",

  // Quizzes
  QUIZ_CONTESTAR_DETALLE: "/quiz/contestar/:quizId",
  QUIZ_RESULTADO: "/quiz/resultado",
  MIS_RESULTADOS: "/quiz/mis-resultados",
  QUIZ_RESULTADOS_ADMIN: "/quizzes/resultados",
  QUIZ_ANALYTICS_ADMIN: "/quizzes/analytics",

  // === APPOINTMENT ROUTES ===
  AGENDAR_CITA: "/agendar-cita",
  CITA_DETALLE: "/cita/:id",

  // Psychologist routes
  AGENDA: "/agenda",
  DISPONIBILIDAD: "/disponibilidad",

  // Admin routes
  CITAS_ADMIN: "/citas/admin",
  REPORTES_CITAS: "/citas/reportes",
};

// UI Configuration
export const UI_CONFIG = {
  SIDEBAR_WIDTH: "256px",
  HEADER_HEIGHT: "64px",
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
};

// Appointment configuration
export const APPOINTMENT_CONFIG = {
  MAX_ADVANCE_BOOKING_DAYS: 90,
  MIN_ADVANCE_BOOKING_HOURS: 2,
  DEFAULT_DURATION: 60,
  AVAILABLE_DURATIONS: [30, 45, 60, 90],
  CANCELLATION_DEADLINE_HOURS: 24,
};

// Days of week for availability
export const DAYS_OF_WEEK = {
  LUNES: "LUNES",
  MARTES: "MARTES",
  MIERCOLES: "MIERCOLES",
  JUEVES: "JUEVES",
  VIERNES: "VIERNES",
  SABADO: "SABADO",
  DOMINGO: "DOMINGO",
};

// Time slots for appointments (24-hour format)
export const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];
