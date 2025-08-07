import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import {
  Shield,
  TrendingUp,
  Users,
  Settings,
  Brain,
  CheckCircle,
  Heart,
  BookOpen,
  Calendar,
} from "lucide-react";
import { ROUTES } from "../utils/constants";

// Placeholder para imagen de fondo - puedes reemplazar con tu imagen
const backgroundImage = "/src/assets/psychology-bg.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-20"
          style={{
            backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <p className="text-sm text-gray-600 mb-8 font-medium">
            Sistema Psicológico Integral
          </p>
          <h1 className="text-5xl uppercase md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Bienestar estudiantil{" "}
            <span className="text-blue-600">simplificado</span>
          </h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            La plataforma integral para instituciones educativas donde
            psicólogos, orientadores y estudiantes trabajan juntos para promover
            la salud mental y el bienestar académico.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg">
              Acceder al Sistema
            </Button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Una plataforma en la que puedes confiar
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Diseñado específicamente para el entorno educativo, garantizando la
            privacidad y el cuidado que los estudiantes merecen.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Privacidad y confidencialidad
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Cumplimos con los más altos estándares de privacidad y
                  confidencialidad para proteger la información personal y
                  psicológica de los estudiantes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Seguimiento integral del bienestar
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Herramientas de evaluación psicológica y seguimiento que
                  permiten detectar tempranamente situaciones de riesgo y
                  brindar apoyo oportuno.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Colaboración interdisciplinaria
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Facilita la comunicación entre psicólogos, orientadores y
                  personal académico para un enfoque integral del bienestar
                  estudiantil.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Cómo funciona nuestro sistema
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Un proceso simple y efectivo para el cuidado integral de la salud
            mental estudiantil.
          </p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                1. Evaluación
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Los estudiantes completan evaluaciones psicológicas validadas
                que ayudan a identificar áreas de atención y fortalezas
                personales.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                2. Canalización
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Basándose en los resultados, los psicólogos canalizan casos que
                requieren atención especializada hacia los recursos apropiados.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                3. Seguimiento
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Se programan sesiones de seguimiento y se mantiene un registro
                detallado del progreso para asegurar el bienestar continuo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Diseñado para cada rol en tu institución
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Psicólogos</h3>
                <p className="text-sm text-gray-600">
                  Aplican evaluaciones, canalizan casos y realizan seguimiento
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Orientadores</h3>
                <p className="text-sm text-gray-600">
                  Brindan apoyo académico y personal a los estudiantes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Estudiantes</h3>
                <p className="text-sm text-gray-600">
                  Acceden a evaluaciones y reciben apoyo personalizado
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Administradores
                </h3>
                <p className="text-sm text-gray-600">
                  Gestionan usuarios y supervisan el sistema
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            ¿Listo para transformar el bienestar en tu institución?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a las instituciones que ya están cuidando la salud mental de
            sus estudiantes.
          </p>
          <Link to={ROUTES.LOGIN}>
            <Button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg">
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Sistema Psicológico
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Plataforma integral para el bienestar estudiantil, diseñada para
                instituciones educativas que priorizan la salud mental de su
                comunidad.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Dashboard
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Evaluaciones
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Canalizaciones
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Reportes
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white transition-colors cursor-pointer">
                  Centro de Ayuda
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Contacto
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Capacitación
                </li>
                <li className="hover:text-white transition-colors cursor-pointer">
                  Documentación
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Sistema Psicológico. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <span className="hover:text-white transition-colors cursor-pointer">
                Términos de Servicio
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Política de Privacidad
              </span>
              <span className="hover:text-white transition-colors cursor-pointer">
                Confidencialidad
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
