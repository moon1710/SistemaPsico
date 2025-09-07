import React from "react";

function parseOpciones(opciones) {
  if (!opciones) {
    return [
      { value: 0, label: "0 - Nada" },
      { value: 1, label: "1 - Leve" },
      { value: 2, label: "2 - Moderado" },
      { value: 3, label: "3 - Severo" },
    ];
  }
  try {
    const arr = typeof opciones === "string" ? JSON.parse(opciones) : opciones;
    return arr.map((o, i) =>
      typeof o === "number"
        ? { value: o, label: `${o}` }
        : typeof o?.value !== "undefined"
        ? o
        : { value: i, label: String(o) }
    );
  } catch {
    return [
      { value: 0, label: "0" },
      { value: 1, label: "1" },
      { value: 2, label: "2" },
      { value: 3, label: "3" },
    ];
  }
}

export default function QuizQuestion({ q, value, onChange }) {
  const options = parseOpciones(q.opciones);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="mb-3">
        <p className="text-sm text-gray-500">Pregunta {q.orden}</p>
        <p className="text-base font-medium text-gray-900">{q.texto}</p>
      </div>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={`q-${q.id}`}
              value={opt.value}
              checked={Number(value) === Number(opt.value)}
              onChange={(e) => onChange(q.id, Number(e.target.value))}
              className="h-4 w-4"
            />
            <span className="text-gray-800">{opt.label}</span>
          </label>
        ))}
      </div>
      {q.obligatoria && value == null && (
        <p className="text-xs text-red-600 mt-2">
          Esta pregunta es obligatoria.
        </p>
      )}
    </div>
  );
}
