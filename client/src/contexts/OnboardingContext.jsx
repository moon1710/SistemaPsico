// client/src/contexts/OnboardingContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api"; // ← instancia central de axios
import { STORAGE_KEYS } from "../utils/constants";

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
  const getStorageKey = () =>
    user?.id ? `onboarding_completed_${user.id}` : null;

  // Verificar si es primera vez del usuario
  useEffect(() => {
    if (!user?.id) return;

    const storageKey = getStorageKey();
    const onboardingCompletedInStorage =
      localStorage.getItem(storageKey) === "true";
    const profileCompleted =
      user.perfilCompletado === 1 || user.perfilCompletado === true;

    const shouldHideOnboarding =
      onboardingCompletedInStorage || profileCompleted;

    if (!shouldHideOnboarding) {
      setIsFirstTime(true);
      setShowOnboarding(true);
      setOnboardingCompleted(false);
    } else {
      setIsFirstTime(false);
      setShowOnboarding(false);
      setOnboardingCompleted(true);

      // Sincroniza si BD dice completado pero localStorage no
      if (profileCompleted && !onboardingCompletedInStorage) {
        localStorage.setItem(storageKey, "true");
      }
    }
  }, [user?.id, user?.perfilCompletado]);

  // Refrescar datos del usuario desde el servidor
  const refreshUserProfile = async () => {
    try {
      const token =
        localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
        localStorage.getItem("token"); // fallback por compat
      if (!token) return null;

      // api ya incluye withCredentials y Authorization via interceptor
      const { data } = await api.get("/auth/profile");

      if (data?.success && data?.data?.user) {
        const freshUser = data.data.user;
        setUser(freshUser);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(freshUser));
        return freshUser;
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error?.message || error);
    }
    return null;
  };

  // Limpiar cache de onboarding (función de depuración)
  const clearOnboardingCache = () => {
    if (!user?.id) return;
    const storageKey = getStorageKey();
    localStorage.removeItem(storageKey);

    const profileCompleted =
      user.perfilCompletado === 1 || user.perfilCompletado === true;
    setIsFirstTime(!profileCompleted);
    setShowOnboarding(!profileCompleted);
    setOnboardingCompleted(profileCompleted);
  };

  // Marcar onboarding como completado
  const completeOnboarding = async () => {
    if (!user?.id) return;

    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, "true");
    setOnboardingCompleted(true);
    setShowOnboarding(false);
    setIsFirstTime(false);

    // Intenta refrescar desde el backend
    const freshUser = await refreshUserProfile();
    if (!freshUser) {
      // Fallback local si falla la petición
      setUser({ ...user, perfilCompletado: 1 });
      const updated = { ...user, perfilCompletado: 1 };
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updated));
    }
  };

  // Reiniciar onboarding (para testing o reactivar)
  const resetOnboarding = () => {
    if (!user?.id) return;
    const storageKey = getStorageKey();
    localStorage.removeItem(storageKey);
    setOnboardingCompleted(false);
    setIsFirstTime(true);
    setShowOnboarding(true);
    setCurrentStep(0);
  };

  // Navegación entre pasos
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));
  const goToStep = (step) => setCurrentStep(step);

  // Control del modal
  const closeOnboarding = () => setShowOnboarding(false);

  // Términos
  const acceptTerms = () => setTermsAccepted(true);
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
    clearOnboardingCache,
    refreshUserProfile,
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
