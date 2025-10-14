import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Wind,
  Brain,
  Moon,
  Shield,
  Users,
  Smartphone,
  FileText,
  Phone,
  Clock,
  Activity,
  Heart,
  ArrowRight,
  Play,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Zap,
} from "lucide-react";
import { ROUTES } from "../utils/constants";

const RecursosPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const recursosInteractivos = [
    {
      id: "crisis",
      title: "Crisis Inmediata",
      icon: AlertTriangle,
      color: "red",
      urgent: true,
      description: "Ayuda inmediata disponible 24/7",
      link: ROUTES.CRISIS_INMEDIATA,
      features: ["Plan de seguridad personal", "Contactos de emergencia", "Técnicas rápidas de estabilización"]
    },
    {
      id: "primeros-auxilios",
      title: "Primeros Auxilios Emocionales",
      icon: Heart,
      color: "blue",
      description: "Cómo ayudar a alguien en crisis",
      link: ROUTES.PRIMEROS_AUXILIOS,
      features: ["Protocolos paso a paso", "Crisis de ansiedad", "Crisis depresivas", "Episodios disociativos"]
    },
    {
      id: "respiracion",
      title: "Respiración Guiada",
      icon: Wind,
      color: "green",
      description: "Técnicas de respiración interactivas",
      link: ROUTES.RESPIRACION_GUIADA,
      features: ["Respiración 4-7-8", "Respiración cuadrada", "Respiración profunda", "Con temporizador"]
    },
    {
      id: "grounding",
      title: "Técnica 5-4-3-2-1",
      icon: Brain,
      color: "purple",
      description: "Grounding interactivo con los 5 sentidos",
      link: ROUTES.TECNICA_5432,
      features: ["Guía paso a paso", "Registro de respuestas", "Conecta con el presente"]
    },
    {
      id: "relajacion",
      title: "Relajación Muscular",
      icon: Zap,
      color: "indigo",
      description: "Relajación muscular progresiva guiada",
      link: ROUTES.RELAJACION_MUSCULAR,
      features: ["Sesión completa", "Versión rápida", "Grupos específicos", "Con instrucciones de voz"]
    }
  ];

  const recursosEstaticos = [
    {
      id: "habitos",
      title: "Hábitos y Estilo de Vida",
      icon: Moon,
      color: "indigo",
      description: "Fundamentos para el bienestar diario",
      items: [
        {
          title: "Guía del Sueño Estudiantil",
          description: "Consejos prácticos para mejorar tu descanso",
          action: "Próximamente",
          icon: Moon,
          comingSoon: true,
        },
        {
          title: "Pausas Activas",
          description: "Ejercicios de 2 minutos durante el estudio",
          action: "Próximamente",
          icon: Activity,
          comingSoon: true,
        },
      ],
    },
    {
      id: "academico",
      title: "Apoyo Académico",
      icon: FileText,
      color: "orange",
      description: "Herramientas para el éxito académico",
      items: [
        {
          title: "Planificador de Estudios",
          description: "Organiza tu tiempo de forma efectiva",
          action: "Próximamente",
          icon: Clock,
          comingSoon: true,
        },
        {
          title: "Manejo de Ansiedad ante Exámenes",
          description: "Estrategias para reducir el estrés académico",
          action: "Próximamente",
          icon: Brain,
          comingSoon: true,
        },
      ],
    },
    {
      id: "apoyo",
      title: "Red de Apoyo",
      icon: Users,
      color: "teal",
      description: "Construye tu red de soporte",
      items: [
        {
          title: "Directorio de Contactos Campus",
          description: "Servicios de apoyo disponibles en tu institución",
          action: "Ver Directorio",
          icon: Phone,
          available: true,
        },
        {
          title: "Cómo Pedir Ayuda",
          description: "Guía para comunicar tus necesidades",
          action: "Ver Guía",
          icon: Heart,
          available: true,
          link: ROUTES.COMO_PEDIR_AYUDA,
        },
      ],
    },
  ];

  const getColorClasses = (color, urgent = false) => {
    const colors = {
      red: urgent
        ? "bg-red-100 border-red-300 text-red-800"
        : "bg-red-50 border-red-200 text-red-700",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      purple: "bg-purple-50 border-purple-200 text-purple-700",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
      orange: "bg-orange-50 border-orange-200 text-orange-700",
      green: "bg-green-50 border-green-200 text-green-700",
      teal: "bg-teal-50 border-teal-200 text-teal-700",
      pink: "bg-pink-50 border-pink-200 text-pink-700",
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      red: "text-red-600",
      blue: "text-blue-600",
      purple: "text-purple-600",
      indigo: "text-indigo-600",
      orange: "text-orange-600",
      green: "text-green-600",
      teal: "text-teal-600",
      pink: "text-pink-600",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Centro de Recursos de Bienestar
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Herramientas, técnicas y recursos diseñados para apoyar tu bienestar
          emocional, académico y personal durante tu experiencia universitaria.
        </p>
      </motion.div>

      {/* Banner de Crisis - Siempre visible */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-red-600 text-white rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-bold">¿Necesitas Ayuda Inmediata?</h2>
            <p>Si estás en crisis o tienes pensamientos de autolesión, busca ayuda ahora.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to={ROUTES.CRISIS_INMEDIATA}
            className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Centro de Crisis
          </Link>
          <button
            onClick={() => window.open('tel:911', '_self')}
            className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            911
          </button>
        </div>
      </motion.div>

      {/* Recursos Interactivos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recursos Interactivos</h2>
          <p className="text-gray-600 mb-6">Herramientas guiadas que puedes usar ahora mismo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recursosInteractivos.map((recurso, index) => {
            const IconComponent = recurso.icon;
            return (
              <motion.div
                key={recurso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group"
              >
                <Link to={recurso.link} className="block">
                  <div className={`rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${getColorClasses(recurso.color, recurso.urgent)}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className={`w-8 h-8 ${getIconColor(recurso.color)}`} />
                      <h3 className="text-xl font-bold text-gray-900">{recurso.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-4">{recurso.description}</p>
                    <ul className="space-y-1 mb-4">
                      {recurso.features.map((feature, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-current rounded-full opacity-60"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                      <span>Usar ahora</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recursos adicionales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recursos Adicionales</h2>
          <p className="text-gray-600 mb-6">Guías, programas y herramientas complementarias</p>
        </div>

        {recursosEstaticos.map((seccion, index) => {
          const IconComponent = seccion.icon;
          const isExpanded = expandedSection === seccion.id;

          return (
            <motion.div
              key={seccion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`rounded-xl border-2 overflow-hidden ${getColorClasses(
                seccion.color,
                seccion.urgent
              )}`}
            >
              {/* Header de la sección */}
              <div
                className="p-6 cursor-pointer hover:bg-opacity-80 transition-all"
                onClick={() => toggleSection(seccion.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <IconComponent className={`w-8 h-8 ${getIconColor(seccion.color)}`} />
                    <div>
                      <h3 className="text-xl font-bold">{seccion.title}</h3>
                      <p className="text-sm opacity-80">{seccion.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {seccion.items.length} recursos
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido expandible */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-current border-opacity-20"
                >
                  <div className="p-6 bg-white bg-opacity-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {seccion.items.map((item, itemIndex) => {
                        const ItemIcon = item.icon;
                        return (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                            className={`bg-white rounded-lg p-4 shadow-sm transition-shadow border-l-4 ${
                              item.comingSoon
                                ? 'border-yellow-400 opacity-75 cursor-default'
                                : item.available
                                ? 'border-green-400 hover:shadow-md cursor-pointer group'
                                : 'border-gray-300 hover:shadow-md cursor-pointer group'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <ItemIcon className={`w-5 h-5 mt-1 ${
                                item.comingSoon
                                  ? 'text-yellow-600'
                                  : getIconColor(seccion.color)
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className={`font-semibold ${
                                    item.comingSoon ? 'text-gray-700' : 'text-gray-900'
                                  }`}>
                                    {item.title}
                                  </h4>
                                  {item.comingSoon && (
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                      Próximamente
                                    </span>
                                  )}
                                  {item.available && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                      Disponible
                                    </span>
                                  )}
                                  {item.duration && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {item.duration}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {item.description}
                                </p>
                                {item.comingSoon ? (
                                  <div className="flex items-center gap-2 text-sm font-medium text-yellow-600">
                                    <Clock className="w-4 h-4" />
                                    {item.action}
                                  </div>
                                ) : item.link ? (
                                  <Link
                                    to={item.link}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-3 transition-all"
                                  >
                                    {item.action}
                                    <ArrowRight className="w-4 h-4" />
                                  </Link>
                                ) : (
                                  <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-3 transition-all">
                                    {item.action}
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer con información adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-gray-50 rounded-xl p-6 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ¿Necesitas más apoyo personalizado?
        </h3>
        <p className="text-gray-600 mb-4">
          Nuestro equipo de psicólogos está disponible para acompañarte en tu proceso.
        </p>
        <Link
          to={ROUTES.AGENDAR_CITA}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Agendar Cita con Psicología
        </Link>
      </motion.div>
    </div>
  );
};

export default RecursosPage;