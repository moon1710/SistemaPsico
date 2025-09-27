// src/pages/PrivacidadPage.jsx
import { useLocation } from "react-router-dom";
export default function PrivacidadPage() {
  const { pathname } = useLocation();
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 md:p-12">
        Estás en: <code>{pathname}</code> — Política de Privacidad
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-900">
          Aviso de Privacidad
        </h1>
        
        <p className="mb-6 text-gray-700 leading-relaxed">
          En cumplimiento con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), con fundamento en los artículos 3º, fracción II, 16, 17, 18, 21, 25, 26, 27, 28 y 65, informamos que Jacaranda, plataforma desarrollada en colaboración con el Tecnológico Nacional de México, Campus Tuxtepec, con domicilio en Calzada Dr. Víctor Bravo Ahuja No. 561, Col. Predio El Paraíso, C.P. 68350, San Juan Bautista Tuxtepec, Oaxaca, es responsable del tratamiento, uso y protección de sus datos personales.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">
          Finalidades del tratamiento de datos personales
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Los datos personales recabados serán utilizados con las siguientes finalidades:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Finalidades primarias (necesarias para el servicio):</h3>
        <ul className="list-disc list-inside mb-4 ml-4 text-gray-700 leading-relaxed">
          <li>Aplicar un test psicológico para detectar niveles de ansiedad y estrés.</li>
          <li>Generar un perfil personalizado del usuario con base en sus respuestas.</li>
          <li>Entregar resultados y sugerencias de actividades adaptadas al nivel de ansiedad identificado.</li>
          <li>Elaborar análisis estadísticos de forma anonimizada con fines académicos o de mejora del servicio.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Finalidades secundarias (opcionales):</h3>
        <ul className="list-disc list-inside mb-4 ml-4 text-gray-700 leading-relaxed">
          <li>Invitar al usuario a participar en futuras investigaciones académicas o talleres relacionados con la salud mental.</li>
          <li>Ofrecer membresías de colaboración o vinculación con otros sectores en convenio con el TecNM.</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">
          Datos personales que se recaban
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Los datos que podrían ser solicitados incluyen: nombre, edad, género, correo electrónico, ocupación, historial de síntomas, hábitos de vida y estado emocional. En algunos casos, se podrán recabar datos personales sensibles, relacionados con tu salud emocional.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">
          Transferencia de datos personales
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Jacaranda no transferirá sus datos personales a terceros sin su consentimiento, no serán transferidos, difundidos, ni distribuidos, salvo lo señalado en el artículo 22 de la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados.
          En el caso del tratamiento de los datos sensibles, se estará sujeto a lo previsto por los artículos 3º, fracción X, 7º y 21 de la Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800 border-b-2 border-indigo-500 pb-2">
          Ejercicio de derechos ARCO
        </h2>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales (Derechos ARCO), enviando una solicitud al correo electrónico: **[correo@.com]**, indicando:
        </p>
        <ul className="list-disc list-inside mb-4 ml-4 text-gray-700 leading-relaxed">
          <li>Nombre completo</li>
          <li>Relación con el sitio (usuario, paciente, etc.)</li>
          <li>Derecho que desea ejercer</li>
          <li>Copia de su identificación oficial.</li>
        </ul>
      </div>
    </div>
  );
}
