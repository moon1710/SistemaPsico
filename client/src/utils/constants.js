//client/src/utils/constants.js

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  API_BASE: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  TIMEOUT: 10000,
};

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  VERIFY: "/auth/verify",
};

// Roles del sistema
export const USER_ROLES = {
  SUPER_ADMIN_NACIONAL: "SUPER_ADMIN_NACIONAL",
  SUPER_ADMIN_INSTITUCION: "SUPER_ADMIN_INSTITUCION",
  PSICOLOGO: "PSICOLOGO",
  ESTUDIANTE: "ESTUDIANTE",
  ORIENTADOR: "ORIENTADOR",
};

// Local Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "auth_token",
  USER_DATA: "user_data",
  REFRESH_TOKEN: "refresh_token",
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",

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
};

// Mensajes de la aplicación
export const MESSAGES = {
  LOGIN_SUCCESS: "Inicio de sesión exitoso",
  LOGIN_ERROR: "Credenciales incorrectas",
  LOGOUT_SUCCESS: "Sesión cerrada correctamente",
  NETWORK_ERROR: "Error de conexión. Verifica tu internet.",
  UNAUTHORIZED: "No tienes permisos para acceder a esta sección",
  SESSION_EXPIRED: "Tu sesión ha expirado. Inicia sesión nuevamente.",
};

// Configuración de UI
export const UI_CONFIG = {
  SIDEBAR_WIDTH: "256px",
  HEADER_HEIGHT: "64px",
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
};
