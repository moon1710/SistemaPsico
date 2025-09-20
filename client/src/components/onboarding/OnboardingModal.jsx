// client/src/components/onboarding/OnboardingModal.jsx
import React from "react";
import { useOnboarding } from "../../contexts/OnboardingContext";
import TutorialSteps from "./TutorialSteps";
import WelcomeForm from "./WelcomeForm";
import { onboardingSteps } from "./onboardingConfig";

const OnboardingModal = () => {
  const { showOnboarding, currentStep, closeOnboarding, user } =
    useOnboarding();

  if (!showOnboarding) return null;

  const isLastStep = currentStep >= onboardingSteps.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                {isLastStep ? "¡Bienvenido!" : "Tutorial del Sistema"}
              </h1>
              <p className="text-blue-100 mt-1">
                {isLastStep
                  ? `Hola, ${user?.nombreCompleto || user?.nombre}`
                  : `Paso ${currentStep + 1} de ${onboardingSteps.length}`}
              </p>
            </div>
            <button
              onClick={closeOnboarding}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Cerrar tutorial"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!isLastStep && (
          <div className="bg-gray-200 h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-300 ease-out"
              style={{
                width: `${((currentStep + 1) / onboardingSteps.length) * 100}%`,
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLastStep ? <WelcomeForm /> : <TutorialSteps />}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
