import {
  Home,
  Users,
  Calendar,
  Heart,
  FileText,
  BarChart3,
  TrendingUp,
  Clock,
  Shield,
  MessageCircle,
} from "lucide-react";
import { ROUTES } from "../../../utils/constants";

export const baseItems = [
  { href: ROUTES.DASHBOARD, icon: Home, label: "Dashboard", roles: ["all"] },
];

export const roleSpecificItems = [
  // ===== Admin institución (incluye super-admin institución y nacional) =====
  {
    href: ROUTES.USUARIOS,
    icon: Users,
    label: "Gestión de Usuarios",
    roles: [
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },

  // ===== Psicología =====
  {
    href: ROUTES.QUIZ_RESULTADOS_ADMIN,
    icon: FileText,
    label: "Resultados de Quiz",
    roles: [
      "PSICOLOGO",
      "ORIENTADOR",
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },
  {
    href: ROUTES.QUIZ_ANALYTICS_ADMIN,
    icon: TrendingUp,
    label: "Análisis Estadístico",
    roles: [
      "PSICOLOGO",
      "ORIENTADOR",
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },
  {
    href: ROUTES.CANALIZACIONES,
    icon: Heart,
    label: "Canalizaciones",
    roles: [
      "PSICOLOGO",
      "ORIENTADOR",
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },
  // ===== Rutas de Citas =====
  {
    href: ROUTES.AGENDA,
    icon: Calendar,
    label: "Mi Agenda",
    roles: ["PSICOLOGO", "ORIENTADOR"],
  },
  {
    href: ROUTES.DISPONIBILIDAD,
    icon: Clock,
    label: "Mi Disponibilidad",
    roles: ["PSICOLOGO", "ORIENTADOR"],
  },
  {
    href: ROUTES.CITAS_ADMIN,
    icon: Calendar,
    label: "Administrar Citas",
    roles: [
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },
  {
    href: ROUTES.CHAT,
    icon: MessageCircle,
    label: "Chat",
    roles: [
      "PSICOLOGO",
      "ORIENTADOR",
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },

  // ===== Estudiante =====
  {
    href: ROUTES.QUIZ_CONTESTAR,
    icon: FileText,
    label: "Evaluaciones",
    roles: ["ESTUDIANTE"],
  },
  {
    href: ROUTES.MIS_RESULTADOS,
    icon: BarChart3,
    label: "Mis Resultados",
    roles: ["ESTUDIANTE"],
  },
  {
    href: ROUTES.RECURSOS,
    icon: Shield,
    label: "Recursos",
    roles: ["ESTUDIANTE"],
  },

  // ===== Reportes =====
  {
    href: ROUTES.REPORTES_PSICOLOGO,
    icon: BarChart3,
    label: "Mis Reportes",
    roles: [
      "PSICOLOGO",
      "ORIENTADOR",
    ],
  },
];