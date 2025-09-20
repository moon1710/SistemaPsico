// client/src/pages/citas/components/MyAppointmentsStaff.jsx
import React from "react";
import {
  getMyAppointments,
  updateStatus,
} from "../../../services/citasService";

function useToast() {
  const [msg, setMsg] = React.useState("");
  React.useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(""), 3000);
    return () => clearTimeout(t);
  }, [msg]);
  const Toast = () =>
    msg ? (
      <div className="fixed top-4 right-4 bg-gray-900 text-white text-sm px-4 py-2 rounded shadow">
        {msg}
      </div>
    ) : null;
  return { setMsg, Toast };
}

function formatDate(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt || "—";
  }
}

const ACTIONS = [
  { key: "CONFIRMADA", label: "Confirmar", tone: "bg-blue-600" },
  { key: "EN_PROGRESO", label: "Iniciar", tone: "bg-amber-600" },
  { key: "COMPLETADA", label: "Completar", tone: "bg-emerald-600" },
  { key: "CANCELADA", label: "Cancelar", tone: "bg-gray-400" },
  { key: "NO_ASISTIO", label: "No asistió", tone: "bg-rose-600" },
];

export default function MyAppointmentsStaff({ institutionId }) {
  const { setMsg, Toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [updatingId, setUpdatingId] = React.useState("");

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyAppointments({
        role: "STAFF",
        institutionId,
      });
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Error al cargar");
    } finally {
      setLoading(false);
    }
  }, [institutionId]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function doUpdate(id, estado) {
    setUpdatingId(id);
    try {
      await updateStatus(id, { estado }, { institutionId });
      setMsg("Estado actualizado.");
      fetchData();
    } catch (e) {
      setMsg(e?.response?.data?.message || "No se pudo actualizar.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="p-4">
      <Toast />
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Mis citas</h2>
        <button
          onClick={fetchData}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
        >
          Refrescar
        </button>
      </div>

      {loading && <p className="text-gray-500">Cargando citas…</p>}
      {error && (
        <p className="text-red-600">
          Error: <span className="font-medium">{error}</span>
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500">No tienes citas próximas.</p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-3 py-2">Fecha y hora</th>
              <th className="text-left px-3 py-2">Alumno</th>
              <th className="text-left px-3 py-2">Estado</th>
              <th className="text-left px-3 py-2">Duración</th>
              <th className="text-left px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t">
                <td className="px-3 py-2">{formatDate(it.fechaHora)}</td>
                <td className="px-3 py-2">{it.alumnoNombre || "—"}</td>
                <td className="px-3 py-2">
                  <span className="inline-block rounded bg-gray-100 px-2 py-1 text-xs">
                    {it.estado || "—"}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {it.duracion ? `${it.duracion} min` : "—"}
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {ACTIONS.map((a) => (
                      <button
                        key={a.key}
                        disabled={updatingId === it.id}
                        onClick={() => doUpdate(it.id, a.key)}
                        className={`px-2.5 py-1 rounded text-white ${a.tone} text-xs disabled:opacity-50`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
