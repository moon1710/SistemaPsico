import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { quizzesApi } from "../../services/quizzesService";
import SeverityBadge from "../../components/quizzes/SeverityBadge";
import { useAuth } from "../../contexts/AuthContext";
import { USER_ROLES } from "../../utils/constants";
import {
  ChartBarIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

const ADMIN_ROLES = new Set([
  USER_ROLES.PSICOLOGO,
  USER_ROLES.ORIENTADOR,
  USER_ROLES.ADMIN_INSTITUCION,
  USER_ROLES.SUPER_ADMIN_INSTITUCION,
  USER_ROLES.SUPER_ADMIN_NACIONAL,
]);

export default function AnalyticsPage() {
  const { user } = useAuth();
  const canAccess = ADMIN_ROLES.has(user?.rol) ||
    user?.instituciones?.some(i => ADMIN_ROLES.has(i.rol));

  const [institutionId, setInstitutionId] = React.useState(
    user?.instituciones?.find((m) => m.isMembershipActiva)?.institucionId ||
      user?.instituciones?.[0]?.institucionId ||
      ""
  );

  const [filters, setFilters] = React.useState({
    codigo: "",
    desde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hasta: new Date().toISOString().split('T')[0],
    semestre: "",
    genero: "",
    carrera: ""
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [analytics, setAnalytics] = React.useState(null);

  const fetchAnalytics = React.useCallback(() => {
    if (!institutionId) return;

    setLoading(true);
    setError("");

    quizzesApi
      .analytics({
        institutionId,
        ...filters
      })
      .then((res) => {
        console.log("Analytics response:", res);
        setAnalytics(res);
      })
      .catch((e) => {
        console.error("Analytics error:", e);
        setError(e.data?.message || e.message || "Error cargando analytics");
      })
      .finally(() => setLoading(false));
  }, [institutionId, filters]);

  const handleExport = () => {
    if (!institutionId) return;

    quizzesApi.exportAnalytics({
      institutionId,
      ...filters
    });
  };

  React.useEffect(() => {
    if (canAccess) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, canAccess]);

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a los análisis estadísticos.</p>
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const severityData = analytics?.severityDistribution ?
    Object.entries(analytics.severityDistribution).map(([key, value], index) => ({
      id: index,
      value: value,
      label: key === 'MINIMA' ? 'Mínima' : key === 'LEVE' ? 'Leve' : key === 'MODERADA' ? 'Moderada' : 'Severa'
    })).filter(item => item.value > 0) : [];

  const weeklyData = analytics?.weeklyTrends ? analytics.weeklyTrends.map(item => item.count) : [];
  const weekLabels = analytics?.weeklyTrends ? analytics.weeklyTrends.map(item => `Semana ${item.week}`) : [];

  const scoreData = analytics?.averageScoreByQuiz ?
    Object.entries(analytics.averageScoreByQuiz).map(([quiz, score]) => score) : [];
  const scoreLabels = analytics?.averageScoreByQuiz ?
    Object.keys(analytics.averageScoreByQuiz) : [];

  const genderData = analytics?.byGender ?
    analytics.byGender.map((item, index) => ({
      id: index,
      value: item.total,
      label: item.genero || 'No especificado'
    })) : [];

  const semesterData = analytics?.bySemester ?
    analytics.bySemester.map(item => item.total) : [];
  const semesterLabels = analytics?.bySemester ?
    analytics.bySemester.map(item => `${item.semestre}° Sem`) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <ChartBarIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Análisis Estadístico</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visualiza tendencias y patrones en las evaluaciones de bienestar mental con gráficos interactivos.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl border p-6 shadow-sm mb-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filtros de Análisis</h3>
            <button
              onClick={handleExport}
              disabled={loading || !analytics}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institución</label>
              <select
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {(user?.instituciones || []).map((m) => (
                  <option key={m.institucionId} value={m.institucionId}>
                    {m.institucionNombre || m.institucionId}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Evaluación</label>
              <select
                value={filters.codigo}
                onChange={(e) => setFilters(prev => ({ ...prev, codigo: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas</option>
                <option value="BAI">BAI - Ansiedad</option>
                <option value="BDI2">BDI-II - Depresión</option>
                <option value="PHQ9">PHQ-9 - Depresión</option>
                <option value="GAD7">GAD-7 - Ansiedad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semestre</label>
              <select
                value={filters.semestre}
                onChange={(e) => setFilters(prev => ({ ...prev, semestre: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                {[1,2,3,4,5,6,7,8,9,10].map(sem => (
                  <option key={sem} value={sem}>{sem}° Semestre</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
              <select
                value={filters.genero}
                onChange={(e) => setFilters(prev => ({ ...prev, genero: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
              <input
                type="date"
                value={filters.desde}
                onChange={(e) => setFilters(prev => ({ ...prev, desde: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
              <input
                type="date"
                value={filters.hasta}
                onChange={(e) => setFilters(prev => ({ ...prev, hasta: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
            <select
              value={filters.carrera}
              onChange={(e) => setFilters(prev => ({ ...prev, carrera: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las carreras</option>
              <optgroup label="Licenciaturas">
                <option value="Administración">Administración</option>
                <option value="Contador Público">Contador Público</option>
                <option value="Gestión Empresarial">Gestión Empresarial</option>
              </optgroup>
              <optgroup label="Ingenierías">
                <option value="Ingeniería Química">Ingeniería Química</option>
                <option value="Ingeniería Civil">Ingeniería Civil</option>
                <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                <option value="Ingeniería Electromecánica">Ingeniería Electromecánica</option>
                <option value="Ingeniería en Informática">Ingeniería en Informática</option>
                <option value="Ingeniería en Sistemas Computacionales">Ingeniería en Sistemas Computacionales</option>
                <option value="Ingeniería en Desarrollo de Aplicaciones">Ingeniería en Desarrollo de Aplicaciones</option>
                <option value="Ingeniería Bioquímica">Ingeniería Bioquímica</option>
              </optgroup>
            </select>
          </div>

          <div>
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generando..." : "Actualizar Análisis"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generando análisis estadístico...</p>
          </div>
        ) : analytics ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Respuestas</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.summary?.total || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Estudiantes Únicos</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.summary?.uniqueStudents || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Puntaje Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analytics.summary?.promedio ? Math.round(analytics.summary.promedio * 10) / 10 : "0"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Período</p>
                    <p className="text-sm font-bold text-gray-900">
                      {Math.ceil((new Date(filters.hasta) - new Date(filters.desde)) / (1000 * 60 * 60 * 24))} días
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart - Severity Distribution */}
              {severityData.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Distribución por Severidad</h3>
                  <div className="flex justify-center">
                    <PieChart
                      series={[{ data: severityData }]}
                      width={400}
                      height={200}
                    />
                  </div>
                </div>
              )}

              {/* Line Chart - Weekly Trends */}
              {weeklyData.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Tendencias Semanales</h3>
                  <div className="flex justify-center">
                    <LineChart
                      xAxis={[{ scaleType: 'point', data: weekLabels }]}
                      series={[{ data: weeklyData, label: 'Evaluaciones' }]}
                      width={400}
                      height={200}
                    />
                  </div>
                </div>
              )}

              {/* Gender Distribution */}
              {genderData.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Distribución por Género</h3>
                  <div className="flex justify-center">
                    <PieChart
                      series={[{ data: genderData }]}
                      width={400}
                      height={200}
                    />
                  </div>
                </div>
              )}

              {/* Semester Distribution */}
              {semesterData.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Distribución por Semestre</h3>
                  <div className="flex justify-center">
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: semesterLabels }]}
                      series={[{ data: semesterData, label: 'Evaluaciones' }]}
                      width={400}
                      height={200}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Average Scores Chart */}
            {scoreData.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Puntajes Promedio por Evaluación</h3>
                <div className="flex justify-center">
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: scoreLabels }]}
                    series={[{ data: scoreData, label: 'Puntaje Promedio' }]}
                    width={600}
                    height={300}
                  />
                </div>
              </div>
            )}

            {/* Top Careers */}
            {analytics.byCareer && analytics.byCareer.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Top 10 Carreras con Más Evaluaciones</h3>
                <div className="space-y-4">
                  {analytics.byCareer.map((career, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{career.carrera}</p>
                        <p className="text-sm text-gray-600">Promedio: {Math.round(career.promedio * 10) / 10}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${Math.min((career.total / analytics.byCareer[0].total) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {career.total}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Severity Table */}
            {analytics.severityDistribution && Object.keys(analytics.severityDistribution).length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Detalle por Severidad</h3>
                <div className="space-y-4">
                  {['MINIMA', 'LEVE', 'MODERADA', 'SEVERA'].map((severity) => {
                    const count = analytics.severityDistribution[severity] || 0;
                    const total = analytics.summary?.total || 0;
                    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                    return (
                      <div key={severity} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <SeverityBadge value={severity} size="md" showTooltip={true} />
                          <span className="text-sm text-gray-600">
                            {count} estudiante{count !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${
                                severity === 'MINIMA' ? 'bg-green-500' :
                                severity === 'LEVE' ? 'bg-yellow-500' :
                                severity === 'MODERADA' ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <ChartBarIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
            <p className="text-gray-600">
              Ajusta los filtros y haz clic en "Actualizar Análisis" para generar el reporte.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}