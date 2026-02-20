// client/src/components/onboarding/onboardingConfig.js

export const onboardingSteps = [
  {
    id: "welcome",
    title: "Bienvenido a Neuroflora",
    subtitle: "Plataforma integral de salud mental",
    icon: "HeartHandshake",
    description:
      "Explora herramientas validadas, acompaña tu progreso y conecta con profesionales para cuidar tu salud mental.",
    features: [
      "Evaluaciones psicológicas validadas",
      "Seguimiento personalizado",
      "Derivaciones y canalización",
      "Recursos educativos",
    ],
    media: {
      // Imagen de bienvenida: Manos unidas / apoyo / naturaleza
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop",
      description: "Interfaz principal del sistema",
    },
  },
  {
    id: "dashboard",
    title: "Panel de control",
    subtitle: "Tu centro de actividades",
    icon: "ChartBar",
    description:
      "Consulta tu estado general, notificaciones y accesos rápidos a las funciones principales.",
    features: [
      "Resumen de progreso",
      "Recordatorios y pendientes",
      "Acceso directo a evaluaciones",
      "Estadísticas personales",
    ],
    media: {
      // Imagen Dashboard: Tecnología limpia / Tablet
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      description: "Vista del panel principal",
    },
  },
  {
    id: "quizzes",
    title: "Evaluaciones psicológicas",
    subtitle: "Herramientas de autoconocimiento",
    icon: "Brain",
    description:
      "Realiza cuestionarios de forma sencilla y obtén resultados claros con sugerencias prácticas.",
    features: [
      "Ansiedad y depresión",
      "Estrés y bienestar",
      "Personalidad y habilidades",
      "Resultados con recomendaciones",
    ],
    media: {
      // Imagen Tests: Persona escribiendo / pensando
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
      description: "Ejemplo de evaluación",
    },
  },
  {
    id: "results",
    title: "Resultados y tendencias",
    subtitle: "Seguimiento de tu progreso",
    icon: "ClipboardList",
    description:
      "Explora tu historial, identifica patrones y exporta reportes cuando los necesites.",
    features: [
      "Histórico completo",
      "Gráficas temporales",
      "Comparaciones por periodo",
      "Exportación de reportes",
    ],
    media: {
      // Imagen Resultados: Gráficas / Análisis
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      description: "Resultados y análisis",
    },
  },
  {
    id: "support",
    title: "Soporte y recursos",
    subtitle: "Acompañamiento cuando lo necesites",
    icon: "LifeBuoy",
    description:
      "Accede a directorios, material educativo y líneas de ayuda para momentos críticos.",
    features: [
      "Directorio de profesionales",
      "Material de apoyo",
      "Líneas de emergencia",
      "Comunidad y acompañamiento",
    ],
    media: {
      // Imagen Soporte: Grupo de personas / ayuda
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
      description: "Red de apoyo y recursos",
    },
  },
];

export default onboardingSteps;