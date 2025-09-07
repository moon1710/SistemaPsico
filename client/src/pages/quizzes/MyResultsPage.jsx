import React from "react";
import { quizzesApi } from "../../services/quizzesService";
import SeverityBadge from "../../components/quizzes/SeverityBadge";

export default function MyResultsPage() {
  const [loading, setLoading] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    quizzesApi
      .myResults()
      .then((res) => alive && setRows(res.data || []))
      .catch((e) =>
        setError(e.data?.message || e.message || "Error cargando resultados")
      )
      .finally(() => setLoading(false));
    return () => (alive = false);
  }, []);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Mis resultados</h1>
      {rows.length === 0 ? (
        <p className="text-gray-600">Aún no tienes resultados.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Quiz</th>
                <th className="text-left p-3">Código</th>
                <th className="text-left p-3">Versión</th>
                <th className="text-left p-3">Puntaje</th>
                <th className="text-left p-3">Severidad</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">
                    {new Date(r.fechaEnvio).toLocaleString()}
                  </td>
                  <td className="p-3">{r.titulo}</td>
                  <td className="p-3 font-mono">{r.codigo}</td>
                  <td className="p-3">{r.version}</td>
                  <td className="p-3">{r.puntajeTotal}</td>
                  <td className="p-3">
                    <SeverityBadge value={r.severidad} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
