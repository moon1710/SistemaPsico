import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { API_CONFIG } from "../../utils/constants";

/**
 * Statuses de solicitudes:
 * PENDIENTE | EN_REVISION | APROBADA | RECHAZADA
 */
const STATUS_COLORS = {
  PENDIENTE: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    icon: AlertTriangle,
    label: "Pendiente",
  },
  EN_REVISION: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: RefreshCw,
    label: "En revisión",
  },
  APROBADA: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: CheckCircle,
    label: "Aprobada",
  },
  RECHAZADA: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: XCircle,
    label: "Rechazada",
  },
};

const SolicitudesManagement = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    pendientes: 0,
    enRevision: 0,
    aprobadas: 0,
    rechazadas: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "status",
    sortOrder: "asc",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const depsKey = useMemo(
    () =>
      JSON.stringify({
        filters,
        page: pagination.page,
        limit: pagination.limit,
      }),
    [filters, pagination.page, pagination.limit]
  );

  useEffect(() => {
    loadSolicitudes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsKey]);

  const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("authToken:v1");

  const loadSolicitudes = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: String(pagination.page),
        limit: String(pagination.limit),
        search: filters.search || "",
        status: filters.status || "",
        sortBy: filters.sortBy || "status",
        sortOrder: filters.sortOrder || "asc",
      });

      const token = getToken();
      const apiUrl = `${
        API_CONFIG.API_BASE
      }/admin/solicitudes?${queryParams.toString()}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Error al cargar solicitudes: ${response.status} ${text}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "No se pudo cargar solicitudes");
      }

      setSolicitudes(data.data.solicitudes || []);
      setPagination((prev) => ({
        ...prev,
        total: data.data.pagination?.total || 0,
        totalPages: data.data.pagination?.totalPages || 0,
      }));
      setStats(data.data.stats || {});
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e) => handleFilterChange("search", e.target.value);

  const StatusBadge = ({ status }) => {
    const config = STATUS_COLORS[status] || STATUS_COLORS.PENDIENTE;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
      >
        <Icon className={`h-3 w-3 ${status === "EN_REVISION" ? "" : ""}`} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Acciones:
   * - aprobar: POST /api/admin/solicitudes/:id/aprobar
   * - rechazar: POST /api/admin/solicitudes/:id/rechazar
   * - revision: POST /api/admin/solicitudes/:id/revision
   */
  const handleSolicitudAction = async (solicitudId, action, payload = {}) => {
    try {
      setActionLoading(solicitudId);

      const token = getToken();
      const url = `${API_CONFIG.API_BASE}/admin/solicitudes/${solicitudId}/${action}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Acción fallida");
      }

      await loadSolicitudes();

      const msg =
        action === "aprobar"
          ? "Solicitud aprobada y institución creada ✅"
          : action === "rechazar"
          ? "Solicitud rechazada ✅"
          : "Solicitud puesta en revisión ✅";

      alert(msg);
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error("Solicitud action error:", { status, data, err });

      const serverMsg =
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : null) ||
        err?.message ||
        "Error desconocido";

      throw new Error(`(${status ?? "NO_STATUS"}) ${serverMsg}`);
    }
  };

  const ActionButton = ({
    solicitud,
    label,
    icon: Icon,
    variant = "default",
    onClick,
  }) => {
    const isLoading = actionLoading === solicitud.id;

    const variantClasses = {
      default: "bg-blue-500 hover:bg-blue-600 text-white",
      success: "bg-green-500 hover:bg-green-600 text-white",
      warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
      danger: "bg-red-500 hover:bg-red-600 text-white",
      info: "bg-slate-700 hover:bg-slate-800 text-white",
    };

    return (
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md
          transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
        `}
        title={label}
      >
        <Icon className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
        {label}
      </button>
    );
  };

  // “Ver” básico (sin modal): muestra un resumen rápido
  const handleView = (s) => {
    const lines = [
      `Institución: ${s.institucionNombre || "N/A"}`,
      `Clave: ${s.cedulaProfesional || "N/A"}`,
      `Responsable: ${[s.nombre, s.apellidoPaterno, s.apellidoMaterno]
        .filter(Boolean)
        .join(" ")}`,
      `Email: ${s.email || "N/A"}`,
      `Cargo: ${s.cargoInstitucion || "N/A"}`,
      `Ubicación: ${
        [s.institucionCiudad, s.institucionEstado].filter(Boolean).join(", ") ||
        "N/A"
      }`,
      `Status: ${s.status}`,
      `Motivo: ${s.motivoSolicitud || "N/A"}`,
    ];
    alert(lines.join("\n"));
  };

  if (loading && solicitudes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Cargando solicitudes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-slate-700" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendientes || 0}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En revisión</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.enRevision || 0}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.aprobadas || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rechazadas</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rechazadas || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por institución, responsable, email, ciudad..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="EN_REVISION">En revisión</option>
              <option value="APROBADA">Aprobadas</option>
              <option value="RECHAZADA">Rechazadas</option>
            </select>

            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="status-asc">Estado (Pendientes primero)</option>
              <option value="createdAt-desc">Más recientes</option>
              <option value="createdAt-asc">Más antiguos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitud / Institución
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
                    Fecha
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {solicitudes.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {s.institucionNombre || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {s.cedulaProfesional || "—"} •{" "}
                          {s.institucionTipo || "—"} •{" "}
                          {s.institucionNivel || "—"}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {[s.nombre, s.apellidoPaterno, s.apellidoMaterno]
                            .filter(Boolean)
                            .join(" ")}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {s.email || "N/A"}
                        </div>
                        {s.telefono && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {s.telefono}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {[s.institucionCiudad, s.institucionEstado]
                          .filter(Boolean)
                          .join(", ") || "N/A"}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={s.status} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(s.createdAt)}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <ActionButton
                          solicitud={s}
                          icon={Eye}
                          label="Ver"
                          variant="info"
                          onClick={() => handleView(s)}
                        />

                        {/* Poner en revisión */}
                        {s.status === "PENDIENTE" && (
                          <ActionButton
                            solicitud={s}
                            icon={RefreshCw}
                            label="Revisar"
                            variant="warning"
                            onClick={() => {
                              const notasAdmin = prompt(
                                "Notas (opcional) para poner en revisión:"
                              );
                              handleSolicitudAction(s.id, "revision", {
                                notasAdmin: notasAdmin || "",
                              });
                            }}
                          />
                        )}

                        {/* Aprobar */}
                        {(s.status === "PENDIENTE" ||
                          s.status === "EN_REVISION") && (
                          <ActionButton
                            solicitud={s}
                            icon={CheckCircle}
                            label="Aprobar"
                            variant="success"
                            onClick={() => {
                              const notasAdmin = prompt(
                                "Notas (opcional) de aprobación:"
                              );
                              handleSolicitudAction(s.id, "aprobar", {
                                notasAdmin: notasAdmin || "",
                              });
                            }}
                          />
                        )}

                        {/* Rechazar */}
                        {(s.status === "PENDIENTE" ||
                          s.status === "EN_REVISION") && (
                          <ActionButton
                            solicitud={s}
                            icon={XCircle}
                            label="Rechazar"
                            variant="danger"
                            onClick={() => {
                              const motivoRechazo = prompt(
                                "Motivo de rechazo (mínimo 10 caracteres):"
                              );
                              if (
                                !motivoRechazo ||
                                motivoRechazo.trim().length < 10
                              ) {
                                alert(
                                  "El motivo de rechazo debe tener al menos 10 caracteres."
                                );
                                return;
                              }
                              const notasAdmin =
                                prompt("Notas internas (opcional):") || "";
                              handleSolicitudAction(s.id, "rechazar", {
                                motivoRechazo,
                                notasAdmin,
                              });
                            }}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {solicitudes.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron solicitudes</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-700">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} a{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                de {pagination.total} solicitudes
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                <span className="px-3 py-1 text-sm">
                  Página {pagination.page} de {pagination.totalPages}
                </span>

                <button
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
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
    </div>
  );
};

export default SolicitudesManagement;
