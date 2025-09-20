import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizzesApi } from "../../services/quizzesService";
import QuizQuestion from "../../components/quizzes/QuizQuestion";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

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
  const [timeElapsed, setTimeElapsed] = React.useState(0);
  const [showWarnings, setShowWarnings] = React.useState(true);
  const startedAtRef = React.useRef(new Date().toISOString());

  const [institutionId, setInstitutionId] = React.useState(
    user?.instituciones?.find((m) => m.isMembershipActiva)?.institucionId ||
      user?.instituciones?.[0]?.institucionId ||
      ""
  );

  // Timer effect
  React.useEffect(() => {
    if (loading || submitting) return;
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, submitting]);

  React.useEffect(() => {
    let alive = true;
    quizzesApi
      .getQuiz(quizId)
      .then((res) => {
        if (!alive) return;
        setQuiz(res.data?.quiz || null);
        setPreguntas(res.data?.preguntas || []);
        startedAtRef.current = new Date().toISOString();
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

  const progressStats = React.useMemo(() => {
    const totalQuestions = preguntas.length;
    const answeredQuestions = Object.keys(respuestas).filter(id => respuestas[id] != null).length;
    const requiredQuestions = preguntas.filter(p => p.obligatoria).length;
    const answeredRequired = preguntas.filter(p => p.obligatoria && respuestas[p.id] != null).length;

    return {
      totalQuestions,
      answeredQuestions,
      requiredQuestions,
      answeredRequired,
      progressPercentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
      requiredProgress: requiredQuestions > 0 ? Math.round((answeredRequired / requiredQuestions) * 100) : 100
    };
  }, [preguntas, respuestas]);

  const canSubmit = consent && unansweredRequired.length === 0 && !submitting;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // Final validation
    if (unansweredRequired.length > 0) {
      setError(`Faltan ${unansweredRequired.length} preguntas obligatorias por responder.`);
      return;
    }

    const isConfirmed = window.confirm(
      `¿Estás seguro de enviar tus respuestas?\n\n` +
      `• Preguntas respondidas: ${progressStats.answeredQuestions}/${progressStats.totalQuestions}\n` +
      `• Tiempo empleado: ${formatTime(timeElapsed)}\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!isConfirmed) return;

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

      // Success feedback with better formatting
      const successMessage = [
        "✅ ¡Quiz completado exitosamente!",
        "",
        `📊 Puntaje total: ${data.puntajeTotal}`,
        `📈 Nivel de severidad: ${data.severidad}`,
        `⏱️ Tiempo empleado: ${formatTime(timeElapsed)}`,
        "",
        "Redirigiendo a tus resultados..."
      ].join("\n");

      alert(successMessage);
      navigate(ROUTES.MIS_RESULTADOS);
    } catch (e) {
      setError(e.data?.message || e.message || "Error al enviar respuestas");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quiz no encontrado</h2>
          <p className="text-gray-600">El quiz que buscas no existe o no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header with Progress */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{quiz.titulo}</h1>
              <p className="text-sm text-gray-500">
                Código <span className="font-mono">{quiz.codigo}</span> · Versión {quiz.version}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4" />
                <span>{progressStats.answeredQuestions}/{progressStats.totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressStats.progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Progreso: {progressStats.progressPercentage}%</span>
            <span>Obligatorias: {progressStats.answeredRequired}/{progressStats.requiredQuestions}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Quiz Description */}
        {quiz.descripcion && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-medium text-gray-900 mb-2">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{quiz.descripcion}</p>
          </div>
        )}

        {/* Institution Selector */}
        {!!user?.instituciones?.length && (
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="font-medium text-gray-900 mb-3">Institución</h3>
            <select
              value={institutionId}
              onChange={(e) => setInstitutionId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {user.instituciones.map((m) => (
                <option key={m.institucionId} value={m.institucionId}>
                  {m.institucionNombre || m.institucionId}
                  {m.isMembershipActiva ? " (Activa)" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Consent */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <div>
              <span className="font-medium text-gray-900 block mb-1">Consentimiento Informado</span>
              <span className="text-sm text-gray-700">
                Acepto el consentimiento informado y autorizo el uso de mis respuestas con fines de evaluación y seguimiento.
                Entiendo que la información será tratada de manera confidencial y utilizada únicamente para propósitos académicos y de bienestar estudiantil.
              </span>
            </div>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Warning for unanswered required questions */}
        {showWarnings && unansweredRequired.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Preguntas obligatorias pendientes
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Aún faltan {unansweredRequired.length} preguntas obligatorias por responder.
                </p>
              </div>
              <button
                onClick={() => setShowWarnings(false)}
                className="text-yellow-500 hover:text-yellow-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {preguntas.map((q) => (
            <QuizQuestion
              key={q.id}
              q={q}
              value={respuestas[q.id]}
              onChange={setAnswer}
              isAnswered={respuestas[q.id] != null}
            />
          ))}
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900">¿Listo para enviar?</p>
              <p className="text-sm text-gray-600">
                Revisa tus respuestas antes de enviar. Esta acción no se puede deshacer.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                canSubmit
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </span>
              ) : (
                "Enviar respuestas"
              )}
            </button>
          </div>

          {!canSubmit && !submitting && (
            <div className="mt-4 text-sm text-gray-500">
              {!consent && "• Acepta el consentimiento informado"}
              {unansweredRequired.length > 0 && "• Completa todas las preguntas obligatorias"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
