import React from "react";
import { Link } from "react-router-dom";
import { quizzesApi } from "../../services/quizzesService";
import { ROUTES } from "../../utils/constants";

export default function PublicQuizzesPage() {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let alive = true;
    quizzesApi
      .listPublic()
      .then((res) => alive && setItems(res.data || []))
      .catch((e) =>
        setError(e.data?.message || e.message || "Error cargando quizzes")
      )
      .finally(() => setLoading(false));
    return () => (alive = false);
  }, []);

  if (loading) return <div className="p-6">Cargando quizzes...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Quizzes disponibles</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">No hay quizzes públicos activos.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((q) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border p-4 shadow-sm"
            >
              <h2 className="font-medium text-gray-900">{q.titulo}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Código: <span className="font-mono">{q.codigo}</span> · Versión{" "}
                {q.version}
              </p>
              {q.descripcion && (
                <p className="text-sm text-gray-600 mt-2">{q.descripcion}</p>
              )}
              <div className="mt-4">
                <Link
                  to={ROUTES.QUIZ_CONTESTAR_DETALLE.replace(":quizId", q.id)}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Resolver
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
