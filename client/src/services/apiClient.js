//Lo ando haciendo rapido ahi luego le mueves tu :P
// client/src/utils/apiClient.js
import { API_CONFIG, STORAGE_KEYS } from "./constants";

export async function apiFetch(path, { method = "GET", headers = {}, body, signal } = {}) {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  const res = await fetch(`${API_CONFIG.API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = isJson ? data?.message : res.statusText;
    const error = new Error(message || "Request failed");
    error.status = res.status;
    error.data = isJson ? data : undefined;
    throw error;
  }
  return data;
}
