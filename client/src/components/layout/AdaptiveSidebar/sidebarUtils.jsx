export const getRoleColor = (rol) => {
  const colors = {
    SUPER_ADMIN_NACIONAL: "from-[#4c1d95] to-[#527ceb]",
    SUPER_ADMIN_INSTITUCION: "from-[#527ceb] to-[#3730a3]",
    PSICOLOGO: "from-[#cdb4db] to-[#527ceb]",
    ESTUDIANTE: "from-[#527ceb] to-[#10cfbd]",
    ORIENTADOR: "from-[#3730a3] to-[#cdb4db]",
  };
  return colors[rol] || "from-gray-500 to-gray-700";
};

export const getRoleLabel = (rol) => {
  const labels = {
    SUPER_ADMIN_NACIONAL: "Super Admin Nacional",
    SUPER_ADMIN_INSTITUCION: "Admin Institución",
    PSICOLOGO: "Psicólogo",
    ESTUDIANTE: "Estudiante",
    ORIENTADOR: "Orientador",
  };
  return labels[rol] || rol;
};
