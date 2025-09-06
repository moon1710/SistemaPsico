// src/pages/ConfidencialidadPage.jsx
import { useLocation } from "react-router-dom";
export default function ConfidencialidadPage() {
  const { pathname } = useLocation();
  return (
    <div className="p-6 text-lg">
      Estás en: <code>{pathname}</code> — Confidencialidad
    </div>
  );
}
