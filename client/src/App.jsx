import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Importar el provider y componentes del onboarding
import { OnboardingProvider } from "./contexts/OnboardingContext";
import OnboardingModal from "./components/onboarding/OnboardingModal";

import Layout from "./components/layout/Layout";
import PublicLayout from "./components/layout/PublicLayout";

import ProtectedRoute, {
  PublicOnlyRoute,
  PsychologyStaffRoute,
} from "./components/auth/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

//Paginas de Info
import AboutUsPage from "./pages/AboutUsPage";
import HelpPage from "./pages/HelpPage";
import DocsPage from "./pages/DocsPage";
import TerminosPage from "./pages/TerminosPage";
import PrivacidadPage from "./pages/PrivacidadPage";
import ConfidencialidadPage from "./pages/ConfidencialidadPage";

//QuizzesPages
import PublicQuizzesPage from "./pages/quizzes/PublicQuizzesPage";
import TakeQuizPage from "./pages/quizzes/TakeQuizPage";
import MyResultsPage from "./pages/quizzes/MyResultsPage";
import AdminResultsPage from "./pages/quizzes/AdminResultsPage";
import AnalyticsPage from "./pages/quizzes/AnalyticsPage";

//AppointmentPages
import BookAppointmentPage from "./pages/citas/BookAppointmentPage";
import AgendaPage from "./pages/citas/AgendaPage";
import AvailabilityPage from "./pages/citas/AvailabilityPage";
import AppointmentDetailPage from "./pages/citas/AppointmentDetailPage";
import AdminAppointmentsPage from "./pages/citas/AdminAppointmentsPage";

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
    <OnboardingProvider>
      {/* Modal de Onboarding - Se mostrará automáticamente cuando sea la primera vez */}
      <OnboardingModal />
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

      {/* Quizzes (protegidas) */}
      <Route
        path={ROUTES.QUIZ_CONTESTAR}
        element={
          <ProtectedRoute>
            <Layout>
              <PublicQuizzesPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.QUIZ_CONTESTAR_DETALLE}
        element={
          <ProtectedRoute>
            <Layout>
              <TakeQuizPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.MIS_RESULTADOS}
        element={
          <ProtectedRoute>
            <Layout>
              <MyResultsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.QUIZ_RESULTADOS_ADMIN}
        element={
          <ProtectedRoute requiredRoles={['PSICOLOGO', 'ORIENTADOR', 'ADMIN_INSTITUCION', 'SUPER_ADMIN_INSTITUCION', 'SUPER_ADMIN_NACIONAL']}>
            <Layout>
              <AdminResultsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.QUIZ_ANALYTICS_ADMIN}
        element={
          <ProtectedRoute requiredRoles={['PSICOLOGO', 'ORIENTADOR', 'ADMIN_INSTITUCION', 'SUPER_ADMIN_INSTITUCION', 'SUPER_ADMIN_NACIONAL']}>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Appointment Routes */}
      {/* Student - Book Appointment */}
      <Route
        path={ROUTES.AGENDAR_CITA}
        element={
          <ProtectedRoute requiredRoles={['ESTUDIANTE']}>
            <Layout>
              <BookAppointmentPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Appointment Detail - Accessible by students and psychologists */}
      <Route
        path={ROUTES.CITA_DETALLE}
        element={
          <ProtectedRoute requiredRoles={['ESTUDIANTE', 'PSICOLOGO']}>
            <Layout>
              <AppointmentDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Psychologist - Agenda */}
      <Route
        path={ROUTES.AGENDA}
        element={
          <ProtectedRoute requiredRoles={['PSICOLOGO']}>
            <Layout>
              <AgendaPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Psychologist - Availability Configuration */}
      <Route
        path={ROUTES.DISPONIBILIDAD}
        element={
          <ProtectedRoute requiredRoles={['PSICOLOGO']}>
            <Layout>
              <AvailabilityPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin - Appointments Management */}
      <Route
        path={ROUTES.CITAS_ADMIN}
        element={
          <ProtectedRoute requiredRoles={['ADMIN_INSTITUCION', 'SUPER_ADMIN_INSTITUCION', 'SUPER_ADMIN_NACIONAL']}>
            <Layout>
              <AdminAppointmentsPage />
            </Layout>
          </ProtectedRoute>
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
    </OnboardingProvider>
  );
}

export default App;
