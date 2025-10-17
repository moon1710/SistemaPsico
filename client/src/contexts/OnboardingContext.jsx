// client/src/contexts/OnboardingContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding debe usarse dentro de OnboardingProvider");
  }
  return context;
};

export const OnboardingProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Clave para localStorage basada en el usuario
  const getStorageKey = () => {
    return user?.id ? `onboarding_completed_${user.id}` : null;
  };

  // Verificar si es primera vez del usuario
  useEffect(() => {
    if (user?.id) {
      // PRIORIDAD 1: Verificar localStorage (memoria de onboarding completado)
      const storageKey = getStorageKey();
      const onboardingCompletedInStorage = localStorage.getItem(storageKey) === "true";

      // PRIORIDAD 2: Campo perfilCompletado de la BD
      const profileCompleted = user.perfilCompletado === 1 || user.perfilCompletado === true;

      // LÓGICA: Si ya se completó el onboarding (localStorage) O si el perfil está completado, no mostrar
      const shouldHideOnboarding = onboardingCompletedInStorage || profileCompleted;


      if (!shouldHideOnboarding) {
        // Perfil NO completado Y no hay registro en localStorage -> mostrar modal
        setIsFirstTime(true);
        setShowOnboarding(true);
        setOnboardingCompleted(false);
      } else {
        // Perfil completado O ya se completó antes -> no mostrar modal
        setIsFirstTime(false);
        setShowOnboarding(false);
        setOnboardingCompleted(true);

        // Sincronización automática: si la BD dice completado pero localStorage no, actualizar localStorage
        if (profileCompleted && !onboardingCompletedInStorage) {
          localStorage.setItem(storageKey, "true");
        }

        // Si el localStorage dice que está completado pero la BD no, puede ser un caso edge
        if (onboardingCompletedInStorage && !profileCompleted) {
        }
      }
    }
  }, [user?.id, user?.perfilCompletado]);

  // Refrescar datos del usuario desde el servidor
  const refreshUserProfile = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.user) {
          const freshUser = result.data.user;
          setUser(freshUser);

          // También actualizar localStorage
          localStorage.setItem('user_data', JSON.stringify(freshUser));
          return freshUser;
        }
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error.message);
    }
    return null;
  };

  // Limpiar cache de onboarding (función de depuración)
  const clearOnboardingCache = () => {
    if (user?.id) {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);

      // Forzar re-evaluación basada en datos actuales de la BD
      const profileCompleted = user.perfilCompletado === 1 || user.perfilCompletado === true;
      setIsFirstTime(!profileCompleted);
      setShowOnboarding(!profileCompleted);
      setOnboardingCompleted(profileCompleted);
    }
  };

  // Marcar onboarding como completado
  const completeOnboarding = async () => {
    if (user?.id) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, "true");
      setOnboardingCompleted(true);
      setShowOnboarding(false);
      setIsFirstTime(false);

      // IMPORTANTE: Obtener datos frescos del servidor en lugar de solo actualizar localmente
      const freshUser = await refreshUserProfile();

      if (freshUser) {
      } else {
        // Fallback: actualizar localmente si falla la petición
        const updatedUser = {
          ...user,
          perfilCompletado: 1
        };
        setUser(updatedUser);
      }
    }
  };

  // Reiniciar onboarding (para testing o reactivar)
  const resetOnboarding = () => {
    if (user?.id) {
      const storageKey = getStorageKey();
      localStorage.removeItem(storageKey);
      setOnboardingCompleted(false);
      setIsFirstTime(true);
      setShowOnboarding(true);
      setCurrentStep(0);
    }
  };

  // Navegar entre pasos
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // Cerrar onboarding sin completar
  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  // Aceptar términos y condiciones
  const acceptTerms = () => {
    setTermsAccepted(true);
  };

  // Rechazar términos y condiciones
  const declineTerms = () => {
    setShowOnboarding(false);
    setTermsAccepted(false);
  };

  const value = {
    isFirstTime,
    showOnboarding,
    currentStep,
    onboardingCompleted,
    termsAccepted,
    completeOnboarding,
    resetOnboarding,
    clearOnboardingCache,  // Nueva función para limpiar cache
    refreshUserProfile,    // Función para refrescar datos
    nextStep,
    prevStep,
    goToStep,
    closeOnboarding,
    acceptTerms,
    declineTerms,
    user,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
