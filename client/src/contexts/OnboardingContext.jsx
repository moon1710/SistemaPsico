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
  const { user } = useAuth();
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // Clave para localStorage basada en el usuario
  const getStorageKey = () => {
    return user?.id ? `onboarding_completed_${user.id}` : null;
  };

  // Verificar si es primera vez del usuario
  useEffect(() => {
    if (user?.id) {
      // PRIORIDAD TOTAL al campo perfilCompletado de la BD
      const profileCompleted = user.perfilCompletado === 1 || user.perfilCompletado === true;

      console.log('🔍 [OnboardingContext] Verificando estado:', {
        userId: user.id,
        perfilCompletado: user.perfilCompletado,
        profileCompleted,
        shouldShowModal: !profileCompleted
      });

      if (!profileCompleted) {
        // Perfil NO completado -> mostrar modal
        setIsFirstTime(true);
        setShowOnboarding(true);
        setOnboardingCompleted(false);
        console.log('📝 [OnboardingContext] Mostrando modal de onboarding');
      } else {
        // Perfil completado -> no mostrar modal
        setIsFirstTime(false);
        setShowOnboarding(false);
        setOnboardingCompleted(true);
        console.log('✅ [OnboardingContext] Perfil ya completado, ocultando modal');
      }
    }
  }, [user?.id, user?.perfilCompletado]);

  // Marcar onboarding como completado
  const completeOnboarding = () => {
    if (user?.id) {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, "true");
      setOnboardingCompleted(true);
      setShowOnboarding(false);
      setIsFirstTime(false);
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

  const value = {
    isFirstTime,
    showOnboarding,
    currentStep,
    onboardingCompleted,
    completeOnboarding,
    resetOnboarding,
    nextStep,
    prevStep,
    goToStep,
    closeOnboarding,
    user,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
