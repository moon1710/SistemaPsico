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
          <h1 className="text-44 md:text-5xl font-extrabold text-center mb-8 text-gray-900">
            Términos y Condiciones de Uso
          </h1>

          <p className="mb-6 text-gray-700 leading-relaxed">
            El presente documento establece los Términos y Condiciones de Uso aplicables al sitio web Jacaranda, operado en colaboración con el Tecnológico Nacional de México, Campus Tuxtepec, con domicilio en Calzada Dr. Víctor Bravo Ahuja No. 561, Col. Predio El Paraíso, C.P. 68350, San Juan Bautista Tuxtepec, Oaxaca.

Al acceder y utilizar este sitio web, el usuario declara haber leído, entendido y aceptado los presentes Términos. Si no está de acuerdo, deberá abstenerse de usar el sitio y los servicios.
          </p>

          {/* Sección 1 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            1. Aceptación de los Términos
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            El uso de este sitio implica la aceptación plena y sin reservas de
            estos Términos y Condiciones. Si no está de acuerdo, deberá abstenerse
            de utilizar la plataforma.
          </p>

          {/* Sección 2 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            2. Uso del Sitio y Servicios
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            La plataforma de Jacaranda tiene como finalidad ofrecer soluciones
            personalizadas para la evaluación de la ansiedad y el estrés mediante
            un test especializado. Usted se compromete a utilizar los servicios
            de manera lícita y respetuosa, sin infringir derechos de terceros ni
            afectar la operatividad del sitio.
          </p>

          {/* Sección 3 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            3. Edad y Capacidad Legal
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Para usar nuestros servicios, el usuario deberá tener al menos 12
            años de edad o la mayoría de edad legal en su jurisdicción, y contar
            con capacidad jurídica para obligarse en términos de la legislación
            aplicable.
          </p>

          {/* Sección 4 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            4. Propiedad Intelectual
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Todo el contenido del sitio, incluyendo textos, gráficos, logotipos,
            imágenes, software y demás materiales, es propiedad exclusiva de
            Jacaranda o del Tecnológico Nacional de México Campus Tuxtepec y
            está protegido por la legislación en materia de derechos de autor y
            propiedad industrial. No se otorgan licencias ni derechos sobre dicho
            contenido salvo autorización expresa y por escrito.
          </p>

          {/* Sección 5 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            5. Limitación de Responsabilidad
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Jacaranda no será responsable por daños directos o indirectos,
            incidentales, consecuenciales o punitivos que resulten del uso o
            imposibilidad de uso de la plataforma. El servicio se proporciona
            “tal cual” y sin garantías de disponibilidad, exactitud o
            ininterrupción.
          </p>

          {/* Sección 6 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            6. Protección de Datos Personales
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Jacaranda tratará los datos personales recabados conforme a la Ley
            Federal de Protección de Datos Personales en Posesión de los
            Particulares (LFPDPPP) y demás normativa aplicable. Para conocer más
            sobre el tratamiento de datos, consulte nuestro Aviso de Privacidad.
          </p>

          {/* Sección 7 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            7. Modificaciones a los Términos
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Nos reservamos el derecho de actualizar o modificar estos Términos y
            Condiciones en cualquier momento. Los cambios serán publicados en el
            sitio web y entrarán en vigor a partir de su publicación. El uso
            continuado del servicio constituye aceptación de dichas
            modificaciones.
          </p>

          {/* Sección 8 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            8. Suspensión o Cancelación de Servicios
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Jacaranda podrá suspender temporal o definitivamente el acceso al
            servicio en caso de detectar incumplimiento a estos Términos o
            cualquier conducta que vulnere la ley, los derechos de terceros o la
            seguridad de la plataforma.
          </p>

          {/* Sección 9 */}
          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-green-500 pb-2">
            9. Contacto
          </h2>
          <p className="mb-4 text-gray-700 leading-relaxed">
            Para cualquier duda, aclaración o comentario respecto a estos
            Términos y Condiciones, puede escribirnos a:{" "}
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
