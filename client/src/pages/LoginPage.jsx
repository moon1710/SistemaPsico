import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, KeyRound, Building } from "lucide-react";
import { ROUTES } from "../utils/constants";

// Importar imagen de fondo - puedes reemplazar con tu imagen
import backgroundImage from "../assets/bgLogin.png"; // Asegúrate de que esta imagen exista

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institucionId, setInstitucionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // URL a la que redirigir después del login
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Preparar datos de login
      const loginData = {
        email: email.trim(),
        password: password,
      };

      // Agregar institucionId solo si se especificó
      if (institucionId.trim()) {
        loginData.institucionId = parseInt(institucionId.trim());
      }

      // Intentar login
      const result = await login(loginData);

      if (result.success) {
        // Redirigir según el rol o a la página solicitada
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Función para llenar usuario de prueba (solo en desarrollo)
  const fillTestUser = (userEmail, userInstitucionId = "1") => {
    setEmail(userEmail);
    setPassword("Password123!");
    setInstitucionId(userInstitucionId);
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 font-sans bg-white text-[#21252d]">
      {/* Sección izquierda - Login */}
      <section className="flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#21252d] mb-2">
            Tu centro de control para bienestar estudiantil.
          </h1>
          <p className="text-sm text-[#7c777a] mb-6">
            Ingresa tus credenciales para acceder al sistema psicológico.
          </p>

          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-100 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-[#7c777a]"
                size={20}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email institucional"
                className="w-full rounded-xl border border-[#e1e1e1] bg-[#f7f7f7] py-3 pl-10 pr-4 text-[#21252d] placeholder:text-[#7c777a] focus:ring-2 focus:ring-[#527ceb] outline-none transition-all"
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <KeyRound
                className="absolute left-3 top-3.5 text-[#7c777a]"
                size={20}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full rounded-xl border border-[#e1e1e1] bg-[#f7f7f7] py-3 pl-10 pr-4 text-[#21252d] placeholder:text-[#7c777a] focus:ring-2 focus:ring-[#527ceb] outline-none transition-all"
              />
            </div>

            {/* ID Institución */}
            <div className="relative">
              <Building
                className="absolute left-3 top-3.5 text-[#7c777a]"
                size={20}
              />
              <input
                type="number"
                value={institucionId}
                onChange={(e) => setInstitucionId(e.target.value)}
                placeholder="ID de Institución (opcional)"
                className="w-full rounded-xl border border-[#e1e1e1] bg-[#f7f7f7] py-3 pl-10 pr-4 text-[#21252d] placeholder:text-[#7c777a] focus:ring-2 focus:ring-[#527ceb] outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#527ceb] text-white rounded-xl py-3 font-semibold hover:bg-[#48b0f7] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-[#7c777a]">
            ¿Olvidaste tu contraseña?{" "}
            <a
              href="#"
              className="underline text-[#527ceb] hover:text-[#48b0f7] transition-colors"
            >
              Recupérala
            </a>
          </p>

          {/* Usuarios de prueba (solo en desarrollo) */}
          {import.meta.env.DEV && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                🧪 Usuarios de Prueba (Solo Desarrollo)
              </h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillTestUser("psicologo@une.edu")}
                  className="text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    psicologo@une.edu
                  </div>
                  <div className="text-gray-500">Psicólogo</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillTestUser("estudiante@une.edu")}
                  className="text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    estudiante@une.edu
                  </div>
                  <div className="text-gray-500">Estudiante</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillTestUser("admin@une.edu")}
                  className="text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">admin@une.edu</div>
                  <div className="text-gray-500">Admin Institución</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillTestUser("superadmin@sistema.com", "")}
                  className="text-left p-2 bg-white rounded border hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    superadmin@sistema.com
                  </div>
                  <div className="text-gray-500">Super Admin Nacional</div>
                </button>
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                Contraseña para todos:{" "}
                <code className="bg-yellow-100 px-1 rounded">Password123!</code>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sección derecha - Imagen y mensaje */}
      <section
        className="hidden lg:flex flex-col justify-between p-8 relative text-white bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "#2b333c",
        }}
      >
        {/* Badge superior */}
        <div className="flex justify-end">
          <div className="bg-white text-[#21252d] px-4 py-2 rounded-full shadow-md text-sm font-semibold">
            Sistema Seguro y Confiable
          </div>
        </div>

        {/* Contenido central */}
        <div className="text-center px-4 mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">
            Cuidando el Bienestar Estudiantil
          </h2>
          <p className="text-sm text-white/90 max-w-md mx-auto mb-4">
            Plataforma integral para psicólogos, orientadores y estudiantes.
            Construyendo comunidades educativas más saludables y resilientes.
          </p>
          <div className="flex justify-center flex-wrap gap-2 text-sm font-semibold">
            <span className="bg-[#527ceb] text-white px-4 py-2 rounded-full">
              La salud mental es prioridad
            </span>
          </div>
        </div>

        {/* Indicadores visuales */}
        <div className="flex justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-white/80">Sistema Activo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-white/80">Datos Protegidos</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-white/80">24/7 Disponible</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
