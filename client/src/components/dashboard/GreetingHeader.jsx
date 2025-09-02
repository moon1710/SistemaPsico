import React from "react";

const getRoleColor = (role) => {
  const colors = {
    SUPER_ADMIN_NACIONAL: "from-purple-500 to-purple-700",
    SUPER_ADMIN_INSTITUCION: "from-blue-500 to-blue-700",
    PSICOLOGO: "from-green-500 to-green-700",
    ESTUDIANTE: "from-orange-500 to-orange-700",
    ORIENTADOR: "from-indigo-500 to-indigo-700",
  };
  return colors[role] || "from-gray-500 to-gray-700";
};

const GreetingHeader = ({ user }) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  const roleLabel =
    user?.rol === "SUPER_ADMIN_NACIONAL"
      ? "Sistema Nacional"
      : user?.rol === "SUPER_ADMIN_INSTITUCION"
      ? "Administrador de Institución"
      : user?.rol === "PSICOLOGO"
      ? "Psicólogo"
      : user?.rol === "ESTUDIANTE"
      ? "Estudiante"
      : user?.rol === "ORIENTADOR"
      ? "Orientador"
      : "Usuario";

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {user?.nombre}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.institucionNombre ? `${user.institucionNombre} • ` : ""}
            {roleLabel}
          </p>
        </div>

        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRoleColor(
            user?.rol
          )} flex items-center justify-center shadow-lg`}
        >
          <span className="text-white text-xl font-bold">
            {user?.nombre?.charAt(0) || "U"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GreetingHeader;
