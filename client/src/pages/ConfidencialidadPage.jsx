// client/src/pages/ConfidencialidadPage.jsx
import React from 'react';
import { LockClosedIcon, ShieldExclamationIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const ConfidencialidadPage = () => {
    
    const sections = [
        { id: "compromiso", title: "1. Compromiso de Confidencialidad" },
        { id: "manejo", title: "2. Manejo de Datos Sensibles" },
        { id: "alcance", title: "3. Alcance y Límites Legales" },
        { id: "aceptacion", title: "4. Aceptación Formal" },
        { id: "contacto", title: "5. Contacto" },
    ];

    return (
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl bg-white shadow-xl rounded-xl">
            <h1 className="text-4xl font-extrabold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2 flex items-center">
                <LockClosedIcon className="h-8 w-8 mr-3 text-indigo-600" />
                Declaración de Confidencialidad
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Neuroflora garantiza la protección estricta del Secreto Profesional en todos los
                servicios de atención psicológica y manejo de datos clínicos de los estudiantes.
            </p>

            {/* ÍNDICE DE CONTENIDOS (Para navegación interna) */}
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
            {/* SECCIÓN 1: Compromiso de Confidencialidad                 */}
            {/* ========================================================= */}
            <section id="compromiso" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 mr-2 text-indigo-500" />
                    1. Compromiso de Confidencialidad
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Todo el personal profesional de Neuroflora está sujeto a los más altos
                    estándares de secreto profesional, según lo dictan los códigos de ética
                    y las leyes de salud mental. La información que usted comparte es tratada
                    con la máxima reserva.
                </p>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 2: Manejo de Datos Sensibles                      */}
            {/* ========================================================= */}
            <section id="manejo" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    2. Manejo de Datos Sensibles
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Sus datos clínicos, notas de sesiones, y resultados de evaluaciones son
                    clasificados como información sensible y se almacenan bajo cifrado robusto.
                    El acceso a esta información está restringido únicamente a:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li className='text-base'>
                        El estudiante (usted).
                    </li>
                    <li className='text-base'>
                        El psicólogo directamente a cargo de su atención.
                    </li>
                    <li className='text-base'>
                        Personal técnico, bajo supervisión y con fines de mantenimiento y soporte.
                    </li>
                </ul>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 3: Alcance y Límites Legales                      */}
            {/* ========================================================= */}
            <section id="alcance" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3 flex items-center">
                    <ShieldExclamationIcon className="h-6 w-6 mr-2 text-red-500" />
                    3. Alcance y Límites Legales
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed font-semibold">
                    La confidencialidad es absoluta, salvo en las siguientes excepciones,
                    que constituyen un deber ético y legal:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li className='text-base'>
                        Riesgo inminente y grave para la vida del usuario o de terceros.
                    </li>
                    <li className='text-base'>
                        Sospecha o evidencia de abuso infantil o de adultos mayores vulnerables.
                    </li>
                    <li className='text-base'>
                        Requerimiento expreso de una autoridad judicial competente.
                    </li>
                </ul>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 4: Aceptación Formal                              */}
            {/* ========================================================= */}
            <section id="aceptacion" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    4. Aceptación Formal
                </h2>
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-gray-700 leading-relaxed italic">
                        La aceptación de los Términos y Condiciones de Uso de Neuroflora
                        implica la plena comprensión y consentimiento de esta Declaración de
                        Confidencialidad. Su uso de la Plataforma constituye su acuerdo con
                        los términos y límites aquí establecidos.
                    </p>
                    <p className="mt-4 text-sm font-semibold text-gray-500">
                        Fecha de última revisión: Octubre 2025.
                    </p>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SECCIÓN 5: Contacto                                       */}
            {/* ========================================================= */}
            <section id="contacto" className="mb-10 pt-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">
                    5. Contacto
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Para cualquier duda sobre esta política, comuníquese con nuestro
                    Departamento de Ética y Cumplimiento:
                </p>
                <a 
                    href="mailto:etica@neuroflora.com" 
                    className="mt-2 inline-block font-bold text-indigo-700 hover:text-indigo-900 transition duration-150"
                >
                    etica@neuroflora.com
                </a>
            </section>
        </main>
    );
};

export default ConfidencialidadPage;