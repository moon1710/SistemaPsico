import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaPython,
  FaJsSquare,
  FaReact,
  FaNodeJs,
  FaJava,
  FaDocker,
  FaFigma
} from "react-icons/fa";
import {
  SiTypescript,
  SiFlutter,
  SiTestinglibrary,
  SiMarkdown
} from "react-icons/si";
import placeholderImg from "../../assets/members/placeholder.svg";

const TeamCard = ({ member, isPastMember = false }) => {
  const { nombre, foto, carrera, descripcion, linkedin, github, contacto, rol, skills, periodo } =
    member;

  // Skill icons mapping
  const getSkillIcon = (skill) => {
    const iconMap = {
      "Python": <FaPython className="text-blue-500" />,
      "JavaScript": <FaJsSquare className="text-yellow-500" />,
      "TypeScript": <SiTypescript className="text-blue-600" />,
      "React": <FaReact className="text-cyan-500" />,
      "Node.js": <FaNodeJs className="text-green-600" />,
      "Flutter": <SiFlutter className="text-blue-400" />,
      "Java": <FaJava className="text-red-600" />,
      "DevOps": <FaDocker className="text-blue-500" />,
      "Testing": <SiTestinglibrary className="text-red-500" />,
      "Documentation": <SiMarkdown className="text-gray-600" />,
      "UI/UX Design": <FaFigma className="text-purple-500" />,
      "Figma": <FaFigma className="text-purple-500" />,
    };

    return iconMap[skill] || <span className="w-4 h-4 bg-gray-300 rounded-full inline-block"></span>;
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImg;
  };

  return (
    <div
      className={`
        bg-white/95 backdrop-blur-sm
        border border-gray-200 rounded-2xl shadow-sm
        hover:shadow-xl hover:-translate-y-2
        transition-all duration-300 ease-out
        p-6 flex flex-col items-center text-center
        ${isPastMember ? 'opacity-90 border-gray-300' : ''}
        relative overflow-hidden
      `}
    >
      {/* Past Member Badge */}
      {isPastMember && periodo && (
        <div className="absolute top-3 right-3 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
          {periodo}
        </div>
      )}

      {/* Foto */}
      <div className="relative w-36 h-36 mb-4">
        <img
          src={foto || placeholderImg}
          alt={`Foto de ${nombre}`}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover rounded-full shadow-lg border-4 border-white"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#527ceb]/20 to-[#6762b3]/20"></div>
      </div>

      {/* Contenido */}
      <h3 className="text-xl font-bold text-[#21252d] mb-1">{nombre}</h3>
      <p className="text-sm text-[#6762b3] font-semibold mb-1">{rol || carrera}</p>
      <p className="text-xs text-gray-500 mb-3">{carrera}</p>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4 max-w-full">
          {skills.slice(0, 6).map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs"
              title={skill}
            >
              {getSkillIcon(skill)}
              <span className="text-gray-700 font-medium">{skill}</span>
            </div>
          ))}
          {skills.length > 6 && (
            <div className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600">
              +{skills.length - 6} más
            </div>
          )}
        </div>
      )}

      {descripcion && (
        <p className="text-sm text-gray-600 leading-relaxed mb-4 px-1 line-clamp-3">
          {descripcion}
        </p>
      )}

      {/* Social Links */}
      <div className="flex space-x-4 text-xl justify-center mt-auto">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Perfil de LinkedIn de ${nombre}`}
            className="text-gray-400 hover:text-[#0a66c2] hover:scale-110 transition-all duration-200"
          >
            <FaLinkedin />
          </a>
        )}

        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Perfil de GitHub de ${nombre}`}
            className="text-gray-400 hover:text-[#171515] hover:scale-110 transition-all duration-200"
          >
            <FaGithub />
          </a>
        )}

        {contacto && (
          <a
            href={
              contacto.startsWith("mailto:") ? contacto : `mailto:${contacto}`
            }
            aria-label={`Enviar correo a ${nombre}`}
            className="text-gray-400 hover:text-[#d93025] hover:scale-110 transition-all duration-200"
          >
            <FaEnvelope />
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
