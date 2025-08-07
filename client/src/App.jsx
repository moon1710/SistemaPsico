import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layout
import Layout from "./components/layout/Layout";

// Rutas protegidas
import ProtectedRoute, {
  PublicOnlyRoute,
} from "./components/auth/ProtectedRoute";

// Páginas
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

// Constantes
import { ROUTES } from "./utils/constants";
import "./App.css";

function App() {
  const { isLoading } = useAuth();

  // Mostrar loading global mientras se inicializa la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rutas públicas (sin layout) */}
      <Route
        path="/" // Changed from {ROUTES.LANDING} to a hardcoded path
        element={
          <PublicOnlyRoute>
            <LandingPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      {/* Rutas protegidas (con layout) */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Si necesitas una página para el layout sin contenido específico,
        puedes usar esta estructura.
        <Route
          path="/ejemplo-layout"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Página de ejemplo</h1>
                  <p className="text-gray-600 mt-2">
                    Esta es una página de ejemplo para probar el layout.
                  </p>
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
      */}
    </Routes>
  );
}

export default App;
