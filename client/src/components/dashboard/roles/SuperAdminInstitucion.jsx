import React from "react";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import {
  Brain,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";

const SuperAdminInstitucion = () => {
  return (
    <>
      <motion.h2
        className="text-2xl font-bold text-[#21252d] mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Administración de Institución
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Psicólogos activos"
          value="8"
          icon={Brain}
          color="from-[#527ceb] to-[#6762b3]"
        />
        <StatCard
          title="Estudiantes registrados"
          value="1,245"
          icon={Users}
          color="from-[#527ceb] to-[#6762b3]"
        />
        <StatCard
          title="Evaluaciones este mes"
          value="156"
          icon={FileText}
          color="from-[#527ceb] to-[#6762b3]"
        />
        <StatCard
          title="Citas programadas"
          value="34"
          icon={Calendar}
          color="from-[#10cfbd] to-[#48b0f7]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#21252d] mb-3">
                Estado de módulos
              </h3>
              <div className="space-y-3 text-sm text-[#7c777a]">
                {[
                  {
                    label: "Módulo Psicológico",
                    status: "Activo",
                    tone: "text-emerald-600 bg-emerald-50",
                  },
                  {
                    label: "Evaluaciones",
                    status: "Activo",
                    tone: "text-emerald-600 bg-emerald-50",
                  },
                  {
                    label: "Citas",
                    status: "Configurando",
                    tone: "text-amber-700 bg-amber-50",
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3"
                  >
                    <span className="text-[#21252d]">{m.label}</span>
                    <span
                      className={`${m.tone} px-2 py-1 rounded-full text-xs`}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#21252d] mb-3">
                Últimas acciones
              </h3>
              <div className="space-y-3 text-sm text-[#7c777a]">
                <div className="flex items-center gap-3 hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <CheckCircle className="w-4 h-4 text-[#527ceb]" />
                  <span>Psicólogo registrado</span>
                </div>
                <div className="flex items-center gap-3 hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <Clock className="w-4 h-4 text-[#6762b3]" />
                  <span>Evaluación pendiente</span>
                </div>
                <div className="flex items-center gap-3 hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <Users className="w-4 h-4 text-[#527ceb]" />
                  <span>10 estudiantes nuevos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SuperAdminInstitucion;
