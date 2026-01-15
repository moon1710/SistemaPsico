import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import AdminLayout from "../../components/layout/AdminLayout";
import SolicitudModal from "../../components/admin/SolicitudModal";

const statusColors = {
  PENDIENTE: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    icon: ClockIcon,
  },
  EN_REVISION: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: ExclamationCircleIcon,
  },
  APROBADA: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    icon: CheckCircleIcon,
  },
  RECHAZADA: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: XCircleIcon,
  },
};

const SolicitudesPage = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [pagination, setPagination] = useState({});

  // Filtros y búsqueda
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSolicitudes();
  }, [filters]);

  const fetchSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/solicitudes?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSolicitudes(data.data.solicitudes);
        setStats(data.data.stats);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error obteniendo solicitudes:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleViewSolicitud = async (solicitudId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/solicitudes/${solicitudId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSelectedSolicitud(data.data.solicitud);
        setShowModal(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error obteniendo detalles:", error);
      alert("Error al obtener los detalles de la solicitud");
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

  const getStatusBadge = (status) => {
    const statusConfig = statusColors[status] || statusColors.PENDIENTE;
    const IconComponent = statusConfig.icon;

    return (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={fetchSolicitudes}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Solicitudes de Instituciones
            </h1>
            <p className="text-sm text-gray-600">
              Gestiona las solicitudes de registro de nuevas instituciones
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.total || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pendientes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.pendientes || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      En Revisión
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.enRevision || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Aprobadas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.aprobadas || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rechazadas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.rechazadas || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {/* Búsqueda */}
              <div className="sm:col-span-2">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por institución, responsable, correo..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Filtro por estado */}
              <div>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Todos los estados</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="EN_REVISION">En Revisión</option>
                  <option value="APROBADA">Aprobadas</option>
                  <option value="RECHAZADA">Rechazadas</option>
                </select>
              </div>

              {/* Ordenar */}
              <div>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                  }}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  <option value="createdAt-desc">Más recientes</option>
                  <option value="createdAt-asc">Más antiguos</option>
                  <option value="status-asc">Por estado</option>
                  <option value="institucionNombre-asc">Por institución A-Z</option>
                  <option value="institucionNombre-desc">Por institución Z-A</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Solicitudes ({pagination.total || 0})
            </h3>
          </div>

          {solicitudes.length === 0 ? (
            <div className="text-center py-12">
              <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No se encontraron solicitudes
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.status
                  ? "Intenta ajustar los filtros de búsqueda."
                  : "No hay solicitudes registradas."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {solicitudes.map((solicitud) => (
                <li key={solicitud.id} className="px-4 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-lg font-medium text-gray-900 truncate">
                            {solicitud.institucionNombre}
                          </p>
                          <p className="text-sm text-gray-600">
                            {solicitud.institucionCiudad}, {solicitud.institucionEstado}
                          </p>
                        </div>
                        <div className="ml-4">
                          {getStatusBadge(solicitud.status)}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <div className="flex-1">
                          <p>
                            <span className="font-medium">Responsable:</span>{" "}
                            {solicitud.nombre} {solicitud.apellidoPaterno}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {solicitud.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatDate(solicitud.createdAt)}
                          </p>
                          {solicitud.procesadoAt && (
                            <p className="text-xs">
                              Procesado: {formatDate(solicitud.procesadoAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleViewSolicitud(solicitud.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>

              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    a{" "}
                    <span className="font-medium">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{" "}
                    de <span className="font-medium">{pagination.total}</span>{" "}
                    resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>

                    {/* Números de página */}
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, pagination.page - 2) + i;
                      if (pageNum > pagination.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === pagination.page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      {showModal && selectedSolicitud && (
        <SolicitudModal
          solicitud={selectedSolicitud}
          onClose={() => {
            setShowModal(false);
            setSelectedSolicitud(null);
          }}
          onUpdate={fetchSolicitudes}
        />
      )}
    </AdminLayout>
  );
};


export default SolicitudesPage;