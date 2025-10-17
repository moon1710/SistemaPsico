// src/pages/DocsPage.jsx
// client/src/pages/DocsPage.jsx
import React from "react";
import { documentationGuides } from "../data/docs"; // Importamos los datos
import {
  BookOpenIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Componente simple para el icono y estado (ajustado a tu diseño)
const DocIcon = ({ iconType }) => {
  switch (iconType) {
    case "psychologist":
      return <WrenchScrewdriverIcon className="h-6 w-6 text-indigo-500" />;
    case "admin":
      return <ChartBarIcon className="h-6 w-6 text-purple-500" />;
    case "integration":
      return <WrenchScrewdriverIcon className="h-6 w-6 text-gray-500" />;
    case "user":
    default:
      return <UserIcon className="h-6 w-6 text-green-500" />;
  }
};

// Componente Tarjeta de Documento
const DocCard = ({ doc }) => {
  const isAvailable = doc.estado === "available";

  return (
    <div
      className={`p-6 border rounded-xl shadow-md transition duration-300 
            ${
              isAvailable
                ? "bg-white hover:border-indigo-400"
                : "bg-gray-50 border-gray-200 opacity-70 cursor-default"
            }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <DocIcon iconType={doc.icon} />
          <h3
            className={`text-xl font-bold ${
              isAvailable ? "text-gray-800" : "text-gray-600"
            }`}
          >
            {doc.title}
          </h3>
        </div>
        {/* DoD: Estados visibles */}
        {doc.estado === "soon" && (
          <span className="flex items-center px-3 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
            <ClockIcon className="h-4 w-4 mr-1" /> Próximamente
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-4">{doc.description}</p>

      {isAvailable ? (
        <a
          href={doc.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
          aria-label={`Descargar ${doc.title}`}
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Descargar Guía
        </a>
      ) : (
        <button
          disabled
          className="inline-flex items-center font-semibold text-gray-500 bg-gray-200 px-4 py-2 rounded-lg cursor-not-allowed"
        >
          <BookOpenIcon className="h-5 w-5 mr-2" /> No Disponible
        </button>
      )}
    </div>
  );
};

const DocsPage = () => {
  return (
    <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-4 border-b-2 border-indigo-200 pb-2 flex items-center">
        <BookOpenIcon className="h-8 w-8 mr-3 text-indigo-600" />
        Documentación y Capacitación
      </h1>
      <p className="text-xl text-gray-600 mb-10">
        Consulta los manuales y guías detalladas para aprovechar al máximo las
        funcionalidades de Neuroflora.
      </p>

      {/* Mapeo de Documentos (DoD: Render desde array) */}
      <div className="space-y-6">
        {documentationGuides.map((doc) => (
          <DocCard key={doc.id} doc={doc} />
        ))}
      </div>

      <div className="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-yellow-800 mb-2">
          ¿Necesitas un tema específico?
        </h3>
        <p className="text-gray-700">
          Si no encuentras el manual que buscas, contacta a soporte para
          solicitar capacitación personalizada o reportar una necesidad de
          documentación.
        </p>
        <a
          href="/soporte" // Asumiendo que /soporte es la ruta interna de soporte
          className="mt-3 inline-block font-medium text-yellow-700 hover:text-yellow-900 transition underline"
        >
          Ir a Soporte
        </a>
      </div>
    </main>
  );
};

export default DocsPage;
