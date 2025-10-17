import React from "react";
import { motion } from "framer-motion";
import { quizzesApi } from "../../services/quizzesService";
import SeverityBadge from "../../components/quizzes/SeverityBadge";
import { useAuth } from "../../contexts/AuthContext";
import { USER_ROLES } from "../../utils/constants";
import {
  ChartBarIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClockIcon,
  EyeIcon,
  FunnelIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from "@heroicons/react/24/outline";

const SEVS = ["MINIMA", "LEVE", "MODERADA", "SEVERA"];
const ADMIN_ROLES = new Set([
  USER_ROLES.PSICOLOGO,
  USER_ROLES.ORIENTADOR,
  USER_ROLES.ADMIN_INSTITUCION,
  USER_ROLES.SUPER_ADMIN_INSTITUCION,
  USER_ROLES.SUPER_ADMIN_NACIONAL,
]);

export default function AdminResultsPage() {
  const { user } = useAuth();
  const canAccess = ADMIN_ROLES.has(user?.rol) ||
    user?.instituciones?.some(i => ADMIN_ROLES.has(i.rol));

  const [institutionId, setInstitutionId] = React.useState(
    user?.instituciones?.find((m) => m.isMembershipActiva)?.institucionId ||
      user?.instituciones?.[0]?.institucionId ||
      ""
  );
  const [codigo, setCodigo] = React.useState("");
  const [severidad, setSeveridad] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateRange, setDateRange] = React.useState({ start: "", end: "" });
  const [sortBy, setSortBy] = React.useState("fechaEnvio");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [viewMode, setViewMode] = React.useState("table"); // "table" | "cards"
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [stats, setStats] = React.useState(null);
  const [refreshInterval, setRefreshInterval] = React.useState(null);

  const fetchData = React.useCallback(() => {
    if (!institutionId) return;
    setLoading(true);
    setError("");
    quizzesApi
      .adminResults({
        institutionId,
        codigo: codigo || undefined,
        severidad: severidad || undefined,
        searchTerm: searchTerm || undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
        sortBy,
        sortOrder,
        page,
        pageSize,
      })
      .then((res) => {
        setRows(res.data || []);
        setTotal(res.total || 0);
        if (res.stats) setStats(res.stats);
      })
      .catch((e) => setError(e.data?.message || e.message || "Error cargando datos"))
      .finally(() => setLoading(false));
  }, [institutionId, codigo, severidad, searchTerm, dateRange, sortBy, sortOrder, page, pageSize]);

  const fetchStats = React.useCallback(() => {
    if (!institutionId) return;
    quizzesApi
      .getResultsStats({ institutionId })
      .then((res) => setStats(res.data))
      .catch((e) => console.error('Error loading stats:', e));
  }, [institutionId]);

  const exportData = () => {
    if (!institutionId) return;
    setLoading(true);
    quizzesApi
      .exportResults({
        institutionId,
        codigo: codigo || undefined,
        severidad: severidad || undefined,
        searchTerm: searchTerm || undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((e) => setError('Error exportando datos'))
      .finally(() => setLoading(false));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const clearFilters = () => {
    setCodigo("");
    setSeveridad("");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setPage(1);
  };

  const openDetailModal = (result) => {
    setSelectedResult(result);
    setShowDetailModal(true);
  };

  React.useEffect(() => {
    fetchData();
    fetchStats();
  }, [fetchData, fetchStats]);

  React.useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchData();
      fetchStats();
    }, 5 * 60 * 1000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchData, fetchStats]);

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para ver esta página.</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const getSeverityStats = () => {
    if (!stats) return [];
    return [
      { label: "Mínima", value: stats.MINIMA || 0, color: "green", icon: CheckCircleIcon },
      { label: "Leve", value: stats.LEVE || 0, color: "yellow", icon: InformationCircleIcon },
      { label: "Moderada", value: stats.MODERADA || 0, color: "orange", icon: ExclamationTriangleIcon },
      { label: "Severa", value: stats.SEVERA || 0, color: "red", icon: ExclamationTriangleIcon },
    ];
  };

  const getHighRiskCount = () => {
    return rows.filter(r => r.severidad === 'SEVERA' || r.severidad === 'MODERADA').length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Resultados</h1>
            <p className="text-gray-600 mt-1">Monitoreo y análisis de evaluaciones psicológicas</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={exportData}
              disabled={loading || rows.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Evaluaciones</p>
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Casos de Alto Riesgo</p>
                  <p className="text-2xl font-bold text-red-600">{getHighRiskCount()}</p>
                </div>
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Estudiantes Únicos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.uniqueStudents || 0}</p>
                </div>
                <UserGroupIcon className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Última Evaluación</p>
                  <p className="text-sm font-bold text-gray-900">
                    {stats.lastSubmission
                      ? new Date(stats.lastSubmission).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <ClockIcon className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Severity Distribution */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5" />
              Distribución por Severidad
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getSeverityStats().map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-${stat.color}-100 flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${stat.color}-600`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border"
        >
          <div className="p-4 border-b">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <FunnelIcon className="w-5 h-5" />
              Filtros y Búsqueda
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {[codigo, severidad, searchTerm, dateRange.start, dateRange.end].filter(Boolean).length}
              </span>
            </button>
          </div>

          {showFilters && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
                  <select
                    value={institutionId}
                    onChange={(e) => {
                      setInstitutionId(e.target.value);
                      setPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {(user?.instituciones || []).map((m) => (
                      <option key={m.institucionId} value={m.institucionId}>
                        {m.institucionNombre || m.institucionId}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Estudiante</label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                      }}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre del estudiante"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Quiz</label>
                  <input
                    value={codigo}
                    onChange={(e) => {
                      setCodigo(e.target.value.toUpperCase());
                      setPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="BAI, BDI2, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Severidad</label>
                  <select
                    value={severidad}
                    onChange={(e) => {
                      setSeveridad(e.target.value);
                      setPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    {SEVS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => {
                      setDateRange(prev => ({ ...prev, start: e.target.value }));
                      setPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => {
                      setDateRange(prev => ({ ...prev, end: e.target.value }));
                      setPage(1);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Limpiar Filtros
                </button>
                <button
                  onClick={() => {
                    setPage(1);
                    fetchData();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Results Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Resultados</h2>
              <span className="text-sm text-gray-600">
                {total} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <ArrowPathIcon className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Cargando resultados...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center p-12 text-red-600">
                <XCircleIcon className="w-8 h-8 mr-2" />
                {error}
              </div>
            ) : rows.length === 0 ? (
              <div className="flex items-center justify-center p-12 text-gray-500">
                <InformationCircleIcon className="w-8 h-8 mr-2" />
                No se encontraron resultados con los filtros actuales
              </div>
            ) : (
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('fechaEnvio')}
                    >
                      <div className="flex items-center gap-1">
                        Fecha
                        {sortBy === 'fechaEnvio' && (
                          sortOrder === 'desc' ?
                            <ChevronDownIcon className="w-4 h-4" /> :
                            <ChevronUpIcon className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('estudianteNombre')}
                    >
                      <div className="flex items-center gap-1">
                        Estudiante
                        {sortBy === 'estudianteNombre' && (
                          sortOrder === 'desc' ?
                            <ChevronDownIcon className="w-4 h-4" /> :
                            <ChevronUpIcon className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">Quiz</th>
                    <th className="text-left p-4 font-medium text-gray-900">Código</th>
                    <th
                      className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('puntajeTotal')}
                    >
                      <div className="flex items-center gap-1">
                        Puntaje
                        {sortBy === 'puntajeTotal' && (
                          sortOrder === 'desc' ?
                            <ChevronDownIcon className="w-4 h-4" /> :
                            <ChevronUpIcon className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="text-left p-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('severidad')}
                    >
                      <div className="flex items-center gap-1">
                        Severidad
                        {sortBy === 'severidad' && (
                          sortOrder === 'desc' ?
                            <ChevronDownIcon className="w-4 h-4" /> :
                            <ChevronUpIcon className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="text-left p-4 font-medium text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.map((r, index) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-gray-50 ${
                        r.severidad === 'SEVERA'
                          ? 'bg-red-50 border-l-4 border-red-500'
                          : r.severidad === 'MODERADA'
                          ? 'bg-orange-50 border-l-4 border-orange-500'
                          : ''
                      }`}
                    >
                      <td className="p-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">
                            {new Date(r.fechaEnvio).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(r.fechaEnvio).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {r.estudianteNombre || 'Usuario Anónimo'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {r.estudianteId?.slice(-8) || 'N/A'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{r.titulo}</div>
                        <div className="text-xs text-gray-500">v{r.version}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {r.codigo}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-lg text-gray-900">{r.puntajeTotal}</div>
                      </td>
                      <td className="p-4">
                        <SeverityBadge value={r.severidad} showIcon={true} />
                        {(r.severidad === 'SEVERA' || r.severidad === 'MODERADA') && (
                          <div className="flex items-center gap-1 mt-1">
                            <ExclamationTriangleIcon className="w-3 h-3 text-red-500" />
                            <span className="text-xs text-red-600 font-medium">Requiere atención</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => openDetailModal(r)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                          Ver Detalle
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Pagination */}
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border"
          >
            <div className="text-sm text-gray-600">
              Mostrando {((page - 1) * pageSize) + 1} a {Math.min(page * pageSize, total)} de {total} resultados
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Detalle del Resultado</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información del Estudiante</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Nombre:</strong> {selectedResult.estudianteNombre || 'No disponible'}</p>
                    <p><strong>ID:</strong> {selectedResult.estudianteId}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Información del Quiz</h4>
                  <div className="space-y-1 text-sm">
                    <p><strong>Título:</strong> {selectedResult.titulo}</p>
                    <p><strong>Código:</strong> {selectedResult.codigo}</p>
                    <p><strong>Versión:</strong> {selectedResult.version}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Resultados</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">Puntaje Total: {selectedResult.puntajeTotal}</span>
                    <SeverityBadge value={selectedResult.severidad} showIcon={true} size="md" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Fecha de evaluación: {new Date(selectedResult.fechaEnvio).toLocaleString()}
                  </p>
                </div>
              </div>

              {(selectedResult.severidad === 'SEVERA' || selectedResult.severidad === 'MODERADA') && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-900">Caso de Seguimiento</span>
                  </div>
                  <p className="text-sm text-red-800">
                    Este resultado indica {selectedResult.severidad === 'SEVERA' ? 'síntomas severos' : 'síntomas moderados'} que requieren atención profesional.
                    Se recomienda contactar al estudiante para ofrecer apoyo psicológico.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  // Here you could implement contact functionality
                  console.log('Contact student:', selectedResult.estudianteId);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Contactar Estudiante
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
