// services/notificationsService.js
import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS } from '../utils/constants';

// Crear instancia de axios para notifications endpoints
const api = axios.create({
  baseURL: API_CONFIG.API_BASE,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const API_BASE_URL = '/api/notifications';

/**
 * Obtener notificaciones del usuario
 */
export const getNotifications = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.tipo) queryParams.append('tipo', params.tipo);
    if (params.leida !== undefined) queryParams.append('leida', params.leida);
    if (params.limite) queryParams.append('limite', params.limite);
    if (params.pagina) queryParams.append('pagina', params.pagina);

    const url = queryParams.toString() ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    throw error;
  }
};

/**
 * Obtener contador de notificaciones no leídas
 */
export const getUnreadCount = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/unread-count`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo contador de notificaciones no leídas:', error);
    throw error;
  }
};

/**
 * Marcar notificación como leída
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`${API_BASE_URL}/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    throw error;
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const markAllAsRead = async () => {
  try {
    const response = await api.put(`${API_BASE_URL}/mark-all-read`);
    return response.data;
  } catch (error) {
    console.error('Error marcando todas las notificaciones como leídas:', error);
    throw error;
  }
};

/**
 * Eliminar notificación
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    throw error;
  }
};

// Mapeo de tipos de notificación para iconos y colores
export const notificationTypeMap = {
  cita: {
    label: 'Citas',
    color: 'bg-blue-100 text-blue-600 border-blue-200'
  },
  evaluacion: {
    label: 'Evaluaciones',
    color: 'bg-green-100 text-green-600 border-green-200'
  },
  mensaje: {
    label: 'Mensajes',
    color: 'bg-purple-100 text-purple-600 border-purple-200'
  },
  sistema: {
    label: 'Sistema',
    color: 'bg-gray-100 text-gray-600 border-gray-200'
  },
  bienvenida: {
    label: 'Bienvenida',
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200'
  }
};

// Mapeo de prioridades
export const priorityMap = {
  alta: 'bg-red-100 text-red-600 border-red-200',
  media: 'bg-yellow-100 text-yellow-600 border-yellow-200',
  baja: 'bg-blue-100 text-blue-600 border-blue-200'
};

/**
 * Formatear timestamp relativo
 */
export const formatTimestamp = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now - date;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Ahora mismo';
  if (minutes < 60) return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  if (days < 7) return `Hace ${days} día${days !== 1 ? 's' : ''}`;

  // Para fechas más antiguas, mostrar fecha exacta
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};