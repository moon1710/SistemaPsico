// client/src/pages/PrivacidadPage.jsx
import React from 'react';

const PrivacidadPage = () => {
    // Definición de las secciones para el índice
    const sections = [
        { id: "recoleccion", title: "1. Recolección de Información" },
        { id: "uso", title: "2. Uso de la Información Recolectada" },
        { id: "comparticion", title: "3. Compartición con Terceros" },
        { id: "derechos", title: "4. Derechos del Usuario (ARCO)" },
        { id: "contacto", title: "5. Contacto y Revisión" },
    ];

    return (
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl bg-white shadow-xl rounded-xl">
            <h1 className="text-4xl font-extrabold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
                Política de Privacidad
            </h1>
            <p className="text-sm text-gray-500 mb-8">
                Neuroflora está comprometida con la protección de la privacidad y los datos
                personales de nuestros usuarios.
                <br />
                Última revisión: 11 de Octubre de 2025.
            </p>

            {/* ÍNDICE DE CONTENIDOS (Mantenemos la estructura de la página de Términos) */}
            <nav className="p-4 mb-10 bg-indigo-50 rounded-lg border border-indigo-200">
                <h2 className="text-xl font-bold text-indigo-700 mb-3">Índice de Contenidos</h2>
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

            {/* ========================================================= */}
            {/* SECCIÓN 1: Recolección de Información                     */}
            {/* ========================================================= */}
            <section id="recoleccion" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    1. Recolección de Información
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Neuroflora recolecta información necesaria para proveer y mejorar nuestros
                    servicios de apoyo psicológico. Esta información se divide en dos categorías:
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    1.1. Información Personal de Identificación (IPI)
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li className='text-base'>
                        **Datos de Cuenta:** Nombre, correo institucional, identificador de estudiante.
                    </li>
                    <li className='text-base'>
                        **Datos de Contacto:** Número de teléfono (opcional para recordatorios de citas).
                    </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    1.2. Datos Sensibles y de Uso del Servicio
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li className='text-base'>
                        **Datos de Sesiones:** Notas de sesiones con psicólogos y registros de citas.
                    </li>
                    <li className='text-base'>
                        **Resultados de Evaluaciones:** Respuestas y resultados de los Quizzes.
                    </li>
                    <li className='text-base'>
                        **Metadatos de Uso:** Hora de acceso, funciones utilizadas e institución.
                    </li>
                </ul>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 2: Uso de la Información Recolectada              */}
            {/* ========================================================= */}
            <section id="uso" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    2. Uso de la Información Recolectada
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    La información recolectada es utilizada exclusivamente para los siguientes
                    fines en el marco de la salud estudiantil:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li className='text-base'>
                        Proveer el servicio de citas y recordatorios.
                    </li>
                    <li className='text-base'>
                        Permitir que el psicólogo de su institución dé seguimiento adecuado.
                    </li>
                    <li className='text-base'>
                        Generar estadísticas anónimas para la institución sobre el bienestar general
                        (los datos individuales nunca se comparten sin anonimizar).
                    </li>
                    <li className='text-base'>
                        Mejorar la funcionalidad y la experiencia de usuario de la Plataforma.
                    </li>
                </ul>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 3: Compartición con Terceros                      */}
            {/* ========================================================= */}
            <section id="comparticion" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    3. Compartición con Terceros
                </h2>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    3.1. Con la Institución Educativa
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Solo se comparte información **agregada y anónima** con la administración de
                    su institución para fines de planeación y desarrollo de programas de salud.
                    Sus datos personales y resultados individuales son confidenciales.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    3.2. Casos Excepcionales
                </h3>
                <p className="text-gray-700 leading-relaxed">
                    La única excepción para compartir información sin su consentimiento es ante
                    una orden judicial o si existe un riesgo inminente y grave para su vida o la
                    de terceros, siguiendo los protocolos éticos y legales vigentes.
                </p>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 4: Derechos del Usuario (ARCO)                    */}
            {/* ========================================================= */}
            <section id="derechos" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    4. Derechos del Usuario (ARCO)
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Usted tiene derecho a ejercer sus derechos ARCO (Acceso, Rectificación,
                    Cancelación y Oposición) sobre su información personal.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Para ejercer estos derechos, debe enviar una solicitud formal a la dirección
                    de contacto proporcionada a continuación, especificando claramente el derecho
                    que desea ejercer y la información relevante.
                </p>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 5: Contacto y Revisión                            */}
            {/* ========================================================= */}
            <section id="contacto" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    5. Contacto y Revisión
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Cualquier pregunta o inquietud sobre esta Política de Privacidad debe ser
                    dirigida a nuestro Departamento de Protección de Datos:
                </p>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    **Correo electrónico:**
                    <a 
                        href="mailto:privacidad@neuroflora.com" 
                        className="ml-2 font-bold text-indigo-600 hover:text-indigo-800 transition duration-150"
                    >
                        privacidad@neuroflora.com
                    </a>
                </p>
            </section>
        </main>
    );
};

export default PrivacidadPage;