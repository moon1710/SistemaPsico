// src/services/quizzesService.js
import { API_CONFIG, STORAGE_KEYS } from "../utils/constants";

function authFetch(
  path,
  { method = "GET", headers = {}, body, institutionId } = {}
) {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const h = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(institutionId ? { "x-institution-id": String(institutionId) } : {}),
    ...headers,
  };
  return fetch(`${API_CONFIG.API_BASE}${path}`, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data?.message || "Request failed");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  });
}

export const quizzesApi = {
  listPublic: () => authFetch("/quizzes/public"),
  getQuiz: (quizId) => authFetch(`/quizzes/${quizId}`),
  submitQuiz: ({
    quizId,
    respuestas,
    consentimientoAceptado,
    tiempoInicio,
    institutionId,
  }) =>
    authFetch(`/quizzes/${quizId}/submit`, {
      method: "POST",
      institutionId,
      body: { respuestas, consentimientoAceptado, tiempoInicio },
    }),
  myResults: () => {
    console.log("🔍 Fetching quiz results from:", `${API_CONFIG.API_BASE}/quizzes/me/results`);
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    console.log("🔑 Using token:", token ? `${token.slice(0, 20)}...` : "NO TOKEN");
    return authFetch("/quizzes/me/results")
      .then(result => {
        console.log("✅ Quiz results response:", result);
        return result;
      })
      .catch(error => {
        console.error("❌ Quiz results error:", error);
        throw error;
      });
  },
  adminResults: ({
    institutionId,
    codigo,
    severidad,
    searchTerm,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    page = 1,
    pageSize = 20,
  }) => {
    const qs = new URLSearchParams();
    if (codigo) qs.set("codigo", codigo);
    if (severidad) qs.set("severidad", severidad);
    if (searchTerm) qs.set("searchTerm", searchTerm);
    if (startDate) qs.set("startDate", startDate);
    if (endDate) qs.set("endDate", endDate);
    if (sortBy) qs.set("sortBy", sortBy);
    if (sortOrder) qs.set("sortOrder", sortOrder);
    if (page) qs.set("page", page);
    if (pageSize) qs.set("pageSize", pageSize);
    return authFetch(`/quizzes/resultados?${qs.toString()}`, { institutionId });
  },

  getResultsStats: ({ institutionId }) => {
    return authFetch("/quizzes/resultados/stats", { institutionId });
  },

  exportResults: ({
    institutionId,
    codigo,
    severidad,
    searchTerm,
    startDate,
    endDate,
  }) => {
    const qs = new URLSearchParams();
    if (codigo) qs.set("codigo", codigo);
    if (severidad) qs.set("severidad", severidad);
    if (searchTerm) qs.set("searchTerm", searchTerm);
    if (startDate) qs.set("startDate", startDate);
    if (endDate) qs.set("endDate", endDate);

    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const url = `${API_CONFIG.API_BASE}/quizzes/resultados/export?${qs.toString()}`;

    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-institution-id': String(institutionId)
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error exporting data');
      }
      return response.blob();
    });
  },
  analytics: ({ institutionId, codigo, desde, hasta, semestre, genero, carrera }) => {
    const qs = new URLSearchParams();
    if (codigo) qs.set("codigo", codigo);
    if (desde) qs.set("desde", desde);
    if (hasta) qs.set("hasta", hasta);
    if (semestre) qs.set("semestre", semestre);
    if (genero) qs.set("genero", genero);
    if (carrera) qs.set("carrera", carrera);
    return authFetch(`/quizzes/analytics?${qs.toString()}`, { institutionId });
  },
  exportAnalytics: ({ institutionId, codigo, desde, hasta, semestre, genero, carrera }) => {
    const qs = new URLSearchParams();
    if (codigo) qs.set("codigo", codigo);
    if (desde) qs.set("desde", desde);
    if (hasta) qs.set("hasta", hasta);
    if (semestre) qs.set("semestre", semestre);
    if (genero) qs.set("genero", genero);
    if (carrera) qs.set("carrera", carrera);

    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const url = `${API_CONFIG.API_BASE}/quizzes/analytics/export?${qs.toString()}`;

    // Crear y hacer click en un enlace de descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_${new Date().toISOString().split('T')[0]}.csv`;

    // Agregar headers de autorización
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-institution-id': String(institutionId)
      }
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `analytics_${institutionId}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    })
    .catch(error => console.error('Error downloading CSV:', error));
  },
};
