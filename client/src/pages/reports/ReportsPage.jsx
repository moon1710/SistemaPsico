import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { API_CONFIG, STORAGE_KEYS } from "../../utils/constants";

const ReportsPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const colors = ['#527ceb', '#10cfbd', '#f6d365', '#6762b3', '#48b0f7'];

  useEffect(() => {
    loadReports();
  }, [selectedMonth, selectedYear]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      // Cargar datos del dashboard
      const dashboardResponse = await fetch(`${API_CONFIG.API_BASE}/reports/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (dashboardResponse.ok) {
        const dashboardResult = await dashboardResponse.json();
        setDashboardData(dashboardResult.data);
      }

      // Cargar datos mensuales
      const monthlyResponse = await fetch(
        `${API_CONFIG.API_BASE}/reports/monthly?mes=${selectedMonth}&año=${selectedYear}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (monthlyResponse.ok) {
        const monthlyResult = await monthlyResponse.json();
        setMonthlyData(monthlyResult.data);
      }

    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type = 'citas') => {
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const response = await fetch(
        `${API_CONFIG.API_BASE}/reports/export?tipo=${type}&fechaInicio=${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-01&fechaFin=${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-31`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${type}_${selectedYear}_${selectedMonth}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error exportando datos:", error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}% vs mes anterior
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reportes y Estadísticas</h1>
              <p className="text-gray-600 mt-1">Análisis de datos del sistema</p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Filtros */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2024, i).toLocaleDateString('es-ES', { month: 'long' })}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {Array.from({length: 5}, (_, i) => (
                    <option key={2024 - i} value={2024 - i}>
                      {2024 - i}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={loadReports}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <button
                onClick={() => exportData('citas')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Usuarios"
              value={dashboardData.usuarios?.total_usuarios || 0}
              icon={Users}
              color="from-[#527ceb] to-[#6762b3]"
            />
            <StatCard
              title="Total Citas"
              value={dashboardData.citas?.total_citas || 0}
              icon={Calendar}
              color="from-[#10cfbd] to-[#48b0f7]"
            />
            <StatCard
              title="Evaluaciones"
              value={dashboardData.evaluaciones?.total_evaluaciones || 0}
              icon={FileText}
              color="from-[#f6d365] to-[#fda085]"
            />
            <StatCard
              title="Promedio Puntaje"
              value={Math.round(dashboardData.evaluaciones?.promedio_puntaje || 0)}
              icon={TrendingUp}
              color="from-[#6762b3] to-[#9c3493]"
            />
          </div>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribución de Usuarios */}
          {dashboardData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Usuarios</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Estudiantes', value: dashboardData.usuarios.estudiantes },
                      { name: 'Psicólogos', value: dashboardData.usuarios.psicologos },
                      { name: 'Orientadores', value: dashboardData.usuarios.orientadores }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {colors.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Estados de Citas */}
          {dashboardData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estados de Citas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { estado: 'Pendientes', cantidad: dashboardData.citas.pendientes },
                    { estado: 'Confirmadas', cantidad: dashboardData.citas.confirmadas },
                    { estado: 'Completadas', cantidad: dashboardData.citas.completadas },
                    { estado: 'Canceladas', cantidad: dashboardData.citas.canceladas }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="estado" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#527ceb" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Citas por Día del Mes */}
        {monthlyData && monthlyData.citas_por_dia && monthlyData.citas_por_dia.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)] mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Citas por Día - {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData.citas_por_dia}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dia" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total_citas" name="Total Citas" fill="#527ceb" />
                <Bar dataKey="completadas" name="Completadas" fill="#10cfbd" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Top Psicólogos */}
        {monthlyData && monthlyData.top_psicologos && monthlyData.top_psicologos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Psicólogos del Mes</h3>
            <div className="space-y-4">
              {monthlyData.top_psicologos.slice(0, 5).map((psicologo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{psicologo.nombreCompleto}</p>
                    <p className="text-sm text-gray-500">
                      {psicologo.completadas} de {psicologo.total_citas} citas completadas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{psicologo.total_citas}</p>
                    <p className="text-xs text-gray-500">citas</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;