import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'; // Utilice Íconos de react-icons

const TeamCard = ({ member }) => {
  const { nombre, foto, carrera, descripcion, linkedin, github, contacto } = member;

  return (

    <div className="team-card p-4 border rounded-lg shadow-md hover:shadow-xl transition duration-300">
      <img
        src={foto}
        alt={`Foto de ${nombre} - ${carrera}`}
        className="w-full h-48 object-cover rounded-md mb-4"
        loading="lazy"
      />
      
      {/* Contenido */}
      <h3 className="text-xl font-semibold mb-1">{nombre}</h3>
      <p className="text-sm text-gray-600 italic mb-3">{carrera}</p>
      <p className="text-gray-700 text-sm mb-4">{descripcion}</p>

     
      <div className="flex space-x-5 text-2xl justify-center"> 

        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer" 
            aria-label={`Perfil de LinkedIn de ${nombre}`}
            className="text-gray-600 hover:text-blue-700 transition" // Estilo para LinkedIn
          >

            <FaLinkedin /> 
          </a>
        )}
        

        {github && (

          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            aria-label={`Perfil de GitHub de ${nombre}`}
            className="text-gray-600 hover:text-gray-900 transition" // Estilo para GitHub
          >

            <FaGithub /> 
          </a>
        )}
        

        {contacto && (
          <a
            href={contacto} // Esto usará el esquema 'mailto:'
            aria-label={`Enviar correo a ${nombre}`}
            className="text-gray-600 hover:text-red-600 transition" // Estilo para Correo
          >

            <FaEnvelope /> 
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamCard;