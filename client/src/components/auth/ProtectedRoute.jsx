import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/constants";

// Componente de loading mientras se verifica la autenticación
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Verificando autenticación...</p>
    </div>
  </div>
);

/**
 * Componente para proteger rutas que requieren autenticación
 */
const ProtectedRoute = ({
  children,
  requiredRoles = null,
  fallbackPath = ROUTES.LOGIN,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Si se especificaron roles requeridos, verificar que el usuario los tenga
  if (requiredRoles && requiredRoles.length > 0) {
    // Verificar rol global
    const hasGlobalRole = requiredRoles.includes(user?.rol);

    // Verificar roles en instituciones
    const hasInstitutionRole = user?.instituciones?.some(institution =>
      requiredRoles.includes(institution.rol)
    );

    // El usuario debe tener al menos uno de los roles requeridos (global o por institución)
    if (!hasGlobalRole && !hasInstitutionRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-4">No tienes permisos para acceder a esta sección.</p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Regresar
            </button>
          </div>
        </div>
      );
    }
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
};

/**
 * Componente para rutas que solo pueden acceder usuarios NO autenticados (como login)
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Si no está autenticado, mostrar la ruta pública
  return children;
};

/**
 * Componente para verificar acceso a institución específica
 */
const InstitutionProtectedRoute = ({
  children,
  requireInstitutionAccess = true,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  // Extraer institucionId de los parámetros de la URL
  const pathSegments = location.pathname.split("/");
  const institucionIdFromPath = pathSegments.find(
    (segment, index) => pathSegments[index - 1] === "institucion"
  );

  if (requireInstitutionAccess && institucionIdFromPath) {
    const institucionId = parseInt(institucionIdFromPath);

    // Super Admin Nacional puede acceder a cualquier institución
    if (user?.rol === "SUPER_ADMIN_NACIONAL") {
      return children;
    }

    // Otros usuarios solo pueden acceder a su propia institución
    if (user?.institucionId !== institucionId) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Acceso Denegado
            </h2>
            <p className="text-gray-600 mb-4">
              No tienes permisos para acceder a esta institución.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Regresar
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
};

/**
 * HOC para crear rutas protegidas específicas por rol
 */
const createRoleProtectedRoute = (allowedRoles) => {
  return ({ children }) => (
    <ProtectedRoute requiredRoles={allowedRoles}>{children}</ProtectedRoute>
  );
};

// Rutas protegidas específicas por rol
export const SuperAdminNacionalRoute = createRoleProtectedRoute([
  "SUPER_ADMIN_NACIONAL",
]);
export const SuperAdminInstitucionRoute = createRoleProtectedRoute([
  "SUPER_ADMIN_NACIONAL",
  "SUPER_ADMIN_INSTITUCION",
]);
export const PsicologoRoute = createRoleProtectedRoute([
  "SUPER_ADMIN_NACIONAL",
  "SUPER_ADMIN_INSTITUCION",
  "PSICOLOGO",
]);
export const EstudianteRoute = createRoleProtectedRoute(["ESTUDIANTE"]);
export const OrientadorRoute = createRoleProtectedRoute(["ORIENTADOR"]);

// Rutas combinadas (psicólogos + admins)
export const PsychologyStaffRoute = createRoleProtectedRoute([
  "SUPER_ADMIN_NACIONAL",
  "SUPER_ADMIN_INSTITUCION",
  "PSICOLOGO",
  "ORIENTADOR",
]);

export { ProtectedRoute, PublicOnlyRoute, InstitutionProtectedRoute };
export default ProtectedRoute;
