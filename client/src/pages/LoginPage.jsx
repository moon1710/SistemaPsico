import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, KeyRound, Building, UserPlus, Eye, EyeOff } from "lucide-react";
import { ROUTES } from "../utils/constants";
import RegistroEstudiante from "../components/auth/RegistroEstudiante";

// Asegúrate de que la ruta sea correcta:
import backgroundImage from "../assets/bgLogin.png";
import "../styles/login.css"
import "../index.css"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institucionId, setInstitucionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
        // Usar la ruta de redirección determinada por el AuthContext
        const redirectTo = result.redirectPath || from;
        navigate(redirectTo, { replace: true });
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

  // Manejar éxito en registro de estudiante
  const handleRegistroExitoso = (result) => {
    // Limpiar formulario de login
    setEmail("");
    setPassword("");
    setError("");

    // Mostrar login y poner datos del registro
    setShowRegistro(false);
    setEmail(result.data.email);
    setPassword(result.data.contraseñaInicial);

    // Opcional: auto-login después del registro
    setTimeout(async () => {
      try {
        const loginData = { email: result.data.email, password: result.data.contraseñaInicial };
        const loginResult = await login(loginData);

        if (loginResult.success) {
          const redirectTo = loginResult.redirectPath || ROUTES.DASHBOARD;
          navigate(redirectTo, { replace: true });
        }
      } catch (error) {
        console.error('Error en auto-login:', error);
      }
    }, 1000);
  };

  // Si está mostrando registro, renderizar componente de registro
  if (showRegistro) {
    return (
      <main className="login-main">
        <section className="login-section-left">
          <div className="login-form-container">
            <RegistroEstudiante
              onSuccess={handleRegistroExitoso}
              onBackToLogin={() => setShowRegistro(false)}
            />
          </div>
        </section>

        {/* Sección derecha sigue igual */}
        <section
          className="login-section-right"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundColor: "#2b333c",
          }}
        >
          <div className="login-badge">Registro de Estudiantes</div>

          <div className="login-right-content">
            <h2>Únete a NeuroFlora</h2>
            <p>
              Regístrate con tu número de control institucional y comienza tu
              experiencia en nuestra plataforma de bienestar estudiantil.
            </p>
            <span className="login-highlight">Tu bienestar es nuestra prioridad</span>
          </div>

          <div className="login-status-list">
            <div className="login-status-item">
              <span className="login-status-dot green"></span>
              <span>Registro Seguro</span>
            </div>
            <div className="login-status-item">
              <span className="login-status-dot blue"></span>
              <span>Datos Protegidos</span>
            </div>
            <div className="login-status-item">
              <span className="login-status-dot purple"></span>
              <span>Soporte 24/7</span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="login-main">
      {/* Sección izquierda - Login */}
      <section className="login-section-left">
        <div className="login-form-container">
          <h1 className="login-title">
            Tu centro de control para bienestar estudiantil.
          </h1>
          <p className="login-desc">
            Ingresa tus credenciales para acceder al sistema psicológico.
          </p>

          {error && <p className="login-error">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Email */}
            <div className="login-input-group">
              <Mail className="login-input-icon" size={20} />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email o número de control"
                className="login-input"
                autoComplete="username"
              />
            </div>
            {/* Contraseña */}
            <div className="login-input-group">
              <KeyRound className="login-input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="login-input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "4px",
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* ID Institución */}
            <div className="login-input-group">
              <Building className="login-input-icon" size={20} />
              <input
                type="number"
                value={institucionId}
                onChange={(e) => setInstitucionId(e.target.value)}
                placeholder="ID de Institución (opcional)"
                className="login-input"
              />
            </div>

            <button type="submit" disabled={loading} className="login-submit">
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/*-----------------Quitar cuando se ponga modulo de recuperacion de contraseña
          <p className="login-recover">
            ¿Olvidaste tu contraseña?{" "}
            <a href="#" className="login-recover-link">
              Recupérala
            </a>
          </p>
          */}

          {/* Separador */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "20px 0",
              gap: "10px",
            }}
          >
            <div
              style={{ flex: 1, height: "1px", background: "#e5e7eb" }}
            ></div>
            <span style={{ color: "#6b7280", fontSize: "14px" }}>o</span>
            <div
              style={{ flex: 1, height: "1px", background: "#e5e7eb" }}
            ></div>
          </div>

          {/* Botón de registro para estudiantes */}
          <button
            type="button"
            onClick={() => setShowRegistro(true)}
            className="login-submit"
            style={{
              background: "#10b981",
              borderColor: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <UserPlus size={20} />
            Registrarse como Estudiante
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "10px",
            }}
          >
            ¿Eres estudiante nuevo? Regístrate con tu número de control
          </p>
        </div>
      </section>

      {/* Sección derecha - Imagen y mensaje */}
      <section
        className="login-section-right"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "#2b333c",
        }}
      >
        <div className="login-badge">Sistema Seguro y Confiable</div>

        <div className="login-right-content">
          <h2>Cuidando el Bienestar Estudiantil</h2>
          <p>
            Plataforma integral para psicólogos, orientadores y estudiantes.
            Construyendo comunidades educativas más saludables y resilientes.
          </p>
          <span className="login-highlight">La salud mental es prioridad</span>
        </div>

        <div className="login-status-list">
          <div className="login-status-item">
            <span className="login-status-dot green"></span>
            <span>Sistema Activo</span>
          </div>
          <div className="login-status-item">
            <span className="login-status-dot blue"></span>
            <span>Datos Protegidos</span>
          </div>
          <div className="login-status-item">
            <span className="login-status-dot purple"></span>
            <span>24/7 Disponible</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
