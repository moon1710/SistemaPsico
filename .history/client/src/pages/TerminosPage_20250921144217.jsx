// src/pages/TerminosPage.jsx
import { useLocation } from "react-router-dom";

export default function TerminosPage() {
  const { pathname } = useLocation();

  return (
    <div className="p-6 text-lg bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <p className="mb-4 text-sm text-gray-600">
          Estás en: <code>{pathname}</code>
        </p>

        <div className="bg-white py-12 px-6 sm:px-10 lg:px-16 rounded-xl shadow-xl border-t-4 border-indigo-600">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-900">
            Términos y Condiciones
          </h1>

          <p className="mb-6 text-gray-700 leading-relaxed">
            Bienvenido a <strong>Jacaranda</strong>. Al acceder y utilizar nuestra
            plataforma aceptas estar sujeto a los siguientes términos y
            condiciones ("Términos"). Por favor, léelos detenidamente antes de
            usar el servicio.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            1. Aceptación de los Términos
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Al usar los servicios de Jacaranda confirmas que has leído,
            entendido y aceptado estos Términos y todas las leyes y regulaciones
            aplicables. Si no estás de acuerdo con alguno de estos términos, no
            utilices nuestra plataforma.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            2. Uso de la Plataforma
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            La plataforma está diseñada para ofrecer soluciones personalizadas
            de evaluación y orientación frente a la ansiedad y el estrés a
            través de un test especializado. Te comprometes a utilizar el
            servicio solo para fines legítimos, sin infringir derechos de
            terceros ni afectar el funcionamiento del sitio.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            3. Cuentas de Usuario
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Al crear una cuenta eres responsable de:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 leading-relaxed">
            <li>Mantener la confidencialidad de tus credenciales.</li>
            <li>Informar de inmediato sobre cualquier uso no autorizado.</li>
            <li>Asegurarte de que la información proporcionada sea veraz.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            4. Propiedad Intelectual
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Todos los contenidos, software, logotipos, textos, gráficos y demás
            materiales del sitio son propiedad exclusiva de Jacaranda y/o del
            Tecnológico Nacional de México Campus Tuxtepec. No está permitido
            copiarlos, reproducirlos o distribuirlos sin autorización expresa.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            5. Limitación de Responsabilidad
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Jacaranda no será responsable de daños indirectos, incidentales,
            especiales o consecuenciales que resulten del uso o imposibilidad de
            uso del servicio. El servicio se proporciona “tal como está”, sin
            garantía de disponibilidad continua o ausencia de errores.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            6. Protección de Datos Personales
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            El tratamiento de los datos personales recabados a través de la
            plataforma se realiza conforme a la Ley Federal de Protección de
            Datos Personales en Posesión de los Particulares (LFPDPPP) y demás
            normativa aplicable. Para más información, consulta nuestro Aviso de
            Privacidad.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            7. Cambios a los Términos
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Nos reservamos el derecho de modificar estos Términos en cualquier
            momento. Te notificaremos sobre cambios relevantes y el uso continuo
            de la plataforma implica la aceptación de los nuevos términos.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            8. Contacto
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Para dudas o comentarios sobre estos Términos, puedes escribirnos a{" "}
            <a
              href="mailto:contacto@jacaranda.mx"
              className="text-indigo-600 hover:underline"
            >
              contacto@jacaranda.mx
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

