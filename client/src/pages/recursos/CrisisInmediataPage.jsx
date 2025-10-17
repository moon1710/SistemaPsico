import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Phone,
  MessageCircle,
  Shield,
  ArrowLeft,
  Clock,
  Heart,
  Wind,
  Brain,
  CheckCircle,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

const CrisisInmediataPage = () => {
  const [planCreado, setPlanCreado] = useState(false);
  const [pasoCompletado, setPasoCompletado] = useState({});

  const completarPaso = (pasoId) => {
    setPasoCompletado(prev => ({...prev, [pasoId]: !prev[pasoId]}));
  };

  const contactosEmergencia = [
    {
      nombre: "Emergencias Nacionales",
      numero: "911",
      descripcion: "Policía, bomberos, ambulancia",
      disponibilidad: "24/7",
      color: "red",
    },
    {
      nombre: "Línea de la Vida",
      numero: "800-911-2000",
      descripcion: "Prevención del suicidio",
      disponibilidad: "24/7",
      color: "blue",
    },
    {
      nombre: "Psicología Campus",
      numero: "664-123-4567",
      descripcion: "Centro de Bienestar TecNM Tuxtepec",
      disponibilidad: "Lun-Vie 8:00-18:00",
      color: "green",
    },
    {
      nombre: "Chat de Crisis",
      numero: "En línea",
      descripcion: "Apoyo inmediato por chat",
      disponibilidad: "24/7",
      color: "purple",
    },
  ];

  const pasosPlanSeguridad = [
    {
      id: "identificar",
      titulo: "Identifica tus señales de alerta",
      descripcion: "Reconoce cuándo estás en riesgo",
      ejemplo: "Pensamientos negativos intensos, aislamiento, desesperanza",
    },
    {
      id: "contactos",
      titulo: "Lista tus contactos de apoyo",
      descripcion: "3-5 personas en las que confías",
      ejemplo: "Familia, amigos cercanos, profesores de confianza",
    },
    {
      id: "lugares",
      titulo: "Identifica lugares seguros",
      descripcion: "Espacios donde te sientes protegido",
      ejemplo: "Centro estudiantil, biblioteca, casa de familiar",
    },
    {
      id: "tecnicas",
      titulo: "Elige técnicas de calma",
      descripcion: "Estrategias que te han funcionado",
      ejemplo: "Respiración profunda, música, caminar",
    },
    {
      id: "eliminar",
      titulo: "Remueve medios de autolesión",
      descripcion: "Haz tu entorno más seguro",
      ejemplo: "Pide a alguien que guarde objetos peligrosos",
    },
  ];

  const tecnicasRapidas = [
    {
      nombre: "Respiración 4-7-8",
      descripcion: "Inhala 4, retén 7, exhala 8 segundos",
      duracion: "3-5 repeticiones",
      icon: Wind,
      link: ROUTES.RESPIRACION_GUIADA,
    },
    {
      nombre: "Técnica 5-4-3-2-1",
      descripcion: "Grounding con los 5 sentidos",
      duracion: "5-10 minutos",
      icon: Brain,
      link: ROUTES.TECNICA_5432,
    },
    {
      nombre: "Contacto de Apoyo",
      descripcion: "Llama a alguien de confianza",
      duracion: "Inmediato",
      icon: Users,
    },
    {
      nombre: "Lugar Seguro",
      descripcion: "Ve a un espacio que te tranquilice",
      duracion: "Inmediato",
      icon: MapPin,
    },
  ];

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
            <AlertTriangle className="w-8 h-8 text-red-600" />
            Crisis Inmediata
          </h1>
          <p className="text-gray-600 mt-2">
            Recursos para situaciones de emergencia emocional. Si estás en peligro inmediato, contacta al 911.
          </p>
        </div>
      </motion.div>

      {/* Banner de emergencia */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-red-600 text-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">¿Estás en peligro ahora mismo?</h2>
            <p>Si tienes pensamientos de autolesión o estás en crisis, busca ayuda inmediatamente.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {contactosEmergencia.map((contacto, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white text-gray-900 p-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-left"
              onClick={() => window.open(`tel:${contacto.numero}`, '_self')}
            >
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4" />
                <span className="font-bold">{contacto.numero}</span>
              </div>
              <p className="text-sm font-medium">{contacto.nombre}</p>
              <p className="text-xs text-gray-600">{contacto.descripcion}</p>
              <p className="text-xs text-gray-500 mt-1">{contacto.disponibilidad}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Técnicas rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-blue-50 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-600" />
          Técnicas de Calma Inmediata
        </h2>
        <p className="text-gray-600 mb-6">
          Estas técnicas pueden ayudarte a estabilizarte en los primeros momentos de crisis.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tecnicasRapidas.map((tecnica, index) => {
            const IconComponent = tecnica.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => tecnica.link && (window.location.href = tecnica.link)}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="w-6 h-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tecnica.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{tecnica.descripcion}</p>
                    <p className="text-xs text-gray-500 mt-2">{tecnica.duracion}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Plan de seguridad personal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-green-50 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Shield className="w-6 h-6 text-green-600" />
          Plan de Seguridad Personal
        </h2>
        <p className="text-gray-600 mb-6">
          Crea tu plan personalizado para momentos difíciles. Tener un plan preparado puede salvarte la vida.
        </p>

        <div className="space-y-4">
          {pasosPlanSeguridad.map((paso, index) => (
            <motion.div
              key={paso.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-white rounded-lg p-4 border-l-4 ${
                pasoCompletado[paso.id] ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => completarPaso(paso.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    pasoCompletado[paso.id]
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {pasoCompletado[paso.id] && <CheckCircle className="w-4 h-4" />}
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {index + 1}. {paso.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{paso.descripcion}</p>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Ejemplo: {paso.ejemplo}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-2">
            ¿Ya completaste tu plan?
          </h3>
          <button
            onClick={() => setPlanCreado(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Guardar Mi Plan de Seguridad
          </button>
          {planCreado && (
            <div className="mt-3 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
              ✅ Plan guardado. Recuerda revisarlo periódicamente y mantenerlo actualizado.
            </div>
          )}
        </div>
      </motion.div>

      {/* Recordatorios importantes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-yellow-50 rounded-xl p-6 border border-yellow-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Heart className="w-6 h-6 text-yellow-600" />
          Recordatorios Importantes
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
            <p>Las crisis son temporales. Este momento difícil pasará.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
            <p>Pedir ayuda es un acto de valentía, no de debilidad.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
            <p>Tu vida tiene valor y mereces apoyo y cuidado.</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
            <p>Si una técnica no funciona, prueba otra. Está bien experimentar.</p>
          </div>
        </div>
      </motion.div>

      {/* Recursos adicionales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gray-50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ¿Necesitas más apoyo?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2B-xvZKl6KLUb7H0jvcNNBNdXAhGO9X2G0Qwl0DOMBFDzykmYM1Kv0MOHSs0vPrWkUZTDyy2QQ"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            <Calendar className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold">Agendar Cita</p>
            <p className="text-sm opacity-90">Con nuestro equipo de psicología</p>
          </a>
          <Link
            to={ROUTES.PRIMEROS_AUXILIOS}
            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center"
          >
            <Heart className="w-6 h-6 mx-auto mb-2" />
            <p className="font-semibold">Primeros Auxilios Emocionales</p>
            <p className="text-sm opacity-90">Técnicas de estabilización</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default CrisisInmediataPage;