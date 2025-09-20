// client/src/pages/citas/components/Availability.jsx
import React from "react";
import { publishSlots, getOpenSlots } from "../../../services/citasService";

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

function isoPlusDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function formatDate(dt) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt || "—";
  }
}

export default function Availability({ institutionId, currentUser }) {
  const { setMsg, Toast } = useToast();
  const [dt, setDt] = React.useState("");
  const [dur, setDur] = React.useState(45);
  const [blocks, setBlocks] = React.useState([]);
  const [publishing, setPublishing] = React.useState(false);
  const [myOpenSlots, setMyOpenSlots] = React.useState([]);
  const [loadingSlots, setLoadingSlots] = React.useState(false);

  const psicologoId = currentUser?.id;

  function addBlock() {
    if (!dt || !dur) return;
    setBlocks((prev) => [...prev, { fechaHora: dt, duracion: Number(dur) }]);
    setDt("");
    setDur(45);
  }

  async function handlePublish() {
    if (blocks.length === 0) {
      setMsg("Agrega al menos un bloque.");
      return;
    }
    setPublishing(true);
    try {
      const payload = {
        blocks: blocks.map((b) => ({
          fechaHora: new Date(b.fechaHora).toISOString(),
          duracion: Number(b.duracion),
        })),
      };
      await publishSlots(payload, { institutionId });
      setMsg("Disponibilidad publicada.");
      setBlocks([]);
      fetchMyOpenSlots(); // refresh
    } catch (e) {
      setMsg(e?.response?.data?.message || "No se pudo publicar.");
    } finally {
      setPublishing(false);
    }
  }

  const fetchMyOpenSlots = React.useCallback(async () => {
    if (!psicologoId) return;
    setLoadingSlots(true);
    try {
      const now = new Date().toISOString();
      const twoWeeks = isoPlusDays(14);
      const data = await getOpenSlots({
        from: now,
        to: twoWeeks,
        psicologoId,
        institutionId,
      });
      setMyOpenSlots(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      // Silent-ish; optional section
    } finally {
      setLoadingSlots(false);
    }
  }, [psicologoId, institutionId]);

  React.useEffect(() => {
    fetchMyOpenSlots();
  }, [fetchMyOpenSlots]);

  return (
    <div className="p-4 space-y-6">
      <Toast />
      <div>
        <h2 className="text-lg font-semibold mb-2">Publicar disponibilidad</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm text-gray-700">Fecha y hora</span>
            <input
              type="datetime-local"
              className="mt-1 block w-full border rounded px-3 py-2"
              value={dt}
              onChange={(e) => setDt(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Duración (min)</span>
            <input
              type="number"
              min={15}
              step={5}
              className="mt-1 block w-full border rounded px-3 py-2"
              value={dur}
              onChange={(e) => setDur(Number(e.target.value || 0))}
            />
          </label>
          <div className="flex items-end">
            <button
              onClick={addBlock}
              className="w-full md:w-auto px-3 py-2 rounded bg-gray-800 text-white"
            >
              Agregar bloque
            </button>
          </div>
        </div>

        {blocks.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Bloques a publicar
            </h3>
            <ul className="space-y-2">
              {blocks.map((b, i) => (
                <li
                  key={`${b.fechaHora}-${i}`}
                  className="flex items-center justify-between border rounded px-3 py-2"
                >
                  <div>
                    <div className="font-medium">{formatDate(b.fechaHora)}</div>
                    <div className="text-xs text-gray-600">
                      Duración: {b.duracion} min
                    </div>
                  </div>
                  <button
                    className="text-sm text-rose-600"
                    onClick={() =>
                      setBlocks((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-3">
              <button
                disabled={publishing}
                onClick={handlePublish}
                className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
              >
                {publishing ? "Publicando…" : "Publicar disponibilidad"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">
          Mis slots abiertos (14 días)
        </h2>
        {loadingSlots && <p className="text-gray-500">Cargando slots…</p>}
        {!loadingSlots && myOpenSlots.length === 0 && (
          <p className="text-gray-500">No tienes slots abiertos.</p>
        )}
        <ul className="space-y-2">
          {myOpenSlots.map((s) => (
            <li
              key={s.id}
              className="border rounded px-3 py-2 bg-white flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{formatDate(s.fechaHora)}</div>
                <div className="text-xs text-gray-600">
                  Duración: {s.duracion} min
                </div>
              </div>
              <span className="text-xs text-gray-500">ABIERTA</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
