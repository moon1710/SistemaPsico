import React from "react";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import { CheckCircle, Calendar, BookOpen, Heart } from "lucide-react";

const Estudiante = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Evaluaciones Completadas"
          value="3"
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Próximas Citas"
          value="1"
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Recomendaciones"
          value="5"
          icon={BookOpen}
          color="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tu Bienestar</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Heart className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">Estado general: Bueno</p>
                  <p className="text-sm text-gray-600">
                    Última evaluación: Hace 2 semanas
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Recursos Recomendados
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">
                  Técnicas de Relajación
                </p>
                <p className="text-sm text-blue-700">
                  Ejercicios para reducir el estrés
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-900">Gestión del Tiempo</p>
                <p className="text-sm text-green-700">
                  Estrategias de organización
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Estudiante;
