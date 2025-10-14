// client/src/pages/HelpPage.jsx
import React, { useState, useMemo } from 'react';
import { faqs } from '../data/faqs';
import { ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  

  const [openFAQ, setOpenFAQ] = useState(null); 

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) {
      return faqs;
    }
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    return faqs.filter(faq => 
      // Busca en la pregunta o en la respuesta
      faq.q.toLowerCase().includes(lowerCaseSearch) || 
      faq.a.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm]);

  // Función para abrir/cerrar un FAQ
  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-2">
        Centro de Ayuda
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Encuentra respuestas a tus preguntas más frecuentes o contacta con nuestro equipo de soporte.
      </p>

      {/* ========================================================= */}
      {/* SECCIÓN DE SOPORTE / CONTACTO (DoD: Enlace visible)      */}
      {/* ========================================================= */}
      <div className="mb-12 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-indigo-700 mb-2 flex items-center">
            <EnvelopeIcon className="h-6 w-6 mr-2" /> Soporte Técnico y Contacto
        </h2>
        <p className="text-gray-700 mb-3">
          Si no encuentras lo que buscas en las FAQs, no dudes en contactarnos directamente.
        </p>
        <a 
          href="mailto:soporte@neuroflora.com" 
          className="inline-flex items-center font-medium text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
        >
          Enviar Correo a Soporte
        </a>
        <span className="ml-4 text-sm text-gray-500">
          (soporte@neuroflora.com)
        </span>
      </div>

      {/* ========================================================= */}
      {/* SECCIÓN DE FAQs                                           */}
      {/* ========================================================= */}
      <h2 className="text-3xl font-bold text-indigo-800 mb-6 border-b pb-2">
        Preguntas Frecuentes (FAQ)
      </h2>

      {/* Buscador (DoD: Sin errores al escribir) */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Busca una pregunta o palabra clave..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mapeo de FAQs (DoD: Renderizado con map) */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <div 
              key={faq.id} 
              className="border border-gray-200 rounded-lg shadow-sm"
            >
              {/* Botón de Pregunta */}
              <button
                className="flex justify-between items-center w-full p-5 text-left font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition duration-150 rounded-t-lg"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={openFAQ === faq.id}
                aria-controls={`faq-answer-${faq.id}`}
              >
                <span className="text-lg">{faq.q}</span>
                <ChevronDownIcon 
                  className={`h-5 w-5 transform transition-transform ${openFAQ === faq.id ? 'rotate-180 text-indigo-600' : 'rotate-0'}`} 
                />
              </button>

              {/* Respuesta (Acordeón) */}
              {openFAQ === faq.id && (
                <div 
                  id={`faq-answer-${faq.id}`}
                  className="p-5 text-gray-600 bg-white border-t border-gray-200"
                >
                  <p>{faq.a}</p>
                  {faq.cat && (
                      <span className="mt-3 inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                          Categoría: {faq.cat}
                      </span>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-lg text-center text-gray-500 mt-10 p-6 bg-white rounded-lg shadow">
            No se encontraron resultados para "{searchTerm}". Intenta con otras palabras clave.
          </p>
        )}
      </div>

    </div>
  );
};

export default HelpPage;