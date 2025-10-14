import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import SeverityBadge from "../components/quizzes/SeverityBadge";

const CanalizacionesPage = () => {
  const [canalizaciones, setCanalizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    severidad: "",
    estado: "",
    fechaDesde: "",
    fechaHasta: ""
  });
  const [selectedCase, setSelectedCase] = useState(null);

  // Mock data - En producción esto vendría del backend
  const mockCanalizaciones = [
    {
      id: 1,
      estudiante: {
        id: 101,
        nombre: "Ana García López",
        email: "ana.garcia@tecnm.mx",
        carrera: "Ingeniería en Sistemas",
        semestre: 5
      },
      quiz: {
        tipo: "PHQ-9",
        nombre: "Evaluación de Depresión",
        puntaje: 18,
        severidad: "SEVERA"
      },
      fechaResultado: "2024-01-15T10:30:00Z",
      estado: "PENDIENTE", // PENDIENTE, EN_SEGUIMIENTO, CONTACTADO, RESUELTO
      prioridad: "ALTA",
      notas: [],
      psicologoAsignado: null,
      ultimaActividad: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      estudiante: {
        id: 102,
        nombre: "Carlos Ruiz Mendoza",
        email: "carlos.ruiz@tecnm.mx",
        carrera: "Ingeniería Industrial",
        semestre: 3
      },
      quiz: {
        tipo: "GAD-7",
        nombre: "Evaluación de Ansiedad",
        puntaje: 14,
        severidad: "MODERADA"
      },
      fechaResultado: "2024-01-14T15:45:00Z",
      estado: "EN_SEGUIMIENTO",
      prioridad: "MEDIA",
      notas: [
        {
          fecha: "2024-01-15T09:00:00Z",
          psicologo: "Dra. María López",
          nota: "Primer contacto realizado. Estudiante receptivo. Programada cita para el 18/01."
        }
      ],
      psicologoAsignado: {
        id: 201,
        nombre: "Dra. María López"
      },
      ultimaActividad: "2024-01-15T09:00:00Z"
    },
    {
      id: 3,
      estudiante: {
        id: 103,
        nombre: "Sofia Hernández Torres",
        email: "sofia.hernandez@tecnm.mx",
        carrera: "Ingeniería en Gestión Empresarial",
        semestre: 7
      },
      quiz: {
        tipo: "BAI",
        nombre: "Inventario de Ansiedad de Beck",
        puntaje: 25,
        severidad: "SEVERA"
      },
      fechaResultado: "2024-01-13T08:20:00Z",
      estado: "CONTACTADO",
      prioridad: "ALTA",
      notas: [
        {
          fecha: "2024-01-13T14:00:00Z",
          psicologo: "Psic. Roberto Sánchez",
          nota: "Contacto telefónico exitoso. Estudiante en crisis de ansiedad por exámenes. Cita programada para hoy."
        },
        {
          fecha: "2024-01-13T16:30:00Z",
          psicologo: "Psic. Roberto Sánchez",
          nota: "Primera sesión completada. Plan de seguimiento semanal establecido."
        }
      ],
      psicologoAsignado: {
        id: 202,
        nombre: "Psic. Roberto Sánchez"
      },
      ultimaActividad: "2024-01-13T16:30:00Z"
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setCanalizaciones(mockCanalizaciones);
      setLoading(false);
    }, 1000);
  }, []);

  const getEstadoConfig = (estado) => {
    const configs = {
      PENDIENTE: {
        color: "red",
        label: "Pendiente",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
        borderColor: "border-red-200"
      },
      EN_SEGUIMIENTO: {
        color: "yellow",
        label: "En Seguimiento",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
        borderColor: "border-yellow-200"
      },
      CONTACTADO: {
        color: "blue",
        label: "Contactado",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200"
      },
      RESUELTO: {
        color: "green",
        label: "Resuelto",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200"
      }
    };
    return configs[estado] || configs.PENDIENTE;
  };

  const getPrioridadConfig = (prioridad) => {
    const configs = {
      ALTA: { color: "text-red-600", bg: "bg-red-100" },
      MEDIA: { color: "text-orange-600", bg: "bg-orange-100" },
      BAJA: { color: "text-green-600", bg: "bg-green-100" }
    };
    return configs[prioridad] || configs.MEDIA;
  };

  const canalizacionesFiltradas = canalizaciones.filter(c => {
    if (filtros.severidad && c.quiz.severidad !== filtros.severidad) return false;
    if (filtros.estado && c.estado !== filtros.estado) return false;
    return true;
  });

  const estadisticas = {
    total: canalizaciones.length,
    pendientes: canalizaciones.filter(c => c.estado === 'PENDIENTE').length,
    severas: canalizaciones.filter(c => c.quiz.severidad === 'SEVERA').length,
    moderadas: canalizaciones.filter(c => c.quiz.severidad === 'MODERADA').length
  };

  const actualizarEstado = (id, nuevoEstado) => {
    setCanalizaciones(prev =>
      prev.map(c =>
        c.id === id ? { ...c, estado: nuevoEstado, ultimaActividad: new Date().toISOString() } : c
      )
    );
  };

  const asignarPsicologo = (id, psicologo) => {
    setCanalizaciones(prev =>
      prev.map(c =>
        c.id === id ? { ...c, psicologoAsignado: psicologo, ultimaActividad: new Date().toISOString() } : c
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando canalizaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
          Centro de Canalizaciones
        </h1>
        <p className="text-gray-600">
          Gestión de casos de riesgo alto y moderado identificados en evaluaciones psicológicas
        </p>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total de Casos</p>
              <p className="text-2xl font-bold text-gray-900">{estadisticas.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.pendientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Severidad Alta</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.severas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Severidad Moderada</p>
              <p className="text-2xl font-bold text-orange-600">{estadisticas.moderadas}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filtros.severidad}
            onChange={(e) => setFiltros(prev => ({ ...prev, severidad: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las severidades</option>
            <option value="SEVERA">Severa</option>
            <option value="MODERADA">Moderada</option>
          </select>

          <select
            value={filtros.estado}
            onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_SEGUIMIENTO">En Seguimiento</option>
            <option value="CONTACTADO">Contactado</option>
            <option value="RESUELTO">Resuelto</option>
          </select>

          <input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaDesde: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Fecha desde"
          />

          <input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaHasta: e.target.value }))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Fecha hasta"
          />
        </div>
      </motion.div>

      {/* Lista de canalizaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="space-y-4"
      >
        {canalizacionesFiltradas.map((canalizacion, index) => {
          const estadoConfig = getEstadoConfig(canalizacion.estado);
          const prioridadConfig = getPrioridadConfig(canalizacion.prioridad);

          return (
            <motion.div
              key={canalizacion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm border-l-4 ${
                canalizacion.quiz.severidad === 'SEVERA' ? 'border-red-500' : 'border-orange-500'
              } p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {canalizacion.estudiante.nombre}
                      </h3>
                    </div>

                    <SeverityBadge value={canalizacion.quiz.severidad} size="sm" />

                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoConfig.bgColor} ${estadoConfig.textColor}`}>
                      {estadoConfig.label}
                    </span>

                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadConfig.bg} ${prioridadConfig.color}`}>
                      Prioridad {canalizacion.prioridad}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div>
                      <p><strong>Email:</strong> {canalizacion.estudiante.email}</p>
                      <p><strong>Carrera:</strong> {canalizacion.estudiante.carrera}</p>
                    </div>
                    <div>
                      <p><strong>Quiz:</strong> {canalizacion.quiz.nombre}</p>
                      <p><strong>Puntaje:</strong> {canalizacion.quiz.puntaje}</p>
                    </div>
                    <div>
                      <p><strong>Fecha:</strong> {new Date(canalizacion.fechaResultado).toLocaleDateString()}</p>
                      {canalizacion.psicologoAsignado && (
                        <p><strong>Asignado a:</strong> {canalizacion.psicologoAsignado.nombre}</p>
                      )}
                    </div>
                  </div>

                  {canalizacion.notas.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Última nota:</h4>
                      <p className="text-sm text-gray-700">{canalizacion.notas[canalizacion.notas.length - 1].nota}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Por {canalizacion.notas[canalizacion.notas.length - 1].psicologo} - {new Date(canalizacion.notas[canalizacion.notas.length - 1].fecha).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => setSelectedCase(canalizacion)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-1"
                  >
                    <EyeIcon className="w-4 h-4" />
                    Ver Detalle
                  </button>

                  {canalizacion.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => actualizarEstado(canalizacion.id, 'EN_SEGUIMIENTO')}
                      className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      Tomar Caso
                    </button>
                  )}

                  <button
                    onClick={() => window.open(`tel:${canalizacion.estudiante.email}`, '_self')}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    Contactar
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {canalizacionesFiltradas.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
            <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay canalizaciones</h3>
            <p className="text-gray-600">No se encontraron casos que coincidan con los filtros seleccionados.</p>
          </div>
        )}
      </motion.div>

      {/* Modal de detalle (simplificado) */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Detalle del Caso</h2>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Información del Estudiante</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p><strong>Nombre:</strong> {selectedCase.estudiante.nombre}</p>
                  <p><strong>Email:</strong> {selectedCase.estudiante.email}</p>
                  <p><strong>Carrera:</strong> {selectedCase.estudiante.carrera}</p>
                  <p><strong>Semestre:</strong> {selectedCase.estudiante.semestre}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Resultado de Evaluación</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <SeverityBadge value={selectedCase.quiz.severidad} />
                    <span className="font-semibold">Puntaje: {selectedCase.quiz.puntaje}</span>
                  </div>
                  <p><strong>Evaluación:</strong> {selectedCase.quiz.nombre}</p>
                  <p><strong>Fecha:</strong> {new Date(selectedCase.fechaResultado).toLocaleString()}</p>
                </div>
              </div>

              {selectedCase.notas.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Historial de Seguimiento</h3>
                  <div className="space-y-2">
                    {selectedCase.notas.map((nota, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{nota.nota}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {nota.psicologo} - {new Date(nota.fecha).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CanalizacionesPage;