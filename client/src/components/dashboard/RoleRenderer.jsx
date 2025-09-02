import React from "react";
import { ROLE_COMPONENTS } from "./roles";

const RoleRenderer = ({ rol }) => {
  const Cmp = ROLE_COMPONENTS[rol];
  if (!Cmp) {
    return (
      <div className="text-center py-12 text-gray-600">
        No hay contenido para el rol{" "}
        <span className="font-semibold">{rol || "desconocido"}</span>.
      </div>
    );
  }
  return <Cmp />;
};

export default RoleRenderer;
