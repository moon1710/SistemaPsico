import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizzesApi } from "../../services/quizzesService";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

/* =========================
   PALETA (tus colores originales)
   ========================= */
const QUIZ_THEMES = {
  BAI: {
    name: "Ansiedad",
    primary: "#6366F1", // Indigo
    secondary: "#EEF2FF",
    accent: "#4F46E5",
    gradient: "from-indigo-500 to-purple-600",
  },
  BDI2: {
    name: "Depresión",
    primary: "#3B82F6", // Blue
    secondary: "#EFF6FF",
    accent: "#2563EB",
    gradient: "from-blue-500 to-indigo-600",
  },
  PHQ9: {
    name: "Estado de Ánimo",
    primary: "#06B6D4", // Cyan
    secondary: "#ECFEFF",
    accent: "#0891B2",
    gradient: "from-cyan-500 to-blue-600",
  },
  GAD7: {
    name: "Ansiedad Generalizada",
    primary: "#8B5CF6", // Violet
    secondary: "#F5F3FF",
    accent: "#7C3AED",
    gradient: "from-violet-500 to-purple-600",
  },
  DEFAULT: {
    name: "Evaluación",
    primary: "#6366F1",
    secondary: "#F1F5F9",
    accent: "#475569",
    gradient: "from-slate-600 to-slate-700",
  },
};

/* =========================
   UTILS
   ========================= */
function parseOpciones(opciones) {
  if (!opciones) {
    return [
      { value: 0, label: "0", description: "Nada en absoluto" },
      { value: 1, label: "1", description: "Un poco" },
      { value: 2, label: "2", description: "Moderadamente" },
      { value: 3, label: "3", description: "Mucho" },
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

/* =========================
   COMPONENTES UI
   ========================= */

// Tira superior numerada (clickeable)
const StepStrip = ({ total, current, answeredMap, onJump, theme }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {Array.from({ length: total }).map((_, i) => {
        const answered = answeredMap[i];
        const isCurrent = i === current;
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={[
              "min-w-8 h-8 px-2 rounded-full text-xs font-semibold transition border",
              isCurrent
                ? "text-white shadow"
                : "text-gray-600 hover:text-gray-900 bg-white",
            ].join(" ")}
            style={{
              background: isCurrent
                ? theme.primary
                : answered
                ? theme.secondary
                : "#ffffff",
              borderColor: isCurrent ? theme.primary : "#e5e7eb",
              color: isCurrent ? "#fff" : answered ? theme.accent : undefined,
            }}
            aria-label={`Ir a la pregunta ${i + 1}`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
};

// Opción tipo “pill” vertical (como tus screens)
const OptionPill = ({ selected, label, description, onSelect, theme }) => {
  return (
    <button
      onClick={onSelect}
      className={[
        "w-full flex items-center gap-3 rounded-full px-4 py-3 border-2 transition text-left",
        "focus:outline-none focus:ring-2",
        selected ? "shadow-lg" : "hover:border-gray-300 hover:bg-gray-50",
      ].join(" ")}
      style={{
        borderColor: selected ? theme.primary : "#e5e7eb",
        background: selected ? theme.primary : "#ffffff",
        color: selected ? "#ffffff" : "#111827",
      }}
    >
      {/* radio a la izquierda */}
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2"
        style={{
          borderColor: selected ? "#fff" : "#9ca3af",
          background: selected ? "#fff" : "transparent",
          color: selected ? theme.primary : "#9ca3af",
        }}
      >
        {selected ? (
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: theme.primary }}
          />
        ) : null}
      </span>

      <div className="flex-1">
        <div className="text-sm font-semibold leading-none">{label}</div>
        {description && (
          <div
            className="text-xs mt-1"
            style={{ color: selected ? "#f3f4f6" : "#4b5563" }}
          >
            {description}
          </div>
        )}
      </div>

      {selected && (
        <CheckCircleIcon className="w-5 h-5" style={{ color: "#fff" }} />
      )}
    </button>
  );
};

function QuestionSlide({
  question,
  value,
  onChange,
  theme,
  questionNumber,
  totalQuestions,
  onAutoAdvance,
  answeredMap,
  onJump,
}) {
  const options = parseOpciones(question.opciones);

  const handleOptionSelect = (questionId, optionValue) => {
    onChange(questionId, optionValue);
    setTimeout(onAutoAdvance, 350);
  };

  return (
    <div
      className="flex flex-col h-screen bg-gray-50"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Evaluación {theme.name}
              </h1>
              <p className="text-xs text-gray-500">
                Pregunta {questionNumber} de {totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {Math.round((questionNumber / totalQuestions) * 100)}%
              </div>
              <div className="text-xs text-gray-500">Completado</div>
            </div>
          </div>

          {/* tira numerada */}
          <div className="mt-3">
            <StepStrip
              total={totalQuestions}
              current={questionNumber - 1}
              answeredMap={answeredMap}
              onJump={onJump}
              theme={theme}
            />
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                {question.texto}
              </h2>
              {question.obligatoria && (
                <span className="inline-block mt-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  Obligatoria
                </span>
              )}
            </div>

            {/* Lista vertical como en el screenshot */}
            <div className="space-y-3">
              {options.map((o) => (
                <OptionPill
                  key={o.value}
                  selected={Number(value) === Number(o.value)}
                  label={o.label}
                  description={o.description}
                  onSelect={() =>
                    handleOptionSelect(question.id, Number(o.value))
                  }
                  theme={theme}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer simple con contador legible */}
      <div className="bg-white/90 backdrop-blur border-t border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Anterior</span>
          </button>

          <div className="text-sm font-semibold text-gray-900">
            {questionNumber}{" "}
            <span className="text-gray-500">/ {totalQuestions}</span>
          </div>

          <button
            onClick={onAutoAdvance}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white"
            style={{ background: theme.primary }}
          >
            <span className="text-sm font-medium">Siguiente</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   PÁGINA
   ========================= */
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
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [showingConsent, setShowingConsent] = React.useState(true);

  const startedAtRef = React.useRef(new Date().toISOString());

  const [institutionId, setInstitutionId] = React.useState(
    user?.instituciones?.find((m) => m.isMembershipActiva)?.institucionId ||
      user?.instituciones?.[0]?.institucionId ||
      ""
  );

  const theme = React.useMemo(() => {
    if (!quiz?.codigo) return QUIZ_THEMES.DEFAULT;
    return QUIZ_THEMES[quiz.codigo.toUpperCase()] || QUIZ_THEMES.DEFAULT;
  }, [quiz?.codigo]);

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
        setError(e?.data?.message || e.message || "Error cargando quiz")
      )
      .finally(() => setLoading(false));
    return () => (alive = false);
  }, [quizId]);

  const setAnswer = (pid, value) =>
    setRespuestas((prev) => ({ ...prev, [pid]: value }));

  const unansweredRequired = React.useMemo(
    () => preguntas.filter((p) => p.obligatoria && respuestas[p.id] == null),
    [preguntas, respuestas]
  );

  const answeredCount = React.useMemo(
    () => preguntas.filter((p) => respuestas[p.id] != null).length,
    [preguntas, respuestas]
  );

  const canSubmit = consent && unansweredRequired.length === 0 && !submitting;
  const currentQuestion = preguntas[currentSlide];

  const handleAutoAdvance = () => {
    setCurrentSlide((prev) => (prev < preguntas.length - 1 ? prev + 1 : prev));
  };
  const jumpTo = (idx) => {
    if (idx >= 0 && idx < preguntas.length) setCurrentSlide(idx);
  };

  const handleStartQuiz = () => {
    if (consent) setShowingConsent(false);
  };

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
        `¡Evaluación completada!\n\nPuntaje: ${data.puntajeTotal}\nNivel: ${data.severidad}`
      );
      navigate(ROUTES.MIS_RESULTADOS);
    } catch (e) {
      setError(e?.data?.message || e.message || "Error al enviar respuestas");
    } finally {
      setSubmitting(false);
    }
  };

  // atajos
  React.useEffect(() => {
    const handleKey = (e) => {
      if (showingConsent || !currentQuestion) return;
      if (e.key >= "0" && e.key <= "9") {
        const v = Math.min(3, Math.max(0, parseInt(e.key, 10)));
        setAnswer(currentQuestion.id, v);
        setTimeout(handleAutoAdvance, 200);
      }
      if (e.key === "ArrowLeft" && currentSlide > 0) {
        setCurrentSlide((p) => p - 1);
      }
      if (e.key === "ArrowRight" && currentSlide < preguntas.length - 1) {
        setCurrentSlide((p) => p + 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentSlide, currentQuestion, showingConsent, preguntas.length]);

  // loading / error / not found
  if (loading) {
    return (
      <div
        className="min-h-screen grid place-items-center bg-gray-50"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando evaluación...</p>
        </div>
      </div>
    );
  }
  if (error && !quiz) {
    return (
      <div
        className="min-h-screen grid place-items-center bg-gray-50"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl border">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  if (!quiz) {
    return (
      <div
        className="min-h-screen grid place-items-center bg-gray-50"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Evaluación no encontrada
          </h2>
          <p className="text-gray-600">
            La evaluación no existe o no está disponible.
          </p>
        </div>
      </div>
    );
  }

  // consentimiento (mantiene tu look)
  if (showingConsent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 p-6"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow"
                style={{ backgroundColor: theme.primary }}
              >
                {quiz.codigo}
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {quiz.titulo}
              </h1>
              <p className="text-sm text-gray-600">
                Evaluación de {theme.name}
              </p>
            </div>

            {quiz.descripcion && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {quiz.descripcion}
                </p>
              </div>
            )}

            {!!user?.instituciones?.length && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institución
                </label>
                <select
                  value={institutionId}
                  onChange={(e) => setInstitutionId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {user.instituciones.map((m) => (
                    <option key={m.institucionId} value={m.institucionId}>
                      {m.institucionNombre || m.institucionId}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <div className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium text-gray-900">
                    Consentimiento Informado.
                  </span>{" "}
                  Acepto participar voluntariamente en esta evaluación. La
                  información será tratada confidencialmente y utilizada para
                  fines académicos y de bienestar estudiantil.
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>
                <strong>{answeredCount}</strong> / {preguntas.length}{" "}
                respondidas
              </span>
              <span>~{Math.ceil(preguntas.length * 0.5)} min</span>
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={!consent}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                consent
                  ? `bg-gradient-to-r ${theme.gradient} text-white hover:shadow-lg`
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Iniciar Evaluación
            </button>
          </div>
        </div>
      </div>
    );
  }

  // pregunta
  if (currentQuestion) {
    const answeredMap = preguntas.map((p) => respuestas[p.id] != null);
    return (
      <QuestionSlide
        question={currentQuestion}
        value={respuestas[currentQuestion.id]}
        onChange={setAnswer}
        theme={theme}
        questionNumber={currentSlide + 1}
        totalQuestions={preguntas.length}
        onAutoAdvance={handleAutoAdvance}
        answeredMap={answeredMap}
        onJump={(i) => setCurrentSlide(i)}
      />
    );
  }

  return null;
}
