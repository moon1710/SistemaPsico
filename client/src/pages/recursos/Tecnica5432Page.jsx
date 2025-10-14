import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  ArrowLeft,
  Eye,
  Ear,
  Hand,
  Zap,
  Coffee,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Heart,
  Wind,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

const Tecnica5432Page = () => {
  const [pasoActual, setPasoActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [ejercicioCompletado, setEjercicioCompletado] = useState(false);
  const [ejercicioIniciado, setEjercicioIniciado] = useState(false);

  const pasos = [
    {
      numero: 5,
      sentido: "Vista",
      icon: Eye,
      color: "blue",
      pregunta: "¿Qué 5 cosas puedes VER a tu alrededor?",
      instruccion: "Mira alrededor tuyo y nombra 5 cosas que puedes ver. Pueden ser objetos, colores, formas, texturas.",
      ejemplos: ["Una taza azul", "Las hojas del árbol", "La luz del sol", "Un libro rojo", "El patrón de la pared"],
      placeholder: "Ejemplo: Una lámpara amarilla en la mesa..."
    },
    {
      numero: 4,
      sentido: "Tacto",
      icon: Hand,
      color: "green",
      pregunta: "¿Qué 4 cosas puedes TOCAR?",
      instruccion: "Toca diferentes superficies y texturas. Nota si están frías, calientes, suaves, rugosas.",
      ejemplos: ["La textura de tu ropa", "El respaldo de la silla", "Tu cabello", "Una superficie fría"],
      placeholder: "Ejemplo: La superficie lisa de mi teléfono..."
    },
    {
      numero: 3,
      sentido: "Oído",
      icon: Ear,
      color: "purple",
      pregunta: "¿Qué 3 sonidos puedes ESCUCHAR?",
      instruccion: "Cierra los ojos por un momento y escucha atentamente los sonidos a tu alrededor.",
      ejemplos: ["El aire acondicionado", "Voces lejanas", "El tráfico afuera"],
      placeholder: "Ejemplo: El sonido del viento en las hojas..."
    },
    {
      numero: 2,
      sentido: "Olfato",
      icon: Zap,
      color: "orange",
      pregunta: "¿Qué 2 olores puedes PERCIBIR?",
      instruccion: "Respira profundamente y nota los diferentes aromas en el ambiente.",
      ejemplos: ["El aroma del café", "El olor a limpio"],
      placeholder: "Ejemplo: El aroma a café que viene de la cocina..."
    },
    {
      numero: 1,
      sentido: "Gusto",
      icon: Coffee,
      color: "red",
      pregunta: "¿Qué 1 sabor puedes SABOREAR?",
      instruccion: "Nota el sabor en tu boca en este momento, o toma un sorbo de agua.",
      ejemplos: ["El sabor de la menta", "Un sabor dulce"],
      placeholder: "Ejemplo: El sabor refrescante del agua..."
    }
  ];

  const iniciarEjercicio = () => {
    setEjercicioIniciado(true);
    setPasoActual(0);
    setRespuestas({});
    setEjercicioCompletado(false);
  };

  const agregarRespuesta = (paso, respuesta) => {
    if (!respuesta.trim()) return;

    const nuevasRespuestas = { ...respuestas };
    if (!nuevasRespuestas[paso]) {
      nuevasRespuestas[paso] = [];
    }
    nuevasRespuestas[paso].push(respuesta.trim());
    setRespuestas(nuevasRespuestas);
  };

  const eliminarRespuesta = (paso, index) => {
    const nuevasRespuestas = { ...respuestas };
    nuevasRespuestas[paso].splice(index, 1);
    setRespuestas(nuevasRespuestas);
  };

  const siguientePaso = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      setEjercicioCompletado(true);
    }
  };

  const pasoAnterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  const reiniciarEjercicio = () => {
    setEjercicioIniciado(false);
    setPasoActual(0);
    setRespuestas({});
    setEjercicioCompletado(false);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 text-orange-700',
      red: 'bg-red-50 border-red-200 text-red-700'
    };
    return colors[color] || colors.blue;
  };

  const getButtonColor = (color) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      orange: 'bg-orange-600 hover:bg-orange-700',
      red: 'bg-red-600 hover:bg-red-700'
    };
    return colors[color] || colors.blue;
  };

  if (!ejercicioIniciado) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <Link
            to={ROUTES.RECURSOS}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-600" />
              Técnica 5-4-3-2-1
            </h1>
            <p className="text-gray-600 mt-2">
              Grounding para conectarte con el presente usando tus 5 sentidos
            </p>
          </div>
        </motion.div>

        {/* Introducción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-purple-50 rounded-xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Qué es la técnica 5-4-3-2-1?
          </h2>
          <p className="text-gray-700 mb-4">
            Es una técnica de grounding (conexión a tierra) que te ayuda a calmarte
            cuando sientes ansiedad, pánico o estás abrumado. Te reconecta con el
            presente usando tus cinco sentidos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">¿Cuándo usarla?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Durante ataques de ansiedad o pánico</li>
                <li>• Cuando te sientes desconectado</li>
                <li>• Si estás abrumado por pensamientos</li>
                <li>• Para volver al momento presente</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Beneficios:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reduce la ansiedad inmediatamente</li>
                <li>• Te conecta con tu entorno</li>
                <li>• Interrumpe pensamientos negativos</li>
                <li>• Es simple y se puede hacer en cualquier lugar</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Vista previa de los pasos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-900">Los 5 pasos:</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pasos.map((paso, index) => {
              const IconComponent = paso.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 text-center ${getColorClasses(paso.color)}`}
                >
                  <div className="flex justify-center mb-2">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-bold mb-1">{paso.numero}</div>
                  <div className="text-sm font-medium">{paso.sentido}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Botón para comenzar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={iniciarEjercicio}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold"
          >
            Comenzar el Ejercicio
          </button>
          <p className="text-sm text-gray-500 mt-3">
            El ejercicio toma aproximadamente 5-10 minutos
          </p>
        </motion.div>
      </div>
    );
  }

  if (ejercicioCompletado) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <Link
            to={ROUTES.RECURSOS}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              ¡Ejercicio Completado!
            </h1>
          </div>
        </motion.div>

        {/* Mensaje de finalización */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-800 mb-3">
            ¡Excelente trabajo!
          </h2>
          <p className="text-green-700 mb-6">
            Has completado la técnica 5-4-3-2-1. Esperamos que te sientas más
            tranquilo y conectado con el presente.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={reiniciarEjercicio}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Repetir Ejercicio
            </button>
            <Link
              to={ROUTES.RECURSOS}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Volver a Recursos
            </Link>
          </div>
        </motion.div>

        {/* Resumen de respuestas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Tu experiencia sensorial:
          </h3>
          <div className="space-y-4">
            {pasos.map((paso, index) => {
              const IconComponent = paso.icon;
              const respuestasPaso = respuestas[index] || [];
              return (
                <div key={index} className="flex items-start gap-3">
                  <IconComponent className={`w-6 h-6 text-${paso.color}-600 mt-1`} />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {paso.numero} {paso.sentido}:
                    </h4>
                    {respuestasPaso.length > 0 ? (
                      <ul className="text-sm text-gray-600 ml-4 list-disc">
                        {respuestasPaso.map((respuesta, i) => (
                          <li key={i}>{respuesta}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 ml-4">No se registraron respuestas</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Enlaces a otros recursos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Otros recursos de calma:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to={ROUTES.RESPIRACION_GUIADA}
              className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <Wind className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-semibold">Respiración Guiada</p>
                <p className="text-sm text-gray-600">Técnicas de respiración calmante</p>
              </div>
            </Link>
            <Link
              to={ROUTES.RELAJACION_MUSCULAR}
              className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
            >
              <Heart className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold">Relajación Muscular</p>
                <p className="text-sm text-gray-600">Tensión y relajación progresiva</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Ejercicio en progreso
  const pasoData = pasos[pasoActual];
  const IconComponent = pasoData.icon;
  const respuestasPaso = respuestas[pasoActual] || [];
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header con progreso */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.RECURSOS}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Técnica 5-4-3-2-1
            </h1>
            <p className="text-gray-600">
              Paso {pasoActual + 1} de {pasos.length}
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((pasoActual + 1) / pasos.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Paso actual */}
      <motion.div
        key={pasoActual}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.5 }}
        className={`rounded-xl p-6 border-2 ${getColorClasses(pasoData.color)}`}
      >
        <div className="text-center mb-6">
          <IconComponent className="w-16 h-16 mx-auto mb-4" />
          <div className="text-4xl font-bold mb-2">{pasoData.numero}</div>
          <h2 className="text-2xl font-bold mb-2">{pasoData.pregunta}</h2>
          <p className="text-gray-700">{pasoData.instruccion}</p>
        </div>

        {/* Input para nueva respuesta */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevaRespuesta}
              onChange={(e) => setNuevaRespuesta(e.target.value)}
              placeholder={pasoData.placeholder}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  agregarRespuesta(pasoActual, nuevaRespuesta);
                  setNuevaRespuesta('');
                }
              }}
            />
            <button
              onClick={() => {
                agregarRespuesta(pasoActual, nuevaRespuesta);
                setNuevaRespuesta('');
              }}
              className={`px-4 py-3 text-white rounded-lg transition-colors ${getButtonColor(pasoData.color)}`}
            >
              Agregar
            </button>
          </div>

          {/* Lista de respuestas */}
          {respuestasPaso.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Tus respuestas:</h4>
              {respuestasPaso.map((respuesta, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-3 rounded-lg"
                >
                  <span>{respuesta}</span>
                  <button
                    onClick={() => eliminarRespuesta(pasoActual, index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Ejemplos */}
          <div className="bg-white bg-opacity-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Ejemplos:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {pasoData.ejemplos.map((ejemplo, index) => (
                <p key={index}>• {ejemplo}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-6">
          <button
            onClick={pasoAnterior}
            disabled={pasoActual === 0}
            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <button
            onClick={siguientePaso}
            disabled={respuestasPaso.length < pasoData.numero}
            className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${getButtonColor(pasoData.color)} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {pasoActual === pasos.length - 1 ? 'Finalizar' : 'Siguiente'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {respuestasPaso.length < pasoData.numero && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Agrega {pasoData.numero - respuestasPaso.length} elemento(s) más para continuar
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default Tecnica5432Page;