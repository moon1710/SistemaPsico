import { API_CONFIG } from "../utils/constants";

const BASE_URL = `${API_CONFIG.API_BASE}/canalizaciones`;

// Obtener token del localStorage
const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

// Headers con autenticación
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
};

export const canalizacionesService = {
  // Obtener todas las canalizaciones
  async getCanalizaciones(filtros = {}) {
    try {
      const params = new URLSearchParams();

      if (filtros.severidad) params.append('severidad', filtros.severidad);
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
      if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);

      const url = `${BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error obteniendo canalizaciones:", error);
      throw error;
    }
  },

  // Crear nueva canalización
  async crearCanalizacion(canalizacionData) {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(canalizacionData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creando canalización:", error);
      throw error;
    }
  },

  // Actualizar estado de canalización
  async actualizarEstado(canalizacionId, estado, psicologoAsignado = null) {
    try {
      const response = await fetch(`${BASE_URL}/${canalizacionId}/estado`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          estado,
          ...(psicologoAsignado && { psicologoAsignado })
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error actualizando estado:", error);
      throw error;
    }
  },

  // Agregar nota de seguimiento
  async agregarNota(canalizacionId, nota, tipo = 'SEGUIMIENTO') {
    try {
      const response = await fetch(`${BASE_URL}/${canalizacionId}/notas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ nota, tipo }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error agregando nota:", error);
      throw error;
    }
  },

  // Obtener estadísticas
  async getEstadisticas() {
    try {
      const response = await fetch(`${BASE_URL}/estadisticas`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      throw error;
    }
  },
};

export default canalizacionesService;