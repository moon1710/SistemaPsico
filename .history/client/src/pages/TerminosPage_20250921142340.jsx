// src/pages/TerminosPage.jsx
import { useLocation } from "react-router-dom";
export default function TerminosPage() {
  const { pathname } = useLocation();
  return (
    <div className="p-6 text-lg">
      Estás en: <code>{pathname}</code> — Términos y Condiciones
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto rounded-xl shadow-xl p-8 md:p-12 border-t-4 border-indigo-600">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-900">
          Términos y Condiciones
        </h1>
        
        <p className="mb-6 text-gray-700 leading-relaxed">
          Bienvenido a Jacaranda. Al acceder y utilizar nuestra plataforma, aceptas estar sujeto a los siguientes términos y condiciones ("Términos"). Por favor, léelos detenidamente antes de usar el servicio.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
          1. Aceptación de los Términos
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Al usar los servicios de Jacaranda, confirmas que has leído, entendido y aceptado estos Términos y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, no utilices nuestra plataforma.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
          2. Uso de la Plataforma
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          La plataforma Jacaranda está diseñada para [menciona el propósito principal, por ejemplo: proporcionar evaluaciones psicológicas y apoyo a estudiantes]. Aceptas utilizarla solo para fines legítimos y de manera que no infrinja los derechos de otros o restrinja su uso y disfrute de la plataforma.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
          3. Cuentas de Usuario
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Al crear una cuenta, eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta. Notifícanos inmediatamente de cualquier uso no autorizado de tu cuenta.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
          4. Derechos de Propiedad Intelectual
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Todos los contenidos de la plataforma (texto, gráficos, logos, etc.) son propiedad de Jacaranda o del Tecnológico Nacional de México, Campus Tuxtepec, y están protegidos por leyes de derechos de autor.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
          5. Limitación de Responsabilidad
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          La plataforma y sus servicios se proporcionan "tal como están". No garantizamos que el servicio sea ininterrumpido o libre de errores.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
          6. Cambios a los Términos
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Nos reservamos el derecho de modificar estos Términos en cualquier momento. Al continuar usando la plataforma después de los cambios, aceptas los nuevos términos.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
          7. Contacto
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Para cualquier pregunta sobre estos Términos, contáctanos en: **[Tu correo electrónico]**.
        </p>
        
      </div>
    </div>
    </div>
  );
}
