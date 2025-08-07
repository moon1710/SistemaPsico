import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Alert from "../ui/Alert";
import { ROUTES } from "../../utils/constants";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    institucionId: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email no es válido";
    }

    if (!formData.password.trim()) {
      errors.password = "Contraseña es requerida";
    } else if (formData.password.length < 6) {
      errors.password = "Contraseña debe tener al menos 6 caracteres";
    }

    return errors;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Preparar datos para enviar
    const loginData = {
      email: formData.email.trim(),
      password: formData.password,
    };

    // Agregar institucionId solo si se especificó
    if (formData.institucionId.trim()) {
      loginData.institucionId = parseInt(formData.institucionId.trim());
    }

    // Intentar login
    const result = await login(loginData);

    if (result.success) {
      // Redirigir al dashboard
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
    // Si hay error, se mostrará automáticamente desde el contexto
  };

  // Usuarios de prueba para desarrollo
  const testUsers = [
    { email: "psicologo@une.edu", role: "Psicólogo" },
    { email: "estudiante@une.edu", role: "Estudiante" },
    { email: "admin@une.edu", role: "Admin Institución" },
    { email: "superadmin@sistema.com", role: "Super Admin" },
  ];

  const fillTestUser = (email) => {
    setFormData({
      email,
      password: "Password123!",
      institucionId: email.includes("superadmin") ? "" : "1",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Autenticación Psicológico
          </p>
        </div>

        {/* Formulario */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              placeholder="tu@email.com"
              required
              leftIcon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              }
            />

            {/* Contraseña */}
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              placeholder="Tu contraseña"
              required
              leftIcon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              }
            />

            {/* ID Institución (opcional) */}
            <Input
              label="ID de Institución"
              type="number"
              name="institucionId"
              value={formData.institucionId}
              onChange={handleChange}
              placeholder="1"
              helperText="Opcional. Déjalo vacío para Super Admin Nacional"
              leftIcon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              }
            />
          </div>

          {/* Error global */}
          {error && (
            <Alert type="error" dismissible>
              {error}
            </Alert>
          )}

          {/* Botón de envío */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>

          {/* Usuarios de prueba (solo en desarrollo) */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                🧪 Usuarios de Prueba (Solo Desarrollo)
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {testUsers.map((user, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => fillTestUser(user.email)}
                    className="text-left p-2 text-xs bg-white rounded border hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">
                      {user.email}
                    </div>
                    <div className="text-gray-500">{user.role}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                Contraseña para todos:{" "}
                <code className="bg-yellow-100 px-1 rounded">Password123!</code>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
