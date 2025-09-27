// src/pages/TerminosPage.jsx
import { useLocation } from "react-router-dom";

export default function TerminosPage() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Encabezado con barra de color */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
          <h1 className="text-3xl font-bold text-white text-center">
            Términos y Condiciones de Uso
          </h1>
        </div>

        {/* Contenido */}
        <div className="p-10">
          <p className="text-sm text-gray-500 mb-6">
            Estás en: <code>{pathname}</code>
          </p>

          <p className="text-gray-600 mb-6 text-justify">
            Bienvenido al <strong>Sistema Psicológico Integral</strong>, una
            plataforma desarrollada por el Tecnológico Nacional de México Campus
            Tuxtepec, cuyo objetivo es ofrecer herramientas de apoyo psicológico
            y académico para estudiantes.
          </p>

          {/* Secciones */}
          <Section
            number="1"
            title="Aceptación de los Términos"
            text="Al acceder y utilizar el Sistema Psicológico Integral, usted acepta quedar sujeto a los presentes Términos y Condiciones. En caso de no estar de acuerdo, le solicitamos no utilizar la plataforma."
          />
          <Section
            number="2"
            title="Uso del Servicio"
            text="El uso del sistema está destinado únicamente para fines educativos y de orientación psicológica. Está prohibido utilizar la plataforma para actividades ilícitas, lucrativas o que atenten contra la integridad de terceros."
          />
          <Section
            number="3"
            title="Privacidad y Protección de Datos"
            text="El tratamiento de los datos personales recabados se rige conforme a lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), así como en nuestro Aviso de Privacidad disponible en el sitio web."
          />
          <Section
            number="4"
            title="Responsabilidad del Usuario"
            text="El usuario se compromete a proporcionar información veraz y a utilizar la plataforma de manera responsable. Cualquier uso indebido será motivo de suspensión de acceso al servicio."
          />
          <Section
            number="5"
            title="Limitación de Responsabilidad"
            text="El Sistema Psicológico Integral es un sistema de apoyo y orientación. No sustituye tratamientos médicos o psicológicos profesionales. El Tecnológico Nacional de México Campus Tuxtepec no será responsable por un uso distinto al establecido."
          />
          <Section
            number="6"
            title="Modificaciones"
            text="El Tecnológico Nacional de México Campus Tuxtepec se reserva el derecho de modificar los presentes Términos y Condiciones en cualquier momento. Los cambios serán publicados en el sitio web."
          />

          <p className="text-gray-500 text-center text-sm mt-10">
            Última actualización: Septiembre 2025
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, text }) {
  return (
    <div className="mb-8">
      <h2 className="flex items-center text-xl font-semibold text-gray-800 mb-2">
        <span className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold">
          {number}
        </span>
        {title}
      </h2>
      <p className="text-gray-600 text-justify">{text}</p>
      <div className="border-b border-gray-200 mt-4"></div>
    </div>
  );
}