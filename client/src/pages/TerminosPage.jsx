// client/src/pages/TerminosPage.jsx
import React from "react";

const TerminosPage = () => {
  // Índice de contenidos
  const sections = [
    { id: "introduccion", title: "1. Introducción y Alcance" },
    { id: "responsable", title: "2. Responsable del Tratamiento" },
    { id: "datos", title: "3. Datos Personales que Recabamos" },
    { id: "finalidades", title: "4. Finalidades del Tratamiento" },
    { id: "transferencias", title: "5. Transferencia de Datos" },
    { id: "seguridad", title: "6. Medidas de Seguridad" },
    { id: "arco", title: "7. Derechos ARCO y Procedimiento" },
    { id: "modificaciones", title: "8. Modificaciones al Aviso" },
    { id: "legislacion", title: "9. Legislación Aplicable" },
    { id: "contacto", title: "10. Contacto" },
  ];

  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl bg-white shadow-xl rounded-xl">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
        Términos y Condiciones — Sistema Psicológico Neuroflora
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        Última actualización:{" "}
        <span className="font-semibold">16 de octubre de 2025</span>.
      </p>

      {/* ÍNDICE */}
      <nav className="p-4 mb-10 bg-indigo-50 rounded-lg border border-indigo-200">
        <h2 className="text-xl font-bold text-indigo-700 mb-3">
          Índice de Contenidos
        </h2>
        <ul className="list-disc list-inside space-y-1 text-indigo-600">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="hover:text-indigo-800 transition duration-150 text-base"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 1. INTRODUCCIÓN */}
      <section id="introduccion" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          1. Introducción y Alcance
        </h2>
        <p className="text-gray-700 leading-relaxed">
          En Neuroflora, respetamos tu privacidad y protegemos tus datos
          personales en cumplimiento con la{" "}
          <strong>
            Ley Federal de Protección de Datos Personales en Posesión de los
            Particulares (LFPDPPP, 2010)
          </strong>{" "}
          y la{" "}
          <strong>
            Ley General de Protección de Datos Personales en Posesión de Sujetos
            Obligados (LGPDPSO, 2017)
          </strong>
          . El Instituto Tecnológico Nacional de México, Campus Tuxtepec, pone a
          disposición de los usuarios este Aviso de Privacidad para informar
          sobre el tratamiento y protección de los datos personales recabados a
          través del sistema Neuroflora.
        </p>
      </section>

      {/* 2. RESPONSABLE */}
      <section id="responsable" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          2. Responsable del Tratamiento
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          <strong>
            Instituto Tecnológico Nacional de México, Campus Tuxtepec
          </strong>
        </p>
        <ul className="text-gray-700 space-y-1 ml-4 list-disc">
          <li>
            <strong>Dirección:</strong> Calzada Dr. Víctor Bravo Ahuja Num. 561,
            Col. Predio el Paraíso, C.P. 68350, San Juan Bautista Tuxtepec,
            Oaxaca.
          </li>
          <li>
            <strong>Correo de contacto:</strong>{" "}
            <a
              href="mailto:cyd_tuxtepec@tecnm.mx"
              className="text-indigo-700 font-semibold hover:underline"
            >
              cyd_tuxtepec@tecnm.mx
            </a>
          </li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-3">
          El Instituto es responsable del tratamiento y resguardo de los datos
          personales recabados mediante el sistema Neuroflora.
        </p>
      </section>

      {/* 3. DATOS PERSONALES */}
      <section id="datos" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          3. Datos Personales que Recabamos
        </h2>
        <p className="text-gray-700 mb-3">
          El sistema podrá solicitar y almacenar los siguientes datos:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
          <li>
            <strong>Identificación y contacto:</strong> Nombre completo, fecha
            de nacimiento, género, teléfono, dirección (calle, ciudad, estado),
            correo electrónico.
          </li>
          <li>
            <strong>Datos académicos:</strong> Carrera y semestre.
          </li>
          <li>
            <strong>Evaluaciones psicológicas:</strong> Respuestas y resultados
            de cuestionarios psicológicos de ansiedad y depresión.
          </li>
        </ul>
        <p className="text-gray-700 mt-4">
          <strong>Nota:</strong> Los resultados de los cuestionarios son
          considerados <strong>datos sensibles</strong>, conforme a la
          legislación vigente.
        </p>
      </section>

      {/* 4. FINALIDADES */}
      <section id="finalidades" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          4. Finalidades del Tratamiento
        </h2>

        <h3 className="text-xl font-semibold text-gray-700 mt-2 mb-2">
          4.1. Primarias
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
          <li>Permitir el acceso y correcto funcionamiento del sistema.</li>
          <li>
            Generar reportes de apoyo para la detección de ansiedad y depresión.
          </li>
          <li>
            Facilitar el seguimiento académico y psicológico por tutores y
            personal autorizado.
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
          4.2. Secundarias (opcionales)
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
          <li>Elaborar estadísticas e informes con información anonimizada.</li>
          <li>Mejorar el sistema y sus funcionalidades.</li>
        </ul>
      </section>

      {/* 5. TRANSFERENCIAS */}
      <section id="transferencias" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          5. Transferencia de Datos
        </h2>
        <p className="text-gray-700 leading-relaxed mb-3">
          Los datos personales no serán transferidos a terceros sin
          consentimiento previo del titular, salvo en los casos previstos por la
          ley. La información podrá compartirse únicamente con tutores y
          personal autorizado de la institución para fines académicos y de
          apoyo.
        </p>
      </section>

      {/* 6. SEGURIDAD */}
      <section id="seguridad" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          6. Medidas de Seguridad
        </h2>
        <p className="text-gray-700 mb-3">
          El sistema implementa medidas de seguridad administrativas, técnicas y
          físicas para proteger la información:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
          <li>Cifrado de datos sensibles.</li>
          <li>Acceso restringido a usuarios autorizados.</li>
          <li>Autenticación mediante contraseñas seguras.</li>
          <li>Registro de accesos y auditorías periódicas.</li>
        </ul>
      </section>

      {/* 7. ARCO */}
      <section id="arco" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          7. Derechos ARCO y Procedimiento
        </h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          El usuario puede ejercer sus derechos de{" "}
          <strong>Acceso, Rectificación, Cancelación u Oposición (ARCO)</strong>{" "}
          sobre sus datos personales mediante una solicitud enviada al correo:{" "}
          <a
            href="mailto:cyd_tuxtepec@tecnm.mx"
            className="text-indigo-700 font-semibold hover:underline"
          >
            cyd_tuxtepec@tecnm.mx
          </a>
          .
        </p>
        <p className="text-gray-700 mb-2">La solicitud deberá incluir:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
          <li>Nombre completo del titular.</li>
          <li>Descripción clara de la petición.</li>
          <li>Un medio de contacto para dar respuesta.</li>
        </ul>
      </section>

      {/* 8. MODIFICACIONES */}
      <section id="modificaciones" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          8. Modificaciones al Aviso
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Este Aviso de Privacidad podrá actualizarse en cualquier momento. Las
          modificaciones serán publicadas directamente en el sistema Neuroflora
          y entrarán en vigor desde su publicación.
        </p>
      </section>

      {/* 9. LEGISLACIÓN */}
      <section id="legislacion" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          9. Legislación Aplicable
        </h2>
        <div className="space-y-4 text-gray-700">
          <div>
            <p className="font-semibold mb-1">
              Ley General de Protección de Datos Personales en Posesión de
              Sujetos Obligados (LGPDPSO, 2017)
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>
                Artículo 3 (fracciones IX y XIII): define datos personales y
                sensibles.
              </li>
              <li>
                Artículo 16: principios de licitud, finalidad, lealtad,
                consentimiento, calidad, proporcionalidad e información.
              </li>
              <li>
                Artículo 18: seguridad de datos mediante medidas
                administrativas, técnicas y físicas.
              </li>
              <li>
                Artículo 22: obligación de contar con Aviso de Privacidad.
              </li>
              <li>
                Artículo 31: medidas de confidencialidad, integridad y
                disponibilidad.
              </li>
              <li>Artículo 64: sanciones por incumplimiento.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">
              Ley Federal de Protección de Datos Personales en Posesión de los
              Particulares (LFPDPPP, 2010)
            </p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Artículo 8: consentimiento del titular.</li>
              <li>
                Artículo 12: prohibición de usos distintos a lo señalado en el
                aviso.
              </li>
              <li>
                Artículo 15: contenido obligatorio del Aviso de Privacidad.
              </li>
              <li>Artículo 19: medidas de seguridad obligatorias.</li>
              <li>
                Artículo 20: uso restringido por encargados del tratamiento.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 10. CONTACTO */}
      <section id="contacto" className="mb-2 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          10. Contacto
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Para cualquier duda o aclaración relacionada con este Aviso de
          Privacidad, por favor escribe a:{" "}
          <a
            href="mailto:cyd_tuxtepec@tecnm.mx"
            className="text-indigo-700 font-semibold hover:underline"
          >
            cyd_tuxtepec@tecnm.mx
          </a>
        </p>
      </section>
    </main>
  );
};

export default TerminosPage;
