// src/pages/AboutUsPage.jsx
import React from "react";
import TeamCard from "../components/cards/TeamCard";
import { teamMembers } from "../data/team";

const AboutUsPage = () => {
  return (
    <div className="about-us-container p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Conócenos: Proyecto y Equipo
      </h1>

      {/* --- BLOQUE 1:*/}
      <section className="project-block mb-12 p-6 bg-gray-50 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          NeuroFlora: Apoyando el Bienestar Estudiantil
        </h2>

        <p className="text-lg mb-4 text-gray-700">
          Somos una plataforma diseñada para centralizar los servicios de apoyo
          psicológico en instituciones educativas. Facilitamos y el diagnóstico
          temprano para mejorar la salud mental de los estudiantes.
        </p>

        <ul className="list-disc list-inside space-y-2 ml-4 text-gray-600">
          <li>
            Diagnóstico Rápido: Implementamos Quizzes para identificar
            necesidades.
          </li>
          <li>
            {" "}
            nose nose nose nose Lorem ipsum dolor, sit amet consectetur
            adipisicing elit. Accusantium nemo quos, cupiditate ullam officia
            unde dignissimos facere aut possimus mollitia sint optio, molestias,
            nam assumenda voluptates nobis non suscipit placeat..
          </li>
        </ul>
      </section>

      {/* --- BLOQUE 2: */}
      <section className="team-block">
        <h2 className="text-2xl font-semibold mb-8 text-center border-b pb-2">
          Nuestro Equipo
        </h2>

        {/* Grid responsive:  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Mapeo de datos dinámicos */}
          {teamMembers.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
