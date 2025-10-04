"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { getRoleColor, normalizeRole } from "../../utils/roles";

const ROLE_LABEL = {
  SUPER_ADMIN_NACIONAL: "Sistema Nacional",
  SUPER_ADMIN_INSTITUCION: "Administrador/a de Institución",
  ADMIN_INSTITUCION: "Administrador/a de Institución",
  PSICOLOGO: "Psicólogo/a",
  TUTOR: "Tutor/a",
  ESTUDIANTE: "Estudiante",
};

export default function GreetingHeader() {
  const { user, activeInstitution, activeRole } = useAuth();
  const roleKey = normalizeRole(activeRole);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const initials = (user?.nombreCompleto || user?.nombre || "Usuario")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      className="rounded-2xl p-6 bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#21252d] tracking-tight">
            {greeting}, {user?.nombre || "Usuario"}
          </h1>
          <p className="mt-1 text-sm md:text-base text-[#7c777a]">
            {activeInstitution?.institucionNombre
              ? `${activeInstitution.institucionNombre} • `
              : ""}
            {ROLE_LABEL[roleKey] || "Usuario"}
          </p>
        </div>

        <div
          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${getRoleColor(
            roleKey
          )} flex items-center justify-center shadow-lg`}
          aria-hidden
        >
          <span className="text-white text-lg md:text-xl font-semibold">
            {initials}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
