import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { onboardingSteps } from "./onboardingConfig";
import * as Icons from "lucide-react";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";

// Función para mapear nombres de string a componentes de Lucide
const iconMap = (name) => {
  const Ico = Icons[name] || Icons.Info;
  return <Ico className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />;
};

// Gradientes para el fondo del contenedor de la imagen
const gradients = [
  "linear-gradient(135deg, #527ceb 0%, #6762b3 100%)",
  "linear-gradient(135deg, #019fd2 0%, #48b0f7 100%)",
  "linear-gradient(135deg, #10cfbd 0%, #527ceb 100%)",
  "linear-gradient(135deg, #6762b3 0%, #21252d 100%)",
  "linear-gradient(135deg, #2b333c 0%, #019fd2 100%)",
];

const TutorialSteps = () => {
  const { currentStep, nextStep, prevStep } = useOnboarding();
  const step = onboardingSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  if (!step) return null;

  const panelGradient = gradients[currentStep % gradients.length];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full flex flex-col"
      >
        {/* --- GRID PRINCIPAL --- */}
        <div className="flex-1 grid md:grid-cols-2 gap-6 md:gap-8 min-h-0">
          
          {/* 1. COLUMNA IZQUIERDA: Texto y Características */}
          <div className="flex flex-col justify-center space-y-5 overflow-y-auto pr-2">
            
            {/* Encabezado con Icono */}
            <div className="inline-flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 shadow-sm">
                {iconMap(step.icon)}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-2xl md:text-3xl text-gray-900 leading-tight">
                  {step.title}
                </h2>
                <p className="text-blue-600 font-medium">
                  {step.subtitle}
                </p>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {step.description}
            </p>

            {/* Lista de Características (Mejorada con CheckCircle) */}
            {step.features?.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <ul className="space-y-3">
                  {step.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 font-medium text-sm md:text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 2. COLUMNA DERECHA: Imagen con Estilo Glassmorphism */}
          <div className="relative hidden md:flex flex-col min-h-0">
            <motion.div
              layoutId="image-container"
              className="flex-1 rounded-2xl p-2 shadow-xl overflow-hidden"
              style={{
                background: panelGradient,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div className="w-full h-full bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden border border-white/50 relative group">
                {step.media?.image ? (
                  <img
                    src={step.media.image}
                    alt={step.media.description}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"; // Fallback elegante
                    }}
                  />
                ) : (
                  <div className="grid place-items-center h-full text-gray-400">
                    Sin imagen disponible
                  </div>
                )}
                
                {/* Overlay sutil para mejorar contraste */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- BARRA DE NAVEGACIÓN INFERIOR --- */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
          
          {/* Botón Anterior */}
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isFirstStep
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </button>

          {/* Indicadores de Progreso (Puntitos) */}
          <div className="flex items-center gap-2">
            {onboardingSteps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => { /* Opcional: permitir saltar pasos */ }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-blue-600 shadow-md shadow-blue-200"
                    : "w-2 bg-gray-200 hover:bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Botón Siguiente */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-medium bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            {isLastStep ? "Finalizar" : "Siguiente"}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialSteps;