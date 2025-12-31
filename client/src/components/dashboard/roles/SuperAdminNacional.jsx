import React, { useState } from "react";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import { Users, FileText, AlertCircle, Building } from "lucide-react";
import InstitutionManagement from "../../admin/InstitutionManagement";

const SuperAdminNacional = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Instituciones Activas"
          value="24"
          icon={Building}
          color="bg-blue-500"
          trend="8"
        />
        <StatCard
          title="Usuarios Totales"
          value="1,248"
          icon={Users}
          color="bg-green-500"
          trend="12"
        />
        <StatCard
          title="Evaluaciones Realizadas"
          value="3,456"
          icon={FileText}
          color="bg-purple-500"
          trend="15"
        />
        <StatCard
          title="Casos Activos"
          value="89"
          icon={AlertCircle}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Instituciones por Región
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Centro</span>
                <span className="font-medium">8 instituciones</span>
              </div>
              <div className="flex justify-between">
                <span>Norte</span>
                <span className="font-medium">6 instituciones</span>
              </div>
              <div className="flex justify-between">
                <span>Sur</span>
                <span className="font-medium">10 instituciones</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Nueva institución registrada</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Reporte mensual generado</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Actualización del sistema</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  return (
    <div>
      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-colors
              ${activeView === 'dashboard'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('institutions')}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2
              ${activeView === 'institutions'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
          >
            <Building className="h-4 w-4" />
            Gestión de Instituciones
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'institutions' && <InstitutionManagement />}
    </div>
  );
};

export default SuperAdminNacional;
