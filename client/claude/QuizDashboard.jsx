{/* 1. Quiz Dashboard (QuizDashboard)

Available Quizzes: Beautiful cards showing BAI, BDI-II, etc.
Results Management: Paginated results with filters
Analytics View: Charts and statistics
My Results: Personal quiz history
Modern animations and hover effects */
}

import React, { useState, useEffect } from "react";
import {
  FileText,
  TrendingUp,
  Users,
  AlertTriangle,
  Eye,
  Calendar,
  Filter,
  ChevronDown,
  Search,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
} from "lucide-react";

const QuizDashboard = () => {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [userResults, setUserResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    codigo: "",
    severidad: "",
    page: 1,
    pageSize: 20,
  });

  // Mock data for demonstration
  const mockQuizzes = [
    {
      id: "1",
      titulo: "Inventario de Ansiedad de Beck",
      descripcion: "Evaluación de síntomas de ansiedad",
      codigo: "BAI",
      version: "1.0",
    },
    {
      id: "2",
      titulo: "Inventario de Depresión de Beck II",
      descripcion: "Evaluación de síntomas depresivos",
      codigo: "BDI-II",
      version: "2.1",
    },
  ];

  const mockResults = [
    {
      id: "1",
      fechaEnvio: "2024-01-15T10:30:00Z",
      puntajeTotal: 24,
      severidad: "MODERADA",
      titulo: "BAI",
      estudianteNombre: "Ana García",
      estudianteId: "est1",
    },
    {
      id: "2",
      fechaEnvio: "2024-01-14T14:20:00Z",
      puntajeTotal: 31,
      severidad: "SEVERA",
      titulo: "BDI-II",
      estudianteNombre: "Carlos López",
      estudianteId: "est2",
    },
    {
      id: "3",
      fechaEnvio: "2024-01-13T09:15:00Z",
      puntajeTotal: 12,
      severidad: "LEVE",
      titulo: "BAI",
      estudianteNombre: "María Rodriguez",
      estudianteId: "est3",
    },
  ];

  const mockAnalytics = {
    summary: {
      total: 156,
      promedio: 18.5,
      minimo: 0,
      maximo: 58,
      ultimaMuestra: "2024-01-15T10:30:00Z",
    },
    bySeverity: [
      { severidad: "MINIMA", total: 45 },
      { severidad: "LEVE", total: 62 },
      { severidad: "MODERADA", total: 32 },
      { severidad: "SEVERA", total: 17 },
    ],
    trend: [
      { fecha: "2024-01-10", total: 12 },
      { fecha: "2024-01-11", total: 18 },
      { fecha: "2024-01-12", total: 15 },
      { fecha: "2024-01-13", total: 22 },
      { fecha: "2024-01-14", total: 19 },
      { fecha: "2024-01-15", total: 24 },
    ],
  };

  useEffect(() => {
    // Simulate API calls
    setQuizzes(mockQuizzes);
    setResults(mockResults);
    setAnalytics(mockAnalytics);
    setUserResults(mockResults.slice(0, 2));
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "MINIMA":
        return "text-green-600 bg-green-100";
      case "LEVE":
        return "text-yellow-600 bg-yellow-100";
      case "MODERADA":
        return "text-orange-600 bg-orange-100";
      case "SEVERA":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
        active
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
          : "bg-white text-gray-600 hover:bg-gray-50 shadow-md"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const QuizCard = ({ quiz, onTake }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {quiz.titulo}
            </h3>
            <p className="text-gray-600 mt-1">{quiz.descripcion}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {quiz.codigo} v{quiz.version}
          </span>
        </div>
        <button
          onClick={() => onTake(quiz)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus size={20} />
            <span>Realizar Quiz</span>
          </div>
        </button>
      </div>
    </div>
  );

  const ResultCard = ({ result }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold text-gray-800">{result.titulo}</h4>
            <p className="text-sm text-gray-600">{result.estudianteNombre}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(
              result.severidad
            )}`}
          >
            {result.severidad}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {result.puntajeTotal}
              </div>
              <div className="text-xs text-gray-500">Puntaje</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">
                {formatDate(result.fechaEnvio)}
              </div>
              <div className="text-xs text-gray-500">Fecha</div>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Eye size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const AnalyticsCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
  }) => (
    <div
      className={`bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold opacity-90">{title}</h3>
          <div className="text-3xl font-bold mt-2">{value}</div>
          {subtitle && <p className="text-sm opacity-80 mt-1">{subtitle}</p>}
        </div>
        <Icon size={40} className="opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Panel de Cuestionarios
              </h1>
              <p className="text-gray-600 mt-1">
                Gestión y análisis de evaluaciones psicológicas
              </p>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md">
              <div className="flex items-center space-x-2">
                <RefreshCw size={20} />
                <span>Actualizar</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-4 mb-8">
          <TabButton
            id="quizzes"
            label="Cuestionarios"
            icon={FileText}
            active={activeTab === "quizzes"}
            onClick={() => setActiveTab("quizzes")}
          />
          <TabButton
            id="results"
            label="Resultados"
            icon={BarChart3}
            active={activeTab === "results"}
            onClick={() => setActiveTab("results")}
          />
          <TabButton
            id="analytics"
            label="Análisis"
            icon={TrendingUp}
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
          />
          <TabButton
            id="my-results"
            label="Mis Resultados"
            icon={Users}
            active={activeTab === "my-results"}
            onClick={() => setActiveTab("my-results")}
          />
        </div>

        {/* Content */}
        <div className="transition-all duration-500">
          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    onTake={(quiz) => console.log("Taking quiz:", quiz)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && (
            <div className="animate-in fade-in duration-500">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={filters.codigo}
                      onChange={(e) =>
                        setFilters({ ...filters, codigo: e.target.value })
                      }
                    >
                      <option value="">Todos</option>
                      <option value="BAI">BAI</option>
                      <option value="BDI-II">BDI-II</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Severidad
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={filters.severidad}
                      onChange={(e) =>
                        setFilters({ ...filters, severidad: e.target.value })
                      }
                    >
                      <option value="">Todas</option>
                      <option value="MINIMA">Mínima</option>
                      <option value="LEVE">Leve</option>
                      <option value="MODERADA">Moderada</option>
                      <option value="SEVERA">Severa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Página
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={filters.page}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          page: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                    />
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                      <Filter size={20} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && analytics && (
            <div className="animate-in fade-in duration-500 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                  title="Total Respuestas"
                  value={analytics.summary.total}
                  icon={FileText}
                  color="blue"
                />
                <AnalyticsCard
                  title="Promedio"
                  value={analytics.summary.promedio.toFixed(1)}
                  icon={TrendingUp}
                  color="green"
                />
                <AnalyticsCard
                  title="Puntaje Máximo"
                  value={analytics.summary.maximo}
                  icon={AlertTriangle}
                  color="red"
                />
                <AnalyticsCard
                  title="Última Muestra"
                  value={
                    formatDate(analytics.summary.ultimaMuestra).split(" ")[0]
                  }
                  subtitle={
                    formatDate(analytics.summary.ultimaMuestra).split(" ")[1]
                  }
                  icon={Clock}
                  color="purple"
                />
              </div>

              {/* Severity Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Distribución por Severidad
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {analytics.bySeverity.map((item) => (
                    <div key={item.severidad} className="text-center">
                      <div
                        className={`w-full h-32 rounded-lg flex items-end justify-center ${getSeverityColor(
                          item.severidad
                        )} mb-2`}
                      >
                        <div className="text-2xl font-bold mb-4">
                          {item.total}
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-600">
                        {item.severidad}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Results Tab */}
          {activeTab === "my-results" && (
            <div className="animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userResults.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizDashboard;
