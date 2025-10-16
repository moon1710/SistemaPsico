import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import { ROUTES } from "../../utils/constants";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react";

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const getRoleColor = (role) => {
    const colors = {
      SUPER_ADMIN_NACIONAL: "bg-purple-100 text-purple-800",
      SUPER_ADMIN_INSTITUCION: "bg-blue-100 text-blue-800",
      PSICOLOGO: "bg-green-100 text-green-800",
      ESTUDIANTE: "bg-orange-100 text-orange-800",
      ORIENTADOR: "bg-indigo-100 text-indigo-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleLabel = (role) => {
    const labels = {
      SUPER_ADMIN_NACIONAL: "Super Admin Nacional",
      SUPER_ADMIN_INSTITUCION: "Admin Institución",
      PSICOLOGO: "Psicólogo",
      ESTUDIANTE: "Estudiante",
      ORIENTADOR: "Orientador",
    };
    return labels[role] || role;
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left side - Logo y hamburger menu */}
        <div className="flex items-center space-x-4">
          {/* Hamburger menu button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          {/* Logo */}
          <Link to={ROUTES.DASHBOARD} className="flex items-center space-x-2">
            <div className="w-9 h-9 flex items-center justify-center">
              <img
                src="/logo.png" // ruta del logo, cambia si está en otra carpeta
                alt="NeuroFlora Logo"
                className="w-9 h-9 object-contain" // tamaño pequeño y proporcional
              />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              NeuroFlora
            </span>
          </Link>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.nombre?.charAt(0) || "U"}
                </span>
              </div>

              {/* User info - hidden on mobile */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.nombreCompleto || "Usuario"}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getRoleColor(
                      user?.rol
                    )}`}
                  >
                    {getRoleLabel(user?.rol)}
                  </span>
                </div>
              </div>

              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User info (shown on mobile) */}
                <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                  <p className="font-medium text-gray-900">
                    {user?.nombreCompleto}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${getRoleColor(
                      user?.rol
                    )}`}
                  >
                    {getRoleLabel(user?.rol)}
                  </span>
                </div>

                {/* Menu items */}
                <Link
                  to={ROUTES.PROFILE}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Mi Perfil</span>
                </Link>
                {/*
                <Link
                  to={ROUTES.CONFIGURATION}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Configuración</span>
                </Link>
 */}

                <hr className="my-2" />

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;
