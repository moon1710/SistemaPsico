// RecursosPage.jsx — versión “humana”, glass + gradientes
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
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Zap,
} from "lucide-react";
import { ROUTES } from "../utils/constants";
import {
  glass,
  softCard,
  gradPrimary,
  pageWrap,
  subtleText,
  cta,
  baseBg,
} from "../../src/components/ui/tokens.js"; // <- añade este import

const RecursosPage = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const toggleSection = (id) =>
    setExpandedSection(expandedSection === id ? null : id);

  const recursosInteractivos = [
    {
      id: "crisis",
      title: "Crisis Inmediata",
      icon: AlertTriangle,
      description: "Ayuda inmediata 24/7",
      link: ROUTES.CRISIS_INMEDIATA,
    },
    {
      id: "primeros-auxilios",
      title: "Primeros Auxilios Emocionales",
      icon: Heart,
      description: "Cómo ayudar en una crisis",
      link: ROUTES.PRIMEROS_AUXILIOS,
    },
    {
      id: "respiracion",
      title: "Respiración Guiada",
      icon: Wind,
      description: "Técnicas interactivas con temporizador",
      link: ROUTES.RESPIRACION_GUIADA,
    },
    {
      id: "grounding",
      title: "Técnica 5-4-3-2-1",
      icon: Brain,
      description: "Conecta con el presente (paso a paso)",
      link: ROUTES.TECNICA_5432,
    },
    {
      id: "relajacion",
      title: "Relajación Muscular",
      icon: Zap,
      description: "Sesión completa, rápida o por zonas",
      link: ROUTES.RELAJACION_MUSCULAR,
    },
  ];

  const recursosEstaticos = [
    {
      id: "habitos",
      title: "Hábitos y Estilo de Vida",
      icon: Moon,
      description: "Fundamentos para tu día a día",
      items: [
        {
          title: "Guía del Sueño Estudiantil",
          description: "Consejos prácticos para descansar mejor",
          action: "Próximamente",
          comingSoon: true,
          icon: Moon,
        },
        {
          title: "Pausas Activas",
          description: "Micro-ejercicios de 2 minutos al estudiar",
          action: "Próximamente",
          comingSoon: true,
          icon: Activity,
        },
      ],
    },
    {
      id: "academico",
      title: "Apoyo Académico",
      icon: FileText,
      description: "Herramientas para estudiar sin ahogarte",
      items: [
        {
          title: "Planificador de Estudios",
          description: "Organiza tiempo y cargas",
          action: "Próximamente",
          comingSoon: true,
          icon: Clock,
        },
        {
          title: "Manejo de Ansiedad en Exámenes",
          description: "Estrategias antes/durante/después",
          action: "Próximamente",
          comingSoon: true,
          icon: Brain,
        },
      ],
    },
    {
      id: "apoyo",
      title: "Red de Apoyo",
      icon: Users,
      description: "Construye tu red de sostén",
      items: [
        {
          title: "Directorio de Contactos Campus",
          description: "Servicios disponibles en tu institución",
          action: "Ver Directorio",
          available: true,
          icon: Phone,
        },
        {
          title: "Cómo Pedir Ayuda",
          description: "Frases, plantillas y tips",
          action: "Ver Guía",
          available: true,
          icon: Heart,
          link: ROUTES.COMO_PEDIR_AYUDA,
        },
      ],
    },
  ];

  return (
    <div className={`${baseBg}`}>
      <div className={pageWrap}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-[#21252d] mb-3">
            Centro de Recursos
          </h1>
          <p className={`text-lg ${subtleText} max-w-3xl mx-auto`}>
            Herramientas y técnicas para acompañarte en lo académico, emocional
            y personal.
          </p>
        </motion.div>

        {/* Banner de Crisis (gradiente, no sólido) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className={`${gradPrimary} text-white ${glass} p-6`}
        >
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">¿Necesitas ayuda inmediata?</h2>
              <p className="opacity-90">
                Si estás en crisis o con ideas de autolesión, pide apoyo ahora.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={ROUTES.CRISIS_INMEDIATA}
              className={`${glass} px-5 py-2 font-semibold transition-all hover:scale-[1.02]`}
            >
              Centro de Crisis
            </Link>
            <button
              onClick={() => window.open("tel:911", "_self")}
              className={`${glass} px-5 py-2 font-semibold transition-all hover:scale-[1.02]`}
            >
              Llamar al 911
            </button>
          </div>
        </motion.div>

        {/* Interactivos (tarjetas glass) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <div className="mt-8 mb-2">
            <h2 className="text-2xl font-bold">Recursos Interactivos</h2>
            <p className={subtleText}>Usa estas herramientas ahora mismo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recursosInteractivos.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * i }}
                >
                  <Link to={r.link} className="block">
                    <div className={`${softCard} p-6`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 ${gradPrimary} rounded-xl flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">{r.title}</h3>
                      </div>
                      <p className={`${subtleText} mb-4`}>{r.description}</p>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-[#527ceb]">Usar ahora</span>
                        <ArrowRight className="w-4 h-4 text-[#527ceb]" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Adicionales (acordeones glass) */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="space-y-6 mt-10"
        >
          <div>
            <h2 className="text-2xl font-bold">Recursos Adicionales</h2>
            <p className={subtleText}>Guías y programas complementarios</p>
          </div>

          {recursosEstaticos.map((sec, idx) => {
            const Icon = sec.icon;
            const open = expandedSection === sec.id;
            return (
              <div key={sec.id} className={`${softCard} overflow-hidden`}>
                <button
                  className="w-full p-6 flex items-center justify-between"
                  onClick={() => toggleSection(sec.id)}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div
                      className={`w-10 h-10 ${gradPrimary} rounded-xl flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{sec.title}</h3>
                      <p className={`text-sm ${subtleText}`}>
                        {sec.description}
                      </p>
                    </div>
                  </div>
                  {open ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>

                {open && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sec.items.map((it, i) => {
                        const ItIcon = it.icon;
                        return (
                          <div key={i} className={`${softCard} p-4`}>
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-9 h-9 ${gradPrimary} rounded-lg flex items-center justify-center mt-1`}
                              >
                                <ItIcon className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-semibold">{it.title}</h4>
                                  {it.comingSoon && (
                                    <span className="text-xs px-2 py-1 rounded-lg bg-black/5">
                                      Próximamente
                                    </span>
                                  )}
                                  {it.available && (
                                    <span className="text-xs px-2 py-1 rounded-lg bg-black/5">
                                      Disponible
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm ${subtleText} mb-3`}>
                                  {it.description}
                                </p>
                                {it.comingSoon ? (
                                  <div className={`text-sm ${subtleText}`}>
                                    Muy pronto ✨
                                  </div>
                                ) : it.link ? (
                                  <Link
                                    to={it.link}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-[#527ceb] transition-all hover:gap-3"
                                  >
                                    {it.action}
                                    <ArrowRight className="w-4 h-4" />
                                  </Link>
                                ) : (
                                  <button className="inline-flex items-center gap-2 text-sm font-medium text-[#527ceb] transition-all hover:gap-3">
                                    {it.action}
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className={`${softCard} p-6 text-center`}
        >
          <h3 className="text-lg font-semibold mb-2">
            ¿Quieres apoyo personalizado?
          </h3>
          <p className={subtleText}>
            Nuestro equipo puede acompañarte paso a paso.
          </p>
          <Link to={ROUTES.AGENDAR_CITA} className={`inline-block mt-4 ${cta}`}>
            Agendar cita con psicología
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default RecursosPage;
