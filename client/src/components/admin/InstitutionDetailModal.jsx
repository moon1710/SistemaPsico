import React, { useState } from 'react';
import {
  X,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Settings,
  UserCheck,
  GraduationCap,
  Shield,
  Edit,
  Save
} from 'lucide-react';

const STATUS_COLORS = {
  PENDIENTE_APROBACION: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: AlertTriangle,
    label: 'Pendiente de Aprobación'
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

const USER_ROLE_COLORS = {
  ADMIN_INSTITUCION: 'bg-purple-100 text-purple-800',
  PSICOLOGO: 'bg-blue-100 text-blue-800',
  ORIENTADOR: 'bg-green-100 text-green-800',
  ESTUDIANTE: 'bg-gray-100 text-gray-800'
};

const USER_ROLE_LABELS = {
  ADMIN_INSTITUCION: 'Admin Institución',
  PSICOLOGO: 'Psicólogo',
  ORIENTADOR: 'Orientador',
  ESTUDIANTE: 'Estudiante'
};

const USER_STATUS_COLORS = {
  ACTIVO: 'bg-green-100 text-green-800',
  INACTIVO: 'bg-gray-100 text-gray-800',
  BLOQUEADO: 'bg-red-100 text-red-800',
  PENDIENTE: 'bg-yellow-100 text-yellow-800'
};

const InstitutionDetailModal = ({ institution, onClose, onStatusChange }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nombre: institution.institution.nombre,
    nombreCorto: institution.institution.nombreCorto,
    telefono: institution.institution.telefono || '',
    emailInstitucional: institution.institution.emailInstitucional || '',
    responsableNombre: institution.institution.responsableNombre,
    responsableEmail: institution.institution.responsableEmail,
    responsableTelefono: institution.institution.responsableTelefono || '',
    responsableCargo: institution.institution.responsableCargo || '',
    maxUsuarios: institution.institution.maxUsuarios || 1000
  });
  const [saving, setSaving] = useState(false);

  const inst = institution.institution;
  const statusConfig = STATUS_COLORS[inst.status] || STATUS_COLORS.INACTIVA;
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      const response = await fetch(`/api/institutions/${inst.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editData)
      });

      const result = await response.json();

      if (result.success) {
        alert('Institución actualizada exitosamente');
        setIsEditing(false);
        // Optionally refresh the modal data
        window.location.reload(); // Simple refresh for now
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error('Error updating institution:', err);
      alert('Error al actualizar la institución: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const ActionButton = ({ action, icon: Icon, label, variant, onClick, disabled = false }) => {
    const variantClasses = {
      success: 'bg-green-500 hover:bg-green-600 text-white',
      danger: 'bg-red-500 hover:bg-red-600 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      primary: 'bg-blue-500 hover:bg-blue-600 text-white'
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
          transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant] || variantClasses.primary}
        `}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    );
  };

  const InfoRow = ({ icon: Icon, label, value, editable = false, field = null, type = 'text' }) => {
    const isEditingField = isEditing && editable;

    return (
      <div className="flex items-start gap-3 py-2">
        <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          {isEditingField ? (
            type === 'number' ? (
              <input
                type="number"
                value={editData[field]}
                onChange={(e) => setEditData(prev => ({ ...prev, [field]: parseInt(e.target.value) || 0 }))}
                className="mt-1 w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <input
                type={type}
                value={editData[field]}
                onChange={(e) => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
                className="mt-1 w-full px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )
          ) : (
            <p className="text-sm text-gray-900">{value || 'N/A'}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-4">
              <Building className="h-8 w-8 text-blue-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{inst.nombre}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </span>
                  <span className="text-sm text-gray-500">{inst.codigo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Editar información"
                >
                  <Edit className="h-5 w-5" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditData({
                        nombre: inst.nombre,
                        nombreCorto: inst.nombreCorto,
                        telefono: inst.telefono || '',
                        emailInstitucional: inst.emailInstitucional || '',
                        responsableNombre: inst.responsableNombre,
                        responsableEmail: inst.responsableEmail,
                        responsableTelefono: inst.responsableTelefono || '',
                        responsableCargo: inst.responsableCargo || '',
                        maxUsuarios: inst.maxUsuarios || 1000
                      });
                    }}
                    className="px-3 py-1 text-gray-600 text-sm border rounded hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <nav className="flex">
              {[
                { id: 'info', label: 'Información', icon: Building },
                { id: 'users', label: `Usuarios (${institution.users?.length || 0})`, icon: Users },
                { id: 'carreras', label: `Carreras (${institution.carreras?.length || 0})`, icon: GraduationCap },
                { id: 'history', label: 'Historial', icon: Clock }
              ].map(tab => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <TabIcon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Institution Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Información de la Institución</h3>
                  <div className="space-y-2">
                    <InfoRow
                      icon={Building}
                      label="Nombre Completo"
                      value={inst.nombre}
                      editable={true}
                      field="nombre"
                    />
                    <InfoRow
                      icon={Building}
                      label="Nombre Corto"
                      value={inst.nombreCorto}
                      editable={true}
                      field="nombreCorto"
                    />
                    <InfoRow icon={Settings} label="Tipo" value={inst.tipoInstitucion} />
                    <InfoRow icon={GraduationCap} label="Nivel Educativo" value={inst.nivelEducativo} />
                    <InfoRow icon={MapPin} label="Ubicación" value={`${inst.ciudad}, ${inst.estado} ${inst.codigoPostal || ''}`} />
                    <InfoRow
                      icon={Phone}
                      label="Teléfono"
                      value={inst.telefono}
                      editable={true}
                      field="telefono"
                      type="tel"
                    />
                    <InfoRow
                      icon={Mail}
                      label="Email Institucional"
                      value={inst.emailInstitucional}
                      editable={true}
                      field="emailInstitucional"
                      type="email"
                    />
                    <InfoRow
                      icon={Users}
                      label="Límite de Usuarios"
                      value={inst.maxUsuarios}
                      editable={true}
                      field="maxUsuarios"
                      type="number"
                    />
                  </div>
                </div>

                {/* Responsible Person Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Responsable Institucional</h3>
                  <div className="space-y-2">
                    <InfoRow
                      icon={User}
                      label="Nombre Completo"
                      value={inst.responsableNombre}
                      editable={true}
                      field="responsableNombre"
                    />
                    <InfoRow
                      icon={UserCheck}
                      label="Cargo"
                      value={inst.responsableCargo}
                      editable={true}
                      field="responsableCargo"
                    />
                    <InfoRow
                      icon={Mail}
                      label="Email"
                      value={inst.responsableEmail}
                      editable={true}
                      field="responsableEmail"
                      type="email"
                    />
                    <InfoRow
                      icon={Phone}
                      label="Teléfono"
                      value={inst.responsableTelefono}
                      editable={true}
                      field="responsableTelefono"
                      type="tel"
                    />
                  </div>

                  {/* Dates & Stats */}
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Fechas Importantes</h4>
                    <div className="space-y-2">
                      <InfoRow icon={Calendar} label="Fecha de Registro" value={formatDate(inst.createdAt)} />
                      <InfoRow icon={Calendar} label="Última Actualización" value={formatDate(inst.updatedAt)} />
                      {inst.fechaActivacion && (
                        <InfoRow icon={CheckCircle} label="Fecha de Activación" value={formatDate(inst.fechaActivacion)} />
                      )}
                      {inst.fechaVencimiento && (
                        <InfoRow icon={AlertTriangle} label="Fecha de Vencimiento" value={formatDate(inst.fechaVencimiento)} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Usuarios Registrados</h3>
                  <div className="text-sm text-gray-600">
                    Total: {institution.users?.length || 0} usuarios
                  </div>
                </div>

                {institution.users && institution.users.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Acceso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {institution.users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {user.nombre} {user.apellidoPaterno} {user.apellidoMaterno}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                {user.matricula && (
                                  <div className="text-xs text-gray-400">Mat: {user.matricula}</div>
                                )}
                                {user.numeroEmpleado && (
                                  <div className="text-xs text-gray-400">Emp: {user.numeroEmpleado}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${USER_ROLE_COLORS[user.rol] || 'bg-gray-100 text-gray-800'}`}>
                                {USER_ROLE_LABELS[user.rol] || user.rol}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${USER_STATUS_COLORS[user.status] || 'bg-gray-100 text-gray-800'}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    No hay usuarios registrados en esta institución
                  </div>
                )}
              </div>
            )}

            {activeTab === 'carreras' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Carreras Disponibles</h3>
                  <div className="text-sm text-gray-600">
                    Total: {institution.carreras?.length || 0} carreras
                  </div>
                </div>

                {institution.carreras && institution.carreras.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {institution.carreras.map((carrera) => (
                      <div key={carrera.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{carrera.nombre}</h4>
                            <p className="text-sm text-gray-600">{carrera.codigo}</p>
                            {carrera.areaConocimiento && (
                              <p className="text-xs text-gray-500 mt-1">{carrera.areaConocimiento}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${carrera.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {carrera.activa ? 'Activa' : 'Inactiva'}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {carrera.estudiantes || 0} estudiantes
                            </div>
                          </div>
                        </div>
                        {carrera.duracionSemestres && (
                          <div className="mt-2 text-sm text-gray-600">
                            Duración: {carrera.duracionSemestres} semestres
                          </div>
                        )}
                        {carrera.modalidad && (
                          <div className="text-sm text-gray-600">
                            Modalidad: {carrera.modalidad}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    No hay carreras registradas en esta institución
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Actividades</h3>

                {institution.history && institution.history.length > 0 ? (
                  <div className="space-y-4">
                    {institution.history.map((entry, index) => (
                      <div key={entry.id || index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                entry.historyStatus === 'APROBADA' ? 'bg-green-100 text-green-800' :
                                entry.historyStatus === 'RECHAZADA' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {entry.historyStatus}
                              </span>
                              <span className="text-sm text-gray-600">{formatDate(entry.createdAt)}</span>
                            </div>
                            {entry.notasAdmin && (
                              <p className="text-sm text-gray-900 mt-2">{entry.notasAdmin}</p>
                            )}
                            {entry.motivoRechazo && (
                              <p className="text-sm text-red-600 mt-2">Motivo de rechazo: {entry.motivoRechazo}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    No hay historial disponible
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            {inst.status === 'PENDIENTE_APROBACION' && (
              <ActionButton
                action="approve"
                icon={CheckCircle}
                label="Aprobar Institución"
                variant="success"
                onClick={() => onStatusChange(inst.id, 'approve', {})}
              />
            )}

            {inst.status === 'ACTIVA' && (
              <ActionButton
                action="suspend"
                icon={XCircle}
                label="Suspender Institución"
                variant="danger"
                onClick={() => {
                  const reason = prompt('Razón de suspensión:');
                  if (reason) {
                    onStatusChange(inst.id, 'suspend', { razon: reason, temporal: true });
                  }
                }}
              />
            )}

            {inst.status === 'SUSPENDIDA' && (
              <ActionButton
                action="reactivate"
                icon={RefreshCw}
                label="Reactivar Institución"
                variant="success"
                onClick={() => onStatusChange(inst.id, 'reactivate', {})}
              />
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetailModal;