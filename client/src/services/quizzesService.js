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
  myResults: () => authFetch("/quizzes/me/results"),
  adminResults: ({
    institutionId,
    codigo,
    severidad,
    page = 1,
    pageSize = 20,
  }) => {
    const qs = new URLSearchParams();
    if (codigo) qs.set("codigo", codigo);
    if (severidad) qs.set("severidad", severidad);
    if (page) qs.set("page", page);
    if (pageSize) qs.set("pageSize", pageSize);
    return authFetch(`/quizzes/resultados?${qs.toString()}`, { institutionId });
  },
  analytics: ({ institutionId, codigo, desde, hasta }) => {
    const qs = new URLSearchParams();
    if (codigo) qs.set("codigo", codigo);
    if (desde) qs.set("desde", desde);
    if (hasta) qs.set("hasta", hasta);
    return authFetch(`/quizzes/analytics?${qs.toString()}`, { institutionId });
  },
};
