import React from "react";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import {
  CheckCircle,
  Calendar,
  BookOpen,
  Heart,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";

const Estudiante = () => {
  return (
    <>
      <motion.h2
        className="text-2xl font-bold text-[#21252d] mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Panel de Estudiante
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Evaluaciones completadas"
          value="3"
          icon={CheckCircle}
          color="from-[#527ceb] to-[#6762b3]" // azul/púrpura
        />
        <StatCard
          title="Próximas citas"
          value="1"
          icon={Calendar}
          color="from-[#10cfbd] to-[#48b0f7]" // turquesa/azul claro
        />
        <StatCard
          title="Recomendaciones"
          value="5"
          icon={BookOpen}
          color="from-[#527ceb] to-[#6762b3]" // azul/púrpura
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
                Tu bienestar
              </h3>
              <div className="space-y-4 text-sm text-[#7c777a]">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-[#527ceb]" />
                  <div>
                    <p className="font-medium text-[#21252d]">
                      Estado general: Bueno
                    </p>
                    <p className="text-[#7c777a]">
                      Última evaluación: hace 2 semanas
                    </p>
                  </div>
                </div>
                <div className="hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3 flex items-center justify-between">
                  <span>Revisa tu historial de evaluaciones</span>
                  <ChevronRight className="w-4 h-4 text-[#6762b3]" />
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
                Recursos recomendados
              </h3>
              <div className="space-y-2 text-sm text-[#7c777a]">
                <div className="hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <p className="font-medium text-[#21252d]">
                    Técnicas de relajación
                  </p>
                  <p>Ejercicios para reducir el estrés</p>
                </div>
                <div className="hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3">
                  <p className="font-medium text-[#21252d]">
                    Gestión del tiempo
                  </p>
                  <p>Estrategias de organización</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Estudiante;
