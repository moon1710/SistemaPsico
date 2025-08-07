import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "../components/ui/Card";
import {
  Users,
  Brain,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Heart,
  BookOpen,
  FileText,
} from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();

  // Función para obtener el saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  // Función para obtener el color del rol
  const getRoleColor = () => {
    const colors = {
      SUPER_ADMIN_NACIONAL: "from-purple-500 to-purple-700",
      SUPER_ADMIN_INSTITUCION: "from-blue-500 to-blue-700",
      PSICOLOGO: "from-green-500 to-green-700",
      ESTUDIANTE: "from-orange-500 to-orange-700",
      ORIENTADOR: "from-indigo-500 to-indigo-700",
    };
    return colors[user?.rol] || "from-gray-500 to-gray-700";
  };

  // Componente de tarjeta de estadística
  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-xs text-green-600 mt-1">
                ↗ +{trend}% este mes
              </p>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Renderizar contenido según el rol
  const renderRoleContent = () => {
    switch (user?.rol) {
      case "SUPER_ADMIN_NACIONAL":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Instituciones Activas"
                value="24"
                icon={Users}
                color="bg-blue-500"
                trend="8"
              />
              <StatCard
                title="Usuarios Totales"
                value="1,248"
                icon={Users}
                color="bg-green-500"
                trend="12"
              />
              <StatCard
                title="Evaluaciones Realizadas"
                value="3,456"
                icon={FileText}
                color="bg-purple-500"
                trend="15"
              />
              <StatCard
                title="Casos Activos"
                value="89"
                icon={AlertCircle}
                color="bg-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Instituciones por Región
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Centro</span>
                      <span className="font-medium">8 instituciones</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Norte</span>
                      <span className="font-medium">6 instituciones</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sur</span>
                      <span className="font-medium">10 instituciones</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Actividad Reciente
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">
                        Nueva institución registrada
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Reporte mensual generado</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Actualización del sistema</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );

      case "SUPER_ADMIN_INSTITUCION":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Psicólogos Activos"
                value="8"
                icon={Brain}
                color="bg-green-500"
              />
              <StatCard
                title="Estudiantes Registrados"
                value="1,245"
                icon={Users}
                color="bg-blue-500"
                trend="5"
              />
              <StatCard
                title="Evaluaciones este Mes"
                value="156"
                icon={FileText}
                color="bg-purple-500"
                trend="23"
              />
              <StatCard
                title="Citas Programadas"
                value="34"
                icon={Calendar}
                color="bg-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Estado de Módulos
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Módulo Psicológico</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Activo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Evaluaciones</span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Activo
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Citas</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        Configurando
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Últimas Acciones
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Psicólogo registrado</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Evaluación pendiente</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">10 estudiantes nuevos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );

      case "PSICOLOGO":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Estudiantes Asignados"
                value="42"
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Evaluaciones Pendientes"
                value="8"
                icon={FileText}
                color="bg-orange-500"
              />
              <StatCard
                title="Citas Esta Semana"
                value="12"
                icon={Calendar}
                color="bg-green-500"
              />
              <StatCard
                title="Casos Canalizados"
                value="5"
                icon={Heart}
                color="bg-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Próximas Citas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Ana García</p>
                        <p className="text-sm text-gray-600">Seguimiento</p>
                      </div>
                      <span className="text-sm text-gray-500">14:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Carlos López</p>
                        <p className="text-sm text-gray-600">
                          Primera consulta
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">15:30</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Casos Prioritarios
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm">2 casos de alto riesgo</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">3 seguimientos pendientes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );

      case "ESTUDIANTE":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Evaluaciones Completadas"
                value="3"
                icon={CheckCircle}
                color="bg-green-500"
              />
              <StatCard
                title="Próximas Citas"
                value="1"
                icon={Calendar}
                color="bg-blue-500"
              />
              <StatCard
                title="Recomendaciones"
                value="5"
                icon={BookOpen}
                color="bg-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Tu Bienestar</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Estado general: Bueno</p>
                        <p className="text-sm text-gray-600">
                          Última evaluación: Hace 2 semanas
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Recursos Recomendados
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-900">
                        Técnicas de Relajación
                      </p>
                      <p className="text-sm text-blue-700">
                        Ejercicios para reducir el estrés
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-900">
                        Gestión del Tiempo
                      </p>
                      <p className="text-sm text-green-700">
                        Estrategias de organización
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );

      default:
        return (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bienvenido al Sistema
            </h3>
            <p className="text-gray-600">
              Tu dashboard se está configurando...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {user?.nombre}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.institucionNombre && `${user.institucionNombre} • `}
              {user?.rol === "SUPER_ADMIN_NACIONAL"
                ? "Sistema Nacional"
                : user?.rol === "SUPER_ADMIN_INSTITUCION"
                ? "Administrador de Institución"
                : user?.rol === "PSICOLOGO"
                ? "Psicólogo"
                : user?.rol === "ESTUDIANTE"
                ? "Estudiante"
                : user?.rol === "ORIENTADOR"
                ? "Orientador"
                : "Usuario"}
            </p>
          </div>
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center shadow-lg`}
          >
            <span className="text-white text-xl font-bold">
              {user?.nombre?.charAt(0) || "U"}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido específico por rol */}
      {renderRoleContent()}
    </div>
  );
};

export default DashboardPage;
