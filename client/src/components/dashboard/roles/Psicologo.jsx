import React from "react";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import { Users, FileText, Calendar, BarChart3, Activity, ExternalLink, UserCheck, MapPin, Clock, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { API_CONFIG, STORAGE_KEYS } from "../../../utils/constants";

const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";
const listHover = "hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3";

const GOOGLE_CALENDAR_LINK = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2B-xvZKl6KLUb7H0jvcNNBNdXAhGO9X2G0Qwl0DOMBFDzykmYM1Kv0MOHSs0vPrWkUZTDyy2QQ";

const PSYCHOLOGIST_INFO = {
  name: "Claudia Ortiz Reyes",
  year: "2025 Psicología",
  sessionDuration: "Citas de 45 min",
  institution: "TecNM - Campus Tuxtepec",
  address: "Avenida Dr, Víctor Bravo Ahuja S/N, 5 de Mayo, 68350 San Juan Bautista Tuxtepec, Oax., México",
  newLocation: "NUEVA UBICACIÓN: Oficina situada a lado de la Sala de usos Múltiples, siguiendo la ruta de acceso hacia el Oxxo."
};

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

      {/* Información del Psicólogo */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.07 }}
        className="mt-8"
      >
        <Card className={`${glass} transition-all duration-300 hover:scale-[1.02]`}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#21252d] mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#6762b3]" />
              Información del Psicólogo
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6762b3] to-[#527ceb] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">CO</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#21252d] text-lg">{PSYCHOLOGIST_INFO.name}</h4>
                    <p className="text-[#7c777a] text-sm">{PSYCHOLOGIST_INFO.year}</p>
                    <p className="text-[#7c777a] text-sm">{PSYCHOLOGIST_INFO.institution}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#21252d]">
                  <Clock className="w-4 h-4 text-[#527ceb]" />
                  <span className="text-sm font-medium">{PSYCHOLOGIST_INFO.sessionDuration}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#527ceb] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#21252d] leading-relaxed">{PSYCHOLOGIST_INFO.address}</p>
                    <div className="mt-2 p-2 bg-gradient-to-r from-[#10cfbd]/10 to-[#48b0f7]/10 rounded-lg border-l-2 border-[#10cfbd]">
                      <p className="text-xs text-[#21252d] font-medium">{PSYCHOLOGIST_INFO.newLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Acciones Rápidas Section */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.14 }}
        className="mt-8"
      >
        <Card className={`${glass} transition-all duration-300 hover:scale-[1.02]`}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#21252d] mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#527ceb]" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Agendar Cita Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(GOOGLE_CALENDAR_LINK, '_blank')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#527ceb] to-[#6762b3] p-6 text-left transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-6 h-6 text-white" />
                    <span className="font-semibold text-white text-lg">Agendar Cita</span>
                  </div>
                  <p className="text-white/80 text-sm mb-3">
                    Programa citas con estudiantes usando Google Calendar
                  </p>
                  <div className="flex items-center gap-2 text-white/90">
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Abrir calendario</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              {/* Canalizaciones Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/canalizaciones'}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#43cea2] to-[#185a9d] p-6 text-left transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <UserCheck className="w-6 h-6 text-white" />
                    <span className="font-semibold text-white text-lg">Canalizaciones</span>
                  </div>
                  <p className="text-white/80 text-sm mb-3">
                    Gestiona estudiantes que requieren atención especializada
                  </p>
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="text-sm">Ver canalizaciones</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
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
