import {
  Home,
  Users,
  Brain,
  GraduationCap,
  Settings,
  Calendar,
  ClipboardList,
  Heart,
  MessageSquare,
  FileText,
  BookOpen,
  UserPlus,
  Building,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

export const baseItems = [
  { href: ROUTES.DASHBOARD, icon: Home, label: "Dashboard", roles: ["all"] },
];

export const roleSpecificItems = [
  {
    href: ROUTES.INSTITUCIONES,
    icon: Building,
    label: "Instituciones",
    roles: ["SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.ESTADISTICAS_GLOBALES,
    icon: TrendingUp,
    label: "Estadísticas Globales",
    roles: ["SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.USUARIOS,
    icon: Users,
    label: "Gestión de Usuarios",
    roles: ["SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.PSICOLOGOS,
    icon: Brain,
    label: "Psicólogos",
    roles: ["SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.ESTUDIANTES,
    icon: GraduationCap,
    label: "Estudiantes",
    roles: ["SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.MODULOS,
    icon: Settings,
    label: "Módulos Sistema",
    roles: ["SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.QUIZ_APLICAR,
    icon: ClipboardList,
    label: "Aplicar Quiz",
    roles: ["PSICOLOGO", "SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.CANALIZACIONES,
    icon: Heart,
    label: "Canalizaciones",
    roles: ["PSICOLOGO", "SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.CITAS,
    icon: Calendar,
    label: "Gestión de Citas",
    roles: ["PSICOLOGO", "SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.SESIONES,
    icon: MessageSquare,
    label: "Notas de Sesión",
    roles: ["PSICOLOGO", "SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: ROUTES.QUIZ_CONTESTAR,
    icon: FileText,
    label: "Contestar Quiz",
    roles: ["ESTUDIANTE"],
  },
  {
    href: ROUTES.MIS_CITAS,
    icon: Calendar,
    label: "Mis Citas",
    roles: ["ESTUDIANTE"],
  },
  {
    href: ROUTES.RECOMENDACIONES,
    icon: BookOpen,
    label: "Recomendaciones",
    roles: ["ESTUDIANTE"],
  },
  {
    href: "/orientacion",
    icon: UserPlus,
    label: "Orientación",
    roles: ["ORIENTADOR", "SUPER_ADMIN_INSTITUCION", "SUPER_ADMIN_NACIONAL"],
  },
  {
    href: "/reportes",
    icon: BarChart3,
    label: "Reportes",
    roles: [
      "PSICOLOGO",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
      "ORIENTADOR",
    ],
  },
];
