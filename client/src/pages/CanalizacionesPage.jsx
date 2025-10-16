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
  PlusIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import SeverityBadge from "../components/quizzes/SeverityBadge";
import canalizacionesService from "../services/canalizacionesService";
import { useAuth } from "../contexts/AuthContext";

const GOOGLE_CALENDAR_LINK = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2B-xvZKl6KLUb7H0jvcNNBNdXAhGO9X2G0Qwl0DOMBFDzykmYM1Kv0MOHSs0vPrWkUZTDyy2QQ";

const CanalizacionesPage = () => {
  const { user } = useAuth();
  const [canalizaciones, setCanalizaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    severidad: "",
    estado: "",
    fechaDesde: "",
    fechaHasta: ""
  });
  const [selectedCase, setSelectedCase] = useState(null);
  const [actualizandoEstado, setActualizandoEstado] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  // Cargar datos reales de la API
  const cargarCanalizaciones = async () => {
    try {
      setLoading(true);
      setError(null);

      const [canalizacionesRes, estadisticasRes] = await Promise.all([
        canalizacionesService.getCanalizaciones(filtros),
        canalizacionesService.getEstadisticas()
      ]);

      if (canalizacionesRes.success) {
        // Transformar datos de la API al formato esperado por el componente
        const canalizacionesTransformadas = canalizacionesRes.data.map(caso => ({
          id: caso.canalizacionId || `temp-${caso.quizId}`,
          estudiante: {
            id: caso.usuarioId,
            nombre: caso.nombreCompleto,
            email: caso.email,
            carrera: caso.carrera,
            semestre: caso.semestre,
            matricula: caso.matricula,
            telefono: caso.telefono
          },
          quiz: {
            tipo: caso.quizTipo,
            nombre: caso.quizNombre,
            puntaje: caso.puntajeTotal,
            severidad: caso.severidad,
            fechaAplicacion: caso.fechaEnvio,
            interpretacion: `${caso.severidad} - Requiere ${caso.severidad === 'SEVERA' ? 'intervención inmediata' : 'seguimiento psicológico'}`
          },
          fechaResultado: caso.fechaEnvio,
          estado: caso.estadoCaso || 'PENDIENTE',
          prioridad: caso.prioridad || (caso.severidad === 'SEVERA' ? 'ALTA' : 'MEDIA'),
          motivoCanalizacion: caso.motivoCanalizacion || `Evaluación ${caso.quizNombre} con resultado ${caso.severidad.toLowerCase()}`,
          notas: caso.notas || [],
          psicologoAsignado: caso.psicologoNombre ? {
            id: caso.psicologoAsignado,
            nombre: caso.psicologoNombre,
            especialidad: caso.especialidades || 'Psicología General',
            cedula: caso.cedulaProfesional
          } : null,
          ultimaActividad: caso.ultimaActividad || caso.fechaEnvio,
          proximaCita: caso.proximaCita,
          fechaAlta: caso.fechaAlta,
          contactoEmergencia: caso.contactoEmergenciaNombre ? {
            nombre: caso.contactoEmergenciaNombre,
            telefono: caso.contactoEmergenciaTelefono
          } : null,
          institucionNombre: caso.institucionNombre
        }));

        setCanalizaciones(canalizacionesTransformadas);
      }

      if (estadisticasRes.success) {
        setEstadisticas(estadisticasRes.data);
      }

    } catch (error) {
      console.error("Error cargando canalizaciones:", error);
      setError("Error al cargar las canalizaciones. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCanalizaciones();
  }, [filtros]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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

  const estadisticasDisplay = {
    total: estadisticas.totalCasos || canalizaciones.length,
    pendientes: estadisticas.pendientes || canalizaciones.filter(c => c.estado === 'PENDIENTE').length,
    severas: estadisticas.severos || canalizaciones.filter(c => c.quiz.severidad === 'SEVERA').length,
    moderadas: estadisticas.moderados || canalizaciones.filter(c => c.quiz.severidad === 'MODERADA').length
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      setActualizandoEstado(id);

      await canalizacionesService.actualizarEstado(id, nuevoEstado, user.id);

      // Actualizar localmente
      setCanalizaciones(prev =>
        prev.map(c =>
          c.id === id ? {
            ...c,
            estado: nuevoEstado,
            ultimaActividad: new Date().toISOString(),
            psicologoAsignado: nuevoEstado !== 'PENDIENTE' ? { id: user.id, nombre: user.nombreCompleto } : c.psicologoAsignado
          } : c
        )
      );

      // Recargar para obtener datos actualizados
      await cargarCanalizaciones();

    } catch (error) {
      console.error("Error actualizando estado:", error);
      setError("Error al actualizar el estado. Por favor, intenta nuevamente.");
    } finally {
      setActualizandoEstado(null);
    }
  };

  const agregarNota = async (id, nota, tipo = 'SEGUIMIENTO') => {
    try {
      await canalizacionesService.agregarNota(id, nota, tipo);
      await cargarCanalizaciones(); // Recargar para mostrar la nueva nota
    } catch (error) {
      console.error("Error agregando nota:", error);
      setError("Error al agregar la nota. Por favor, intenta nuevamente.");
    }
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
          <button
            onClick={cargarCanalizaciones}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
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
          Gestión de casos de riesgo identificados en evaluaciones psicológicas del ITTux
        </p>
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-sm text-red-800">
              <strong>Protocolo de Emergencia:</strong> Para casos de riesgo suicida o crisis inmediata, contactar inmediatamente a:
              <strong> Centro de Crisis 24/7: 961-6122334</strong> | <strong>SAPTEL: 55-5259-8121</strong>
            </p>
          </div>
        </div>
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
              <p className="text-2xl font-bold text-gray-900">{estadisticasDisplay.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Pendientes</p>
              <p className="text-2xl font-bold text-red-600">{estadisticasDisplay.pendientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">Severidad Alta</p>
              <p className="text-2xl font-bold text-red-600">{estadisticasDisplay.severas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm text-gray-500">Severidad Moderada</p>
              <p className="text-2xl font-bold text-orange-600">{estadisticasDisplay.moderadas}</p>
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
                      <p><strong>Matrícula:</strong> {canalizacion.estudiante.matricula}</p>
                      <p><strong>Email:</strong> {canalizacion.estudiante.email}</p>
                      <p><strong>Carrera:</strong> {canalizacion.estudiante.carrera}</p>
                      <p><strong>Semestre:</strong> {canalizacion.estudiante.semestre}°</p>
                    </div>
                    <div>
                      <p><strong>Evaluación:</strong> {canalizacion.quiz.nombre}</p>
                      <p><strong>Puntaje:</strong> {canalizacion.quiz.puntaje} - {canalizacion.quiz.interpretacion}</p>
                      <p><strong>Motivo:</strong> {canalizacion.motivoCanalizacion}</p>
                    </div>
                    <div>
                      <p><strong>Fecha:</strong> {new Date(canalizacion.fechaResultado).toLocaleDateString()}</p>
                      {canalizacion.psicologoAsignado && (
                        <>
                          <p><strong>Asignado a:</strong> {canalizacion.psicologoAsignado.nombre}</p>
                          <p><strong>Especialidad:</strong> {canalizacion.psicologoAsignado.especialidad}</p>
                        </>
                      )}
                      {canalizacion.proximaCita && (
                        <p><strong>Próxima cita:</strong> {new Date(canalizacion.proximaCita).toLocaleDateString()}</p>
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
                      disabled={actualizandoEstado === canalizacion.id}
                      className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {actualizandoEstado === canalizacion.id ? 'Procesando...' : 'Tomar Caso'}
                    </button>
                  )}

                  {canalizacion.estado === 'EN_SEGUIMIENTO' && (
                    <button
                      onClick={() => actualizarEstado(canalizacion.id, 'CONTACTADO')}
                      disabled={actualizandoEstado === canalizacion.id}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {actualizandoEstado === canalizacion.id ? 'Procesando...' : 'Marcar Contactado'}
                    </button>
                  )}

                  {(canalizacion.estado === 'CONTACTADO' || canalizacion.estado === 'EN_SEGUIMIENTO') && (
                    <button
                      onClick={() => actualizarEstado(canalizacion.id, 'RESUELTO')}
                      disabled={actualizandoEstado === canalizacion.id}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                    >
                      {actualizandoEstado === canalizacion.id ? 'Procesando...' : 'Resolver Caso'}
                    </button>
                  )}

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(dropdownOpen === canalizacion.id ? null : canalizacion.id);
                      }}
                      className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      Contactar
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>

                    {dropdownOpen === canalizacion.id && (
                      <div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              window.open(`mailto:${canalizacion.estudiante.email}`, '_self');
                              setDropdownOpen(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <PhoneIcon className="w-4 h-4" />
                            Enviar email
                          </button>
                          <button
                            onClick={() => {
                              window.open(GOOGLE_CALENDAR_LINK, '_blank');
                              setDropdownOpen(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <CalendarDaysIcon className="w-4 h-4" />
                            Agendar cita
                          </button>
                          {canalizacion.estudiante.telefono && (
                            <button
                              onClick={() => {
                                window.open(`tel:${canalizacion.estudiante.telefono}`, '_self');
                                setDropdownOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <PhoneIcon className="w-4 h-4" />
                              Llamar
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
                  <p><strong>Matrícula:</strong> {selectedCase.estudiante.matricula}</p>
                  <p><strong>Email:</strong> {selectedCase.estudiante.email}</p>
                  <p><strong>Carrera:</strong> {selectedCase.estudiante.carrera}</p>
                  <p><strong>Semestre:</strong> {selectedCase.estudiante.semestre}°</p>
                  <p><strong>Edad:</strong> {selectedCase.estudiante.edad} años</p>
                  {selectedCase.contactoEmergencia && (
                    <p><strong>Contacto de emergencia:</strong> {selectedCase.contactoEmergencia.nombre} - {selectedCase.contactoEmergencia.telefono}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Resultado de Evaluación</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-2">
                    <SeverityBadge value={selectedCase.quiz.severidad} />
                    <span className="font-semibold">Puntaje: {selectedCase.quiz.puntaje}</span>
                  </div>
                  <p><strong>Evaluación:</strong> {selectedCase.quiz.nombre} ({selectedCase.quiz.tipo})</p>
                  <p><strong>Interpretación:</strong> {selectedCase.quiz.interpretacion}</p>
                  <p><strong>Motivo de canalización:</strong> {selectedCase.motivoCanalizacion}</p>
                  <p><strong>Fecha de aplicación:</strong> {new Date(selectedCase.quiz.fechaAplicacion).toLocaleString()}</p>
                </div>
              </div>

              {selectedCase.psicologoAsignado && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Psicólogo Asignado</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p><strong>Nombre:</strong> {selectedCase.psicologoAsignado.nombre}</p>
                    <p><strong>Especialidad:</strong> {selectedCase.psicologoAsignado.especialidad}</p>
                    <p><strong>Cédula profesional:</strong> {selectedCase.psicologoAsignado.cedula}</p>
                    {selectedCase.proximaCita && (
                      <p><strong>Próxima cita programada:</strong> {new Date(selectedCase.proximaCita).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedCase.notas.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Historial de Seguimiento</h3>
                  <div className="space-y-3">
                    {selectedCase.notas.map((nota, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            {nota.tipo?.replace(/_/g, ' ') || 'NOTA GENERAL'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(nota.fecha).toLocaleDateString()} {new Date(nota.fecha).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{nota.nota}</p>
                        <p className="text-xs text-gray-600 font-medium">
                          👩‍⚕️ {nota.psicologo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCase.estado === 'RESUELTO' && selectedCase.fechaAlta && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Información de Alta</h3>
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
                    <p><strong>Fecha de alta:</strong> {new Date(selectedCase.fechaAlta).toLocaleDateString()}</p>
                    {selectedCase.seguimientoPostAlta && (
                      <p><strong>Seguimiento programado:</strong> {new Date(selectedCase.seguimientoPostAlta).toLocaleDateString()}</p>
                    )}
                    <p className="text-sm text-green-700 mt-2">
                      ✅ Caso resuelto exitosamente. El estudiante ha mostrado mejoría significativa y está en condiciones de alta terapéutica.
                    </p>
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