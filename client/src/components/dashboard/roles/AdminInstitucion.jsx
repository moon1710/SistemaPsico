import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatCard from "../StatCard";
import { Card, CardContent } from "../../ui/Card";
import Button from "../../ui/Button";
import { usersService } from "../../../services/usersService";
import { ROUTES } from "../../../utils/constants";
import {
  Users,
  Brain,
  GraduationCap,
  UserPlus,
  Calendar,
  CheckCircle,
  BarChart3,
  Activity,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminInstitucion() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await usersService.getUserStats();
      if (response.success) setStats(response.data);
    } catch (e) {
      console.error("Error loading stats:", e);
    } finally {
      setLoading(false);
    }
  };

  const glass =
    "rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_8px_28px_rgba(0,0,0,0.08)]";
  const listHover = "hover:bg-[#f0f0f0]/60 rounded-lg transition-colors p-3";

  const quickActions = [
    {
      title: "Gestionar Usuarios",
      description: "Administra usuarios de tu institución",
      icon: Users,
      href: ROUTES.USUARIOS,
      gradient: "from-[#527ceb] to-[#6762b3]",
    },
    {
      title: "Ver Psicólogos",
      description: "Gestiona el equipo de psicólogos",
      icon: Brain,
      href: ROUTES.PSICOLOGOS,
      gradient: "from-[#6762b3] to-[#019fd2]",
    },
    {
      title: "Ver Estudiantes",
      description: "Administra estudiantes registrados",
      icon: GraduationCap,
      href: ROUTES.ESTUDIANTES,
      gradient: "from-[#48b0f7] to-[#10cfbd]",
    },
    {
      title: "Administrar Citas",
      description: "Gestiona las citas de la institución",
      icon: Calendar,
      href: ROUTES.CITAS_ADMIN,
      gradient: "from-[#ffb199] to-[#ff7a7a]",
    },
  ];

  const recentActivities = [
    {
      icon: UserPlus,
      colorClass: "text-[#527ceb]",
      title: "Nuevo psicólogo registrado",
      time: "Hace 2 horas",
    },
    {
      icon: CheckCircle,
      colorClass: "text-[#10cfbd]",
      title: "15 evaluaciones completadas",
      time: "Hace 4 horas",
    },
    {
      icon: Calendar,
      colorClass: "text-[#6762b3]",
      title: "8 citas programadas para hoy",
      time: "Hace 6 horas",
    },
    {
      icon: TrendingUp,
      colorClass: "text-[#ff7a7a]",
      title: "Reportes mensuales generados",
      time: "Hace 1 día",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-[#21252d]">
            Panel de Administración
          </h1>
          <p className="text-[#7c777a]">
            Gestiona tu institución de manera eficiente
          </p>
        </div>
        <Link to={ROUTES.USUARIOS}>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-[#527ceb] to-[#6762b3] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03]">
            <UserPlus className="w-4 h-4" />
            <span>Gestionar Usuarios</span>
          </Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Usuarios"
          value={loading ? "..." : stats?.total || "0"}
          icon={Users}
          color="from-[#527ceb] to-[#6762b3]"
        />
        <StatCard
          title="Estudiantes"
          value={loading ? "..." : stats?.estudiantes || "0"}
          icon={GraduationCap}
          color="from-[#48b0f7] to-[#10cfbd]"
        />
        <StatCard
          title="Psicólogos Activos"
          value={loading ? "..." : stats?.psicologos || "0"}
          icon={Brain}
          color="from-[#6762b3] to-[#019fd2]"
        />
        <StatCard
          title="Usuarios Activos"
          value={loading ? "..." : stats?.activos || "0"}
          icon={CheckCircle}
          color="from-[#ffb199] to-[#ff7a7a]"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-[#21252d] mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <Link key={i} to={a.href}>
              <Card
                className={`${glass} transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${a.gradient}`}
                    >
                      <a.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#21252d]">{a.title}</h3>
                      <p className="text-sm text-[#7c777a]">{a.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#7c777a]" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#21252d]">
                <Activity className="w-5 h-5 mr-2 text-[#10cfbd]" />
                Estado del Sistema
              </h3>
              <div className="space-y-3">
                {[
                  ["Módulo de Usuarios", "Activo", "emerald"],
                  ["Evaluaciones", "Activo", "emerald"],
                  ["Sistema de Citas", "Activo", "emerald"],
                  ["Reportes", "Configurando", "amber"],
                ].map(([name, status, tone], idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-[#7c777a]">{name}</span>
                    <span
                      className={`bg-${tone}-50 text-${tone}-700 px-2 py-1 rounded-full text-xs`}
                    >
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card
            className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#21252d]">
                <Calendar className="w-5 h-5 mr-2 text-[#6762b3]" />
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                {recentActivities.map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 ${listHover}`}
                  >
                    <a.icon className={`w-5 h-5 ${a.colorClass}`} />
                    <div className="flex-1">
                      <p className="text-sm text-[#21252d]">{a.title}</p>
                      <p className="text-xs text-[#7c777a]">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card
            className={`${glass} transition-all duration-300 hover:scale-[1.02]`}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-[#21252d]">
                <BarChart3 className="w-5 h-5 mr-2 text-[#527ceb]" />
                Estadísticas Rápidas
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#7c777a]">
                    Usuarios activos (30 días)
                  </span>
                  <span className="font-semibold text-[#21252d]">
                    {loading ? "..." : stats?.activosUltimos30Dias || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#7c777a]">
                    Usuarios inactivos
                  </span>
                  <span className="font-semibold text-[#21252d]">
                    {loading ? "..." : stats?.inactivos || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#7c777a]">Orientadores</span>
                  <span className="font-semibold text-[#21252d]">
                    {loading ? "..." : stats?.orientadores || "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#7c777a]">
                    Administradores
                  </span>
                  <span className="font-semibold text-[#21252d]">
                    {loading ? "..." : stats?.admins || "0"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
