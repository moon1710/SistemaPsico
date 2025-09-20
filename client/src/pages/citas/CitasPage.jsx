// client/src/pages/citas/CitasPage.jsx
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import RequestsQueue from "./components/RequestsQueue";
import MyAppointmentsStaff from "./components/MyAppointmentsStaff";
import Availability from "./components/Availability";

function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function CitasPage() {
  const { user } = useAuth();

  const activeInstitutionId = React.useMemo(() => {
    const memberships = user?.instituciones || [];
    const active =
      memberships.find((m) => m?.isMembershipActiva) || memberships[0];
    return active?.institucionId;
  }, [user]);

  const tabs = [
    { id: "sol", label: "Solicitudes" },
    { id: "mine", label: "Mis citas" },
    { id: "disp", label: "Disponibilidad" },
  ];

  const [tab, setTab] = React.useState("sol");

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Citas (Staff)</h1>
        {activeInstitutionId ? (
          <p className="text-sm text-gray-500 mt-1">
            Institución activa:{" "}
            <span className="font-medium">{activeInstitutionId}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">
            Sin institución activa (se enviarán peticiones sin encabezado).
          </p>
        )}
      </header>

      <nav className="mb-6 flex gap-2 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={classNames(
              "px-4 py-2 -mb-px border-b-2 text-sm font-medium",
              tab === t.id
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-800"
            )}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <section className="bg-white shadow-sm rounded-lg border border-gray-200">
        {tab === "sol" && <RequestsQueue institutionId={activeInstitutionId} />}
        {tab === "mine" && (
          <MyAppointmentsStaff institutionId={activeInstitutionId} />
        )}
        {tab === "disp" && (
          <Availability
            institutionId={activeInstitutionId}
            currentUser={user}
          />
        )}
      </section>
    </div>
  );
}
