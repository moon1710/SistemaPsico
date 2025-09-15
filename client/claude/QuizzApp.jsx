{
  /* 
    5. Main Application (QuizApp)

Complete navigation with sidebar and header
User management with roles and permissions
Notification system with real-time alerts
Responsive layout for mobile and desktop
Context-based state management 
*/
}
import React, { useState, useEffect, createContext, useContext } from "react";
import {
  Menu,
  X,
  Home,
  FileText,
  BarChart3,
  Users,
  Settings,
  LogOut,
  User,
  Bell,
  ChevronDown,
  Briefcase,
  Shield,
  Heart,
  Brain,
  BookOpen,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

// Create Context for App State
const AppContext = createContext();

// Custom Hook to use App Context
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

// Mock user data
const mockUser = {
  id: "1",
  name: "Dr. Ana García",
  email: "ana.garcia@universidad.edu",
  role: "PSICOLOGO",
  institution: "Universidad Nacional",
  avatar: null,
  permissions: ["VIEW_RESULTS", "MANAGE_QUIZZES", "VIEW_ANALYTICS"],
};

// Navigation items based on user role
const getNavigationItems = (userRole) => {
  const baseItems = [
    { id: "dashboard", label: "Panel Principal", icon: Home, path: "/" },
    { id: "quizzes", label: "Cuestionarios", icon: FileText, path: "/quizzes" },
  ];

  const adminItems = [
    { id: "results", label: "Resultados", icon: BarChart3, path: "/results" },
    {
      id: "analytics",
      label: "Análisis",
      icon: TrendingUp,
      path: "/analytics",
    },
    { id: "students", label: "Estudiantes", icon: Users, path: "/students" },
  ];

  const superAdminItems = [
    {
      id: "institutions",
      label: "Instituciones",
      icon: Briefcase,
      path: "/institutions",
    },
    { id: "admin", label: "Administración", icon: Shield, path: "/admin" },
  ];

  if (["SUPER_ADMIN_NACIONAL", "SUPER_ADMIN_INSTITUCION"].includes(userRole)) {
    return [...baseItems, ...adminItems, ...superAdminItems];
  }

  if (["ADMIN_INSTITUCION", "PSICOLOGO", "ORIENTADOR"].includes(userRole)) {
    return [...baseItems, ...adminItems];
  }

  return baseItems;
};

// Header Component
const Header = () => {
  const { user, currentView, notifications } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  PsychoEval
                </h1>
                <p className="text-xs text-gray-500">Sistema de Evaluación</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <Bell size={20} />
                {notifications.unread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.unread}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">
                      Notificaciones
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.items.map((notification, index) => (
                      <div
                        key={index}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === "urgent"
                                ? "bg-red-500"
                                : notification.type === "warning"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 text-center">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          {user.institution}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                      <User size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">Mi Perfil</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left">
                      <Settings size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-700">
                        Configuración
                      </span>
                    </button>
                    <hr className="my-2" />
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left text-red-600">
                      <LogOut size={16} />
                      <span className="text-sm">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
const Sidebar = () => {
  const { user, currentView, setCurrentView, sidebarOpen, setSidebarOpen } =
    useApp();
  const navigationItems = getNavigationItems(user.role);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800">PsychoEval</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                  currentView === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Heart className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Bienestar Mental
                  </p>
                  <p className="text-xs text-gray-600">
                    Cuidando la salud estudiantil
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useApp();

  const statsCards = [
    {
      title: "Evaluaciones Hoy",
      value: "12",
      change: "+8%",
      color: "blue",
      icon: FileText,
    },
    {
      title: "Casos Críticos",
      value: "3",
      change: "-2",
      color: "red",
      icon: AlertTriangle,
    },
    {
      title: "Estudiantes Activos",
      value: "156",
      change: "+5%",
      color: "green",
      icon: Users,
    },
    {
      title: "Promedio General",
      value: "18.5",
      change: "+1.2",
      color: "purple",
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    {
      type: "evaluation",
      message: "Nueva evaluación BAI completada",
      student: "Ana García",
      time: "Hace 5 min",
      severity: "MODERADA",
    },
    {
      type: "alert",
      message: "Resultado severo detectado",
      student: "Carlos López",
      time: "Hace 15 min",
      severity: "SEVERA",
    },
    {
      type: "evaluation",
      message: "Evaluación BDI-II completada",
      student: "María Rodríguez",
      time: "Hace 30 min",
      severity: "LEVE",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Bienvenido, {user.name.split(" ")[1]}
            </h2>
            <p className="text-blue-100 mb-4">
              Aquí tienes un resumen de la actividad de hoy
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Hoy:{" "}
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>{user.institution}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <Brain className="w-16 h-16 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 bg-${card.color}-100 rounded-lg flex items-center justify-center`}
              >
                <card.icon className={`w-6 h-6 text-${card.color}-600`} />
              </div>
              <span
                className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  card.change.startsWith("+")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {card.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {card.value}
            </div>
            <div className="text-gray-600 font-medium">{card.title}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            Actividad Reciente
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    activity.severity === "SEVERA"
                      ? "bg-red-500"
                      : activity.severity === "MODERADA"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.message}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estudiante: {activity.student}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-purple-600" />
            Acciones Rápidas
          </h3>
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md text-left">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Nuevo Cuestionario</div>
                  <div className="text-sm opacity-90">
                    Crear evaluación personalizada
                  </div>
                </div>
              </div>
            </button>

            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md text-left">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Ver Reportes</div>
                  <div className="text-sm opacity-90">
                    Análisis detallado de resultados
                  </div>
                </div>
              </div>
            </button>

            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-md text-left">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Gestionar Estudiantes</div>
                  <div className="text-sm opacity-90">
                    Administrar perfiles y seguimiento
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const QuizApp = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user] = useState(mockUser);
  const [notifications] = useState({
    unread: 3,
    items: [
      {
        type: "urgent",
        title: "Resultado Crítico",
        message: "Estudiante con puntuación severa en BAI",
        time: "Hace 10 min",
      },
      {
        type: "warning",
        title: "Revisión Pendiente",
        message: "5 evaluaciones requieren revisión",
        time: "Hace 1 hora",
      },
      {
        type: "info",
        title: "Nuevo Estudiante",
        message: "María González se ha registrado",
        time: "Hace 2 horas",
      },
    ],
  });

  // Mock components for different views
  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "quizzes":
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FileText className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Gestión de Cuestionarios
            </h2>
            <p className="text-gray-600">
              Aquí se cargaría el componente QuizDashboard
            </p>
          </div>
        );
      case "results":
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BarChart3 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Resultados y Análisis
            </h2>
            <p className="text-gray-600">
              Aquí se cargaría el componente QuizResultsViewer
            </p>
          </div>
        );
      case "analytics":
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Análisis Avanzado
            </h2>
            <p className="text-gray-600">Reportes y métricas detalladas</p>
          </div>
        );
      case "students":
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Users className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Gestión de Estudiantes
            </h2>
            <p className="text-gray-600">
              Administración de perfiles estudiantiles
            </p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  const contextValue = {
    user,
    currentView,
    setCurrentView,
    sidebarOpen,
    setSidebarOpen,
    notifications,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Header />

        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Mobile menu button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Menu size={24} className="text-gray-600" />
                </button>
              </div>

              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default QuizApp;
