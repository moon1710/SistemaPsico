import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  AlertCircle,
  BookOpen,
  Target,
  SendHorizonal,
  Loader2,
  CheckCircle,
  Heart,
  Brain,
  CalendarDays,
  X,
} from "lucide-react";
import { apiFetch } from "../../services/api";
import {API_ENDPOINTS } from "../../utils/constants";

// Optional: if you can provide this from your app state, we’ll send it as header
// so backend can fix the institution context when needed.
const INSTITUTION_HEADER = "X-Institucion-Id";

const likertOptions = [
  { value: 0, label: "En absoluto", description: "No me ha molestado nada" },
  { value: 1, label: "Levemente", description: "No me ha molestado mucho" },
  {
    value: 2,
    label: "Moderadamente",
    description: "Me ha resultado desagradable pero pude soportarlo",
  },
  { value: 3, label: "Severamente", description: "Apenas pude soportarlo" },
];

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function toISO(date) {
  return new Date(date).toISOString();
}

const HighSeverityModal = ({
  open,
  onClose,
  severity,
  attemptId,
  fetchSlots,
  bookSlot,
  loadingSlots,
  slots,
  bookingId,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Resultado {severity}
              </h3>
              <p className="text-gray-600 text-sm">
                Respuesta: <span className="font-mono">{attemptId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <CalendarDays className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-gray-700">
              Puedes reservar un horario disponible publicado por los psicólogos
              de tu institución. Si no ves horarios, tu solicitud igualmente
              quedó registrada y el equipo te contactará.
            </p>
          </div>

          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold text-gray-800">
              Horarios disponibles (próximos 7 días)
            </h4>
            <button
              onClick={fetchSlots}
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              Actualizar
            </button>
          </div>

          <div className="max-h-72 overflow-auto rounded-xl border border-gray-200">
            {loadingSlots ? (
              <div className="flex items-center justify-center p-8 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Cargando horarios…
              </div>
            ) : slots.length === 0 ? (
              <div className="p-6 text-gray-600">No hay horarios ABIERTOS.</div>
            ) : (
              <ul className="divide-y">
                {slots.map((s) => {
                  const start = new Date(s.fechaHora);
                  const end = new Date(
                    start.getTime() + (s.duracion ?? 60) * 60000
                  );
                  return (
                    <li
                      key={s.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-gray-800">
                          {start.toLocaleDateString()} •{" "}
                          {start.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          –{" "}
                          {end.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          Duración: {s.duracion ?? 60} min
                        </div>
                      </div>
                      <button
                        onClick={() => bookSlot(s.id)}
                        disabled={bookingId === s.id}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          bookingId === s.id
                            ? "bg-gray-200 text-gray-500"
                            : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                        }`}
                      >
                        {bookingId === s.id ? "Reservando…" : "Reservar"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const QuizInterface = ({
  quizId,
  onComplete = () => {},
  activeInstitutionId = null, // if you have it, we’ll send X-Institucion-Id
}) => {
  const [currentStep, setCurrentStep] = useState("consent");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [timeStarted, setTimeStarted] = useState(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  // post-submit result
  const [result, setResult] = useState(null);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const extraHeaders = useMemo(
    () =>
      activeInstitutionId
        ? { [INSTITUTION_HEADER]: String(activeInstitutionId) }
        : {},
    [activeInstitutionId]
  );

  // Load quiz
  useEffect(() => {
    let abort = new AbortController();
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const data = await apiFetch(`/quizzes/${encodeURIComponent(quizId)}`, {
          headers: { ...extraHeaders },
          signal: abort.signal,
        });
        setQuiz(data.data);
      } catch (e) {
        setLoadError(e.message || "No se pudo cargar el cuestionario");
      } finally {
        setLoading(false);
      }
    }
    if (quizId) load();
    return () => abort.abort();
  }, [quizId, extraHeaders]);

  const handleConsentAccept = () => {
    setConsentAccepted(true);
    setCurrentStep("instructions");
    setTimeStarted(new Date().toISOString());
  };

  const handleStartQuiz = () => setCurrentStep("quiz");

  const handleAnswerChange = (questionId, value) => {
    // no parseInt — allow UUID/string ids
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getProgress = () => {
    if (currentStep === "quiz" && quiz?.preguntas?.length) {
      return ((currentQuestion + 1) / quiz.preguntas.length) * 100;
    }
    return 0;
  };

  const getCurrentQuestion = () => quiz?.preguntas?.[currentQuestion];

  const isCurrentAnswered = () => {
    const q = getCurrentQuestion();
    return q && answers[q.id] !== undefined;
  };

  const handleNext = () => {
    if (!quiz?.preguntas) return;
    if (currentQuestion < quiz.preguntas.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!quiz?.quiz?.id) return;
    setSubmitting(true);

    const respuestas = Object.entries(answers).map(([preguntaId, valor]) => ({
      preguntaId, // keep as string
      valor, // integer 0..3
    }));

    const payload = {
      respuestas,
      consentimientoAceptado: !!consentAccepted,
      tiempoInicio: timeStarted,
    };

    try {
      const data = await apiFetch(
        `/quizzes/${encodeURIComponent(quiz.quiz.id)}/submit`,
        {
          method: "POST",
          headers: { ...extraHeaders },
          body: payload,
        }
      );

      setResult(data.data);
      setCurrentStep("completed");
      onComplete(data.data);

      // If high severity, open booking modal
      const sev = String(data.data?.severidad || "");
      if (sev === "MODERADA" || sev === "SEVERA") {
        // preload slots
        await fetchSlots();
        setModalOpen(true);
      }
    } catch (e) {
      alert(
        e.data?.message || e.message || "No se pudo enviar el cuestionario"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ----- Slots (ABIERTA) -----
  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const now = new Date();
      const from = toISO(now);
      const to = toISO(addDays(now, 7));
      const res = await apiFetch(
        `/citas/slots?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
          to
        )}`,
        { headers: { ...extraHeaders } }
      );
      // API returns [{id, psicologoId, fechaHora, duracion}]
      setSlots(res.data || []);
    } catch (e) {
      console.error(e);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const bookSlot = async (slotId) => {
    setBookingId(slotId);
    try {
      await apiFetch(`/citas/slots/${encodeURIComponent(slotId)}/book`, {
        method: "POST",
        headers: { ...extraHeaders },
      });
      // success: reflect UI
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      alert("¡Cita reservada correctamente!");
      setModalOpen(false);
    } catch (e) {
      alert(
        e.data?.message ||
          "No se pudo reservar. Quizá otro usuario tomó el slot."
      );
      // refetch after conflict
      fetchSlots();
    } finally {
      setBookingId(null);
    }
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">
            Cargando cuestionario...
          </p>
        </div>
      </div>
    );
  }

  if (loadError || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border rounded-xl p-8 shadow-sm max-w-md text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2">No se pudo cargar</h2>
          <p className="text-gray-600 mb-4">
            {loadError || "Intenta nuevamente"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Progress Bar */}
      {currentStep === "quiz" && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-2 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Consent */}
        {currentStep === "consent" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {quiz.quiz.titulo}
                </h1>
                <p className="text-gray-600">{quiz.quiz.descripcion}</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 text-blue-600 mr-2" />
                  Consentimiento Informado
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>Al participar en este cuestionario, entiendes que:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Tus respuestas serán tratadas de forma confidencial</li>
                    <li>
                      Los resultados serán utilizados para fines de evaluación
                      psicológica
                    </li>
                    <li>
                      Puedes interrumpir el cuestionario en cualquier momento
                    </li>
                    <li>
                      Los datos serán manejados según las políticas de
                      privacidad institucionales
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleConsentAccept}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Check className="w-5 h-5" />
                  <span>Acepto y Continúo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {currentStep === "instructions" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Instrucciones
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Target className="w-6 h-6 text-blue-600 mr-2" />
                    Cómo Responder
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Lee cada pregunta cuidadosamente
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Selecciona la opción que mejor describa tu experiencia
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Responde basándote en las últimas dos semanas
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Clock className="w-6 h-6 text-green-600 mr-2" />
                    Información Importante
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Tiempo estimado: 5-10 minutos
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      No hay respuestas correctas o incorrectas
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Sé honesto en tus respuestas
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleStartQuiz}
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <Brain className="w-5 h-5" />
                  <span>Comenzar Evaluación</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz */}
        {currentStep === "quiz" && getCurrentQuestion() && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-700 pt-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Pregunta {currentQuestion + 1}
                    </h2>
                    <p className="opacity-90">de {quiz.preguntas.length}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {Math.round(getProgress())}%
                    </div>
                    <p className="text-sm opacity-90">Completado</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 leading-relaxed">
                    {getCurrentQuestion().texto}
                  </h3>
                  <p className="text-gray-600">
                    Selecciona la opción que mejor describa tu experiencia en
                    las últimas dos semanas:
                  </p>
                </div>

                <div className="space-y-4">
                  {likertOptions.map((option) => (
                    <div
                      key={option.value}
                      className={`relative transition-all duration-300 transform hover:scale-102 ${
                        answers[getCurrentQuestion().id] === option.value
                          ? "scale-102"
                          : ""
                      }`}
                    >
                      <label className="block cursor-pointer">
                        <div
                          className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                            answers[getCurrentQuestion().id] === option.value
                              ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg"
                              : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name={`question-${getCurrentQuestion().id}`}
                              value={option.value}
                              checked={
                                answers[getCurrentQuestion().id] ===
                                option.value
                              }
                              onChange={() =>
                                handleAnswerChange(
                                  getCurrentQuestion().id,
                                  option.value
                                )
                              }
                              className="sr-only"
                            />
                            <div
                              className={`w-6 h-6 rounded-full border-2 mr-4 transition-all duration-300 flex items-center justify-center ${
                                answers[getCurrentQuestion().id] ===
                                option.value
                                  ? "border-blue-500 bg-blue-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {answers[getCurrentQuestion().id] ===
                                option.value && (
                                <div className="w-2 h-2 bg-white rounded-full animate-in zoom-in duration-200"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-lg font-semibold ${
                                    answers[getCurrentQuestion().id] ===
                                    option.value
                                      ? "text-blue-700"
                                      : "text-gray-800"
                                  }`}
                                >
                                  {option.label}
                                </span>
                                <span
                                  className={`text-2xl font-bold ${
                                    answers[getCurrentQuestion().id] ===
                                    option.value
                                      ? "text-blue-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {option.value}
                                </span>
                              </div>
                              <p
                                className={`text-sm mt-1 ${
                                  answers[getCurrentQuestion().id] ===
                                  option.value
                                    ? "text-blue-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      currentQuestion === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Anterior</span>
                  </button>

                  <div className="flex space-x-2">
                    {quiz.preguntas.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index < currentQuestion
                            ? "bg-green-500"
                            : index === currentQuestion
                            ? "bg-blue-500 scale-125"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={!isCurrentAnswered()}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform ${
                      !isCurrentAnswered()
                        ? "text-gray-400 cursor-not-allowed bg-gray-100"
                        : "text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    <span>
                      {currentQuestion === quiz.preguntas.length - 1
                        ? "Finalizar"
                        : "Siguiente"}
                    </span>
                    {currentQuestion === quiz.preguntas.length - 1 ? (
                      <SendHorizonal className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submitting */}
        {submitting && (
          <div className="animate-in fade-in duration-700">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Procesando Respuestas
                </h2>
                <p className="text-gray-600">
                  Por favor espera mientras procesamos tu evaluación...
                </p>
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
                      style={{ width: "70%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completed */}
        {currentStep === "completed" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  ¡Evaluación Completada!
                </h2>
                <p className="text-gray-600 mb-6">
                  Gracias por completar el {quiz.quiz.titulo}. Tus respuestas
                  han sido registradas.
                </p>

                {result && (
                  <div className="mx-auto max-w-md bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="text-sm text-gray-600">
                          Puntaje total
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                          {result.puntajeTotal}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Severidad</div>
                        <div
                          className={`text-2xl font-extrabold ${
                            result.severidad === "SEVERA"
                              ? "text-red-600"
                              : result.severidad === "MODERADA"
                              ? "text-orange-600"
                              : result.severidad === "LEVE"
                              ? "text-yellow-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {result.severidad}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-3">
                      Enviado: {new Date(result.fechaEnvio).toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Volver al Panel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* High severity modal */}
      <HighSeverityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        severity={result?.severidad}
        attemptId={result?.attemptId}
        fetchSlots={fetchSlots}
        bookSlot={bookSlot}
        loadingSlots={loadingSlots}
        slots={slots}
        bookingId={bookingId}
      />
    </div>
  );
};

export default QuizInterface;
