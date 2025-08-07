import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import AdaptiveSidebar from "./AdaptiveSidebar";
import Header from "./Header";
import { ROUTES } from "../../utils/constants";

const Layout = ({ children }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(true); // Contraído por defecto como tu diseño
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar autenticación
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate(ROUTES.LOGIN);
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, no renderizar nada
  if (!user) return null;

  // Verificar si estamos en una página que no necesita layout (como login)
  const noLayoutRoutes = [ROUTES.LOGIN, "/"];
  const shouldShowLayout = !noLayoutRoutes.includes(location.pathname);

  if (!shouldShowLayout) {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      {/* Sidebar adaptativo según rol */}
      <AdaptiveSidebar
        user={user}
        onLogout={handleLogout}
        isCollapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header opcional - puedes comentar si no lo quieres */}
        <Header
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
          isSidebarOpen={!collapsed}
        />

        {/* Main content */}
        <main
          className={`
          flex-1 transition-all duration-500 ease-in-out
          ${collapsed ? "lg:ml-0" : "lg:ml-0"}
          p-6
        `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
