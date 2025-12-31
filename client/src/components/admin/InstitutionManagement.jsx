import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import InstitutionDetailModal from './InstitutionDetailModal';

const STATUS_COLORS = {
  PENDIENTE_APROBACION: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: AlertTriangle,
    label: 'Pendiente'
  },
  ACTIVA: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: CheckCircle,
    label: 'Activa'
  },
  SUSPENDIDA: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: XCircle,
    label: 'Suspendida'
  },
  INACTIVA: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    icon: XCircle,
    label: 'Inactiva'
  }
};

const InstitutionManagement = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Filtros y búsqueda
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    estado: '',
    sortBy: 'status',
    sortOrder: 'asc'
  });

  // Paginación
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Estados únicos para filtros
  const [availableStates, setAvailableStates] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadInstitutions();
    loadStates();
  }, [filters, pagination.page]);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const response = await fetch(`/api/institutions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar instituciones');
      }

      const data = await response.json();

      if (data.success) {
        setInstitutions(data.data.institutions);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
        setStats(data.data.stats);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error loading institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStates = async () => {
    try {
      const response = await fetch('/api/institutions/states', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableStates(data.data);
        }
      }
    } catch (err) {
      console.error('Error loading states:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSearch = (e) => {
    handleFilterChange('search', e.target.value);
  };

  const handleStatusAction = async (institutionId, action, data = {}) => {
    try {
      setActionLoading(institutionId);

      const response = await fetch(`/api/institutions/${institutionId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        // Reload institutions to reflect changes
        loadInstitutions();

        // Show success message
        alert(`Institución ${action === 'approve' ? 'aprobada' : action === 'suspend' ? 'suspendida' : 'reactivada'} exitosamente`);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error(`Error in ${action}:`, err);
      alert(`Error al ${action === 'approve' ? 'aprobar' : action === 'suspend' ? 'suspender' : 'reactivar'} institución: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = async (institutionId) => {
    try {
      const response = await fetch(`/api/institutions/${institutionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedInstitution(data.data);
          setShowDetailModal(true);
        }
      }
    } catch (err) {
      console.error('Error loading institution details:', err);
      alert('Error al cargar detalles de la institución');
    }
  };

  const ActionButton = ({ institution, action, icon: Icon, label, variant = 'default', onClick }) => {
    const isLoading = actionLoading === institution.id;

    const variantClasses = {
      default: 'bg-blue-500 hover:bg-blue-600 text-white',
      success: 'bg-green-500 hover:bg-green-600 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      danger: 'bg-red-500 hover:bg-red-600 text-white'
    };

    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md
          transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
        `}
        title={label}
      >
        <Icon className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
        {label}
      </button>
    );
  };

  const StatusBadge = ({ status }) => {
    const config = STATUS_COLORS[status] || STATUS_COLORS.INACTIVA;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && institutions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Cargando instituciones...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendientes || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">{stats.activas || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendidas</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspendidas || 0}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, clave, responsable..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE_APROBACION">Pendientes</option>
              <option value="ACTIVA">Activas</option>
              <option value="SUSPENDIDA">Suspendidas</option>
              <option value="INACTIVA">Inactivas</option>
            </select>

            {/* State Filter */}
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              {availableStates.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="status-asc">Estado (Pendientes primero)</option>
              <option value="nombre-asc">Nombre (A-Z)</option>
              <option value="nombre-desc">Nombre (Z-A)</option>
              <option value="createdAt-desc">Más recientes</option>
              <option value="createdAt-asc">Más antiguos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Institutions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institución
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsable
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuarios
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {institutions.map((institution) => (
                  <tr key={institution.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{institution.nombre}</div>
                        <div className="text-sm text-gray-500">
                          {institution.codigo} • {institution.tipoInstitucion}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{institution.responsableNombre}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {institution.responsableEmail}
                        </div>
                        {institution.responsableTelefono && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {institution.responsableTelefono}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {institution.ciudad}, {institution.estado}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={institution.status} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{institution.totalUsuarios || 0} total</div>
                        <div className="text-gray-500">
                          {institution.admins || 0} admin • {institution.psicologos || 0} psic
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(institution.createdAt)}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <ActionButton
                          institution={institution}
                          action="view"
                          icon={Eye}
                          label="Ver"
                          variant="default"
                          onClick={() => handleViewDetails(institution.id)}
                        />

                        {institution.status === 'PENDIENTE_APROBACION' && (
                          <ActionButton
                            institution={institution}
                            action="approve"
                            icon={CheckCircle}
                            label="Aprobar"
                            variant="success"
                            onClick={() => handleStatusAction(institution.id, 'approve')}
                          />
                        )}

                        {institution.status === 'ACTIVA' && (
                          <ActionButton
                            institution={institution}
                            action="suspend"
                            icon={XCircle}
                            label="Suspender"
                            variant="danger"
                            onClick={() => {
                              const reason = prompt('Razón de suspensión:');
                              if (reason) {
                                handleStatusAction(institution.id, 'suspend', { razon: reason, temporal: true });
                              }
                            }}
                          />
                        )}

                        {institution.status === 'SUSPENDIDA' && (
                          <ActionButton
                            institution={institution}
                            action="reactivate"
                            icon={RefreshCw}
                            label="Reactivar"
                            variant="success"
                            onClick={() => handleStatusAction(institution.id, 'reactivate')}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {institutions.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron instituciones</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-700">
                Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} instituciones
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                <span className="px-3 py-1 text-sm">
                  Página {pagination.page} de {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedInstitution && (
        <InstitutionDetailModal
          institution={selectedInstitution}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInstitution(null);
          }}
          onStatusChange={(institutionId, action, data) => {
            handleStatusAction(institutionId, action, data);
            setShowDetailModal(false);
            setSelectedInstitution(null);
          }}
        />
      )}
    </div>
  );
};

export default InstitutionManagement;