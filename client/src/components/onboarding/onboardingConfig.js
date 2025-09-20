// client/src/components/onboarding/onboardingConfig.js

export const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Bienvenido al Sistema Psicológico',
    subtitle: 'Tu plataforma integral de bienestar mental',
    icon: '👋',
    description: 'Este sistema está diseñado para brindar apoyo psicológico y recursos de bienestar mental a estudiantes y profesionales de la salud mental.',
    features: [
      'Acceso a evaluaciones psicológicas validadas',
      'Seguimiento personalizado de tu bienestar',
      'Conexión con profesionales especializados',
      'Recursos educativos y de autoayuda'
    ],
    media: {
      placeholder: '🏥',
      description: 'Interface principal del sistema'
    }
  },
  {
    id: 'dashboard',
    title: 'Panel de Control',
    subtitle: 'Tu centro de actividades',
    icon: '📊',
    description: 'El dashboard es tu punto de partida. Aquí encontrarás un resumen de tus actividades, evaluaciones pendientes y recursos disponibles.',
    features: [
      'Vista general de tu progreso',
      'Notificaciones importantes',
      'Acceso rápido a funciones principales',
      'Estadísticas personales'
    ],
    media: {
      placeholder: '📈',
      description: 'Vista del dashboard principal'
    }
  },
  {
    id: 'quizzes',
    title: 'Evaluaciones Psicológicas',
    subtitle: 'Herramientas de autoconocimiento',
    icon: '📝',
    description: 'Accede a una amplia gama de evaluaciones psicológicas validadas científicamente para conocer mejor tu estado emocional y mental.',
    features: [
      'Cuestionarios de ansiedad y depresión',
      'Evaluaciones de estrés y bienestar',
      'Tests de personalidad y habilidades',
      'Resultados detallados y recomendaciones'
    ],
    media: {
      placeholder: '🧠',
      description: 'Ejemplo de evaluación psicológica'
    }
  },
  {
    id: 'results',
    title: 'Mis Resultados',
    subtitle: 'Seguimiento de tu progreso',
    icon: '📋',
    description: 'Revisa todos tus resultados anteriores, observa tendencias en tu bienestar y comparte información relevante con profesionales.',
    features: [
      'Historial completo de evaluaciones',
      'Gráficos de progreso temporal',
      'Comparación entre diferentes períodos',
      'Exportación de reportes'
    ],
    media: {
      placeholder: '📊',
      description: 'Vista de resultados y análisis'
    }
  },
  {
    id: 'support',
    title: 'Soporte y Recursos',
    subtitle: 'Ayuda cuando la necesites',
    icon: '🤝',
    description: 'Encuentra recursos de apoyo, contacta profesionales y accede a material educativo para tu bienestar mental.',
    features: [
      'Directorio de profesionales',
      'Recursos educativos especializados',
      'Líneas de crisis y emergencia',
      'Comunidad de apoyo'
    ],
    media: {
      placeholder: '💚',
      description: 'Red de apoyo y recursos'
    }
  }
];

export default onboardingSteps;