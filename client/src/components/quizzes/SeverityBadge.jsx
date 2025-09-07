import React from "react";

const color = {
  MINIMA: "bg-green-100 text-green-700",
  LEVE: "bg-yellow-100 text-yellow-700",
  MODERADA: "bg-orange-100 text-orange-700",
  SEVERA: "bg-red-100 text-red-700",
};

export default function SeverityBadge({ value }) {
  const cls = color[value] || "bg-gray-100 text-gray-700";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
      {value || "N/D"}
    </span>
  );
}
