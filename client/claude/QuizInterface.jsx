{ /* 2. Quiz Taking Interface (QuizInterface)

Multi-step process: Consent → Instructions → Quiz → Results
Beautiful progress tracking with animated progress bar
Likert scale responses with smooth animations
Real-time validation and error handling
Responsive design for all devices */
}

import React, { useState, useEffect } from "react";
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
  XCircle,
  Heart,
  Brain,
} from "lucide-react";

const QuizInterface = ({ quizId = "1", onComplete = () => {} }) => {
  const [currentStep, setCurrentStep] = useState("consent");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeStarted, setTimeStarted] = useState(null);
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Mock quiz data
  const mockQuiz = {
    quiz: {
      id: "1",
      titulo: "Inventario de Ansiedad de Beck (BAI)",
      codigo: "BAI",
      version: "1.0",
      descripcion:
        "Evaluación de síntomas de ansiedad en las últimas dos semanas",
    },
    preguntas: [
      {
        id: 1,
        orden: 1,
        texto: "¿Con qué frecuencia has sentido entumecimiento u hormigueo?",
        tipo: "LIKERT_4",
        obligatoria: true,
      },
      {
        id: 2,
        orden: 2,
        texto: "¿Has experimentado sensación de calor?",
        tipo: "LIKERT_4",
        obligatoria: true,
      },
      {
        id: 3,
        orden: 3,
        texto: "¿Has tenido temblores en las piernas?",
        tipo: "LIKERT_4",
        obligatoria: true,
      },
      {
        id: 4,
        orden: 4,
        texto: "¿Te ha resultado difícil relajarte?",
        tipo: "LIKERT_4",
        obligatoria: true,
      },
      {
        id: 5,
        orden: 5,
        texto: "¿Has tenido miedo a que ocurra lo peor?",
        tipo: "LIKERT_4",
        obligatoria: true,
      },
    ],
  };

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

  useEffect(() => {
    // Simulate loading quiz data
    setTimeout(() => {
      setQuiz(mockQuiz);
      setLoading(false);
    }, 1000);
  }, []);

  const handleConsentAccept = () => {
    setConsentAccepted(true);
    setCurrentStep("instructions");
    setTimeStarted(new Date().toISOString());
  };

  const handleStartQuiz = () => {
    setCurrentStep("quiz");
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.preguntas.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Prepare submission data
    const respuestas = Object.entries(answers).map(([preguntaId, valor]) => ({
      preguntaId: parseInt(preguntaId),
      valor,
    }));

    const submitData = {
      respuestas,
      consentimientoAceptado: consentAccepted,
      tiempoInicio: timeStarted,
    };

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setCurrentStep("completed");
      onComplete(submitData);
    }, 2000);
  };

  const getProgress = () => {
    if (currentStep === "quiz" && quiz) {
      return ((currentQuestion + 1) / quiz.preguntas.length) * 100;
    }
    return 0;
  };

  const getCurrentQuestion = () => {
    return quiz?.preguntas[currentQuestion];
  };

  const isCurrentAnswered = () => {
    const currentQ = getCurrentQuestion();
    return currentQ && answers[currentQ.id] !== undefined;
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Progress Bar */}
      {currentStep === "quiz" && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-2 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Consent Step */}
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

        {/* Instructions Step */}
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

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-2 mt-0.5" />
                  <div>
                    <h4 className="text-yellow-800 font-semibold">
                      Importante
                    </h4>
                    <p className="text-yellow-700 mt-1">
                      Este cuestionario es una herramienta de evaluación. Si
                      experimentas pensamientos de autolesión, busca ayuda
                      profesional inmediatamente.
                    </p>
                  </div>
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

        {/* Quiz Step */}
        {currentStep === "quiz" && getCurrentQuestion() && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-700 pt-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Header */}
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

              {/* Question */}
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

                {/* Answer Options */}
                <div className="space-y-4">
                  {likertOptions.map((option, index) => (
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

                {/* Navigation */}
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
                      ></div>
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

        {/* Submitting Step */}
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
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completed Step */}
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
                  han sido registradas exitosamente.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Próximos Pasos
                  </h3>
                  <ul className="text-left space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Los resultados serán analizados por un profesional
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Recibirás orientación si es necesario
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Puedes consultar tus resultados en el panel
                    </li>
                  </ul>
                </div>

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
    </div>
  );
};

export default QuizInterface;
