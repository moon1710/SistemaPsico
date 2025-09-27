// src/pages/ConfidencialidadPage.jsx
import { ShieldCheck, Lock, FileText, UserCheck, Archive } from "lucide-react";

export default function ConfidencialidadPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-200 via-pink-200 to-purple-200 p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          Política de Confidencialidad
        </h1>
        <p className="text-center text-gray-600 mb-10">
          En el <strong>Sistema Psicológico Integral</strong>, protegemos la información personal de nuestros usuarios con los más altos estándares de confidencialidad y seguridad.
        </p>

        {/* Grid de secciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Alcance */}
          <div className="bg-gradient-to-tr from-indigo-100 to-purple-100 p-6 rounded-2xl shadow-md">
            <div className="flex items-center mb-3">
              <FileText className="text-indigo-600 w-7 h-7 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">1. Alcance</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Aplica a toda la información personal, académica o psicológica proporcionada dentro de la plataforma Jacaranda.
            </p>
          </div>

          {/* Manejo */}
          <div className="bg-gradient-to-tr from-pink-100 to-indigo-100 p-6 rounded-2xl shadow-md">
            <div className="flex items-center mb-3">
              <ShieldCheck className="text-pink-600 w-7 h-7 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">2. Manejo</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Los datos serán utilizados exclusivamente para los fines establecidos y no se compartirán sin autorización o mandato legal.
            </p>
          </div>

          {/* Acceso */}
          <div className="bg-gradient-to-tr from-purple-100 to-pink-100 p-6 rounded-2xl shadow-md">
            <div className="flex items-center mb-3">
              <Lock className="text-purple-600 w-7 h-7 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">3. Acceso Restringido</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Solo personal autorizado puede acceder a la información, bajo principios de ética y responsabilidad profesional.
            </p>
          </div>

          {/* Conservación */}
          <div className="bg-gradient-to-tr from-indigo-100 to-pink-100 p-6 rounded-2xl shadow-md">
            <div className="flex items-center mb-3">
              <Archive className="text-indigo-600 w-7 h-7 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">4. Conservación</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Los datos se conservarán solo el tiempo necesario y luego serán eliminados de manera segura.
            </p>
          </div>

          {/* Compromiso */}
          <div className="bg-gradient-to-tr from-pink-100 to-purple-100 p-6 rounded-2xl shadow-md md:col-span-2">
            <div className="flex items-center mb-3">
              <UserCheck className="text-pink-600 w-7 h-7 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">5. Compromiso Institucional</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Jacaranda cumple con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), garantizando la seguridad de tu información.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-center text-sm mt-10">
          Última actualización: Septiembre 2025
        </p>
      </div>
    </div>
  );
}

