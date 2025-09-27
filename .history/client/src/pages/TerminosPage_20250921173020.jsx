// src/pages/TerminosPage.jsx
import { useLocation } from "react-router-dom";

export default function TerminosPage() {
  const { pathname } = useLocation();

  return (
    
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6">
        <section className="hero-section">
      <div className="bg-white shadow-2xl rounded-2xl max-w-4xl w-full p-10 overflow-y-auto">
        Estás en: <code>{pathname}</code>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Términos y Condiciones de Uso
        </h1>

        <p className="text-gray-600 mb-4">
          Bienvenido a <strong>Sistema Psicológico Integral</strong>, una plataforma desarrollada
          por el Tecnológico Nacional de México Campus Tuxtepec, cuyo objetivo
          es ofrecer herramientas de apoyo psicológico y académico para
          estudiantes.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          1. Aceptación de los Términos
        </h2>
        <p className="text-gray-600 mb-4">
          Al acceder y utilizar el sitio web Jacaranda, usted acepta quedar
          sujeto a los presentes Términos y Condiciones. En caso de no estar de
          acuerdo, le solicitamos no utilizar la plataforma.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          2. Uso del Servicio
        </h2>
        <p className="text-gray-600 mb-4">
          El uso del sistema está destinado únicamente para fines educativos y
          de orientación psicológica. Está prohibido utilizar la plataforma para
          actividades ilícitas, lucrativas o que atenten contra la integridad de
          terceros.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          3. Privacidad y Protección de Datos
        </h2>
        <p className="text-gray-600 mb-4">
          El tratamiento de los datos personales recabados se rige conforme a
          lo establecido en la Ley General de Protección de Datos Personales en
          Posesión de Sujetos Obligados, así como en nuestro Aviso de
          Privacidad, disponible en el sitio web.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          4. Responsabilidad del Usuario
        </h2>
        <p className="text-gray-600 mb-4">
          El usuario se compromete a proporcionar información veraz y a utilizar
          la plataforma de manera responsable. Cualquier uso indebido será
          motivo de suspensión de acceso al servicio.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          5. Limitación de Responsabilidad
        </h2>
        <p className="text-gray-600 mb-4">
          Jacaranda es un sistema de apoyo y orientación. No sustituye
          tratamientos médicos o psicológicos profesionales. El Tecnológico
          Nacional de México Campus Tuxtepec no será responsable por un uso
          distinto al establecido.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          6. Modificaciones
        </h2>
        <p className="text-gray-600 mb-4">
          El Tecnológico Nacional de México Campus Tuxtepec se reserva el
          derecho de modificar los presentes Términos y Condiciones en cualquier
          momento. Los cambios serán publicados en el sitio web.
        </p>

        <p className="text-gray-600 mt-8 text-sm text-center">
          Última actualización: Septiembre 2025
        </p>
      </div>
      </section>
    </div>
  );
}
