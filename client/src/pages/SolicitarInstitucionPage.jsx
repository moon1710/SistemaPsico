import React, { useState } from "react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/solicitar-institucion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Check if response has content before parsing
      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from server");
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", text);
        throw new Error("Invalid JSON response from server");
      }

      // Check if response is not ok after parsing to get server message
      if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
      }

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
      setErrors({ general: error.message || "Error de conexión. Intente nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircleIcon className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Solicitud enviada!
            </h2>

            <p className="text-gray-600 mb-6">
              Hemos recibido tu información. Si la solicitud es aprobada,
              recibirás un correo con las instrucciones para completar
              el registro institucional.
            </p>

            {solicitudData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Datos de tu solicitud
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Campus: </span>
                    <span className="text-gray-900">{solicitudData.nombreCampus}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Responsable: </span>
                    <span className="text-gray-900">{solicitudData.responsableNombre}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">ID: </span>
                    <span className="text-gray-900">{solicitudData.solicitudId}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Estado: </span>
                    <span className="text-gray-900">{solicitudData.status}</span>
                  </div>
                </div>
              </div>
            )}

            <a
              href="/"
              className="inline-block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Volver al inicio
            </a>

            <p className="text-xs text-gray-500 mt-4">
              Si no ves el correo, revisa la carpeta de spam o "Promociones".
            </p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.53 10.53a.75.75 0 00-1.06 1.061l1.5 1.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              NeuroFlora - Solicitud Institucional
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Registro de Institución
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete el formulario para solicitar el registro de su institución educativa.
              Validaremos la información y nos pondremos en contacto por correo electrónico.
            </p>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Solicitud de Registro
                </h2>
                <p className="text-sm text-gray-600">
                  Paso {currentStep} de {steps.length}
                </p>
              </div>
              <div className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label="Iniciar sesión"
                >
                  Inicia sesión
                </a>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="px-6 py-4">
              <nav aria-label="Progreso del formulario">
                <ol className="flex items-center justify-between">
                  {steps.map((step, stepIndex) => {
                    const completed = step.id < currentStep;
                    const current = step.id === currentStep;

                    return (
                      <li key={step.id} className="flex items-center">
                        <div className="flex items-center">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium ${
                              completed
                                ? "bg-blue-600 border-blue-600 text-white"
                                : current
                                ? "bg-blue-50 border-blue-600 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500"
                            }`}
                            aria-current={current ? "step" : undefined}
                          >
                            {completed ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              <span>{step.id}</span>
                            )}
                          </div>
                          <div className="ml-3">
                            <p className={`text-sm font-medium ${
                              completed || current ? "text-gray-900" : "text-gray-500"
                            }`}>
                              {step.label}
                            </p>
                          </div>
                        </div>
                        {stepIndex < steps.length - 1 && (
                          <div className="ml-6 w-16 h-0.5 bg-gray-200">
                            <div
                              className={`h-full transition-all duration-300 ${
                                completed ? "bg-blue-600 w-full" : "bg-gray-200 w-0"
                              }`}
                            />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>

            {/* Form Content */}
            <div className="px-6 py-6">
              <div className="max-w-2xl mx-auto">
                {/* Section header */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {currentStep === 1 && "Datos de la Institución"}
                    {currentStep === 2 && "Datos del Responsable"}
                    {currentStep === 3 && "Confirmación"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentStep === 1 &&
                      "Proporcione la información básica del campus y contacto institucional."}
                    {currentStep === 2 &&
                      "Ingrese los datos del responsable que gestionará el registro."}
                    {currentStep === 3 &&
                      "Revise la información y confirme la autorización institucional."}
                  </p>
                </div>

                {/* Form Fields */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="nombreCampus" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Campus *
                      </label>
                      <input
                        id="nombreCampus"
                        type="text"
                        required
                        value={formData.nombreCampus}
                        onChange={(e) => handleInputChange("nombreCampus", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.nombreCampus ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Ej: Universidad Tecnológica de Guadalajara"
                        aria-describedby={errors.nombreCampus ? "nombreCampus-error" : undefined}
                      />
                      {errors.nombreCampus && (
                        <p id="nombreCampus-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.nombreCampus}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                          Estado *
                        </label>
                        <input
                          id="estado"
                          type="text"
                          required
                          value={formData.estado}
                          onChange={(e) => handleInputChange("estado", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.estado ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Ej: Jalisco"
                          aria-describedby={errors.estado ? "estado-error" : undefined}
                        />
                        {errors.estado && (
                          <p id="estado-error" className="mt-1 text-sm text-red-600" role="alert">
                            {errors.estado}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                          Ciudad *
                        </label>
                        <input
                          id="ciudad"
                          type="text"
                          required
                          value={formData.ciudad}
                          onChange={(e) => handleInputChange("ciudad", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.ciudad ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Ej: Guadalajara"
                          aria-describedby={errors.ciudad ? "ciudad-error" : undefined}
                        />
                        {errors.ciudad && (
                          <p id="ciudad-error" className="mt-1 text-sm text-red-600" role="alert">
                            {errors.ciudad}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-1">
                          Código Postal
                        </label>
                        <input
                          id="codigoPostal"
                          type="text"
                          value={formData.codigoPostal}
                          onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.codigoPostal ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="44100"
                          maxLength="5"
                          aria-describedby={errors.codigoPostal ? "codigoPostal-error" : undefined}
                        />
                        {errors.codigoPostal && (
                          <p id="codigoPostal-error" className="mt-1 text-sm text-red-600" role="alert">
                            {errors.codigoPostal}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="claveInstitucional" className="block text-sm font-medium text-gray-700 mb-1">
                          Clave Institucional *
                        </label>
                        <input
                          id="claveInstitucional"
                          type="text"
                          required
                          value={formData.claveInstitucional}
                          onChange={(e) => handleInputChange("claveInstitucional", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.claveInstitucional ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="Ej: UTG2024"
                          aria-describedby={errors.claveInstitucional ? "claveInstitucional-error" : undefined}
                        />
                        {errors.claveInstitucional && (
                          <p id="claveInstitucional-error" className="mt-1 text-sm text-red-600" role="alert">
                            {errors.claveInstitucional}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="telefonoInstitucion" className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono Institucional *
                        </label>
                        <input
                          id="telefonoInstitucion"
                          type="tel"
                          required
                          value={formData.telefonoInstitucion}
                          onChange={(e) => handleInputChange("telefonoInstitucion", e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.telefonoInstitucion ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder="3331234567"
                          aria-describedby={errors.telefonoInstitucion ? "telefonoInstitucion-error" : undefined}
                        />
                        {errors.telefonoInstitucion && (
                          <p id="telefonoInstitucion-error" className="mt-1 text-sm text-red-600" role="alert">
                            {errors.telefonoInstitucion}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="extension" className="block text-sm font-medium text-gray-700 mb-1">
                          Extensión
                        </label>
                        <input
                          id="extension"
                          type="text"
                          value={formData.extension}
                          onChange={(e) => handleInputChange("extension", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="101"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="nombreDirector" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Director *
                      </label>
                      <input
                        id="nombreDirector"
                        type="text"
                        required
                        value={formData.nombreDirector}
                        onChange={(e) => handleInputChange("nombreDirector", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.nombreDirector ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Dr. Juan Pérez García"
                        aria-describedby={errors.nombreDirector ? "nombreDirector-error" : undefined}
                      />
                      {errors.nombreDirector && (
                        <p id="nombreDirector-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.nombreDirector}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="correoInstitucional" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Institucional *
                      </label>
                      <input
                        id="correoInstitucional"
                        type="email"
                        required
                        value={formData.correoInstitucional}
                        onChange={(e) => handleInputChange("correoInstitucional", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.correoInstitucional ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="contacto@universidad.edu.mx"
                        aria-describedby={errors.correoInstitucional ? "correoInstitucional-error" : undefined}
                      />
                      {errors.correoInstitucional && (
                        <p id="correoInstitucional-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.correoInstitucional}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="responsableNombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        id="responsableNombre"
                        type="text"
                        required
                        value={formData.responsableNombre}
                        onChange={(e) => handleInputChange("responsableNombre", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.responsableNombre ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="María Elena González Martínez"
                        aria-describedby={errors.responsableNombre ? "responsableNombre-error" : undefined}
                      />
                      {errors.responsableNombre && (
                        <p id="responsableNombre-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.responsableNombre}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="responsableCargo" className="block text-sm font-medium text-gray-700 mb-1">
                        Cargo *
                      </label>
                      <input
                        id="responsableCargo"
                        type="text"
                        required
                        value={formData.responsableCargo}
                        onChange={(e) => handleInputChange("responsableCargo", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.responsableCargo ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Coordinadora de Bienestar Estudiantil"
                        aria-describedby={errors.responsableCargo ? "responsableCargo-error" : undefined}
                      />
                      {errors.responsableCargo && (
                        <p id="responsableCargo-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.responsableCargo}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="responsableTelefonoPersonal" className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono Personal *
                      </label>
                      <input
                        id="responsableTelefonoPersonal"
                        type="tel"
                        required
                        value={formData.responsableTelefonoPersonal}
                        onChange={(e) => handleInputChange("responsableTelefonoPersonal", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.responsableTelefonoPersonal ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="3339876543"
                        aria-describedby={errors.responsableTelefonoPersonal ? "responsableTelefonoPersonal-error" : undefined}
                      />
                      {errors.responsableTelefonoPersonal && (
                        <p id="responsableTelefonoPersonal-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.responsableTelefonoPersonal}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="responsableCorreoInstitucional" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Institucional *
                      </label>
                      <input
                        id="responsableCorreoInstitucional"
                        type="email"
                        required
                        value={formData.responsableCorreoInstitucional}
                        onChange={(e) => handleInputChange("responsableCorreoInstitucional", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.responsableCorreoInstitucional ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="maria.gonzalez@universidad.edu.mx"
                        aria-describedby={errors.responsableCorreoInstitucional ? "responsableCorreoInstitucional-error" : undefined}
                      />
                      {errors.responsableCorreoInstitucional && (
                        <p id="responsableCorreoInstitucional-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.responsableCorreoInstitucional}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="responsableCorreoPersonal" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo Personal *
                      </label>
                      <input
                        id="responsableCorreoPersonal"
                        type="email"
                        required
                        value={formData.responsableCorreoPersonal}
                        onChange={(e) => handleInputChange("responsableCorreoPersonal", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.responsableCorreoPersonal ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="maria.personal@gmail.com"
                        aria-describedby={errors.responsableCorreoPersonal ? "responsableCorreoPersonal-error" : undefined}
                      />
                      {errors.responsableCorreoPersonal && (
                        <p id="responsableCorreoPersonal-error" className="mt-1 text-sm text-red-600" role="alert">
                          {errors.responsableCorreoPersonal}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-1">
                        Comentarios Adicionales
                      </label>
                      <textarea
                        id="comentarios"
                        value={formData.comentarios}
                        onChange={(e) => handleInputChange("comentarios", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Información adicional relevante para la solicitud..."
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Resumen de la solicitud:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium text-gray-700">Campus:</span>{" "}
                            <span className="text-gray-900">{formData.nombreCampus}</span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Ubicación:</span>{" "}
                            <span className="text-gray-900">{formData.ciudad}, {formData.estado}</span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Clave:</span>{" "}
                            <span className="text-gray-900">{formData.claveInstitucional}</span>
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium text-gray-700">Responsable:</span>{" "}
                            <span className="text-gray-900">{formData.responsableNombre}</span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Cargo:</span>{" "}
                            <span className="text-gray-900">{formData.responsableCargo}</span>
                          </p>
                          <p>
                            <span className="font-medium text-gray-700">Contacto:</span>{" "}
                            <span className="text-gray-900">{formData.responsableCorreoInstitucional}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          id="autorizacionConfirmada"
                          type="checkbox"
                          checked={formData.autorizacionConfirmada}
                          onChange={(e) => handleInputChange("autorizacionConfirmada", e.target.checked)}
                          className={`mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                            errors.autorizacionConfirmada ? "border-red-500" : ""
                          }`}
                          aria-describedby={errors.autorizacionConfirmada ? "autorizacion-error" : "autorizacion-desc"}
                        />
                        <label htmlFor="autorizacionConfirmada" className="ml-3 text-sm text-gray-700">
                          <strong>
                            Confirmo que cuento con autorización institucional
                            para solicitar el alta
                          </strong>
                        </label>
                      </div>

                      {errors.autorizacionConfirmada && (
                        <p id="autorizacion-error" className="text-sm text-red-600 flex items-center" role="alert">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.autorizacionConfirmada}
                        </p>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-900">
                              Información importante
                            </h3>
                            <div className="mt-2 text-sm text-blue-800">
                              <p id="autorizacion-desc">
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
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-600 flex items-center" role="alert">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          {errors.general}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-8">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-4 py-2 text-sm font-medium rounded-md border ${
                      currentStep === 1
                        ? "cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    }`}
                  >
                    Anterior
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? "Enviando..." : "Enviar Solicitud"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <p className="text-xs text-gray-500 text-center">
                Al enviar, confirma que tiene autorización para representar a la
                institución y que la información proporcionada es verídica.
              </p>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Proceso de Registro
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  1
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Validación</h4>
                <p className="text-sm text-gray-600">
                  Revisamos su información institucional
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  2
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Notificación</h4>
                <p className="text-sm text-gray-600">
                  Le enviamos un correo con el resultado
                </p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  3
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Activación</h4>
                <p className="text-sm text-gray-600">
                  Complete el registro y comience a usar la plataforma
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default SolicitarInstitucionPage;