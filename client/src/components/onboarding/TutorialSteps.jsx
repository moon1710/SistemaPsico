// client/src/components/onboarding/TutorialSteps.jsx
import React from "react";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { onboardingSteps } from "./onboardingConfig";

const TutorialSteps = () => {
  const { currentStep, nextStep, prevStep } = useOnboarding();

  const step = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  if (!step) return null;

  return (
    <div className="min-h-[400px] flex flex-col">
      {/* Step Content */}
      <div className="flex-1">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <span className="text-2xl">{step.icon}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {step.title}
          </h2>
          <p className="text-gray-600">{step.subtitle}</p>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700 leading-relaxed">{step.description}</p>

          {/* Features List */}
          {step.features && step.features.length > 0 && (
            <ul className="mt-4 space-y-2">
              {step.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image/Video placeholder */}
        {step.media && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 text-center mb-6">
            <div className="text-4xl mb-2">{step.media.placeholder}</div>
            <p className="text-sm text-gray-500">{step.media.description}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={prevStep}
          disabled={isFirstStep}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isFirstStep
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          ← Anterior
        </button>

        <div className="flex gap-2">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? "bg-blue-600"
                  : index < currentStep
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          {isLastStep ? "Finalizar →" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
};

export default TutorialSteps;
