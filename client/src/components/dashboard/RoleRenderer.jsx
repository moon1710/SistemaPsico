"use client";
import React, { Suspense } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ROLE_COMPONENTS } from "./roles";
import { normalizeRole } from "../../utils/roles";

const EmptyState = ({ role }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-600">
    No hay contenido para el rol{" "}
    <span className="font-semibold">{role || "desconocido"}</span>.
  </div>
);

const Fallback = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-10">
    <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
    <div className="h-3 w-72 bg-gray-100 rounded mb-2" />
    <div className="h-3 w-64 bg-gray-100 rounded" />
  </div>
);

const RoleRenderer = ({ rol }) => {
  const { activeRole } = useAuth();
  const resolved = normalizeRole(rol || activeRole);
  const Cmp = ROLE_COMPONENTS[resolved];

  if (!Cmp) return <EmptyState role={resolved} />;

  return (
    <Suspense fallback={<Fallback />}>
      <Cmp />
    </Suspense>
  );
};

export default RoleRenderer;
