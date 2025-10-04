import React from "react";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import {
  Users,
  FileText,
  Calendar,
  Heart,
  AlertCircle,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";

const Psicologo = () => {
  return (
    <>
      <motion.h2
        className="text-2xl font-bold text-[#21252d] mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Panel de Psicólogo
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Estudiantes asignados"
          value="42"
          icon={Users}
          color="from-[#527ceb] to-[#6762b3]"
        />
        <StatCard
          title="Evaluaciones pendientes"
          value="8"
          icon={FileText}
          color="from-[#527ceb] to-[#6762b3]"
        />
        <StatCard
          title="Citas esta semana"
          value="12"
          icon={Calendar}
          color="from-[#10cfbd] to-[#48b0f7]"
        />
        <StatCard
          title="Casos canalizados"
          value="5"
          icon={Heart}
          color="from-[#527ceb] to-[#6762b3]"
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
                Próximas citas
              </h3>
              <div className="space-y-3 text-sm text-[#7c777a]">
                <div className="flex justify-between items-center hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <div>
                    <p className="font-medium text-[#21252d]">Ana García</p>
                    <p>Seguimiento</p>
                  </div>
                  <span>14:00</span>
                </div>
                <div className="flex justify-between items-center hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <div>
                    <p className="font-medium text-[#21252d]">Carlos López</p>
                    <p>Primera consulta</p>
                  </div>
                  <span>15:30</span>
                </div>
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
                Casos prioritarios
              </h3>
              <div className="space-y-3 text-sm text-[#7c777a]">
                <div className="flex items-center gap-3 hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <AlertCircle className="w-4 h-4 text-[#6762b3]" />
                  <span>2 casos de alto riesgo</span>
                </div>
                <div className="flex items-center gap-3 hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <Clock className="w-4 h-4 text-[#527ceb]" />
                  <span>3 seguimientos pendientes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Psicologo;
