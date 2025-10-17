import React from "react";
import { Link } from "react-router-dom";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../../components/ui/Card";
import {
  CheckCircle,
  Calendar,
  BookOpen,
  Heart,
  ChevronRight,
  AlertTriangle,
  Wind,
  Brain,
  Phone,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";
import { API_CONFIG, STORAGE_KEYS, ROUTES } from "../../../utils/constants";

const glass =
  "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";
const listHover = "hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3";

const Estudiante = () => {
  const [dashboardData, setDashboardData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        const response = await fetch(
          `${API_CONFIG.API_BASE}/dashboard/student`,
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
        Panel de Estudiante
      </motion.h2>

      {/* Métricas con gradientes variados */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Evaluaciones"
            value={
              dashboardData?.estadisticas?.evaluaciones_completadas?.toString() ||
              "0"
            }
            icon={CheckCircle}
            color="from-[#527ceb] to-[#6762b3]" // brand
          />
          <StatCard
            title="Citas"
            value={
              dashboardData?.estadisticas?.proximas_citas?.toString() || "0"
            }
            icon={Calendar}
            color="from-[#10cfbd] to-[#48b0f7]" // mint
          />
          <StatCard
            title="Quizzes"
            value={
              dashboardData?.estadisticas?.quizzes_disponibles?.toString() ||
              "0"
            }
            icon={BookOpen}
            color="from-[#f6d365] to-[#fda085]" // sunset
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bienestar */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#21252d] mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#527ceb]" />
                Tu bienestar
              </h3>

              {dashboardData?.ultimas_evaluaciones?.length > 0 ? (
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-[#6762b3]" />
                    <div>
                      <p className="font-medium text-[#21252d]">
                        Puntaje promedio:{" "}
                        {dashboardData.estadisticas?.promedio_puntaje ||
                          "No disponible"}
                      </p>
                      <p className="text-[#7c777a]">
                        {dashboardData.estadisticas?.ultima_evaluacion
                          ? `Última evaluación: ${new Date(
                              dashboardData.estadisticas.ultima_evaluacion
                            ).toLocaleDateString()}`
                          : "Sin evaluaciones recientes"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dashboardData.ultimas_evaluaciones
                      .slice(0, 3)
                      .map((ev, idx) => (
                        <div key={idx} className={listHover}>
                          <p className="font-medium text-[#21252d]">
                            {ev.titulo}
                          </p>
                          <p className="text-[#7c777a] text-xs">
                            Puntaje: {ev.puntajeTotal} • {ev.severidad}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#7c777a] py-5">
                  <Heart className="w-8 h-8 text-[#527ceb] mx-auto mb-2" />
                  <p>No hay evaluaciones registradas</p>
                  <p className="text-xs">
                    Completa tu primera evaluación para ver tu estado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recursos */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
        >
          <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#21252d] mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#6762b3]" />
                Recursos de Apoyo
              </h3>

              <div className="space-y-3 text-sm">
                <div className="rounded-lg p-3 border border-red-200 bg-gradient-to-r from-[#ffe3e3] to-[#ffd6d6]">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-[#b42318]" />
                    <span className="font-semibold text-[#b42318]">
                      Emergencias
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded text-xs bg-[#b42318] text-white hover:opacity-90 transition-colors">
                      911
                    </button>
                    <a
                      className="px-3 py-1 rounded text-xs bg-[#b42318] text-white hover:opacity-90 transition-colors"
                      href="tel:8009112000"
                    >
                      Locatel
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={ROUTES.RESPIRACION_GUIADA}
                    className={
                      listHover +
                      " cursor-pointer flex items-center gap-2 transition-all"
                    }
                  >
                    <Wind className="w-4 h-4 text-[#527ceb]" />
                    <p className="font-medium text-[#21252d]">
                      Ejercicios de Respiración
                    </p>
                    <ChevronRight className="w-4 h-4 text-[#6762b3] ml-auto" />
                  </Link>

                  <Link
                    to={ROUTES.RELAJACION_MUSCULAR}
                    className={
                      listHover +
                      " cursor-pointer flex items-center gap-2 transition-all"
                    }
                  >
                    <Activity className="w-4 h-4 text-[#6762b3]" />
                    <p className="font-medium text-[#21252d]">
                      Técnicas de Relajación
                    </p>
                    <ChevronRight className="w-4 h-4 text-[#6762b3] ml-auto" />
                  </Link>
                </div>

                {dashboardData?.psicologo && (
                  <div className="rounded-lg p-3 border border-blue-200 bg-gradient-to-r from-[#e8f0ff] to-[#e3ecff]">
                    <p className="font-medium text-[#21252d] text-xs">
                      Psicólogo Asignado
                    </p>
                    <p className="text-[#7c777a] text-xs">
                      {dashboardData.psicologo.psicologo_nombre}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Estudiante;
