import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  Shield,
  Phone,
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  MessageCircle,
  Headphones,
  Calendar,
  Wind,
  Brain,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

const PrimerosAuxiliosPage = () => {
  const [situacionSeleccionada, setSituacionSeleccionada] = useState(null);
  const [pasoCompletado, setPasoCompletado] = useState({});

  const situaciones = [
    {
      id: "ansiedad",
      titulo: "Crisis de Ansiedad",
      descripcion: "Respiración acelerada, sensación de peligro, taquicardia",
      color: "blue",
      icon: Heart,
      pasos: [
        {
          numero: 1,
          titulo: "Mantén la calma",
          descripcion: "Respira profundo y habla con voz tranquila y serena",
          duracion: "30 segundos"
        },
        {
          numero: 2,
          titulo: "Ayuda con la respiración",
          descripcion: "Guía una respiración lenta: inhala 4, retén 4, exhala 4",
          duracion: "2-5 minutos"
        },
        {
          numero: 3,
          titulo: "Técnica de grounding",
          descripcion: "Nombren juntos 5 cosas que ven, 4 que tocan, 3 que escuchan",
          duracion: "5-10 minutos"
        },
        {
          numero: 4,
          titulo: "Mantente presente",
          descripcion: "Quédate con la persona hasta que se sienta estable",
          duracion: "Según necesidad"
        }
      ]
    },
    {
      id: "panico",
      titulo: "Ataque de Pánico",
      descripcion: "Miedo intenso, sudoración, temblores, sensación de muerte",
      color: "red",
      icon: AlertTriangle,
      pasos: [
        {
          numero: 1,
          titulo: "No minimices sus sentimientos",
          descripcion: "Reconoce que lo que siente es real y aterrador para ella/él",
          duracion: "Inmediato"
        },
        {
          numero: 2,
          titulo: "Encuentra un lugar tranquilo",
          descripcion: "Llévala/o a un espacio silencioso y cómodo si es posible",
          duracion: "1-2 minutos"
        },
        {
          numero: 3,
          titulo: "Respiración controlada",
          descripcion: "Respiración en bolsa de papel o técnica 4-7-8",
          duracion: "5-10 minutos"
        },
        {
          numero: 4,
          titulo: "Contacta ayuda profesional",
          descripcion: "Si no mejora en 20 minutos, busca ayuda médica",
          duracion: "Si es necesario"
        }
      ]
    },
    {
      id: "depresion",
      titulo: "Crisis Depresiva",
      descripcion: "Desesperanza, ideas suicidas, aislamiento extremo",
      color: "purple",
      icon: User,
      pasos: [
        {
          numero: 1,
          titulo: "Escucha sin juzgar",
          descripcion: "Permite que exprese sus sentimientos sin dar consejos",
          duracion: "Todo el tiempo necesario"
        },
        {
          numero: 2,
          titulo: "Pregunta sobre pensamientos suicidas",
          descripcion: "Pregunta directamente si ha pensado en hacerse daño",
          duracion: "Con cuidado"
        },
        {
          numero: 3,
          titulo: "No la/lo dejes solo/a",
          descripcion: "Mantente presente o busca a alguien de confianza",
          duracion: "Hasta que esté seguro/a"
        },
        {
          numero: 4,
          titulo: "Busca ayuda profesional inmediata",
          descripcion: "Contacta psicología del campus o línea de crisis",
          duracion: "Inmediato"
        }
      ]
    },
    {
      id: "disociacion",
      titulo: "Episodio Disociativo",
      descripcion: "Desconexión de la realidad, 'estar fuera del cuerpo'",
      color: "green",
      icon: Brain,
      pasos: [
        {
          numero: 1,
          titulo: "Habla con voz suave",
          descripcion: "Usa un tono calmado y di su nombre frecuentemente",
          duracion: "Constante"
        },
        {
          numero: 2,
          titulo: "Técnicas de grounding físico",
          descripcion: "Cubos de hielo, objeto con textura, presión suave",
          duracion: "Según respuesta"
        },
        {
          numero: 3,
          titulo: "Oriéntala/o en tiempo y espacio",
          descripcion: "Recuérdales dónde están, qué día es, quién eres tú",
          duracion: "Repetir si es necesario"
        },
        {
          numero: 4,
          titulo: "Acompañala/o de vuelta",
          descripcion: "Quédate hasta que se reintegre completamente",
          duracion: "Según necesidad"
        }
      ]
    }
  ];

  const completarPaso = (situacionId, pasoIndex) => {
    const key = `${situacionId}-${pasoIndex}`;
    setPasoCompletado(prev => ({...prev, [key]: !prev[key]}));
  };

  const contactosEmergencia = [
    {
      nombre: "Psicología Campus",
      numero: "664-123-4567",
      disponibilidad: "Lun-Vie 8:00-18:00",
    },
    {
      nombre: "Línea de la Vida",
      numero: "800-911-2000",
      disponibilidad: "24/7",
    },
    {
      nombre: "Emergencias",
      numero: "911",
      disponibilidad: "24/7",
    }
  ];

  if (situacionSeleccionada) {
    const situacion = situaciones.find(s => s.id === situacionSeleccionada);
    const IconComponent = situacion.icon;

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
            onClick={() => setSituacionSeleccionada(null)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <IconComponent className={`w-8 h-8 text-${situacion.color}-600`} />
              {situacion.titulo}
            </h1>
            <p className="text-gray-600 mt-2">{situacion.descripcion}</p>
          </div>
        </motion.div>

        {/* Banner de emergencia */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-red-600 text-white rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6" />
            <p className="font-semibold">Si hay riesgo inmediato de autolesión, contacta emergencias: 911</p>
          </div>
        </motion.div>

        {/* Pasos del protocolo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900">Protocolo de Ayuda</h2>
          {situacion.pasos.map((paso, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-white rounded-lg p-6 border-l-4 border-${situacion.color}-500 shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => completarPaso(situacion.id, index)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    pasoCompletado[`${situacion.id}-${index}`]
                      ? `bg-${situacion.color}-500 border-${situacion.color}-500 text-white`
                      : `border-${situacion.color}-300 hover:border-${situacion.color}-400`
                  }`}
                >
                  {pasoCompletado[`${situacion.id}-${index}`] && <CheckCircle className="w-5 h-5" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Paso {paso.numero}: {paso.titulo}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded bg-${situacion.color}-100 text-${situacion.color}-700`}>
                      {paso.duracion}
                    </span>
                  </div>
                  <p className="text-gray-700">{paso.descripcion}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Contactos de emergencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gray-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactos de Apoyo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactosEmergencia.map((contacto, index) => (
              <button
                key={index}
                onClick={() => window.open(`tel:${contacto.numero}`, '_self')}
                className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{contacto.numero}</span>
                </div>
                <p className="text-sm text-gray-600">{contacto.nombre}</p>
                <p className="text-xs text-gray-500">{contacto.disponibilidad}</p>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
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
            <Shield className="w-8 h-8 text-green-600" />
            Primeros Auxilios Emocionales
          </h1>
          <p className="text-gray-600 mt-2">
            Cómo ayudar a alguien en crisis emocional o psicológica
          </p>
        </div>
      </motion.div>

      {/* Introducción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-blue-50 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Qué son los Primeros Auxilios Emocionales?
        </h2>
        <p className="text-gray-700 mb-4">
          Los primeros auxilios emocionales son técnicas básicas para ayudar a alguien
          que está experimentando una crisis emocional o psicológica. El objetivo es
          estabilizar, calmar y conectar con recursos profesionales.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Principios básicos:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Mantén la calma en todo momento</li>
              <li>• Escucha sin juzgar</li>
              <li>• No minimices sus sentimientos</li>
              <li>• Ofrece apoyo, no soluciones</li>
              <li>• Conecta con ayuda profesional</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Cuándo buscar ayuda inmediata:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pensamientos de autolesión o suicidio</li>
              <li>• Desconexión total de la realidad</li>
              <li>• Agresividad hacia otros</li>
              <li>• Consumo excesivo de sustancias</li>
              <li>• Comportamiento extremadamente riesgoso</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Situaciones comunes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-900">Situaciones Comunes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {situaciones.map((situacion, index) => {
            const IconComponent = situacion.icon;
            return (
              <motion.div
                key={situacion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setSituacionSeleccionada(situacion.id)}
                className={`bg-${situacion.color}-50 border-2 border-${situacion.color}-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition-all group`}
              >
                <div className="flex items-start gap-4">
                  <IconComponent className={`w-8 h-8 text-${situacion.color}-600 group-hover:scale-110 transition-transform`} />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {situacion.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{situacion.descripcion}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{situacion.pasos.length} pasos de protocolo</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recursos relacionados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-gray-50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Para tu propio bienestar:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to={ROUTES.RESPIRACION_GUIADA}
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Wind className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-semibold">Si tú necesitas calmarte</p>
              <p className="text-sm text-gray-600">Técnicas de respiración</p>
            </div>
          </Link>
          <a
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2B-xvZKl6KLUb7H0jvcNNBNdXAhGO9X2G0Qwl0DOMBFDzykmYM1Kv0MOHSs0vPrWkUZTDyy2QQ"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Calendar className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-semibold">Si necesitas hablar</p>
              <p className="text-sm text-gray-600">Agenda una cita</p>
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default PrimerosAuxiliosPage;