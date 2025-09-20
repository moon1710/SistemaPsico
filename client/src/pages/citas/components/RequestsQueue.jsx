// client/src/pages/citas/components/RequestsQueue.jsx
import React from "react";
import {
  getOpenRequests,
  claimRequest,
  releaseRequest,
  scheduleRequest,
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

export default function RequestsQueue({ institutionId }) {
  const { setMsg, Toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [scheduling, setScheduling] = React.useState(null); // the request being scheduled
  const [busyId, setBusyId] = React.useState(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getOpenRequests({ institutionId });
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

  async function handleClaim(id) {
    setBusyId(id);
    try {
      const res = await claimRequest(id, { institutionId });
      // Optimistically mark as ASIGNADA
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, estado: "ASIGNADA" } : it))
      );
      setMsg("Solicitud reclamada. Ahora puedes agendar.");
    } catch (e) {
      if (e?.response?.status === 409) {
        setMsg("Otro usuario tomó esta solicitud.");
      } else {
        setMsg(e?.response?.data?.message || "No se pudo reclamar.");
      }
      // Refresh to reflect server truth
      fetchData();
    } finally {
      setBusyId(null);
    }
  }

  async function handleRelease(id) {
    setBusyId(id);
    try {
      await releaseRequest(id, { institutionId });
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, estado: "SOLICITADA" } : it))
      );
      setMsg("Solicitud liberada.");
    } catch (e) {
      setMsg(e?.response?.data?.message || "No se pudo liberar.");
      fetchData();
    } finally {
      setBusyId(null);
    }
  }

  function openScheduleDialog(item) {
    if (item?.estado !== "ASIGNADA") {
      setMsg("Primero reclama la solicitud para agendar.");
      return;
    }
    setScheduling({ id: item.id, fechaHora: "", duracion: 45 });
  }

  async function confirmSchedule() {
    if (!scheduling?.fechaHora || !scheduling?.duracion) return;
    const id = scheduling.id;
    setBusyId(id);
    try {
      const iso = new Date(scheduling.fechaHora).toISOString();
      await scheduleRequest(
        id,
        { fechaHora: iso, duracion: Number(scheduling.duracion) },
        { institutionId }
      );
      setMsg("Cita programada.");
      setScheduling(null);
      // After scheduling, remove from queue (or refetch)
      fetchData();
    } catch (e) {
      if (e?.response?.status === 409) {
        setMsg("Conflicto: ya fue programada por otra persona.");
      } else {
        setMsg(e?.response?.data?.message || "No se pudo programar.");
      }
      fetchData();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="p-4">
      <Toast />
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Solicitudes abiertas</h2>
        <button
          onClick={fetchData}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50"
        >
          Refrescar
        </button>
      </div>

      {loading && <p className="text-gray-500">Cargando solicitudes…</p>}
      {error && (
        <p className="text-red-600">
          Error: <span className="font-medium">{error}</span>
        </p>
      )}
      {!loading && !error && items.length === 0 && (
        <p className="text-gray-500">No hay solicitudes abiertas.</p>
      )}

      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="p-4 bg-white border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <div className="font-medium">
                {it.alumnoNombre || "Estudiante sin nombre"}
              </div>
              <div className="text-sm text-gray-600">
                Severidad:{" "}
                <span className="font-medium">{it.severidad || "—"}</span> ·
                Origen: <span className="font-medium">{it.source || "—"}</span>{" "}
                · Estado:{" "}
                <span className="font-medium">{it.estado || "SOLICITADA"}</span>
              </div>
              <div className="text-xs text-gray-500">
                Creada: {formatDate(it.fechaCreacion)}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                disabled={busyId === it.id}
                onClick={() => handleClaim(it.id)}
                className="px-3 py-1.5 rounded bg-indigo-600 text-white text-sm disabled:opacity-50"
              >
                Reclamar
              </button>

              <button
                disabled={busyId === it.id || it.estado !== "ASIGNADA"}
                onClick={() => openScheduleDialog(it)}
                className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm disabled:opacity-50"
              >
                Agendar
              </button>

              <button
                disabled={busyId === it.id || it.estado !== "ASIGNADA"}
                onClick={() => handleRelease(it.id)}
                className="px-3 py-1.5 rounded bg-gray-200 text-gray-800 text-sm disabled:opacity-50"
              >
                Liberar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Schedule Dialog */}
      {scheduling && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-5">
            <h3 className="text-lg font-semibold mb-3">Programar cita</h3>
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm text-gray-700">Fecha y hora</span>
                <input
                  type="datetime-local"
                  className="mt-1 block w-full border rounded px-3 py-2"
                  value={scheduling.fechaHora}
                  onChange={(e) =>
                    setScheduling((s) => ({ ...s, fechaHora: e.target.value }))
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-700">Duración (min)</span>
                <input
                  type="number"
                  min={15}
                  step={5}
                  className="mt-1 block w-full border rounded px-3 py-2"
                  value={scheduling.duracion}
                  onChange={(e) =>
                    setScheduling((s) => ({
                      ...s,
                      duracion: Number(e.target.value || 0),
                    }))
                  }
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setScheduling(null)}
                className="px-3 py-1.5 rounded border border-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSchedule}
                className="px-3 py-1.5 rounded bg-indigo-600 text-white"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
