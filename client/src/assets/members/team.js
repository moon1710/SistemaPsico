import andrea from "../assets/members/andrea.png";
import angel from "../assets/members/angel.png";
import chris from "../assets/members/chris.png";
import karol from "../assets/members/karol.jpg";
import mon from "../assets/members/mon.png";
import alioth from "../assets/members/alioth.jpeg";
import myriam from "../assets/members/myriam.jpg";
// CURRENT TEAM MEMBERS DATA
// TEAM MEMBERS DATA
export const teamMembers = [
  {
    id: 1,
    nombre: "Monserat López Caballero",
    foto: mon,
    carrera: "Ingeniera en Sistemas Computacionales",
    linkedin: "https://www.linkedin.com/in/monserrat-caballero-26b233353",
    github: "https://github.com/moon1710",
    contacto: "moncab.dev@gmail.com",
    descripcion:
      "Líder técnica y desarrolladora full-stack responsable del diseño arquitectónico, desarrollo y despliegue del sistema. Encargada de garantizar la calidad funcional y documental del proyecto, supervisando entregables, pruebas y cumplimiento de estándares técnicos y legales. Gestiona la infraestructura y los entornos de producción bajo prácticas DevOps, asegurando estabilidad y coherencia entre backend, frontend y documentación técnica. Experiencia con Python, JavaScript, TypeScript, Flutter y Java.",
  },
  {
    id: 2,
    nombre: "Christian de Jesús Zaleta Roque",
    foto: chris,
    carrera: "Ingeniero en Sistemas Computacionales",
    linkedin: "",
    github: "https://github.com/ZaletaRoqueChris",
    contacto: "",
    descripcion:
      "Analista de calidad y documentación (QA & Documentation Analyst) con funciones complementarias de gestor de marca y cumplimiento legal. Responsable de garantizar la calidad funcional, documental y visual del sistema, asegurando que cumpla con los estándares técnicos, legales y de diseño establecidos. Supervisa la coherencia entre la documentación técnica y la ejecución del proyecto, revisa entregables, verifica la funcionalidad del sistema mediante pruebas y valida la alineación visual con los objetivos institucionales.",
  },
  {
    id: 3,
    nombre: "Karol Quevedo Hernández",
    foto: karol,
    carrera: "Ingeniera en Sistemas Computacionales",
    linkedin: "",
    github: "https://github.com/karol783",
    contacto: "karolquevedo970@gmail.com",
    descripcion:
      "Asistente de Documentación y Control de Calidad (Project Documentation and Quality Assurance Assistant). Participó en la organización y redacción de documentación técnica y legal del proyecto. Apoyó en la verificación de pruebas del sistema y la validación de resultados. Colaboró en la gestión de reportes, evidencias y control de entregables, asegurando la coherencia y calidad de los documentos generados. Su labor contribuyó al cumplimiento estructurado de los objetivos del equipo.",
  },
  {
    id: 4,
    nombre: "Andrea Rodríguez Navarrete",
    foto: andrea,
    carrera: "Ingeniera en Sistemas Computacionales",
    linkedin: "",
    github: "https://github.com/Andy-2311",
    contacto: "rodriguezandreamichelle3@gmail.com",
    descripcion:
      "Apasionada por la programación, la creatividad y el diseño digital. Le interesa crear interfaces interactivas que combinen arte y tecnología, cuidando la estética y los detalles visuales. Ha colaborado en tareas de frontend y en procesos de documentación, mostrando disposición constante por aprender más sobre desarrollo web, bases de datos y proyectos que integren tecnología con expresión creativa.",
  },
  {
    id: 5,
    nombre: "Angel Abel Martínez Menéndez",
    foto: angel,
    carrera: "Ingeniero en Sistemas Computacionales",
    linkedin: "",
    github: "https://github.com/abel190504",
    contacto: "martinezangelabel52@gmail.com",
    descripcion:
      "Integrante del área técnica con interés en desarrollo web y bases de datos. Ha apoyado en tareas de frontend y en pruebas funcionales del sistema, contribuyendo al control de calidad y la validación de funcionalidades. Mantiene una actitud colaborativa y disposición constante por mejorar sus habilidades en programación y buenas prácticas de desarrollo.",
  },
];

// PAST TEAM MEMBERS DATA
export const pastMembers = [
  {
    id: 101,
    nombre: "Alioth Musule Alfaro",
    foto: alioth, // deja null si no hay imagen disponible
    carrera:
      "Ingeniero en Sistemas Computacionales (ITTux, Generación 2020–2024)",
    rol: "Líder técnico y desarrollador full-stack (Equipo fundador)",
    fundador: true,
    etapa: "Equipo fundador",
    linkedin: "https://www.linkedin.com/in/aliothmusulealfaro",
    github: "https://github.com/aliothmusule",
    contacto: null,
    skills: [
      "Arquitectura de sistemas",
      "Backend & Frontend",
      "Python",
      "Pandas",
      "Polars",
      "Fuzzy Matching",
      "SQLAlchemy",
      "Flask",
      "Organización de equipo",
    ],
    descripcion:
      "Líder técnico del equipo fundador con foco en backend y frontend, responsable de la organización inicial del proyecto y del diseño de la arquitectura base. Interés profesional en ciencia y análisis de datos, con dominio práctico de Python y su ecosistema (Pandas, Polars, SQLAlchemy) y experiencia en coincidencia difusa para normalización y depuración de datos. Perfil adaptable orientado a la entrega de soluciones y al crecimiento hacia seniority.",
    periodo: "2023 – 2024",
  },
  {
    id: 102,
    nombre: "Miryam Yanit Baranda Moreno",
    foto: myriam, // deja null si no hay imagen disponible
    carrera: "Ingeniera en Sistemas Computacionales",
    rol: "Desarrolladora full-stack y responsable de documentación (Equipo fundador)",
    fundador: true,
    etapa: "Equipo fundador",
    linkedin: "https://linkedin.com/in/miryam-yanit-baranda-moreno-226a78336",
    github: null,
    contacto: "miryamybm@gmail.com",
    skills: [
      "Requerimientos y documentación técnica",
      "Frontend & Backend",
      "UI de baja/alta fidelidad",
      "Metodologías ágiles",
      "Redes y ciberseguridad",
      "Pruebas y aseguramiento de calidad",
    ],
    descripcion:
      "Integrante del equipo fundador con participación en frontend y backend, y responsabilidad sobre la documentación técnica y funcional. Fuerte interés en redes y ciberseguridad, con experiencia en análisis de requerimientos, diseño de interfaces y aplicación de metodologías ágiles. Enfoque en la calidad, la trazabilidad de entregables y la optimización de sistemas.",
    periodo: "2023 – 2024",
  },
];
