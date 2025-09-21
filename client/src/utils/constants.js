//client/src/utils/constants.js

// Configuration for the API
const BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

export const API_CONFIG = {
  BASE_URL,
  API_BASE: `${BASE_URL}/api`,
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

  // Estudiante
  QUIZ_CONTESTAR: "/quiz/contestar",
  MIS_CITAS: "/mis-citas",
  RECOMENDACIONES: "/recomendaciones",

  // Quizzes
  QUIZ_CONTESTAR_DETALLE: "/quiz/contestar/:quizId",
  MIS_RESULTADOS: "/quiz/mis-resultados",
  QUIZ_RESULTADOS_ADMIN: "/quizzes/resultados", // para psicólogo/orientador/admin
  QUIZ_ANALYTICS_ADMIN: "/quizzes/analytics", // opcional

  // === APPOINTMENT ROUTES ===

  // Student appointment routes
  AGENDAR_CITA: "/agendar-cita",
  CITA_DETALLE: "/cita/:id",

  // Psychologist routes
  AGENDA: "/agenda",
  DISPONIBILIDAD: "/disponibilidad",

  // Admin routes
  CITAS_ADMIN: "/citas/admin",
  REPORTES_CITAS: "/citas/reportes",
};

// Application messages
export const MESSAGES = {
  LOGIN_SUCCESS: "Inicio de sesión exitoso",
  LOGIN_ERROR: "Credenciales incorrectas",
  LOGOUT_SUCCESS: "Sesión cerrada correctamente",
  NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
  UNAUTHORIZED: "No tienes permisos para acceder a esta sección",
  SESSION_EXPIRED: "Tu sesión ha expirado. Inicia sesión nuevamente.",

  // Appointment messages
  APPOINTMENT_REQUESTED: "Cita solicitada exitosamente",
  APPOINTMENT_CANCELLED: "Cita cancelada exitosamente",
  APPOINTMENT_CONFIRMED: "Cita confirmada exitosamente",
  APPOINTMENT_ERROR: "Error al procesar la cita",
  PSYCHOLOGIST_UNAVAILABLE: "El psicólogo no está disponible en ese horario",
  INVALID_APPOINTMENT_TIME: "Horario de cita inválido",
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
  MAX_ADVANCE_BOOKING_DAYS: 90, // Maximum days in advance to book
  MIN_ADVANCE_BOOKING_HOURS: 2, // Minimum hours in advance to book
  DEFAULT_DURATION: 60, // Default appointment duration in minutes
  AVAILABLE_DURATIONS: [30, 45, 60, 90], // Available duration options
  CANCELLATION_DEADLINE_HOURS: 24, // Hours before appointment when cancellation is not allowed
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
