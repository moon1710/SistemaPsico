// client/src/pages/PrivacidadPage.jsx
import React from "react";

const PrivacidadPage = () => {
  const sections = [
    { id: "intro", title: "0. Introducción" },
    { id: "responsable", title: "1. Responsable del Tratamiento de Datos" },
    { id: "datos", title: "2. Datos Personales Recabados" },
    { id: "finalidades", title: "3. Finalidades del Tratamiento de Datos" },
    { id: "transferencias", title: "4. Transferencia de Datos" },
    { id: "seguridad", title: "5. Medidas de Seguridad" },
    { id: "arco", title: "6. Derechos ARCO y Revocación" },
    { id: "conservacion", title: "7. Plazo de Conservación" },
    { id: "modificaciones", title: "8. Modificaciones a la Política" },
    { id: "legislacion", title: "9. Legislación Aplicable" },
    { id: "cuestionarios", title: "10. Descargo sobre los Cuestionarios" },
    { id: "contacto", title: "11. Contacto" },
    { id: "aceptacion", title: "12. Aceptación" },
  ];

  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl bg-white shadow-xl rounded-xl">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
        Política de Privacidad del Sistema Neuroflora
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        En el Instituto Tecnológico Nacional de México, Campus Tuxtepec, estamos
        comprometidos con la protección de tu privacidad y el manejo responsable
        de tus datos personales a través del Sistema Neuroflora. <br />
        <span className="font-semibold">Fecha de última actualización:</span> 17
        de octubre de 2025.
      </p>

      {/* Índice */}
      <nav className="p-4 mb-10 bg-indigo-50 rounded-lg border border-indigo-200">
        <h2 className="text-xl font-bold text-indigo-700 mb-3">Índice</h2>
        <ul className="list-disc list-inside space-y-1 text-indigo-600">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="hover:text-indigo-800 transition duration-150 text-base"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 0. Introducción */}
      <section id="intro" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          0. Introducción
        </h2>
        <p className="text-gray-700 leading-relaxed">
          El Sistema Neuroflora es una plataforma educativa diseñada para apoyar
          el bienestar académico y emocional de los estudiantes mediante
          cuestionarios validados de detección de ansiedad y depresión. Al usar
          el Sistema, aceptas esta Política de Privacidad. Si no estás de
          acuerdo, por favor, no utilices el Sistema.
        </p>
      </section>

      {/* 1. Responsable */}
      <section id="responsable" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          1. Responsable del Tratamiento de Datos
        </h2>
        <ul className="space-y-2 text-gray-700 leading-relaxed">
          <li>
            <span className="font-semibold">Identidad:</span> Instituto
            Tecnológico Nacional de México, Campus Tuxtepec.
          </li>
          <li>
            <span className="font-semibold">Dirección:</span> Calzada Dr. Víctor
            Bravo Ahuja Num. 561, Col. Predio el Paraíso, C.P. 68350, San Juan
            Bautista Tuxtepec, Oaxaca, México.
          </li>
          <li>
            <span className="font-semibold">Correo de contacto:</span>{" "}
            <a
              href="mailto:cyd_tuxtepec@tecnm.mx"
              className="text-indigo-700 underline"
            >
              cyd_tuxtepec@tecnm.mx
            </a>
          </li>
        </ul>
        <p className="text-gray-700 mt-3 leading-relaxed">
          El Instituto es el responsable principal del tratamiento y resguardo
          de los datos personales recopilados a través del Sistema. Si se
          contratan servicios externos (por ejemplo, almacenamiento en la nube),
          los proveedores estarán obligados contractualmente a cumplir con las
          mismas medidas de protección de datos.
        </p>
      </section>

      {/* 2. Datos */}
      <section id="datos" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          2. Datos Personales Recabados
        </h2>
        <h3 className="text-xl font-semibold text-gray-700 mt-2 mb-2">
          2.1. Datos de Identificación
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>
            Nombre completo, fecha de nacimiento, género, teléfono, dirección.
          </li>
          <li>Correo electrónico institucional, carrera y semestre.</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
          2.2. Datos Sensibles
        </h3>
        <p className="text-gray-700 mb-2">
          Respuestas y resultados de cuestionarios de ansiedad y depresión,
          considerados datos personales sensibles (LGPDPSO art. 3 fr. XIII;
          LFPDPPP art. 3 fr. VI).
        </p>
        <p className="text-gray-700">
          No recopilamos datos biométricos, financieros u otros no esenciales.
          Los datos se obtienen directamente de ti o de fuentes institucionales
          autorizadas.
        </p>
      </section>

      {/* 3. Finalidades */}
      <section id="finalidades" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          3. Finalidades del Tratamiento de Datos
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Tratamos tus datos bajo los principios de licitud, consentimiento,
          información, calidad, finalidad, lealtad, proporcionalidad y
          responsabilidad (LGPDPSO art. 16).
        </p>
        <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
          3.1. Finalidades Primarias
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>Registro, acceso y funcionamiento personalizado del Sistema.</li>
          <li>Generación de resultados de cuestionarios.</li>
          <li>Seguimiento académico y psicológico por personal autorizado.</li>
          <li>Envío de notificaciones relacionadas con tu bienestar.</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
          3.2. Finalidades Secundarias
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>
            Estadísticas e informes con datos anonimizados para investigación.
          </li>
          <li>Mejora de funcionalidades y experiencia del Sistema.</li>
        </ul>
        <p className="text-gray-700 mt-2">
          Puedes oponerte a fines secundarios escribiendo a{" "}
          <a
            href="mailto:cyd_tuxtepec@tecnm.mx"
            className="text-indigo-700 underline"
          >
            cyd_tuxtepec@tecnm.mx
          </a>
          .
        </p>
      </section>

      {/* 4. Transferencias */}
      <section id="transferencias" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          4. Transferencia de Datos
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>
            <span className="font-semibold">Sin consentimiento:</span> Solo en
            supuestos legales (LFPDPPP art. 37; LGPDPSO art. 70).
          </li>
          <li>
            <span className="font-semibold">Dentro del Instituto:</span> Con
            tutores/psicólogos/personal autorizado bajo confidencialidad.
          </li>
          <li>
            <span className="font-semibold">Internacionales:</span> Si aplica,
            cláusulas contractuales para garantizar protección equivalente.
          </li>
        </ul>
      </section>

      {/* 5. Seguridad */}
      <section id="seguridad" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          5. Medidas de Seguridad
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Medidas administrativas, técnicas y físicas (LGPDPSO arts. 18 y 31;
          LFPDPPP art. 19):
        </p>
        <h3 className="text-lg font-semibold text-gray-700 mt-3 mb-2">
          Técnicas
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>Cifrado (p. ej., AES-256) de resultados de cuestionarios.</li>
          <li>Firewalls, IDS/IPS y respaldos seguros.</li>
        </ul>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
          Administrativas
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>Acceso restringido, capacitación y auditorías periódicas.</li>
        </ul>
        <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
          Físicas
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>Servidores en instalaciones seguras con acceso controlado.</li>
        </ul>
        <p className="text-gray-700 mt-3">
          En caso de brecha, se notificará a usuarios y al INAI dentro de 72
          horas y se mitigará el impacto.
        </p>
      </section>

      {/* 6. ARCO */}
      <section id="arco" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          6. Derechos ARCO y Revocación de Consentimiento
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Para ejercer Acceso, Rectificación, Cancelación y Oposición, o revocar
          consentimiento, envía correo a{" "}
          <a
            href="mailto:cyd_tuxtepec@tecnm.mx"
            className="text-indigo-700 underline"
          >
            cyd_tuxtepec@tecnm.mx
          </a>{" "}
          con: nombre completo, identificación, descripción de la petición y
          medio de contacto. Responderemos en un máximo de 20 días hábiles
          (LFPDPPP art. 32). Si revocas, podrías perder acceso a ciertas
          funcionalidades esenciales.
        </p>
        <p className="text-gray-700 mt-2">
          Si consideras vulnerados tus derechos, puedes presentar una queja ante
          el INAI.
        </p>
      </section>

      {/* 7. Conservación */}
      <section id="conservacion" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          7. Plazo de Conservación de Datos
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Conservaremos tus datos solo el tiempo necesario para las finalidades
          descritas o mientras seas estudiante activo, salvo obligación legal
          mayor. Concluido el período, se eliminarán o anonimizarán para fines
          estadísticos (LFPDPPP art. 13; LGPDPSO art. 27).
        </p>
      </section>

      {/* 8. Modificaciones */}
      <section id="modificaciones" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          8. Modificaciones a la Política
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Podremos actualizar esta Política por cambios normativos o de
          práctica. Las modificaciones se publicarán en el Sistema y, cuando
          corresponda, se notificarán por correo. El uso continuado implica
          aceptación.
        </p>
      </section>

      {/* 9. Legislación */}
      <section id="legislacion" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          9. Legislación Aplicable
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
          <li>
            <span className="font-semibold">
              Ley General de Protección de Datos Personales en Posesión de
              Sujetos Obligados (2017)
            </span>
            : arts. 3, 16, 18, 22, 31, 64.
          </li>
          <li>
            <span className="font-semibold">
              Ley Federal de Protección de Datos Personales en Posesión de los
              Particulares (2010)
            </span>
            : arts. 8, 12, 15, 19.
          </li>
          <li>
            Otras: Constitución (art. 16), Reglamento de la LFPDPPP y
            lineamientos del INAI.
          </li>
        </ul>
        <p className="text-gray-700 mt-3">
          En caso de controversias, se resolverán en tribunales competentes de
          Oaxaca, México, tras intentar una solución amistosa con el Instituto.
        </p>
      </section>

      {/* 10. Descargo */}
      <section id="cuestionarios" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          10. Descargo sobre los Cuestionarios
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Los cuestionarios de ansiedad y depresión son herramientas educativas
          y de detección preliminar; no sustituyen un diagnóstico profesional.
          Busca atención por un psicólogo o médico calificado si los resultados
          sugieren problemas de salud mental. El Instituto no asume
          responsabilidad por decisiones basadas en los resultados del Sistema.
        </p>
      </section>

      {/* 11. Contacto */}
      <section id="contacto" className="mb-10 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          11. Contacto
        </h2>
        <div className="mt-2 p-4 bg-indigo-50 border-2 border-indigo-300 rounded-lg">
          <p className="text-gray-700">
            Correo:{" "}
            <a
              href="mailto:cyd_tuxtepec@tecnm.mx"
              className="text-indigo-700 underline"
            >
              cyd_tuxtepec@tecnm.mx
            </a>
          </p>
          <p className="text-gray-700">
            Dirección: Calzada Dr. Víctor Bravo Ahuja Num. 561, Col. Predio el
            Paraíso, C.P. 68350, San Juan Bautista Tuxtepec, Oaxaca.
          </p>
        </div>
      </section>

      {/* 12. Aceptación */}
      <section id="aceptacion" className="mb-2 pt-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
          12. Aceptación
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Al usar el Sistema Neuroflora, confirmas que has leído, entendido y
          aceptado esta Política de Privacidad en su totalidad.
        </p>
      </section>
    </main>
  );
};

export default PrivacidadPage;
