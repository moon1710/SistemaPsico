// client/src/data/docs.js

/**
 * Array de objetos que representa las guías y documentación de Neuroflora.
 * Estado: 'available' (disponible con link) o 'soon' (próximamente).
 */
export const documentationGuides = [
  {
    id: 1,
    title: "Guía Rápida para Estudiantes",
    description: "Aprende a usar el Dashboard, agendar tu primera cita y acceder a los Quizzes de bienestar.",
    estado: "available",
    link: "/docs/guia-estudiante-v1.pdf", // Cambiar por la URL real
    icon: "user",
  },
  {
    id: 2,
    title: "Manejo del Sistema para Psicólogos",
    description: "Configura tu disponibilidad, administra tu agenda y accede al historial clínico de tus pacientes.",
    estado: "available",
    link: "/docs/manual-psicologo-v1.pdf",
    icon: "psychologist",
  },
  {
    id: 3,
    title: "Funcionalidades de Análisis (Admin)",
    description: "Manual para administradores institucionales sobre la visualización y análisis de datos agregados de Quizzes.",
    estado: "soon",
    link: null,
    icon: "admin",
  },
  {
    id: 4,
    title: "Integración con Plataformas Académicas",
    description: "Detalles técnicos sobre cómo sincronizar Neuroflora con el LMS o el ERP de la institución.",
    estado: "soon",
    link: null,
    icon: "integration",
  },
];