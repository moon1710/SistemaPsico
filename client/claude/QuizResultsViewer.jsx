{/* 3. Results Viewer (QuizResultsViewer)

Advanced filtering by quiz type, severity, dates
Detailed analytics with Recharts visualizations
Individual result details with modal popups
Professional recommendations based on severity
Export and notification features */
}

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  Eye,
  Calendar,
  Filter,
  Download,
  Search,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  FileText,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const QuizResultsViewer = () => {
  const [activeView, setActiveView] = useState("overview");
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    codigo: "",
    severidad: "",
    estudiante: "",
    fechaDesde: "",
    fechaHasta: "",
    page: 1,
    pageSize: 20,
  });

  // Mock data for demonstration
  const mockResults = [
    {
      id: "1",
      fechaEnvio: "2024-01-15T10:30:00Z",
      puntajeTotal: 24,
      severidad: "MODERADA",
      quizId: "quiz1",
      titulo: "Inventario de Ansiedad de Beck",
      codigo: "BAI",
      version: "1.0",
      estudianteId: "est1",
      estudianteNombre: "Ana García Rodríguez",
      respuestas: {
        items: Array.from({ length: 21 }, (_, i) => ({
          preguntaId: i + 1,
          valor: Math.floor(Math.random() * 4),
        })),
      },
    },
    {
      id: "2",
      fechaEnvio: "2024-01-14T14:20:00Z",
      puntajeTotal: 31,
      severidad: "SEVERA",
      quizId: "quiz2",
      titulo: "Inventario de Depresión de Beck II",
      codigo: "BDI-II",
      version: "2.1",
      estudianteId: "est2",
      estudianteNombre: "Carlos López Martín",
      respuestas: {
        items: Array.from({ length: 21 }, (_, i) => ({
          preguntaId: i + 1,
          valor: Math.floor(Math.random() * 4),
        })),
      },
    },
    {
      id: "3",
      fechaEnvio: "2024-01-13T09:15:00Z",
      puntajeTotal: 12,
      severidad: "LEVE",
      quizId: "quiz1",
      titulo: "Inventario de Ansiedad de Beck",
      codigo: "BAI",
      version: "1.0",
      estudianteId: "est3",
      estudianteNombre: "María Rodríguez López",
      respuestas: {
        items: Array.from({ length: 21 }, (_, i) => ({
          preguntaId: i + 1,
          valor: Math.floor(Math.random() * 4),
        })),
      },
    },
  ];

  const mockAnalytics = {
    summary: {
      total: 156,
      promedio: 18.5,
      minimo: 0,
      maximo: 58,
      ultimaMuestra: "2024-01-15T10:30:00Z",
      totalEstudiantes: 89,
      tendenciaSemanal: "+12%",
    },
    bySeverity: [
      { severidad: "MINIMA", total: 45, porcentaje: 28.8 },
      { severidad: "LEVE", total: 62, porcentaje: 39.7 },
      { severidad: "MODERADA", total: 32, porcentaje: 20.5 },
      { severidad: "SEVERA", total: 17, porcentaje: 10.9 },
    ],
    trend: [
      { fecha: "2024-01-08", total: 8, promedio: 16.2 },
      { fecha: "2024-01-09", total: 12, promedio: 18.1 },
      { fecha: "2024-01-10", total: 15, promedio: 17.8 },
      { fecha: "2024-01-11", total: 18, promedio: 19.2 },
      { fecha: "2024-01-12", total: 15, promedio: 18.9 },
      { fecha: "2024-01-13", total: 22, promedio: 20.1 },
      { fecha: "2024-01-14", total: 19, promedio: 18.7 },
      { fecha: "2024-01-15", total: 24, promedio: 19.3 },
    ],
    byQuiz: [
      { codigo: "BAI", version: "1.0", total: 89, promedio: 17.2 },
      { codigo: "BDI-II", version: "2.1", total: 67, promedio: 20.1 },
    ],
  };

  useEffect(() => {
    // Simulate API calls
    setResults(mockResults);
    setAnalytics(mockAnalytics);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "MINIMA":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "LEVE":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
        };
      case "MODERADA":
        return {
          bg: "bg-orange-100",
          text: "text-orange-700",
          border: "border-orange-200",
        };
      case "SEVERA":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const COLORS = ["#10B981", "#F59E0B", "#F97316", "#EF4444"];

  const ViewButton = ({ id, label, icon: Icon, active, onClick, count }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
        active
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
          : "bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            active ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  const StatsCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
    trend,
  }) => (
    <div
      className={`bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon size={32} className="opacity-80" />
        {trend && (
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              trend.startsWith("+") ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            <TrendingUp size={14} />
            <span className="text-xs font-semibold">{trend}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-lg font-semibold opacity-90 mb-1">{title}</div>
      {subtitle && <div className="text-sm opacity-75">{subtitle}</div>}
    </div>
  );

  const ResultCard = ({ result, onClick }) => {
    const colors = getSeverityColor(result.severidad);

    return (
      <div
        onClick={() => onClick(result)}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer transform hover:-translate-y-1"
      >
        <div className={`h-2 ${colors.bg.replace("100", "400")}`}></div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h4 className="font-bold text-lg text-gray-800 mb-1">
                {result.titulo}
              </h4>
              <p className="text-gray-600 flex items-center">
                <User size={16} className="mr-1" />
                {result.estudianteNombre}
              </p>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Calendar size={14} className="mr-1" />
                {formatDate(result.fechaEnvio)}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${colors.bg} ${colors.text} ${colors.border} border`}
              >
                {result.severidad}
              </span>
              <div className="text-2xl font-bold text-gray-800 mt-2">
                {result.puntajeTotal}
              </div>
              <div className="text-xs text-gray-500">puntos</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-600">
                  {result.codigo}
                </div>
                <div className="text-xs text-gray-500">v{result.version}</div>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
              <Eye size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DetailModal = ({ result, onClose }) => {
    if (!result) return null;

    const colors = getSeverityColor(result.severidad);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-500">
          {/* Header */}
          <div
            className={`bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{result.titulo}</h2>
                <p className="opacity-90">{result.estudianteNombre}</p>
                <p className="text-sm opacity-75 mt-1">
                  {formatDate(result.fechaEnvio)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 text-center`}
              >
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {result.puntajeTotal}
                </div>
                <div className="text-lg font-semibold text-gray-600">
                  Puntaje Total
                </div>
                <div className="text-sm text-gray-500 mt-1">de 63 posibles</div>
              </div>

              <div
                className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6 text-center`}
              >
                <div className={`text-2xl font-bold mb-2 ${colors.text}`}>
                  {result.severidad}
                </div>
                <div className="text-lg font-semibold text-gray-600">
                  Nivel de Severidad
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Clasificación BAI
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                <div className="text-2xl font-bold text-blue-700 mb-2">
                  {result.codigo}
                </div>
                <div className="text-lg font-semibold text-gray-600">
                  Cuestionario
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Versión {result.version}
                </div>
              </div>
            </div>

            {/* Response Pattern */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart3 className="mr-2" />
                Patrón de Respuestas
              </h3>

              <div className="grid grid-cols-4 gap-4 mb-4">
                {[0, 1, 2, 3].map((valor) => {
                  const count = result.respuestas.items.filter(
                    (r) => r.valor === valor
                  ).length;
                  const percentage = (
                    (count / result.respuestas.items.length) *
                    100
                  ).toFixed(1);

                  return (
                    <div key={valor} className="text-center">
                      <div
                        className={`h-20 rounded-lg flex items-end justify-center mb-2 ${
                          valor === 0
                            ? "bg-green-200"
                            : valor === 1
                            ? "bg-yellow-200"
                            : valor === 2
                            ? "bg-orange-200"
                            : "bg-red-200"
                        }`}
                      >
                        <div className="text-xl font-bold mb-2">{count}</div>
                      </div>
                      <div className="text-sm font-semibold">Nivel {valor}</div>
                      <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                  );
                })}
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <strong>Nivel 0:</strong> En absoluto •{" "}
                  <strong>Nivel 1:</strong> Levemente •{" "}
                  <strong>Nivel 2:</strong> Moderadamente •{" "}
                  <strong>Nivel 3:</strong> Severamente
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl">
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                <Target className="mr-2" />
                Recomendaciones Profesionales
              </h3>

              {result.severidad === "SEVERA" && (
                <div className="space-y-2 text-blue-700">
                  <p>• Se recomienda evaluación psicológica inmediata</p>
                  <p>• Considerar derivación a especialista en salud mental</p>
                  <p>• Implementar estrategias de apoyo urgente</p>
                  <p>• Seguimiento semanal del estudiante</p>
                </div>
              )}

              {result.severidad === "MODERADA" && (
                <div className="space-y-2 text-blue-700">
                  <p>• Programar sesión de orientación psicológica</p>
                  <p>• Implementar técnicas de manejo de ansiedad</p>
                  <p>• Seguimiento quincenal</p>
                  <p>• Informar a tutores académicos</p>
                </div>
              )}

              {(result.severidad === "LEVE" ||
                result.severidad === "MINIMA") && (
                <div className="space-y-2 text-blue-700">
                  <p>• Continuar con seguimiento preventivo</p>
                  <p>• Reforzar estrategias de bienestar</p>
                  <p>• Seguimiento mensual</p>
                  <p>• Promover actividades de autocuidado</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-8">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                <Download className="w-5 h-5 inline mr-2" />
                Exportar PDF
              </button>
              <button className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold">
                <Mail className="w-5 h-5 inline mr-2" />
                Notificar Tutor
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all font-semibold">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Marcar Revisado
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Resultados y Análisis
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión avanzada de evaluaciones psicológicas
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-sm">
                <Filter className="w-5 h-5 inline mr-2" />
                Filtros
              </button>
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <ViewButton
            id="overview"
            label="Resumen General"
            icon={Activity}
            active={activeView === "overview"}
            onClick={() => setActiveView("overview")}
          />
          <ViewButton
            id="results"
            label="Resultados Detallados"
            icon={FileText}
            active={activeView === "results"}
            onClick={() => setActiveView("results")}
            count={results.length}
          />
          <ViewButton
            id="analytics"
            label="Análisis Avanzado"
            icon={TrendingUp}
            active={activeView === "analytics"}
            onClick={() => setActiveView("analytics")}
          />
          <ViewButton
            id="alerts"
            label="Alertas Críticas"
            icon={AlertTriangle}
            active={activeView === "alerts"}
            onClick={() => setActiveView("alerts")}
            count={results.filter((r) => r.severidad === "SEVERA").length}
          />
        </div>

        {/* Content */}
        <div className="transition-all duration-500">
          {/* Overview */}
          {activeView === "overview" && analytics && (
            <div className="animate-in fade-in duration-500 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Evaluaciones"
                  value={analytics.summary.total}
                  subtitle="Este período"
                  icon={FileText}
                  color="blue"
                  trend={analytics.summary.tendenciaSemanal}
                />
                <StatsCard
                  title="Estudiantes Evaluados"
                  value={analytics.summary.totalEstudiantes}
                  subtitle="Únicos"
                  icon={Users}
                  color="green"
                />
                <StatsCard
                  title="Promedio General"
                  value={analytics.summary.promedio.toFixed(1)}
                  subtitle="Puntuación media"
                  icon={Target}
                  color="purple"
                />
                <StatsCard
                  title="Casos Críticos"
                  value={
                    analytics.bySeverity.find((s) => s.severidad === "SEVERA")
                      ?.total || 0
                  }
                  subtitle="Requieren atención"
                  icon={AlertTriangle}
                  color="red"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Severity Distribution */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Distribución por Severidad
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.bySeverity}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ severidad, porcentaje }) =>
                          `${severidad} ${porcentaje.toFixed(1)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="total"
                      >
                        {analytics.bySeverity.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Trend Chart */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">
                    Tendencia Temporal
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="Evaluaciones"
                      />
                      <Line
                        type="monotone"
                        dataKey="promedio"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        name="Promedio"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {activeView === "results" && (
            <div className="animate-in fade-in duration-500">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuestionario
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option value="">Todos</option>
                      <option value="BAI">BAI - Ansiedad</option>
                      <option value="BDI-II">BDI-II - Depresión</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severidad
                    </label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option value="">Todas</option>
                      <option value="MINIMA">Mínima</option>
                      <option value="LEVE">Leve</option>
                      <option value="MODERADA">Moderada</option>
                      <option value="SEVERA">Severa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desde
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hasta
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                      <Search className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((result) => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    onClick={setSelectedResult}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Analytics */}
          {activeView === "analytics" && analytics && (
            <div className="animate-in fade-in duration-500 space-y-8">
              {/* Comparative Analysis */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Análisis Comparativo por Cuestionario
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.byQuiz}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="codigo" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="total"
                      fill="#3B82F6"
                      name="Total Evaluaciones"
                    />
                    <Bar dataKey="promedio" fill="#8B5CF6" name="Promedio" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analytics.bySeverity.map((item, index) => {
                  const colors = getSeverityColor(item.severidad);
                  return (
                    <div
                      key={item.severidad}
                      className={`${colors.bg} ${colors.border} border-2 rounded-xl p-6`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold mb-2 ${colors.text}`}
                        >
                          {item.total}
                        </div>
                        <div className="text-lg font-semibold text-gray-700">
                          {item.severidad}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.porcentaje.toFixed(1)}% del total
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alerts */}
          {activeView === "alerts" && (
            <div className="animate-in fade-in duration-500">
              <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-xl mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">
                      Casos que Requieren Atención Inmediata
                    </h3>
                    <p className="text-red-700 mt-1">
                      {results.filter((r) => r.severidad === "SEVERA").length}{" "}
                      estudiantes con resultados severos necesitan seguimiento
                      urgente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results
                  .filter(
                    (result) =>
                      result.severidad === "SEVERA" ||
                      result.severidad === "MODERADA"
                  )
                  .map((result) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      onClick={setSelectedResult}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedResult && (
        <DetailModal
          result={selectedResult}
          onClose={() => setSelectedResult(null)}
        />
      )}
    </div>
  );
};

export default QuizResultsViewer;
