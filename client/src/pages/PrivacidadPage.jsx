// client/src/pages/PrivacidadPage.jsx
import React from 'react';

const PrivacidadPage = () => {
    // Estructura actualizada para el índice de contenidos
    const sections = [
        { id: "recoleccion", title: "1. Datos que Recolectamos" },
        { id: "finalidad", title: "2. Finalidad y Base Legal" },
        { id: "seguridad", title: "3. Conservación y Seguridad" },
        { id: "derechos", title: "4. Derechos ARCO" },
        { id: "contacto", title: "5. Contacto DPO" },
    ];

    return (
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl bg-white shadow-xl rounded-xl">
            <h1 className="text-4xl font-extrabold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">
                Política de Privacidad
            </h1>
            <p className="text-sm text-gray-500 mb-8">
                El presente documento detalla la gestión de los datos personales de los usuarios
                de Neuroflora. Nuestra prioridad es su privacidad.
                <br />
                Última revisión: 11 de Octubre de 2025.
            </p>

            {/* ÍNDICE DE CONTENIDOS */}
            <nav className="p-4 mb-10 bg-indigo-50 rounded-lg border border-indigo-200">
                <h2 className="text-xl font-bold text-indigo-700 mb-3">Índice</h2>
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
            {/* SECCIÓN 1: Datos que recolectamos                         */}
            {/* ========================================================= */}
            <section id="recoleccion" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    1. Datos que Recolectamos
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Neuroflora recolecta la siguiente información directamente de usted al
                    momento de su registro y durante el uso activo de la Plataforma:
                </p>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    1.1. Datos de Identificación y Contacto
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li className='text-base'>
                        Nombre completo, correo electrónico institucional y matrícula o ID de estudiante.
                    </li>
                    <li className='text-base'>
                        Datos demográficos (edad, género) para la correcta atención psicológica.
                    </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    1.2. Datos Sensibles y de Salud
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li className='text-base'>
                        Respuestas a los Quizzes y Evaluaciones de bienestar.
                    </li>
                    <li className='text-base'>
                        Registro de citas, historial y notas clínicas generadas por el psicólogo.
                    </li>
                </ul>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 2: Finalidad y Base Legal                         */}
            {/* ========================================================= */}
            <section id="finalidad" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    2. Finalidad y Base Legal
                </h2>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    2.1. Finalidad del Tratamiento
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Los datos se tratan con el objetivo de gestionar las citas, proporcionar
                    el apoyo psicológico, personalizar recomendaciones y generar informes
                    estadísticos (anonimizados) para la mejora de la salud mental institucional.
                </p>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    2.2. Base Legal
                </h3>
                <p className="text-gray-700 leading-relaxed">
                    La base legal para el tratamiento de sus datos es el **Consentimiento
                    Explícito** del usuario al aceptar estos Términos y, para los datos
                    sensibles de salud, la necesidad de un **Tratamiento por un Profesional
                    de la Salud** bajo estricta confidencialidad.
                </p>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 3: Conservación y Seguridad                       */}
            {/* ========================================================= */}
            <section id="seguridad" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    3. Conservación y Seguridad
                </h2>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    3.1. Periodo de Conservación
                </h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Los datos se conservan durante el tiempo que sea estrictamente necesario
                    para la prestación del servicio y hasta cinco (5) años después de que el
                    usuario haya dejado de pertenecer a la institución asociada, salvo obligación
                    legal de conservarlos por un periodo mayor.
                </p>
                <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
                    3.2. Medidas de Seguridad
                </h3>
                <p className="text-gray-700 leading-relaxed">
                    Aplicamos medidas de seguridad técnicas y organizativas avanzadas, incluyendo
                    cifrado de datos en tránsito y en reposo, y acceso restringido al historial
                    clínico solo al personal de psicología asignado, para proteger la información
                    contra el acceso no autorizado o la alteración.
                </p>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 4: Derechos ARCO                                  */}
            {/* ========================================================= */}
            <section id="derechos" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    4. Derechos ARCO
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Usted tiene derecho a ejercer sus derechos de Acceso, Rectificación,
                    Cancelación y Oposición (Derechos ARCO) respecto a sus datos personales.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li className='text-base'>
                        **Acceso:** Conocer qué datos personales tenemos de usted.
                    </li>
                    <li className='text-base'>
                        **Rectificación:** Solicitar la corrección de datos incorrectos o incompletos.
                    </li>
                    <li className='text-base'>
                        **Cancelación:** Solicitar la eliminación de sus datos de nuestros registros.
                    </li>
                    <li className='text-base'>
                        **Oposición:** Oponerse al uso de sus datos para fines específicos.
                    </li>
                </ul>
                <p className="text-gray-700 mt-4 leading-relaxed">
                    Para ejercer estos derechos, debe contactar a nuestro Delegado de Protección
                    de Datos (DPO) en la dirección indicada en la siguiente sección.
                </p>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 5: Contacto DPO                                   */}
            {/* ========================================================= */}
            <section id="contacto" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    5. Contacto DPO
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Para cualquier duda relacionada con el tratamiento de sus datos o para
                    ejercer sus Derechos ARCO, puede contactar a nuestro Delegado de Protección
                    de Datos (DPO):
                </p>
                
                <div className="mt-4 p-4 bg-indigo-50 border-2 border-indigo-300 rounded-lg inline-block">
                    <p className="font-semibold text-gray-800 mb-1">Delegado de Protección de Datos (DPO)</p>
                    <a 
                        href="mailto:dpo@neuroflora.com" 
                        className="text-lg font-bold text-indigo-700 hover:text-indigo-900 transition duration-150"
                    >
                        dpo@neuroflora.com
                    </a>
                </div>
            </section>
        </main>
    );
};

export default PrivacidadPage;