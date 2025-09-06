import { useState } from "react";
import UserForm from "./userform";

export default function OnboardingModal({ user }) {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const slidesEstudiante = [
    "Bienvenido estudiante 👋",
    "Aquí podrás acceder a tus quizzes y recursos.",
    "Recuerda mantener tu información actualizada.",
  ];

  const slidesPsico = [
    "Bienvenido psicólogo/orientador 👋",
    "Aquí gestionarás estudiantes y reportes.",
    "Completa tu información profesional para continuar.",
  ];

  const slides = user?.rol === "ESTUDIANTE" ? slidesEstudiante : slidesPsico;

  const handleNext = () => {
    if (step < slides.length) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch("/api/usuarios/updatePerfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...formData }),
      });

      if (res.ok) {
        setCompleted(true);
        window.location.reload(); // recarga el dashboard
      }
    } catch (err) {
      console.error("Error al guardar perfil:", err);
    }
  };

  if (completed) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        {step < slides.length ? (
          <div className="text-center space-y-6">
            <h2 className="text-xl font-bold">{slides[step]}</h2>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {step === slides.length - 1 ? "Continuar" : "Siguiente"}
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Completa tu perfil</h2>
            <UserForm role={user?.rol} onSubmit={handleSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}
