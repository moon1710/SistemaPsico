import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizzesApi } from "../../services/quizzesService";
import QuizQuestion from "../../components/quizzes/QuizQuestion";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";

export default function TakeQuizPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = React.useState(null);
  const [preguntas, setPreguntas] = React.useState([]);
  const [respuestas, setRespuestas] = React.useState({});
  const [consent, setConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const startedAtRef = React.useRef(new Date().toISOString());

  const [institutionId, setInstitutionId] = React.useState(
    user?.instituciones?.find((m) => m.isMembershipActiva)?.institucionId ||
      user?.instituciones?.[0]?.institucionId ||
      ""
  );

  React.useEffect(() => {
    let alive = true;
    quizzesApi
      .getQuiz(quizId)
      .then((res) => {
        if (!alive) return;
        setQuiz(res.data?.quiz || null);
        setPreguntas(res.data?.preguntas || []);
      })
      .catch((e) =>
        setError(e.data?.message || e.message || "Error cargando quiz")
      )
      .finally(() => setLoading(false));
    return () => (alive = false);
  }, [quizId]);

  const setAnswer = (pid, value) =>
    setRespuestas((p) => ({ ...p, [pid]: value }));

  const unansweredRequired = React.useMemo(
    () => preguntas.filter((p) => p.obligatoria && respuestas[p.id] == null),
    [preguntas, respuestas]
  );

  const canSubmit = consent && unansweredRequired.length === 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        quizId,
        respuestas: preguntas.map((p) => ({
          preguntaId: p.id,
          valor: Number(respuestas[p.id] ?? 0),
        })),
        consentimientoAceptado: consent,
        tiempoInicio: startedAtRef.current,
        institutionId: institutionId || undefined,
      };
      const { data } = await quizzesApi.submitQuiz(payload);
      alert(
        `¡Enviado!\nPuntaje total: ${data.puntajeTotal}\nSeveridad: ${data.severidad}`
      );
      navigate(ROUTES.MIS_RESULTADOS);
    } catch (e) {
      setError(e.data?.message || e.message || "Error al enviar respuestas");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!quiz) return <div className="p-6">Quiz no encontrado.</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl p-5 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {quiz.titulo}
            </h1>
            <p className="text-sm text-gray-500">
              Código <span className="font-mono">{quiz.codigo}</span> · Versión{" "}
              {quiz.version}
            </p>
          </div>

          {!!user?.instituciones?.length && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Institución:</label>
              <select
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                className="border rounded-lg px-2 py-1 text-sm"
              >
                {user.instituciones.map((m) => (
                  <option key={m.institucionId} value={m.institucionId}>
                    {m.institucionNombre || m.institucionId}
                    {m.isMembershipActiva ? " · activa" : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {quiz.descripcion && (
          <p className="text-gray-700 mt-3">{quiz.descripcion}</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span className="text-sm text-gray-700">
            Acepto el consentimiento informado y autorizo el uso de mis
            respuestas con fines de evaluación y seguimiento.
          </span>
        </label>
      </div>

      <div className="space-y-4">
        {preguntas.map((q) => (
          <QuizQuestion
            key={q.id}
            q={q}
            value={respuestas[q.id]}
            onChange={setAnswer}
          />
        ))}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Responde todas las preguntas obligatorias.
        </p>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`px-4 py-2 rounded-lg text-white ${
            canSubmit
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? "Enviando..." : "Enviar respuestas"}
        </button>
      </div>
    </div>
  );
}
