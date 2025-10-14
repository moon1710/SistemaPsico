import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle,
  Clock,
  Wind,
  Brain,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

const RelajacionMuscularPage = () => {
  const [ejercicioActivo, setEjercicioActivo] = useState(null);
  const [grupoActual, setGrupoActual] = useState(0);
  const [fase, setFase] = useState('preparacion'); // preparacion, tension, relajacion, descanso
  const [isRunning, setIsRunning] = useState(false);
  const [sonidoHabilitado, setSonidoHabilitado] = useState(true);
  const [ejercicioCompletado, setEjercicioCompletado] = useState(false);
  const intervalRef = useRef(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const ejercicios = [
    {
      id: 'completo',
      nombre: 'Relajación Completa',
      descripcion: 'Secuencia completa de todos los grupos musculares',
      duracion: '15-20 minutos',
      color: 'blue'
    },
    {
      id: 'rapido',
      nombre: 'Relajación Rápida',
      descripcion: 'Versión reducida para momentos de estrés inmediato',
      duracion: '5-8 minutos',
      color: 'green'
    },
    {
      id: 'especifico',
      nombre: 'Grupos Específicos',
      descripcion: 'Enfócate en áreas donde sientes más tensión',
      duracion: '8-12 minutos',
      color: 'purple'
    }
  ];

  const gruposMusculares = {
    completo: [
      {
        nombre: "Manos y Brazos",
        instrucciones: "Cierra los puños fuertemente, tensa los brazos",
        visualizacion: "Imagina que sostienes algo muy pesado",
        tension: 5,
        relajacion: 10
      },
      {
        nombre: "Cara y Cuello",
        instrucciones: "Frunce el ceño, cierra los ojos fuerte, tensa el cuello",
        visualizacion: "Imagina una sonrisa cálida extendiéndose por tu cara",
        tension: 5,
        relajacion: 10
      },
      {
        nombre: "Hombros y Espalda Alta",
        instrucciones: "Levanta los hombros hacia las orejas, arquea la espalda",
        visualizacion: "Siente como los hombros caen naturalmente",
        tension: 5,
        relajacion: 10
      },
      {
        nombre: "Pecho y Respiración",
        instrucciones: "Toma una respiración profunda y manténla",
        visualizacion: "Imagina que tu pecho se expande como un globo",
        tension: 5,
        relajacion: 10
      },
      {
        nombre: "Abdomen",
        instrucciones: "Contrae los músculos del abdomen fuertemente",
        visualizacion: "Siente como se relaja como una ola cálida",
        tension: 5,
        relajacion: 10
      },
      {
        nombre: "Piernas y Pies",
        instrucciones: "Tensa los muslos, pantorrillas, flexiona los pies",
        visualizacion: "Imagina que tus piernas flotan en agua tibia",
        tension: 5,
        relajacion: 10
      }
    ],
    rapido: [
      {
        nombre: "Brazos y Hombros",
        instrucciones: "Tensa brazos y levanta hombros",
        visualizacion: "Deja que caigan pesadamente",
        tension: 3,
        relajacion: 7
      },
      {
        nombre: "Cara y Cuello",
        instrucciones: "Tensa toda la cara y cuello",
        visualizacion: "Suaviza toda expresión",
        tension: 3,
        relajacion: 7
      },
      {
        nombre: "Torso Completo",
        instrucciones: "Tensa pecho, espalda y abdomen",
        visualizacion: "Libera toda la tensión de una vez",
        tension: 3,
        relajacion: 7
      },
      {
        nombre: "Piernas Completas",
        instrucciones: "Tensa desde caderas hasta pies",
        visualizacion: "Siente como se derriten hacia el suelo",
        tension: 3,
        relajacion: 7
      }
    ],
    especifico: [
      {
        nombre: "Zona de Tensión 1",
        instrucciones: "Identifica tu primera área de tensión y contrácela",
        visualizacion: "Visualiza como se relaja completamente",
        tension: 4,
        relajacion: 8
      },
      {
        nombre: "Zona de Tensión 2",
        instrucciones: "Segunda área donde sientes estrés",
        visualizacion: "Imagina calor y relajación fluyendo",
        tension: 4,
        relajacion: 8
      },
      {
        nombre: "Zona de Tensión 3",
        instrucciones: "Tercera área de tensión más común",
        visualizacion: "Libera completamente toda resistencia",
        tension: 4,
        relajacion: 8
      }
    ]
  };

  const iniciarEjercicio = (ejercicio) => {
    setEjercicioActivo(ejercicio);
    setGrupoActual(0);
    setFase('preparacion');
    setEjercicioCompletado(false);
  };

  const comenzarSecuencia = () => {
    if (!ejercicioActivo) return;

    setIsRunning(true);
    setFase('tension');
    const grupos = gruposMusculares[ejercicioActivo.id];
    let tiempoTotal = grupos[grupoActual].tension;
    let faseActual = 'tension';
    let grupoActualLocal = grupoActual;
    setTiempoRestante(tiempoTotal);

    intervalRef.current = setInterval(() => {
      tiempoTotal--;
      setTiempoRestante(tiempoTotal);

      if (tiempoTotal <= 0) {
        // Cambiar de fase
        if (faseActual === 'tension') {
          faseActual = 'relajacion';
          setFase('relajacion');
          tiempoTotal = grupos[grupoActualLocal].relajacion;
          setTiempoRestante(tiempoTotal);
        } else if (faseActual === 'relajacion') {
          faseActual = 'descanso';
          setFase('descanso');
          tiempoTotal = 3; // 3 segundos de descanso
          setTiempoRestante(tiempoTotal);
        } else if (faseActual === 'descanso') {
          // Pasar al siguiente grupo
          if (grupoActualLocal < grupos.length - 1) {
            grupoActualLocal++;
            setGrupoActual(grupoActualLocal);
            faseActual = 'tension';
            setFase('tension');
            tiempoTotal = grupos[grupoActualLocal].tension;
            setTiempoRestante(tiempoTotal);
          } else {
            // Ejercicio completado
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setEjercicioCompletado(true);
            setFase('preparacion');
          }
        }
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
    setGrupoActual(0);
    setFase('preparacion');
    setEjercicioCompletado(false);
    setTiempoRestante(0);
  };

  const volverAEjercicios = () => {
    reiniciarEjercicio();
    setEjercicioActivo(null);
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

  const getButtonColor = (color) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700'
    };
    return colors[color] || colors.blue;
  };

  const getFaseTexto = () => {
    switch(fase) {
      case 'preparacion': return 'Prepárate para comenzar';
      case 'tension': return 'Tensa los músculos';
      case 'relajacion': return 'Relaja completamente';
      case 'descanso': return 'Descansa y observa';
      default: return '';
    }
  };

  const getFaseInstruccion = () => {
    if (!ejercicioActivo || grupoActual >= gruposMusculares[ejercicioActivo.id].length) return '';

    const grupo = gruposMusculares[ejercicioActivo.id][grupoActual];
    switch(fase) {
      case 'tension': return grupo.instrucciones;
      case 'relajacion': return grupo.visualizacion;
      case 'descanso': return 'Nota la diferencia entre tensión y relajación';
      default: return 'Encuentra una posición cómoda y respira normalmente';
    }
  };

  if (!ejercicioActivo) {
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
              <Zap className="w-8 h-8 text-purple-600" />
              Relajación Muscular Progresiva
            </h1>
            <p className="text-gray-600 mt-2">
              Libera la tensión física para calmar la mente
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
            ¿Qué es la Relajación Muscular Progresiva?
          </h2>
          <p className="text-gray-700 mb-4">
            Es una técnica que consiste en tensar deliberadamente grupos de músculos
            para luego relajarlos completamente. Esto te ayuda a reconocer la diferencia
            entre tensión y relajación, liberando el estrés físico acumulado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Beneficios:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Reduce tensión muscular y dolor</li>
                <li>• Disminuye ansiedad y estrés</li>
                <li>• Mejora la calidad del sueño</li>
                <li>• Aumenta la conciencia corporal</li>
                <li>• Ayuda con dolores de cabeza</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Mejor momento:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Después de un día estresante</li>
                <li>• Antes de dormir</li>
                <li>• Durante descansos de estudio</li>
                <li>• Cuando sientes tensión física</li>
                <li>• Como rutina de relajación diaria</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Selección de ejercicio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900">Elige tu sesión:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ejercicios.map((ejercicio, index) => (
              <motion.div
                key={ejercicio.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`cursor-pointer p-6 rounded-xl border-2 hover:shadow-lg transition-all ${getColorClasses(ejercicio.color)}`}
                onClick={() => iniciarEjercicio(ejercicio)}
              >
                <h3 className="text-xl font-semibold mb-2">{ejercicio.nombre}</h3>
                <p className="text-sm mb-3">{ejercicio.descripcion}</p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{ejercicio.duracion}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instrucciones generales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Preparación para la sesión:
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Encuentra un lugar tranquilo donde no te interrumpan</p>
            <p>• Usa ropa cómoda y afloja cualquier prenda ajustada</p>
            <p>• Siéntate cómodamente o acuéstate boca arriba</p>
            <p>• Cierra los ojos y respira naturalmente</p>
            <p>• No fuerces los movimientos si sientes dolor</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const grupoActualData = gruposMusculares[ejercicioActivo.id][grupoActual] || {};

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={volverAEjercicios}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {ejercicioActivo.nombre}
          </h1>
          <p className="text-gray-600">
            {ejercicioCompletado ? 'Sesión completada' :
             `Grupo ${grupoActual + 1} de ${gruposMusculares[ejercicioActivo.id].length}`}
          </p>
        </div>
        <button
          onClick={() => setSonidoHabilitado(!sonidoHabilitado)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sonidoHabilitado ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </motion.div>

      {!ejercicioCompletado ? (
        <>
          {/* Progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso</span>
              <span>{Math.round(((grupoActual + (fase !== 'preparacion' ? 0.5 : 0)) / gruposMusculares[ejercicioActivo.id].length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full ${getButtonColor(ejercicioActivo.color).split(' ')[0]}`}
                initial={{ width: 0 }}
                animate={{
                  width: `${((grupoActual + (fase !== 'preparacion' ? 0.5 : 0)) / gruposMusculares[ejercicioActivo.id].length) * 100}%`
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Área principal */}
          <motion.div
            key={`${grupoActual}-${fase}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-8 text-center shadow-lg border-2 border-gray-100"
          >
            {fase !== 'preparacion' && (
              <div className="mb-6">
                <div className="text-6xl font-bold text-purple-600 mb-2">
                  {tiempoRestante}
                </div>
                <div className="text-sm text-gray-500">segundos</div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {grupoActualData.nombre || 'Preparación'}
            </h2>

            <div className="text-xl text-purple-600 font-medium mb-4">
              {getFaseTexto()}
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {getFaseInstruccion()}
            </p>
          </motion.div>

          {/* Controles */}
          <div className="flex justify-center gap-4">
            {fase === 'preparacion' && (
              <button
                onClick={comenzarSecuencia}
                className={`px-8 py-3 text-white rounded-lg font-semibold flex items-center gap-2 ${getButtonColor(ejercicioActivo.color)}`}
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
          </div>
        </>
      ) : (
        /* Pantalla de finalización */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-green-800 mb-3">
              ¡Sesión Completada!
            </h2>
            <p className="text-green-700 mb-6">
              Has completado la sesión de {ejercicioActivo.nombre}.
              ¿Cómo te sientes ahora comparado con cuando comenzaste?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={reiniciarEjercicio}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Repetir Sesión
              </button>
              <button
                onClick={volverAEjercicios}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Elegir Otra Sesión
              </button>
            </div>
          </div>

          {/* Enlaces a otros recursos */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Otros recursos de relajación:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to={ROUTES.RESPIRACION_GUIADA}
                className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <Wind className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="font-semibold">Respiración Guiada</p>
                  <p className="text-sm text-gray-600">Calma mental complementaria</p>
                </div>
              </Link>
              <Link
                to={ROUTES.TECNICA_5432}
                className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
              >
                <Brain className="w-6 h-6 text-purple-500" />
                <div>
                  <p className="font-semibold">Técnica 5-4-3-2-1</p>
                  <p className="text-sm text-gray-600">Grounding sensorial</p>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RelajacionMuscularPage;