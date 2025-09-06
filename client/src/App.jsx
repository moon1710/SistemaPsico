import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import Layout from "./components/layout/Layout";
import PublicLayout from "./components/layout/PublicLayout";

import ProtectedRoute, {
  PublicOnlyRoute,
} from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

import AboutUsPage from "./pages/AboutUsPage";
import HelpPage from "./pages/HelpPage";
import DocsPage from "./pages/DocsPage";
import TerminosPage from "./pages/TerminosPage";
import PrivacidadPage from "./pages/PrivacidadPage";
import ConfidencialidadPage from "./pages/ConfidencialidadPage";

import { ROUTES } from "./utils/constants";
import "./App.css";

function App() {
  const { isLoading } = useAuth();

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
      {/* Públicas solo para NO autenticados */}
      <Route
        path="/"
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

      {/* Públicas ABIERTAS */}
      <Route
        path={ROUTES.ABOUTUS}
        element={
          <PublicLayout>
            <AboutUsPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.HELP}
        element={
          <PublicLayout>
            <HelpPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.TERMINOS}
        element={
          <PublicLayout>
            <TerminosPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.PRIVACIDAD}
        element={
          <PublicLayout>
            <PrivacidadPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.DOCUMENTACION}
        element={
          <PublicLayout>
            <DocsPage />
          </PublicLayout>
        }
      />
      <Route
        path={ROUTES.CONFINDENCIALIDAD}
        element={
          <PublicLayout>
            <ConfidencialidadPage />
          </PublicLayout>
        }
      />
      {/* Alias opcional correcto */}
      <Route
        path={ROUTES.CONFIDENCIALIDAD_ALIAS}
        element={
          <PublicLayout>
            <ConfidencialidadPage />
          </PublicLayout>
        }
      />

      {/* Protegidas */}
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
    </Routes>
  );
}

export default App;
