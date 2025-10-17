// src/pages/AboutUsPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import TeamCard from "../components/cards/TeamCard";
import { teamMembers, pastMembers } from "../data/team";
import {
  Heart,
  Brain,
  Users,
  Award,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import bgImage from "../assets/bg.jpg";

const AboutUsPage = () => {
  const [showPastMembers, setShowPastMembers] = useState(false);

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-[#527ceb]" />,
      title: "Evaluaciones Psicológicas Validadas",
      description: "Implementamos cuestionarios científicamente validados para el diagnóstico temprano de necesidades de salud mental."
    },
    {
      icon: <Heart className="w-8 h-8 text-[#6762b3]" />,
      title: "Apoyo Integral",
      description: "Conectamos estudiantes con profesionales de la salud mental y recursos de apoyo personalizados."
    },
    {
      icon: <Users className="w-8 h-8 text-[#019fd2]" />,
      title: "Gestión Institucional",
      description: "Facilitamos la administración de servicios psicológicos para instituciones educativas."
    },
    {
      icon: <Target className="w-8 h-8 text-[#10cfbd]" />,
      title: "Intervención Temprana",
      description: "Identificamos factores de riesgo para prevenir crisis de salud mental en el entorno estudiantil."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section
        className="relative py-20 px-6 text-center bg-gradient-to-r from-[#527ceb] to-[#6762b3] text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(82, 124, 235, 0.9), rgba(103, 98, 179, 0.9)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#527ceb]/80 to-[#6762b3]/80"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Conócenos
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Transformando la salud mental estudiantil a través de la tecnología
          </p>
          <div className="flex items-center justify-center gap-4">
            <Lightbulb className="w-8 h-8 animate-pulse" />
            <span className="text-lg">Innovación • Empatía • Impacto</span>
          </div>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#21252d] mb-6">
            NeuroFlora: Apoyando el Bienestar Estudiantil
          </h2>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Somos una plataforma integral diseñada para centralizar los servicios de apoyo
            psicológico en instituciones educativas. Nuestra misión es facilitar el acceso
            a recursos de salud mental y promover el diagnóstico temprano para mejorar
            el bienestar de los estudiantes.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-r from-[#527ceb]/10 to-[#6762b3]/10">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#21252d] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Current Team Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-[#21252d] mb-4 flex items-center justify-center gap-3">
              <Users className="w-10 h-10 text-[#527ceb]" />
              Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conoce a las personas apasionadas que hacen posible NeuroFlora
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              >
                <TeamCard member={member} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Members Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <button
              onClick={() => setShowPastMembers(!showPastMembers)}
              className="flex items-center justify-center gap-3 mx-auto text-2xl font-bold text-[#21252d] hover:text-[#527ceb] transition-colors duration-300"
            >
              <Award className="w-8 h-8" />
              Colaboradores Anteriores
              {showPastMembers ? (
                <ChevronUp className="w-6 h-6" />
              ) : (
                <ChevronDown className="w-6 h-6" />
              )}
            </button>
            <p className="text-gray-600 mt-2">
              Personas que contribuyeron al desarrollo de NeuroFlora
            </p>
          </motion.div>

          {showPastMembers && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TeamCard member={member} isPastMember={true} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#527ceb] to-[#6762b3] text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Te interesa nuestro proyecto?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Conecta con nosotros para colaboraciones, feedback o más información sobre NeuroFlora
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:moncab.dev@gmail.com"
              className="bg-white text-[#527ceb] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Contactar al Equipo
            </a>
            <a
              href="https://github.com/moon1710"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#527ceb] transition-all duration-300"
            >
              Ver en GitHub
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutUsPage;
