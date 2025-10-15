import React from "react";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import { Users, FileText, Calendar, BarChart3, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { API_CONFIG, STORAGE_KEYS } from "../../../utils/constants";

const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";
const listHover = "hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3";

const Psicologo = () => {
  const [dashboardData, setDashboardData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = await fetch(
          `${API_CONFIG.API_BASE}/dashboard/psychologist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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

      {/* Métricas con paleta diversa */}
      {!loading && dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Estudiantes asignados"
            value={
              dashboardData.estadisticas?.total_estudiantes?.toString() || "0"
            }
            icon={Users}
            color="from-[#43cea2] to-[#185a9d]" // ocean
          />
          <StatCard
            title="Evaluaciones recientes"
            value={
              dashboardData.estadisticas?.evaluaciones_recientes?.toString() ||
              "0"
            }
            icon={FileText}
            color="from-[#527ceb] to-[#6762b3]" // brand
          />
          <StatCard
            title="Próximas citas"
            value={
              dashboardData.estadisticas?.proximas_citas?.toString() || "0"
            }
            icon={Calendar}
            color="from-[#10cfbd] to-[#48b0f7]" // mint
          />
        </div>
      )}

      {/* Resumen + Próximas acciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#21252d] mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#527ceb]" />
                Resumen de Actividad
              </h3>
              <div className="space-y-3 text-sm text-[#7c777a]">
                {dashboardData ? (
                  <>
                    <Row
                      label="Estudiantes bajo tu cuidado"
                      value={dashboardData.estadisticas?.total_estudiantes || 0}
                    />
                    <Row
                      label="Evaluaciones esta semana"
                      value={
                        dashboardData.estadisticas?.evaluaciones_recientes || 0
                      }
                    />
                    <Row
                      label="Citas programadas"
                      value={dashboardData.estadisticas?.proximas_citas || 0}
                    />
                  </>
                ) : (
                  <div className="text-center text-[#7c777a] py-8">
                    <p>Cargando información del dashboard…</p>
                  </div>
                )}
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
              <h3 className="text-lg font-semibold text-[#21252d] mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#6762b3]" />
                Próximas acciones
              </h3>
              <div className="space-y-2">
                {[
                  "Revisar 3 evaluaciones con severidad alta",
                  "Confirmar 2 citaciones pendientes",
                  "Enviar seguimiento a 4 estudiantes",
                ].map((t) => (
                  <div key={t} className={listHover}>
                    <span className="text-sm text-[#21252d]">{t}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-lg bg-[#f7f7f7]">
      <span className="text-sm text-[#7c777a]">{label}</span>
      <span className="font-semibold text-[#21252d]">{value}</span>
    </div>
  );
}

export default Psicologo;
