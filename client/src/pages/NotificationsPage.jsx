import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Bell,
  Check,
  X,
  Calendar,
  FileText,
  User,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  MoreVertical,
  Filter,
  Search,
  Gift,
  Loader
} from 'lucide-react';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  notificationTypeMap,
  priorityMap,
  formatTimestamp
} from '../services/notificationsService';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pagina: 1,
    limite: 50,
    total: 0,
    totalPaginas: 0
  });

  // Cargar notificaciones desde la API
  const loadNotifications = async (resetPagina = false) => {
    try {
      setLoading(true);
      const params = {
        limite: pagination.limite,
        pagina: resetPagina ? 1 : pagination.pagina
      };

      if (filter !== 'all') {
        if (filter === 'unread') {
          params.leida = false;
        } else {
          params.tipo = filter;
        }
      }

      const response = await getNotifications(params);

      if (resetPagina) {
        setNotifications(response.data.notificaciones);
        setPagination({
          ...pagination,
          pagina: 1,
          total: response.data.total,
          totalPaginas: response.data.totalPaginas
        });
      } else {
        setNotifications(prev => [...prev, ...response.data.notificaciones]);
        setPagination({
          ...pagination,
          total: response.data.total,
          totalPaginas: response.data.totalPaginas
        });
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications(true);
  }, [filter]);

  useEffect(() => {
    if (pagination.pagina > 1) {
      loadNotifications();
    }
  }, [pagination.pagina]);

  const getNotificationIcon = (tipo) => {
    const iconMap = {
      cita: Calendar,
      evaluacion: FileText,
      mensaje: User,
      sistema: AlertCircle,
      bienvenida: Gift
    };
    const IconComponent = iconMap[tipo] || Bell;
    return <IconComponent className="w-5 h-5" />;
  };

  const getPriorityColor = (prioridad) => {
    return priorityMap[prioridad] || priorityMap.media;
  };

  const getTypeLabel = (tipo) => {
    return notificationTypeMap[tipo]?.label || 'General';
  };

  const getTypeColor = (tipo) => {
    return notificationTypeMap[tipo]?.color || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.mensaje.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(notification =>
        notification.id === id ? { ...notification, leida: true, fechaLectura: new Date() } : notification
      ));
    } catch (error) {
      console.error('Error marcando como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        leida: true,
        fechaLectura: new Date()
      })));
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      setSelectedNotifications(prev => prev.filter(nId => nId !== id));
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  const deleteSelected = async () => {
    try {
      await Promise.all(
        selectedNotifications.map(id => deleteNotification(id))
      );
      setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Error eliminando notificaciones seleccionadas:', error);
    }
  };

  const toggleSelection = (id) => {
    setSelectedNotifications(prev =>
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const visibleIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(visibleIds);
  };

  const unselectAll = () => {
    setSelectedNotifications([]);
  };

  const loadMore = () => {
    if (pagination.pagina < pagination.totalPaginas && !loading) {
      setPagination(prev => ({ ...prev, pagina: prev.pagina + 1 }));
    }
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Bell className="w-8 h-8 mr-3 text-blue-600" />
                Notificaciones
                {unreadCount > 0 && (
                  <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-gray-600">Mantente al día con las últimas actualizaciones</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Marcar todas como leídas
              </button>
            )}
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Búsqueda */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar notificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtros */}
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todas</option>
                <option value="unread">No leídas</option>
                <option value="cita">Citas</option>
                <option value="evaluacion">Evaluaciones</option>
                <option value="mensaje">Mensajes</option>
                <option value="sistema">Sistema</option>
                <option value="bienvenida">Bienvenida</option>
              </select>
            </div>
          </div>

          {/* Acciones en lote */}
          {selectedNotifications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedNotifications.length} notificaciones seleccionadas
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={unselectAll}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Deseleccionar
                </button>
                <button
                  onClick={deleteSelected}
                  className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de notificaciones */}
        <div className="space-y-4">
          {loading && filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Loader className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Cargando notificaciones...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
              <p className="text-gray-600">
                {filter === 'all' ? 'No tienes notificaciones en este momento.' : `No hay notificaciones de tipo "${getTypeLabel(filter)}".`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                  notification.leida ? 'border-gray-200' : 'border-blue-200 bg-blue-50/30'
                } ${selectedNotifications.includes(notification.id) ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Checkbox de selección */}
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => toggleSelection(notification.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    {/* Ícono de tipo */}
                    <div className={`flex-shrink-0 p-2 rounded-full ${getPriorityColor(notification.prioridad)}`}>
                      {getNotificationIcon(notification.tipo)}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-sm font-medium ${notification.leida ? 'text-gray-900' : 'text-gray-900 font-semibold'}`}>
                              {notification.titulo}
                            </h3>
                            {!notification.leida && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.mensaje}</p>
                          <div className="flex items-center space-x-4">
                            <span className="text-xs text-gray-500">{formatTimestamp(notification.fechaCreacion)}</span>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(notification.tipo)}`}>
                              {getTypeLabel(notification.tipo)}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(notification.prioridad)}`}>
                              {notification.prioridad}
                            </span>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center space-x-2 ml-4">
                          {notification.acciones && notification.acciones.map((action, index) => (
                            <button
                              key={index}
                              className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            >
                              {action.label}
                            </button>
                          ))}

                          {!notification.leida && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Marcar como leída"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Eliminar notificación"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginación o load more */}
        {pagination.pagina < pagination.totalPaginas && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="inline-flex items-center px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Cargar más notificaciones'
              )}
            </button>
          </div>
        )}

        {filteredNotifications.length > 0 && pagination.pagina >= pagination.totalPaginas && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            Has visto todas las notificaciones
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;