import React from "react";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import { Users, FileText, Calendar, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";

const Orientador = () => {
  return (
    <>
      <motion.h2
        className="text-2xl font-bold text-[#21252d] mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Panel de Orientador
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Estudiantes atendidos"
          value="67"
          icon={Users}
          color="from-[#527ceb] to-[#6762b3]"
        />
        <StatCard
          title="Evaluaciones pendientes"
          value="11"
          icon={FileText}
          color="from-[#527ceb] to-[#6762b3]"
        />
        <StatCard
          title="Citas programadas"
          value="9"
          icon={Calendar}
          color="from-[#10cfbd] to-[#48b0f7]"
        />
        <StatCard
          title="Alertas activas"
          value="4"
          icon={AlertCircle}
          color="from-[#ff7a7a] to-[#ffb199]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
      >
        <Card className="bg-transparent border-0 shadow-none">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#21252d] mb-3">
              Resumen del día
            </h3>
            <p className="text-sm text-[#7c777a]">
              Tienes 3 seguimientos prioritarios y 2 nuevas solicitudes.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default Orientador;
