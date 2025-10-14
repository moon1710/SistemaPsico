import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  HeartIcon,
  PhoneIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { ROUTES } from "../../utils/constants";
import SeverityBadge from "../../components/quizzes/SeverityBadge";

const QuizResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Obtener resultado del state pasado por navigate
    if (location.state?.result) {
      setResult(location.state.result);

      // Si es severidad alta, crear notificación para psicólogos
      if (location.state.result.severidad === 'SEVERA' || location.state.result.severidad === 'MODERADA') {
        createPsychologistNotification(location.state.result);
      }
    } else {
      // Si no hay resultado, redirigir a mis resultados
      navigate(ROUTES.MIS_RESULTADOS);
    }
  }, [location.state, navigate]);

  const createPsychologistNotification = async (resultData) => {
    try {
      // Aquí iría la llamada al backend para crear la notificación
      console.log('🚨 Creating high-risk notification for psychologists:', resultData);
      // await notificationsApi.createHighRiskAlert(resultData);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getSeverityConfig = (severidad) => {
    const configs = {
      MINIMA: {
        title: "¡Excelente resultado!",
        subtitle: "Tus niveles están en un rango saludable",
        color: "green",
        bgGradient: "from-green-50 to-emerald-50",
        icon: CheckCircleIcon,
        message: "Los resultados muestran niveles mínimos de síntomas. Continúa cuidando tu bienestar mental con hábitos saludables.",
        urgency: "low"
      },
      LEVE: {
        title: "Resultado dentro del rango normal",
        subtitle: "Algunos síntomas leves detectados",
        color: "yellow",
        bgGradient: "from-yellow-50 to-amber-50",
        icon: ExclamationTriangleIcon,
        message: "Se detectaron algunos síntomas leves. Es recomendable practicar técnicas de autocuidado y estar atento a cambios.",
        urgency: "low"
      },
      MODERADA: {
        title: "Atención requerida",
        subtitle: "Síntomas moderados que requieren seguimiento",
        color: "orange",
        bgGradient: "from-orange-50 to-red-50",
        icon: ExclamationTriangleIcon,
        message: "Los resultados indican síntomas moderados. Te recomendamos buscar apoyo profesional y usar las herramientas de bienestar disponibles.",
        urgency: "medium"
      },
      SEVERA: {
        title: "Apoyo inmediato recomendado",
        subtitle: "Síntomas severos - Intervención profesional necesaria",
        color: "red",
        bgGradient: "from-red-50 to-pink-50",
        icon: XCircleIcon,
        message: "Los resultados indican síntomas severos. Es importante buscar ayuda profesional inmediatamente. Tu bienestar es nuestra prioridad.",
        urgency: "high"
      }
    };
    return configs[severidad] || configs.LEVE;
  };

  const config = getSeverityConfig(result.severidad);
  const IconComponent = config.icon;

  const getRecommendedActions = (severidad) => {
    const actions = {
      MINIMA: [
        {
          title: "🌟 Recursos de bienestar preventivo",
          description: "Mantén tu bienestar con técnicas de relajación",
          icon: HeartIcon,
          color: "green",
          action: () => navigate(ROUTES.RESPIRACION_GUIADA)
        },
        {
          title: "📚 Explora herramientas de autocuidado",
          description: "Técnicas que puedes usar en tu día a día",
          icon: SparklesIcon,
          color: "blue",
          action: () => navigate(ROUTES.RECURSOS)
        }
      ],
      LEVE: [
        {
          title: "🧘‍♀️ Técnicas de relajación",
          description: "Ejercicios de respiración y relajación muscular",
          icon: HeartIcon,
          color: "blue",
          action: () => navigate(ROUTES.RESPIRACION_GUIADA)
        },
        {
          title: "🎯 Técnica de Grounding 5-4-3-2-1",
          description: "Reconecta con el presente usando tus sentidos",
          icon: BookOpenIcon,
          color: "purple",
          action: () => navigate(ROUTES.TECNICA_5432)
        },
        {
          title: "💡 Recursos de bienestar",
          description: "Explora herramientas de autocuidado",
          icon: SparklesIcon,
          color: "green",
          action: () => navigate(ROUTES.RECURSOS)
        }
      ],
      MODERADA: [
        {
          title: "📅 RECOMENDADO: Agenda una cita",
          description: "Habla con nuestro equipo de psicología",
          icon: CalendarDaysIcon,
          color: "orange",
          action: () => navigate(ROUTES.AGENDAR_CITA),
          priority: true
        },
        {
          title: "🆘 Técnicas de calma inmediata",
          description: "Para manejar momentos de ansiedad o estrés",
          icon: HeartIcon,
          color: "blue",
          action: () => navigate(ROUTES.TECNICA_5432)
        },
        {
          title: "🤝 Cómo pedir ayuda efectivamente",
          description: "Guías prácticas para comunicar tus necesidades",
          icon: UserGroupIcon,
          color: "green",
          action: () => navigate(ROUTES.COMO_PEDIR_AYUDA)
        }
      ],
      SEVERA: [
        {
          title: "🚨 URGENTE: Contacta psicología campus",
          description: "Apoyo profesional inmediato disponible",
          icon: PhoneIcon,
          color: "red",
          action: () => navigate(ROUTES.AGENDAR_CITA),
          priority: true,
          urgent: true
        },
        {
          title: "🆘 Centro de recursos de crisis",
          description: "Herramientas y contactos para emergencias",
          icon: ExclamationTriangleIcon,
          color: "red",
          action: () => navigate(ROUTES.CRISIS_INMEDIATA),
          urgent: true
        },
        {
          title: "💬 Guías para pedir ayuda AHORA",
          description: "Plantillas para comunicar tu situación",
          icon: UserGroupIcon,
          color: "orange",
          action: () => navigate(ROUTES.COMO_PEDIR_AYUDA)
        }
      ]
    };
    return actions[severidad] || actions.LEVE;
  };

  const recommendedActions = getRecommendedActions(result.severidad);

  const emergencyContacts = [
    {
      name: "Emergencias",
      number: "911",
      description: "Situaciones de riesgo inmediato",
      color: "red"
    },
    {
      name: "Línea de la Vida",
      number: "800-911-2000",
      description: "Apoyo en crisis las 24 horas",
      color: "blue"
    },
    {
      name: "Psicología Campus",
      number: "664-123-4567",
      description: "Centro de Bienestar TecNM",
      color: "green"
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} py-8 px-4`}>
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header con resultado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full bg-${config.color}-100 flex items-center justify-center`}>
              <IconComponent className={`w-10 h-10 text-${config.color}-600`} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h1>
          <p className="text-xl text-gray-600 mb-4">{config.subtitle}</p>

          <div className="flex justify-center items-center gap-4 mb-6">
            <SeverityBadge value={result.severidad} showIcon={true} size="lg" />
            <div className="text-left">
              <p className="text-sm text-gray-500">Puntaje obtenido</p>
              <p className="text-2xl font-bold text-gray-900">{result.puntajeTotal}</p>
            </div>
          </div>

          <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
            {config.message}
          </p>
        </motion.div>

        {/* Notificación especial para casos severos/moderados */}
        {(result.severidad === 'SEVERA' || result.severidad === 'MODERADA') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`bg-${result.severidad === 'SEVERA' ? 'red' : 'orange'}-50 border border-${result.severidad === 'SEVERA' ? 'red' : 'orange'}-200 rounded-xl p-6`}
          >
            <div className="flex items-start gap-4">
              <ExclamationTriangleIcon className={`w-6 h-6 text-${result.severidad === 'SEVERA' ? 'red' : 'orange'}-600 mt-1 flex-shrink-0`} />
              <div>
                <h3 className={`text-lg font-semibold text-${result.severidad === 'SEVERA' ? 'red' : 'orange'}-900 mb-2`}>
                  {result.severidad === 'SEVERA' ? 'Notificación Automática Enviada' : 'Seguimiento Programado'}
                </h3>
                <p className={`text-${result.severidad === 'SEVERA' ? 'red' : 'orange'}-800`}>
                  {result.severidad === 'SEVERA'
                    ? 'Hemos notificado a nuestro equipo de psicología sobre tu resultado. Te contactaremos pronto para ofrecerte apoyo personalizado.'
                    : 'Tu resultado ha sido registrado para seguimiento. Nuestro equipo estará disponible si necesitas apoyo adicional.'
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Acciones recomendadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Siguientes pasos recomendados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedActions.map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  onClick={action.action}
                  className={`p-6 rounded-xl border-2 text-left hover:shadow-lg transition-all duration-300 ${
                    action.priority
                      ? `border-${action.color}-300 bg-${action.color}-50 hover:bg-${action.color}-100`
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  } ${action.urgent ? 'ring-2 ring-red-300 animate-pulse' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <ActionIcon className={`w-6 h-6 text-${action.color}-600 mt-1 flex-shrink-0`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        {action.title}
                        {action.urgent && <span className="text-red-500 text-xs">URGENTE</span>}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                      <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                        <span>Acceder</span>
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Contactos de emergencia (solo para severidad moderada/severa) */}
        {(result.severidad === 'SEVERA' || result.severidad === 'MODERADA') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PhoneIcon className="w-6 h-6 text-red-600" />
              Contactos de Apoyo Inmediato
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.0 + index * 0.1 }}
                  onClick={() => window.open(`tel:${contact.number}`, '_self')}
                  className={`p-4 rounded-lg border border-${contact.color}-200 bg-${contact.color}-50 hover:bg-${contact.color}-100 transition-colors text-left`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <PhoneIcon className={`w-4 h-4 text-${contact.color}-600`} />
                    <span className="font-bold text-gray-900">{contact.number}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Acciones finales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center space-y-4"
        >
          {result.severidad === 'SEVERA' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                📞 Te contactaremos pronto
              </h3>
              <p className="text-red-800">
                Nuestro equipo de psicología te contactará en las próximas 24 horas para ofrecerte apoyo personalizado.
                Mientras tanto, puedes usar las herramientas de apoyo inmediato disponibles arriba.
              </p>
            </div>
          )}

          {result.severidad === 'MODERADA' && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                📅 Recomendamos agendar una cita
              </h3>
              <p className="text-orange-800">
                Basado en tus resultados, sería beneficioso que hables con un profesional.
                Puedes agendar una cita usando el botón de arriba o usar nuestras herramientas de apoyo.
              </p>
            </div>
          )}

          {(result.severidad === 'LEVE' || result.severidad === 'MINIMA') && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ✨ Sigue cuidando tu bienestar
              </h3>
              <p className="text-green-800">
                Tus resultados están en un rango saludable. Continúa practicando el autocuidado
                y utilizando las herramientas de bienestar cuando las necesites.
              </p>
            </div>
          )}

          <div className="pt-4">
            <Link
              to={ROUTES.DASHBOARD}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Volver al Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Mensaje de seguimiento */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center text-gray-600 text-sm"
        >
          <p>
            Recuerda que estas evaluaciones son herramientas de apoyo.
            Para un diagnóstico profesional, consulta con nuestro equipo de psicología.
          </p>
          <p className="mt-2">
            Tu bienestar es importante para nosotros. 💙
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizResultPage;