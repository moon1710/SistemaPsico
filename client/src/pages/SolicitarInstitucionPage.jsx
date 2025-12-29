import React, { useState } from "react";
import {
  ChevronRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";
import PublicLayout from "../components/layout/PublicLayout";

const steps = [
  { id: 1, label: "Datos de institución" },
  { id: 2, label: "Datos del responsable" },
  { id: 3, label: "Confirmación" },
];

const SolicitarInstitucionPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [solicitudData, setSolicitudData] = useState(null);
  const [errors, setErrors] = useState({});

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Datos de institución
    nombreCampus: "",
    estado: "",
    ciudad: "",
    codigoPostal: "",
    claveInstitucional: "",
    telefonoInstitucion: "",
    extension: "",
    nombreDirector: "",
    correoInstitucional: "",

    // Datos del responsable
    responsableNombre: "",
    responsableCargo: "",
    responsableCorreoInstitucional: "",
    responsableCorreoPersonal: "",
    responsableTelefonoPersonal: "",

    // Confirmación
    autorizacionConfirmada: false,

    // Comentarios opcionales
    comentarios: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateStep = (step) => {
    const stepErrors = {};

    if (step === 1) {
      // Validaciones datos de institución
      if (!formData.nombreCampus.trim())
        stepErrors.nombreCampus = "Nombre del campus es requerido";
      if (!formData.estado.trim()) stepErrors.estado = "Estado es requerido";
      if (!formData.ciudad.trim()) stepErrors.ciudad = "Ciudad es requerida";
      if (!formData.claveInstitucional.trim())
        stepErrors.claveInstitucional = "Clave institucional es requerida";
      if (!formData.telefonoInstitucion.trim())
        stepErrors.telefonoInstitucion = "Teléfono es requerido";
      if (!formData.nombreDirector.trim())
        stepErrors.nombreDirector = "Nombre del director es requerido";
      if (!formData.correoInstitucional.trim()) {
        stepErrors.correoInstitucional = "Correo institucional es requerido";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoInstitucional)
      ) {
        stepErrors.correoInstitucional = "Formato de correo inválido";
      }
      if (formData.codigoPostal && !/^\d{5}$/.test(formData.codigoPostal)) {
        stepErrors.codigoPostal = "Código postal debe tener 5 dígitos";
      }
    }

    if (step === 2) {
      // Validaciones datos del responsable
      if (!formData.responsableNombre.trim())
        stepErrors.responsableNombre = "Nombre completo es requerido";
      if (!formData.responsableCargo.trim())
        stepErrors.responsableCargo = "Cargo es requerido";
      if (!formData.responsableCorreoInstitucional.trim()) {
        stepErrors.responsableCorreoInstitucional =
          "Correo institucional es requerido";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          formData.responsableCorreoInstitucional
        )
      ) {
        stepErrors.responsableCorreoInstitucional =
          "Formato de correo inválido";
      }
      if (!formData.responsableCorreoPersonal.trim()) {
        stepErrors.responsableCorreoPersonal = "Correo personal es requerido";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.responsableCorreoPersonal)
      ) {
        stepErrors.responsableCorreoPersonal = "Formato de correo inválido";
      }
      if (!formData.responsableTelefonoPersonal.trim())
        stepErrors.responsableTelefonoPersonal =
          "Teléfono personal es requerido";
    }

    if (step === 3) {
      // Validaciones confirmación
      if (!formData.autorizacionConfirmada) {
        stepErrors.autorizacionConfirmada =
          "Debe confirmar que cuenta con autorización institucional";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/public/solicitar-institucion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSolicitudData(result.data);
        setShowSuccess(true);
      } else {
        if (result.errors) {
          const fieldErrors = {};
          result.errors.forEach((error) => {
            fieldErrors[error.path] = error.msg;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({
            general: result.message || "Error al enviar la solicitud",
          });
        }
      }
    } catch (error) {
      console.error("Error enviando solicitud:", error);
      setErrors({ general: "Error de conexión. Intente nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-[#f7f7f7]">
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#21252d] via-[#2b333c] to-[#21252d]" />
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(900px 260px at 30% 30%, rgba(82,124,235,.55), transparent 60%), radial-gradient(900px 260px at 75% 10%, rgba(103,98,179,.55), transparent 60%)",
              }}
            />
            <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
              <div className="rounded-[22px] border border-white/15 bg-white/80 shadow-[0_18px_60px_-25px_rgba(2,6,23,.45)] backdrop-blur">
                <div className="px-6 py-6 sm:px-8 sm:py-10">
                  <div className="text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#10cfbd] to-[#019fd2] shadow-sm">
                      <CheckCircleIcon className="h-8 w-8 text-white" />
                    </div>

                    <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-[#21252d]">
                      ¡Solicitud enviada correctamente!
                    </h2>
                    <p className="mt-3 text-sm text-[#7c777a]">
                      Hemos recibido tu información. Si la solicitud es
                      aprobada, recibirás un correo con las instrucciones para
                      completar el registro institucional.
                    </p>

                    {solicitudData && (
                      <div className="mt-7 rounded-2xl border border-[#2b333c]/10 bg-white p-5 text-left shadow-sm">
                        <h3 className="text-sm font-bold text-[#21252d] mb-3">
                          Datos de tu solicitud
                        </h3>
                        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold text-[#7c777a]">
                              Campus
                            </p>
                            <p className="font-medium text-[#21252d]">
                              {solicitudData.nombreCampus}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#7c777a]">
                              Responsable
                            </p>
                            <p className="font-medium text-[#21252d]">
                              {solicitudData.responsableNombre}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#7c777a]">
                              ID
                            </p>
                            <p className="font-medium text-[#21252d]">
                              {solicitudData.solicitudId}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#7c777a]">
                              Estado
                            </p>
                            <p className="font-medium text-[#21252d]">
                              {solicitudData.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8">
                      <a
                        href="/"
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#527ceb] to-[#6762b3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#48b0f7]/25"
                      >
                        Volver al inicio
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#2b333c]/10 px-6 py-4 text-center text-xs text-[#7c777a]">
                  Si no ves el correo, revisa spam o “Promociones”.
                </div>
              </div>
            </div>
          </section>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-[#f7f7f7]">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#21252d] via-[#2b333c] to-[#21252d]" />
          <div className="absolute -top-24 right-[-140px] h-[420px] w-[420px] rounded-full bg-[#527ceb]/35 blur-3xl" />
          <div className="absolute top-28 left-[-140px] h-[420px] w-[420px] rounded-full bg-[#6762b3]/30 blur-3xl" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
              maskImage:
                "radial-gradient(600px 260px at 50% 15%, black 55%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(600px 260px at 50% 15%, black 55%, transparent 100%)",
            }}
          />

          <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-12 sm:px-6 lg:px-8">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur">
              NeuroFlora
              <span className="h-1 w-1 rounded-full bg-white/70" />
              Solicitud de alta
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Sign up{" "}
              <span className="bg-gradient-to-r from-[#527ceb] via-[#6762b3] to-[#48b0f7] bg-clip-text text-transparent">
                Institución
              </span>
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
              Completa el formulario para solicitar el registro de tu
              institución educativa. Nuestro equipo validará la información y te
              contactará por correo.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs font-semibold text-white/70">
                  Privacidad
                </p>
                <p className="mt-1 text-sm text-white/90">
                  Información confidencial
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs font-semibold text-white/70">Proceso</p>
                <p className="mt-1 text-sm text-white/90">
                  Validación institucional
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                <p className="text-xs font-semibold text-white/70">Tiempo</p>
                <p className="mt-1 text-sm text-white/90">2–3 minutos</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENIDO (CARD tipo imagen) */}
        <div className="mx-auto max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="rounded-[22px] border border-white/40 bg-white/80 shadow-[0_18px_60px_-25px_rgba(2,6,23,.35)] backdrop-blur">
            {/* Top bar: title + link */}
            <div className="flex flex-col gap-4 border-b border-[#2b333c]/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#21252d] text-white">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#21252d]">
                    Sign up
                  </p>
                  <p className="text-xs text-[#7c777a]">
                    Paso {currentStep} de 3
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#7c777a]">
                Already a Member?{" "}
                <a
                  className="font-semibold text-[#527ceb] hover:text-[#48b0f7]"
                  href="/login"
                >
                  Sign In
                </a>
              </div>
            </div>

            {/* Stepper */}
            <div className="px-6 pt-5">
              <ol className="flex items-start justify-between gap-3">
                {steps.map((s, idx) => {
                  const done = s.id < currentStep;
                  const active = s.id === currentStep;

                  return (
                    <li key={s.id} className="flex-1">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(s.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={[
                              "grid h-9 w-9 place-items-center rounded-full border text-xs font-extrabold transition",
                              done || active
                                ? "border-transparent bg-gradient-to-br from-[#527ceb] to-[#6762b3] text-white"
                                : "border-[#2b333c]/15 bg-white text-[#7c777a]",
                            ].join(" ")}
                          >
                            {done ? "✓" : s.id}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={[
                                "truncate text-xs font-semibold",
                                active || done
                                  ? "text-[#21252d]"
                                  : "text-[#7c777a]",
                              ].join(" ")}
                            >
                              {s.label}
                            </p>
                          </div>
                        </div>

                        {idx < steps.length - 1 && (
                          <div className="ml-[18px] mt-3 h-[3px] w-[calc(100%-36px)] rounded-full bg-[#f0f0f0]">
                            <div
                              className={[
                                "h-[3px] rounded-full transition-all",
                                currentStep > s.id
                                  ? "w-full bg-gradient-to-r from-[#527ceb] to-[#6762b3]"
                                  : "w-0 bg-gradient-to-r from-[#527ceb] to-[#6762b3]",
                              ].join(" ")}
                            />
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Body grid */}
            <div className="grid grid-cols-1 gap-6 px-6 pb-6 pt-6 lg:grid-cols-12">
              {/* Left form */}
              <div className="lg:col-span-8">
                <div className="rounded-[18px] border border-[#2b333c]/10 bg-white p-5 shadow-sm">
                  {/* Section header */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold text-[#21252d]">
                        {currentStep === 1 && "Basic Details"}
                        {currentStep === 2 && "Contact Details"}
                        {currentStep === 3 && "Verification"}
                      </h2>
                      <p className="mt-1 text-xs text-[#7c777a]">
                        {currentStep === 1 &&
                          "Información del campus y contacto institucional."}
                        {currentStep === 2 &&
                          "Datos del responsable que gestionará el alta."}
                        {currentStep === 3 &&
                          "Revisión final y confirmación de autorización."}
                      </p>
                    </div>

                    {/* “Add photo” bubble */}
                    <div className="hidden sm:block">
                      <div className="grid place-items-center rounded-2xl border border-[#2b333c]/10 bg-[#f0f0f0] p-4">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#527ceb] to-[#6762b3] shadow-sm">
                          <CameraIcon className="h-6 w-6 text-white" />
                        </div>
                        <p className="mt-2 text-[11px] font-semibold text-[#21252d]">
                          Add Photo
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* --- FORM CONTENT --- */}
                  {currentStep === 1 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-6">
                        Datos de la Institución
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Nombre del Campus *
                          </label>
                          <input
                            type="text"
                            value={formData.nombreCampus}
                            onChange={(e) =>
                              handleInputChange("nombreCampus", e.target.value)
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.nombreCampus ? "border-red-500" : ""
                            }`}
                            placeholder="Ej: Universidad Tecnológica de Guadalajara"
                          />
                          {errors.nombreCampus && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.nombreCampus}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Estado *
                          </label>
                          <input
                            type="text"
                            value={formData.estado}
                            onChange={(e) =>
                              handleInputChange("estado", e.target.value)
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.estado ? "border-red-500" : ""
                            }`}
                            placeholder="Ej: Jalisco"
                          />
                          {errors.estado && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.estado}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Ciudad *
                          </label>
                          <input
                            type="text"
                            value={formData.ciudad}
                            onChange={(e) =>
                              handleInputChange("ciudad", e.target.value)
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.ciudad ? "border-red-500" : ""
                            }`}
                            placeholder="Ej: Guadalajara"
                          />
                          {errors.ciudad && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.ciudad}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Código Postal
                          </label>
                          <input
                            type="text"
                            value={formData.codigoPostal}
                            onChange={(e) =>
                              handleInputChange("codigoPostal", e.target.value)
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.codigoPostal ? "border-red-500" : ""
                            }`}
                            placeholder="44100"
                            maxLength="5"
                          />
                          {errors.codigoPostal && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.codigoPostal}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Clave Institucional *
                          </label>
                          <input
                            type="text"
                            value={formData.claveInstitucional}
                            onChange={(e) =>
                              handleInputChange(
                                "claveInstitucional",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.claveInstitucional ? "border-red-500" : ""
                            }`}
                            placeholder="Ej: UTG2024"
                          />
                          {errors.claveInstitucional && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.claveInstitucional}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Teléfono Institucional *
                          </label>
                          <input
                            type="tel"
                            value={formData.telefonoInstitucion}
                            onChange={(e) =>
                              handleInputChange(
                                "telefonoInstitucion",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.telefonoInstitucion ? "border-red-500" : ""
                            }`}
                            placeholder="3331234567"
                          />
                          {errors.telefonoInstitucion && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.telefonoInstitucion}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Extensión
                          </label>
                          <input
                            type="text"
                            value={formData.extension}
                            onChange={(e) =>
                              handleInputChange("extension", e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="101"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Nombre del Director *
                          </label>
                          <input
                            type="text"
                            value={formData.nombreDirector}
                            onChange={(e) =>
                              handleInputChange(
                                "nombreDirector",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.nombreDirector ? "border-red-500" : ""
                            }`}
                            placeholder="Dr. Juan Pérez García"
                          />
                          {errors.nombreDirector && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.nombreDirector}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Correo Institucional *
                          </label>
                          <input
                            type="email"
                            value={formData.correoInstitucional}
                            onChange={(e) =>
                              handleInputChange(
                                "correoInstitucional",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.correoInstitucional ? "border-red-500" : ""
                            }`}
                            placeholder="contacto@universidad.edu.mx"
                          />
                          {errors.correoInstitucional && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.correoInstitucional}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-6">
                        Datos del Responsable
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Nombre Completo *
                          </label>
                          <input
                            type="text"
                            value={formData.responsableNombre}
                            onChange={(e) =>
                              handleInputChange(
                                "responsableNombre",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.responsableNombre ? "border-red-500" : ""
                            }`}
                            placeholder="María Elena González Martínez"
                          />
                          {errors.responsableNombre && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.responsableNombre}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Cargo *
                          </label>
                          <input
                            type="text"
                            value={formData.responsableCargo}
                            onChange={(e) =>
                              handleInputChange(
                                "responsableCargo",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.responsableCargo ? "border-red-500" : ""
                            }`}
                            placeholder="Coordinadora de Bienestar Estudiantil"
                          />
                          {errors.responsableCargo && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.responsableCargo}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Teléfono Personal *
                          </label>
                          <input
                            type="tel"
                            value={formData.responsableTelefonoPersonal}
                            onChange={(e) =>
                              handleInputChange(
                                "responsableTelefonoPersonal",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.responsableTelefonoPersonal
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="3339876543"
                          />
                          {errors.responsableTelefonoPersonal && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.responsableTelefonoPersonal}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Correo Institucional *
                          </label>
                          <input
                            type="email"
                            value={formData.responsableCorreoInstitucional}
                            onChange={(e) =>
                              handleInputChange(
                                "responsableCorreoInstitucional",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.responsableCorreoInstitucional
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="maria.gonzalez@universidad.edu.mx"
                          />
                          {errors.responsableCorreoInstitucional && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.responsableCorreoInstitucional}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Correo Personal *
                          </label>
                          <input
                            type="email"
                            value={formData.responsableCorreoPersonal}
                            onChange={(e) =>
                              handleInputChange(
                                "responsableCorreoPersonal",
                                e.target.value
                              )
                            }
                            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                              errors.responsableCorreoPersonal
                                ? "border-red-500"
                                : ""
                            }`}
                            placeholder="maria.personal@gmail.com"
                          />
                          {errors.responsableCorreoPersonal && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.responsableCorreoPersonal}
                            </p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Comentarios Adicionales
                          </label>
                          <textarea
                            value={formData.comentarios}
                            onChange={(e) =>
                              handleInputChange("comentarios", e.target.value)
                            }
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Información adicional relevante para la solicitud..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-6">
                        Confirmación
                      </h3>

                      <div className="bg-gray-50 p-6 rounded-lg mb-6">
                        <h4 className="font-medium text-gray-900 mb-4">
                          Resumen de la solicitud:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p>
                              <strong>Campus:</strong> {formData.nombreCampus}
                            </p>
                            <p>
                              <strong>Ubicación:</strong> {formData.ciudad},{" "}
                              {formData.estado}
                            </p>
                            <p>
                              <strong>Clave:</strong>{" "}
                              {formData.claveInstitucional}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Responsable:</strong>{" "}
                              {formData.responsableNombre}
                            </p>
                            <p>
                              <strong>Cargo:</strong>{" "}
                              {formData.responsableCargo}
                            </p>
                            <p>
                              <strong>Contacto:</strong>{" "}
                              {formData.responsableCorreoInstitucional}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            checked={formData.autorizacionConfirmada}
                            onChange={(e) =>
                              handleInputChange(
                                "autorizacionConfirmada",
                                e.target.checked
                              )
                            }
                            className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                              errors.autorizacionConfirmada
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          <label className="ml-3 text-sm text-gray-700">
                            <strong>
                              Confirmo que cuento con autorización institucional
                              para solicitar el alta
                            </strong>
                          </label>
                        </div>

                        {errors.autorizacionConfirmada && (
                          <p className="text-sm text-red-600 flex items-center">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            {errors.autorizacionConfirmada}
                          </p>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex">
                            <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">
                                Información importante
                              </h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>
                                  Al enviar esta solicitud, confirma que tiene
                                  la autoridad para representar a la institución
                                  educativa y que la información proporcionada
                                  es verídica.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {errors.general && (
                        <div className="mt-4 p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-600 flex items-center">
                            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                            {errors.general}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="mt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      currentStep === 1
                        ? "cursor-not-allowed bg-[#f0f0f0] text-[#7c777a]"
                        : "bg-white text-[#21252d] shadow-sm ring-1 ring-[#2b333c]/10 hover:bg-[#f7f7f7]"
                    }`}
                  >
                    Back
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#527ceb] to-[#6762b3] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#48b0f7]/25"
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#10cfbd] to-[#019fd2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-[#10cfbd]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Enviando..." : "Submit"}
                    </button>
                  )}
                </div>
              </div>

              {/* Right sidebar */}
              <div className="lg:col-span-4">
                <div className="rounded-[18px] bg-[#21252d] p-[1px] shadow-sm">
                  <div className="rounded-[18px] bg-gradient-to-b from-[#2b333c] to-[#21252d] p-5 text-white">
                    <h3 className="text-sm font-bold">Recomendaciones</h3>
                    <p className="mt-2 text-xs text-white/70">
                      Usa correos institucionales válidos y verifica la clave
                      del campus para evitar rechazos.
                    </p>

                    <div className="mt-4 space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold">Privacidad</p>
                        <p className="mt-1 text-xs text-white/70">
                          Datos protegidos y usados solo para validación.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold">Qué sigue</p>
                        <ul className="mt-2 space-y-2 text-xs text-white/70">
                          <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" />
                            Validación institucional
                          </li>
                          <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" />
                            Notificación por correo
                          </li>
                          <li className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-white/60" />
                            Alta y activación
                          </li>
                        </ul>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold">Soporte</p>
                        <p className="mt-1 text-xs text-white/70">
                          Si algo falla, vuelve a intentar o contacta al equipo
                          de soporte.
                        </p>
                      </div>
                    </div>

                    {errors.general && (
                      <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
                        <p className="text-xs text-red-200 flex items-center gap-2">
                          <ExclamationTriangleIcon className="h-4 w-4" />
                          {errors.general}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 rounded-2xl bg-white/5 p-4">
                      <p className="text-xs text-white/70">
                        Tip: Mantén el teléfono institucional con lada (ej.
                        287xxxxxxx).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[18px] border border-[#2b333c]/10 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold text-[#21252d]">Status</p>
                  <p className="mt-1 text-xs text-[#7c777a]">
                    Completa el paso actual para continuar.
                  </p>
                  <div className="mt-3 h-2 w-full rounded-full bg-[#f0f0f0]">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#527ceb] to-[#6762b3]"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="border-t border-[#2b333c]/10 px-6 py-4 text-xs text-[#7c777a]">
              Al enviar, confirmas que tienes autorización para representar a la
              institución y que la información es verídica.
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default SolicitarInstitucionPage;
