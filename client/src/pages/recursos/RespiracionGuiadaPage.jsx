import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Wind,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  Heart,
  CheckCircle,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

const RespiracionGuiadaPage = () => {
  const [tecnicaActiva, setTecnicaActiva] = useState(null);
  const [fase, setFase] = useState('preparacion'); // preparacion, inhalar, mantener, exhalar, pausa
  const [ciclo, setCiclo] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sonidoHabilitado, setSonidoHabilitado] = useState(true);
  const [sesionCompletada, setSesionCompletada] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const tecnicas = [
    {
      id: '478',
      nombre: 'Respiración 4-7-8',
      descripcion: 'Técnica calmante para reducir ansiedad',
      instrucciones: 'Inhala 4 segundos, mantén 7, exhala 8',
      duracion: '3-5 ciclos',
      fases: {
        inhalar: 4,
        mantener: 7,
        exhalar: 8,
        pausa: 2
      },
      ciclosRecomendados: 4,
      beneficios: ['Reduce ansiedad', 'Mejora el sueño', 'Calma el sistema nervioso'],
      color: 'blue'
    },
    {
      id: 'cuadrada',
      nombre: 'Respiración Cuadrada',
      descripcion: 'Técnica equilibrada para la concentración',
      instrucciones: 'Inhala 4, mantén 4, exhala 4, pausa 4',
      duracion: '5-8 ciclos',
      fases: {
        inhalar: 4,
        mantener: 4,
        exhalar: 4,
        pausa: 4
      },
      ciclosRecomendados: 6,
      beneficios: ['Mejora concentración', 'Equilibra emociones', 'Reduce estrés'],
      color: 'green'
    },
    {
      id: 'profunda',
      nombre: 'Respiración Profunda',
      descripcion: 'Técnica básica para relajación general',
      instrucciones: 'Respiración lenta y profunda',
      duracion: '6-10 ciclos',
      fases: {
        inhalar: 6,
        mantener: 2,
        exhalar: 6,
        pausa: 2
      },
      ciclosRecomendados: 8,
      beneficios: ['Relajación general', 'Oxigena el cuerpo', 'Reduce tensión'],
      color: 'purple'
    }
  ];

  const faseTextos = {
    preparacion: 'Prepárate para comenzar',
    inhalar: 'Inhala lentamente',
    mantener: 'Mantén la respiración',
    exhalar: 'Exhala suavemente',
    pausa: 'Pausa natural'
  };

  const iniciarTecnica = (tecnica) => {
    setTecnicaActiva(tecnica);
    setFase('preparacion');
    setCiclo(0);
    setSesionCompletada(false);
  };

  const iniciarEjercicio = () => {
    if (!tecnicaActiva) return;

    setIsRunning(true);
    setFase('inhalar');
    let faseActual = 'inhalar';
    let tiempoRestante = tecnicaActiva.fases.inhalar;
    let cicloActual = ciclo;

    intervalRef.current = setInterval(() => {
      tiempoRestante--;

      if (tiempoRestante <= 0) {
        // Cambiar a la siguiente fase
        if (faseActual === 'inhalar') {
          faseActual = 'mantener';
          tiempoRestante = tecnicaActiva.fases.mantener;
        } else if (faseActual === 'mantener') {
          faseActual = 'exhalar';
          tiempoRestante = tecnicaActiva.fases.exhalar;
        } else if (faseActual === 'exhalar') {
          faseActual = 'pausa';
          tiempoRestante = tecnicaActiva.fases.pausa;
        } else if (faseActual === 'pausa') {
          cicloActual++;
          if (cicloActual >= tecnicaActiva.ciclosRecomendados) {
            // Sesión completada
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setSesionCompletada(true);
            setFase('preparacion');
            return;
          }
          faseActual = 'inhalar';
          tiempoRestante = tecnicaActiva.fases.inhalar;
          setCiclo(cicloActual);
        }
        setFase(faseActual);
      }
    }, 1000);
  };

  const pausarEjercicio = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const reiniciarEjercicio = () => {
    pausarEjercicio();
    setFase('preparacion');
    setCiclo(0);
    setSesionCompletada(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    return colors[color] || colors.blue;
  };

  const getCircleColor = (color) => {
    const colors = {
      blue: 'from-blue-400 to-blue-600',
      green: 'from-green-400 to-green-600',
      purple: 'from-purple-400 to-purple-600'
    };
    return colors[color] || colors.blue;
  };

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
            <Wind className="w-8 h-8 text-blue-600" />
            Respiración Guiada
          </h1>
          <p className="text-gray-600 mt-2">
            Técnicas de respiración para calmar la mente y relajar el cuerpo
          </p>
        </div>
      </motion.div>

      {!tecnicaActiva ? (
        /* Selección de técnica */
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              ¿Cómo te sientes ahora?
            </h2>
            <p className="text-gray-600 mb-4">
              Elige la técnica que mejor se adapte a tu estado actual:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tecnicas.map((tecnica, index) => (
                <motion.div
                  key={tecnica.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white rounded-lg p-4 border-2 cursor-pointer hover:shadow-md transition-all ${getColorClasses(tecnica.color)}`}
                  onClick={() => iniciarTecnica(tecnica)}
                >
                  <h3 className="font-semibold text-lg mb-2">{tecnica.nombre}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tecnica.descripcion}</p>
                  <p className="text-xs font-medium mb-3">{tecnica.instrucciones}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    <p>⏱️ {tecnica.duracion}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium">Beneficios:</p>
                    {tecnica.beneficios.map((beneficio, i) => (
                      <p key={i} className="text-xs text-gray-600">• {beneficio}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        /* Ejercicio activo */
        <div className="space-y-6">
          {/* Header del ejercicio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {tecnicaActiva.nombre}
            </h2>
            <p className="text-gray-600">{tecnicaActiva.descripcion}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-sm text-gray-500">
                Ciclo {ciclo + 1} de {tecnicaActiva.ciclosRecomendados}
              </span>
              <button
                onClick={() => setSonidoHabilitado(!sonidoHabilitado)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sonidoHabilitado ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Círculo de respiración */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative w-64 h-64 mb-8">
              <motion.div
                className={`w-full h-full rounded-full bg-gradient-to-br ${getCircleColor(tecnicaActiva.color)} flex items-center justify-center text-white shadow-2xl`}
                animate={{
                  scale:
                    fase === 'inhalar' ? 1.2 :
                    fase === 'mantener' ? 1.2 :
                    fase === 'exhalar' ? 0.8 :
                    1
                }}
                transition={{
                  duration:
                    fase === 'inhalar' ? tecnicaActiva.fases.inhalar :
                    fase === 'mantener' ? 0 :
                    fase === 'exhalar' ? tecnicaActiva.fases.exhalar :
                    tecnicaActiva.fases.pausa,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center">
                  <p className="text-2xl font-bold mb-2">
                    {faseTextos[fase]}
                  </p>
                  {isRunning && (
                    <p className="text-lg opacity-80">
                      {fase !== 'preparacion' && (
                        fase === 'inhalar' ? 'Llena tus pulmones' :
                        fase === 'mantener' ? 'Retén el aire' :
                        fase === 'exhalar' ? 'Libera la tensión' :
                        'Relájate'
                      )}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-4">
              {!isRunning && !sesionCompletada && (
                <button
                  onClick={iniciarEjercicio}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  <Play className="w-5 h-5" />
                  Comenzar
                </button>
              )}

              {isRunning && (
                <button
                  onClick={pausarEjercicio}
                  className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2 font-semibold"
                >
                  <Pause className="w-5 h-5" />
                  Pausar
                </button>
              )}

              <button
                onClick={reiniciarEjercicio}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 font-semibold"
              >
                <RotateCcw className="w-5 h-5" />
                Reiniciar
              </button>

              <button
                onClick={() => setTecnicaActiva(null)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Cambiar Técnica
              </button>
            </div>

            {/* Mensaje de finalización */}
            <AnimatePresence>
              {sesionCompletada && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    ¡Sesión Completada!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Has completado {tecnicaActiva.ciclosRecomendados} ciclos de {tecnicaActiva.nombre}.
                    ¿Cómo te sientes ahora?
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={reiniciarEjercicio}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Repetir Sesión
                    </button>
                    <button
                      onClick={() => setTecnicaActiva(null)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Probar Otra Técnica
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Instrucciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gray-50 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Consejos para esta técnica:
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Encuentra una posición cómoda, sentado o acostado</p>
              <p>• Coloca una mano en el pecho y otra en el abdomen</p>
              <p>• Respira por la nariz, inflando el abdomen más que el pecho</p>
              <p>• No fuerces la respiración, mantén un ritmo natural</p>
              <p>• Si te mareas, detente y respira normalmente</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enlaces a otros recursos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gray-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Otros recursos de calma:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to={ROUTES.TECNICA_5432}
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Heart className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-semibold">Técnica 5-4-3-2-1</p>
              <p className="text-sm text-gray-600">Grounding con los sentidos</p>
            </div>
          </Link>
          <Link
            to={ROUTES.RELAJACION_MUSCULAR}
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Wind className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-semibold">Relajación Muscular</p>
              <p className="text-sm text-gray-600">Tensión y relajación progresiva</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RespiracionGuiadaPage;