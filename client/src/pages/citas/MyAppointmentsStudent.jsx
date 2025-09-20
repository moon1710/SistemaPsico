// client/src/pages/citas/MyAppointmentsStudent.jsx
import React from "react";
import { getMyAppointments } from "../../services/citasService";

function formatDate(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt || "—";
  }
}

export default function MyAppointmentsStudent() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [items, setItems] = React.useState([]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyAppointments({ role: "STUDENT" });
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Mis citas</h1>
      </header>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Próximas citas</h2>
          <button
            onClick={fetchData}
            className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
          >
            Refrescar
          </button>
        </div>

        {loading && <p className="text-gray-500">Cargando…</p>}
        {error && (
          <p className="text-red-600">
            Error: <span className="font-medium">{error}</span>
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-gray-500">No tienes citas próximas.</p>
        )}

        <ul className="space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="p-4 bg-white border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="font-medium">{formatDate(it.fechaHora)}</div>
                <div className="text-sm text-gray-600">
                  Psicólogo:{" "}
                  <span className="font-medium">
                    {it.psicologoNombre || "—"}
                  </span>{" "}
                  · Estado:{" "}
                  <span className="font-medium">{it.estado || "—"}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Duración: {it.duracion ? `${it.duracion} min` : "—"}
                </div>
              </div>
              <div className="text-xs text-gray-500">ID: {it.id}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
