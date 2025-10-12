import React, { useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

const RecursosPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const recursos = [
    {
      id: "crisis",
      title: "Crisis Inmediata",
      icon: AlertTriangle,
      color: "red",
      urgent: true,
      description: "Ayuda inmediata disponible 24/7",
      items: [
        {
          title: "Plan de Seguridad Personal",
          description: "Pasos a seguir en momentos de crisis",
          action: "Crear Plan",
          icon: Shield,
        },
        {
          title: "Contactos de Emergencia",
          description: "Números de apoyo institucional y nacional",
          action: "Ver Contactos",
          icon: Phone,
        },
        {
          title: "Técnica de Respiración 4-7-8",
          description: "Ejercicio rápido para calmar la ansiedad",
          action: "Practicar Ahora",
          icon: Wind,
        },
        {
          title: "Grounding 5-4-3-2-1",
          description: "Reconecta con el presente usando tus sentidos",
          action: "Comenzar",
          icon: Brain,
        },
      ],
    },
    {
      id: "primeros-auxilios",
      title: "Primeros Auxilios Emocionales",
      icon: Heart,
      color: "blue",
      description: "Técnicas de 5-10 minutos para estabilizar emociones",
      items: [
        {
          title: "Respiración Diafragmática",
          description: "Ejercicio guiado para reducir el estrés",
          action: "Audio Guiado",
          icon: Wind,
          duration: "8 min",
        },
        {
          title: "Nube de Pensamientos",
          description: "Externaliza y observa tus pensamientos",
          action: "Ejercicio",
          icon: Brain,
          duration: "5 min",
        },
        {
          title: "Escaneo Corporal",
          description: "Relajación progresiva guiada",
          action: "Audio",
          icon: Activity,
          duration: "10 min",
        },
      ],
    },
    {
      id: "programas",
      title: "Programas Autoguiados",
      icon: Clock,
      color: "purple",
      description: "Programas de 2-6 semanas para desarrollo personal",
      items: [
        {
          title: "Activación Conductual",
          description: "Programa de 4 semanas para mejorar el ánimo",
          action: "Comenzar Programa",
          icon: Activity,
          duration: "4 semanas",
        },
        {
          title: "Registro de Pensamientos (CBT)",
          description: "Identifica y cambia patrones de pensamiento",
          action: "Iniciar",
          icon: Brain,
          duration: "6 semanas",
        },
        {
          title: "Plan de Sueño",
          description: "Mejora tu higiene del sueño paso a paso",
          action: "Empezar",
          icon: Moon,
          duration: "3 semanas",
        },
        {
          title: "Manejo de Preocupación",
          description: "Técnicas para controlar pensamientos repetitivos",
          action: "Acceder",
          icon: Brain,
          duration: "2 semanas",
        },
      ],
    },
    {
      id: "habitos",
      title: "Hábitos y Estilo de Vida",
      icon: Moon,
      color: "indigo",
      description: "Fundamentos para el bienestar diario",
      items: [
        {
          title: "Guía Completa del Sueño",
          description: "Todo sobre higiene del sueño y rutinas",
          action: "Descargar PDF",
          icon: Download,
        },
        {
          title: "Alimentación Consciente",
          description: "Principios básicos de nutrición para estudiantes",
          action: "Ver Guía",
          icon: Heart,
        },
        {
          title: "Micro-pausas Activas",
          description: "Ejercicios de 2 minutos durante el estudio",
          action: "Video Tutorial",
          icon: Activity,
        },
        {
          title: "Reducción de Cafeína",
          description: "Plan gradual para equilibrar el consumo",
          action: "Plan 7 días",
          icon: Moon,
        },
      ],
    },
    {
      id: "academico",
      title: "Apoyo Académico",
      icon: Clock,
      color: "orange",
      description: "Herramientas para el éxito académico sin estrés",
      items: [
        {
          title: "Planificador Semanal",
          description: "Template imprimible para organizar tu semana",
          action: "Descargar",
          icon: Download,
        },
        {
          title: "Método Pomodoro",
          description: "Técnica de productividad con descansos",
          action: "Tutorial",
          icon: Clock,
        },
        {
          title: "Exámenes sin Ansiedad",
          description: "Estrategias probadas para reducir el estrés",
          action: "Guía Completa",
          icon: Brain,
        },
        {
          title: "Comunicación con Docentes",
          description: "Cómo pedir extensiones y apoyo académico",
          action: "Plantillas",
          icon: FileText,
        },
      ],
    },
    {
      id: "seguridad",
      title: "Seguridad y Protección",
      icon: Shield,
      color: "green",
      description: "Recursos para situaciones de riesgo",
      items: [
        {
          title: "Documentar Incidentes",
          description: "Guía paso a paso para reportar situaciones",
          action: "Guía Legal",
          icon: FileText,
        },
        {
          title: "Canales Institucionales",
          description: "Contactos seguros dentro del campus",
          action: "Directorio",
          icon: Phone,
        },
        {
          title: "Autocuidado Post-Evento",
          description: "Cómo cuidarte después de una experiencia difícil",
          action: "Recurso",
          icon: Heart,
        },
        {
          title: "Privacidad Digital",
          description: "Protege tu información en redes sociales",
          action: "Checklist",
          icon: Smartphone,
        },
      ],
    },
    {
      id: "apoyo",
      title: "Red de Apoyo",
      icon: Users,
      color: "teal",
      description: "Construye y fortalece tu red de soporte",
      items: [
        {
          title: "Mapa de Apoyo Personal",
          description: "Identifica quién está disponible para ti",
          action: "Crear Mapa",
          icon: Users,
        },
        {
          title: "Cómo Pedir Ayuda",
          description: "Estrategias para comunicar tus necesidades",
          action: "Guía",
          icon: Heart,
        },
        {
          title: "Mensajes Modelo",
          description: "Plantillas para pedir apoyo por mensaje",
          action: "Templates",
          icon: FileText,
        },
      ],
    },
    {
      id: "diversidad",
      title: "Diversidad e Inclusión",
      icon: Heart,
      color: "pink",
      description: "Recursos para una comunidad inclusiva",
      items: [
        {
          title: "Grupos Estudiantiles",
          description: "Directorio de comunidades en el campus",
          action: "Explorar",
          icon: Users,
        },
        {
          title: "Atención Sensible",
          description: "Servicios especializados disponibles",
          action: "Información",
          icon: Heart,
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
          <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Emergencias: 911
          </button>
          <button className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors">
            Psicología Campus
          </button>
          <button className="bg-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors">
            Chat de Crisis
          </button>
        </div>
      </motion.div>

      {/* Recursos principales */}
      <div className="space-y-6">
        {recursos.map((seccion, index) => {
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
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                          >
                            <div className="flex items-start gap-3">
                              <ItemIcon className={`w-5 h-5 mt-1 ${getIconColor(seccion.color)}`} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">
                                    {item.title}
                                  </h4>
                                  {item.duration && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {item.duration}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  {item.description}
                                </p>
                                <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 group-hover:gap-3 transition-all">
                                  {item.action}
                                  <ArrowRight className="w-4 h-4" />
                                </button>
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
      </div>

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
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Agendar Cita con Psicología
        </button>
      </motion.div>
    </div>
  );
};

export default RecursosPage;