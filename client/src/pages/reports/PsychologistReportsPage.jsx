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
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Download,
  Filter,
  RefreshCw,
  Clock,
  Target,
  Award,
  Activity,
  FileDown,
  Printer
} from "lucide-react";
import { API_CONFIG, STORAGE_KEYS } from "../../utils/constants";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PsychologistReportsPage = () => {
  const [reportData, setReportData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fin: new Date().toISOString().split('T')[0]
  });

  const colors = ['#527ceb', '#10cfbd', '#f6d365', '#6762b3', '#48b0f7', '#ff6b6b'];

  useEffect(() => {
    loadReports();
  }, [dateRange]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

      // Cargar datos específicos del psicólogo
      const [psychologistResponse, dashboardResponse] = await Promise.all([
        fetch(`${API_CONFIG.API_BASE}/reports/psychologist?fechaInicio=${dateRange.inicio}&fechaFin=${dateRange.fin}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_CONFIG.API_BASE}/dashboard/psychologist`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (psychologistResponse.ok) {
        const result = await psychologistResponse.json();
        setReportData(result.data);
      }

      if (dashboardResponse.ok) {
        const result = await dashboardResponse.json();
        setDashboardData(result.data);
      }

    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(82, 124, 235); // Color azul
    doc.text('REPORTE DE EVALUACIONES PSICOLÓGICAS', pageWidth / 2, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Período: ${dateRange.inicio} - ${dateRange.fin}`, pageWidth / 2, 35, { align: 'center' });
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, pageWidth / 2, 45, { align: 'center' });

    let yPosition = 60;

    // Resumen estadístico
    if (reportData?.resumen) {
      doc.setFontSize(16);
      doc.setTextColor(33, 37, 45);
      doc.text('RESUMEN ESTADÍSTICO', 20, yPosition);
      yPosition += 10;

      const statsData = [
        ['Total de Evaluaciones', reportData.resumen.total_evaluaciones || 0],
        ['Evaluaciones Completadas', reportData.resumen.completadas || 0],
        ['Estudiantes Evaluados', reportData.resumen.estudiantes_evaluados || 0],
        ['Casos Severos', reportData.resumen.severas || 0],
        ['Casos Moderados', reportData.resumen.moderadas || 0],
        ['Casos Requieren Atención', reportData.resumen.casos_requieren_atencion || 0],
        ['Tasa de Finalización', `${reportData.resumen.tasa_completion || 0}%`],
        ['Puntaje Promedio', Math.round(reportData.resumen.puntaje_promedio || 0)]
      ];

      doc.autoTable({
        startY: yPosition,
        head: [['Métrica', 'Valor']],
        body: statsData,
        theme: 'grid',
        headStyles: { fillColor: [82, 124, 235] },
        margin: { left: 20, right: 20 }
      });

      yPosition = doc.lastAutoTable.finalY + 20;
    }

    // Estudiantes evaluados
    if (reportData?.estudiantes_evaluados?.length > 0) {
      doc.setFontSize(16);
      doc.text('ESTUDIANTES EVALUADOS', 20, yPosition);
      yPosition += 10;

      const studentsData = reportData.estudiantes_evaluados.slice(0, 15).map(student => [
        student.nombreCompleto,
        student.matricula || 'N/A',
        student.carrera || 'N/A',
        student.total_evaluaciones,
        Math.round(student.puntaje_promedio || 0),
        student.mayor_severidad || 'N/A',
        student.requiere_atencion > 0 ? 'Sí' : 'No',
        new Date(student.ultima_evaluacion).toLocaleDateString('es-ES')
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Nombre', 'Matrícula', 'Carrera', 'Evals', 'Puntaje', 'Severidad', 'Req. Atención', 'Última Eval.']],
        body: studentsData,
        theme: 'grid',
        headStyles: { fillColor: [16, 207, 189] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 8 }
      });

      yPosition = doc.lastAutoTable.finalY + 20;
    }

    // Distribución por severidad
    if (reportData?.distribucion_severidad?.length > 0) {
      // Check if we need a new page
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(16);
      doc.text('DISTRIBUCIÓN POR SEVERIDAD', 20, yPosition);
      yPosition += 10;

      const severityData = reportData.distribucion_severidad.map(item => [
        item.severidad || 'No especificada',
        item.cantidad,
        `${item.porcentaje || 0}%`
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Severidad', 'Cantidad', 'Porcentaje']],
        body: severityData,
        theme: 'grid',
        headStyles: { fillColor: [103, 98, 179] },
        margin: { left: 20, right: 20 }
      });

      yPosition = doc.lastAutoTable.finalY + 20;
    }

    // Casos que requieren canalización
    if (reportData?.casos_canalizacion?.length > 0) {
      // Check if we need a new page
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(16);
      doc.text('CASOS QUE REQUIEREN CANALIZACIÓN', 20, yPosition);
      yPosition += 10;

      const canalizacionData = reportData.casos_canalizacion.slice(0, 10).map(caso => [
        caso.nombreCompleto,
        caso.severidad,
        caso.evaluacion,
        Math.round(caso.puntajeTotal),
        caso.estado_canalizacion,
        new Date(caso.fechaEnvio).toLocaleDateString('es-ES')
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [['Estudiante', 'Severidad', 'Evaluación', 'Puntaje', 'Estado', 'Fecha']],
        body: canalizacionData,
        theme: 'grid',
        headStyles: { fillColor: [255, 107, 107] },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 }
      });
    }

    // Footer
    const finalY = doc.internal.pageSize.height - 20;
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('Sistema de Gestión Psicológica - NeuroFlora', pageWidth / 2, finalY, { align: 'center' });

    // Save
    doc.save(`reporte_evaluaciones_${dateRange.inicio}_${dateRange.fin}.pdf`);
  };

  const exportToCSV = () => {
    if (!reportData?.estudiantes_evaluados) return;

    const csvData = [
      ['Nombre', 'Matrícula', 'Carrera', 'Semestre', 'Total Evaluaciones', 'Puntaje Promedio', 'Mayor Severidad', 'Requiere Atención', 'Última Evaluación'],
      ...reportData.estudiantes_evaluados.map(student => [
        student.nombreCompleto,
        student.matricula || '',
        student.carrera || '',
        student.semestre || '',
        student.total_evaluaciones,
        Math.round(student.puntaje_promedio || 0),
        student.mayor_severidad || '',
        student.requiere_atencion > 0 ? 'Sí' : 'No',
        new Date(student.ultima_evaluacion).toLocaleDateString('es-ES')
      ])
    ];

    const csvContent = csvData.map(row =>
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `estudiantes_evaluados_${dateRange.inicio}_${dateRange.fin}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-sm font-medium mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}% vs período anterior
            </p>
          )}
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${color} shadow-lg`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  // No necesitamos calcular effectiveness rate para evaluaciones

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reportes de Evaluaciones Psicológicas
              </h1>
              <p className="text-gray-600 mt-2">Análisis detallado de las evaluaciones y resultados de estudiantes</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Filtros de fecha */}
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/40 rounded-xl p-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <input
                  type="date"
                  value={dateRange.inicio}
                  onChange={(e) => setDateRange(prev => ({ ...prev, inicio: e.target.value }))}
                  className="border-0 bg-transparent text-sm focus:outline-none"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="date"
                  value={dateRange.fin}
                  onChange={(e) => setDateRange(prev => ({ ...prev, fin: e.target.value }))}
                  className="border-0 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={loadReports}
                  className="p-2 bg-white/80 backdrop-blur-md border border-white/40 rounded-xl hover:bg-white/90 transition-all duration-200"
                  title="Actualizar"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={exportToCSV}
                  className="p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200"
                  title="Exportar CSV"
                >
                  <FileDown className="w-5 h-5" />
                </button>

                <button
                  onClick={generatePDF}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Evaluaciones"
            value={reportData?.resumen?.total_evaluaciones || 0}
            icon={FileText}
            color="from-[#527ceb] to-[#6762b3]"
            subtitle="En el período seleccionado"
          />
          <StatCard
            title="Evaluaciones Completadas"
            value={reportData?.resumen?.completadas || 0}
            icon={Target}
            color="from-[#10cfbd] to-[#48b0f7]"
            subtitle={`${reportData?.resumen?.tasa_completion || 0}% de finalización`}
          />
          <StatCard
            title="Estudiantes Evaluados"
            value={reportData?.resumen?.estudiantes_evaluados || 0}
            icon={Users}
            color="from-[#f6d365] to-[#fda085]"
            subtitle="Estudiantes diferentes evaluados"
          />
          <StatCard
            title="Casos Requieren Atención"
            value={reportData?.resumen?.casos_requieren_atencion || 0}
            icon={Clock}
            color="from-[#ff6b6b] to-[#ee5a52]"
            subtitle="Severidad moderada/severa"
          />
        </div>

        {/* Gráficos y análisis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribución por severidad */}
          {reportData?.distribucion_severidad?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Distribución por Severidad
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.distribucion_severidad}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="cantidad"
                    nameKey="severidad"
                    label={({ severidad, cantidad, percent }) =>
                      `${severidad}: ${cantidad} (${(percent * 100).toFixed(1)}%)`
                    }
                  >
                    {reportData.distribucion_severidad.map((entry, index) => {
                      const severityColors = {
                        'SEVERA': '#ff6b6b',
                        'MODERADA': '#ffa726',
                        'LEVE': '#66bb6a',
                        'NORMAL': '#42a5f5'
                      };
                      return (
                        <Cell key={`cell-${index}`} fill={severityColors[entry.severidad] || colors[index % colors.length]} />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Severidad: ${label}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Distribución por tipo de quiz */}
          {reportData?.distribucion_quiz?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Tipos de Evaluaciones
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.distribucion_quiz}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz_tipo" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === 'cantidad') return [value, 'Evaluaciones'];
                      if (name === 'puntaje_promedio') return [Math.round(value), 'Puntaje Promedio'];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="cantidad" fill="#527ceb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Lista de estudiantes evaluados */}
        {reportData?.estudiantes_evaluados?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Estudiantes Evaluados ({reportData.estudiantes_evaluados.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estudiante</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Carrera</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Evaluaciones</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Puntaje Promedio</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Mayor Severidad</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Requiere Atención</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Última Evaluación</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.estudiantes_evaluados.map((student, index) => {
                    const severityColors = {
                      'SEVERA': 'bg-red-100 text-red-800',
                      'MODERADA': 'bg-orange-100 text-orange-800',
                      'LEVE': 'bg-green-100 text-green-800',
                      'NORMAL': 'bg-blue-100 text-blue-800'
                    };
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{student.nombreCompleto}</div>
                          <div className="text-sm text-gray-500">{student.matricula}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{student.carrera || 'No especificada'}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {student.total_evaluaciones}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {Math.round(student.puntaje_promedio || 0)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            severityColors[student.mayor_severidad] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.mayor_severidad || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {student.requiere_atencion > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Sí ({student.requiere_atencion})
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              No
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(student.ultima_evaluacion).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Casos que requieren canalización */}
        {reportData?.casos_canalizacion?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-6 shadow-[0_8px_28px_rgba(0,0,0,0.08)] mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Casos que Requieren Canalización ({reportData.casos_canalizacion.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estudiante</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Matrícula</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Severidad</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Evaluación</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Puntaje</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado Canalización</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.casos_canalizacion.map((caso, index) => {
                    const severityColors = {
                      'SEVERA': 'bg-red-100 text-red-800',
                      'MODERADA': 'bg-orange-100 text-orange-800'
                    };
                    const statusColors = {
                      'PENDIENTE': 'bg-yellow-100 text-yellow-800',
                      'EN_SEGUIMIENTO': 'bg-blue-100 text-blue-800',
                      'CONTACTADO': 'bg-green-100 text-green-800',
                      'RESUELTO': 'bg-gray-100 text-gray-800'
                    };
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{caso.nombreCompleto}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{caso.matricula}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            severityColors[caso.severidad] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {caso.severidad}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{caso.evaluacion}</td>
                        <td className="py-4 px-4 text-gray-600">{Math.round(caso.puntajeTotal)}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[caso.estado_canalizacion] || 'bg-gray-100 text-gray-800'
                          }`}>
                            {caso.estado_canalizacion}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(caso.fechaEnvio).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Mensaje si no hay datos */}
        {!reportData?.resumen?.total_evaluaciones && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md border border-white/40 rounded-2xl p-8 text-center"
          >
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
            <p className="text-gray-600">
              No se encontraron evaluaciones en el período seleccionado.
              Intenta seleccionar un rango de fechas diferente.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PsychologistReportsPage;