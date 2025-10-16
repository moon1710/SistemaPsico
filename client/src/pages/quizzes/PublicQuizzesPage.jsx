import React from "react";
import { Link } from "react-router-dom";
import { quizzesApi } from "../../services/quizzesService";
import { ROUTES } from "../../utils/constants";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// ====== ESTILO BASE / UTILIDADES ======
const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";
const inputBase =
  "w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-[#527ceb] focus:border-[#527ceb] outline-none";
const pillBase =
  "px-3 py-1.5 rounded-full text-sm transition-all duration-200 border";
const gradientHeader = "bg-gradient-to-r from-[#527ceb] to-[#6762b3]";
const gradients = [
  "from-[#527ceb] to-[#6762b3]",
  "from-[#10cfbd] to-[#48b0f7]",
  "from-[#f6d365] to-[#fda085]",
  "from-[#84fab0] to-[#8fd3f4]",
  "from-[#a18cd1] to-[#fbc2eb]",
  "from-[#43cea2] to-[#185a9d]",
];

export default function PublicQuizzesPage() {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState([]);
  const [error, setError] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("recientes"); // recientes | titulo | duracion

  React.useEffect(() => {
    let alive = true;
    quizzesApi
      .listPublic()
      .then((res) => alive && setItems(res.data || []))
      .catch((e) =>
        setError(e?.data?.message || e?.message || "Error cargando quizzes")
      )
      .finally(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const categories = React.useMemo(() => {
    const codes = items.map((q) => q.codigo).filter(Boolean);
    return ["all", ...Array.from(new Set(codes))];
  }, [items]);

  const filteredItems = React.useMemo(() => {
    const base = items.filter((quiz) => {
      const q = `${quiz.titulo ?? ""} ${quiz.codigo ?? ""} ${
        quiz.descripcion ?? ""
      }`.toLowerCase();
      const matchesSearch = q.includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        (quiz.codigo || "").toLowerCase() === selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });

    const sorted = [...base];
    if (sortBy === "titulo") {
      sorted.sort((a, b) => (a.titulo || "").localeCompare(b.titulo || ""));
    } else if (sortBy === "duracion") {
      // usa estimatedTime si existe; si no, al final
      sorted.sort(
        (a, b) => (a.estimatedTime ?? 1e9) - (b.estimatedTime ?? 1e9)
      );
    } else {
      // recientes: asume id/fecha más alto más reciente si no hay fecha
      sorted.sort(
        (a, b) => (b.updatedAt ?? b.id ?? 0) - (a.updatedAt ?? a.id ?? 0)
      );
    }
    return sorted;
  }, [items, searchTerm, selectedCategory, sortBy]);

  // ====== SKELETON ======
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <div className={`${gradientHeader} text-white`}>
          <div className="max-w-7xl mx-auto px-6 py-10 text-center">
            <div className="opacity-90">
              <ClipboardDocumentListIcon className="h-14 w-14 mx-auto mb-3" />
            </div>
            <h1 className="text-3xl font-bold">Evaluaciones Disponibles</h1>
            <p className="text-white/90 mt-2">
              Descubre y completa evaluaciones públicas de bienestar.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`${glass} p-6 animate-pulse`}>
                <div className="h-6 w-1/2 bg-gray-200/70 rounded mb-3" />
                <div className="h-4 w-3/4 bg-gray-200/60 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-200/60 rounded mb-6" />
                <div className="h-10 w-full bg-gray-200/70 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-6">
        <div className={`${glass} max-w-md w-full p-8 text-center`}>
          <ExclamationTriangleIcon className="h-14 w-14 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-[#21252d] mb-2">
            Error al cargar
          </h2>
          <p className="text-[#7c777a] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-[#527ceb] to-[#6762b3] hover:opacity-95 transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Encabezado con gradiente */}
      <div className={`${gradientHeader} text-white`}>
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <ClipboardDocumentListIcon className="h-14 w-14 mx-auto mb-3 opacity-90" />
          <h1 className="text-3xl font-bold">Evaluaciones Disponibles</h1>
          <p className="text-white/90 mt-2 max-w-2xl mx-auto">
            Completa evaluaciones psicológicas públicas y conoce más sobre tu
            bienestar.
          </p>
        </div>
      </div>

      {/* Barra de búsqueda y filtros (glass) */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        <div className={`${glass} p-4 md:p-6`}>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, código o descripción…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputBase}
                aria-label="Buscar evaluaciones"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2 items-center">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-white/60 bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-[#527ceb] focus:border-[#527ceb] outline-none"
                aria-label="Ordenar"
              >
                <option value="recientes">Más recientes</option>
                <option value="titulo">Por título</option>
                <option value="duracion">Por duración</option>
              </select>
            </div>
          </div>

          {/* Pills de categorías */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((code) => {
              const active =
                selectedCategory.toLowerCase() === code.toLowerCase();
              return (
                <button
                  key={code}
                  onClick={() => setSelectedCategory(code)}
                  className={`${pillBase} ${
                    active
                      ? "bg-gradient-to-r from-[#527ceb] to-[#6762b3] text-white border-transparent"
                      : "bg-white/70 text-[#21252d] border-white/60 hover:bg-white"
                  }`}
                >
                  {code === "all" ? "Todas" : code}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {items.length === 0 ? (
          <EmptyState
            icon={ClipboardDocumentListIcon}
            title="No hay evaluaciones disponibles"
            subtitle="Actualmente no hay evaluaciones públicas activas. Contacta a tu institución para más información."
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={MagnifyingGlassIcon}
            title="No se encontraron resultados"
            subtitle="Ajusta la búsqueda o explora todas las evaluaciones disponibles."
            actionLabel="Limpiar filtros"
            onAction={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSortBy("recientes");
            }}
          />
        ) : (
          <>
            <div className="mb-6 text-[#7c777a]">
              Mostrando{" "}
              <span className="font-semibold text-[#21252d]">
                {filteredItems.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-[#21252d]">
                {items.length}
              </span>{" "}
              evaluaciones
            </div>

            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {filteredItems.map((q, idx) => {
                  const grad = gradients[idx % gradients.length];
                  return <QuizCard key={q.id} quiz={q} gradient={grad} />;
                })}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}

// ====== SUBCOMPONENTES ======
function EmptyState({ icon: Icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="text-center py-14">
      <div className="mx-auto w-24 h-24 rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 flex items-center justify-center shadow">
        <Icon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-[#21252d] mt-4">{title}</h3>
      <p className="text-[#7c777a] mt-1 max-w-xl mx-auto">{subtitle}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-[#527ceb] to-[#6762b3] hover:opacity-95 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function QuizCard({ quiz, gradient }) {
  const estimated = quiz.estimatedTime ? `${quiz.estimatedTime} min` : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`${glass} overflow-hidden transition-all hover:scale-[1.01]`}
    >
      {/* Header chip con gradiente según índice */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
              <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white/70 backdrop-blur-md border border-white/60 text-[#21252d]">
                {quiz.codigo}
              </span>
              <p className="text-xs text-[#7c777a] mt-1">
                Versión {quiz.version}
              </p>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-[#21252d] mb-1 line-clamp-2">
          {quiz.titulo}
        </h3>
        {quiz.descripcion && (
          <p className="text-sm text-[#7c777a] mb-4 line-clamp-3">
            {quiz.descripcion}
          </p>
        )}

        {estimated && (
          <div className="flex items-center gap-2 text-sm text-[#7c777a] mb-4">
            <ClockIcon className="h-4 w-4" />
            <span>~{estimated}</span>
          </div>
        )}

        <Link
          to={ROUTES.QUIZ_CONTESTAR_DETALLE.replace(":quizId", quiz.id)}
          className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl text-white bg-gradient-to-r from-[#527ceb] to-[#6762b3] hover:opacity-95 transition"
        >
          <span>Comenzar evaluación</span>
          <ArrowRightIcon className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="px-6 py-4 bg-white/60 backdrop-blur-md border-t border-white/60 flex items-center justify-between text-sm text-[#7c777a]">
        <span>Público</span>
        <span>Disponible ahora</span>
      </div>
    </motion.div>
  );
}
