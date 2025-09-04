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
import { ROUTES } from "../../../utils/constants";

export const baseItems = [
  { href: ROUTES.DASHBOARD, icon: Home, label: "Dashboard", roles: ["all"] },
];

export const roleSpecificItems = [
  // ===== Nacional =====
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
  {
    href: ROUTES.PSICOLOGOS,
    icon: Brain,
    label: "Psicólogos",
    roles: [
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },
  {
    href: ROUTES.ESTUDIANTES,
    icon: GraduationCap,
    label: "Estudiantes",
    roles: [
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },
  {
    href: ROUTES.MODULOS,
    icon: Settings,
    label: "Módulos Sistema",
    roles: [
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },

  // ===== Psicología =====
  {
    href: ROUTES.QUIZ_APLICAR,
    icon: ClipboardList,
    label: "Aplicar Quiz",
    roles: [
      "PSICOLOGO",
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
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },
  {
    href: ROUTES.CITAS,
    icon: Calendar,
    label: "Gestión de Citas",
    roles: [
      "PSICOLOGO",
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },
  {
    href: ROUTES.SESIONES,
    icon: MessageSquare,
    label: "Notas de Sesión",
    roles: [
      "PSICOLOGO",
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },

  // ===== Estudiante =====
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

  // ===== Orientación/Tutor =====
  {
    href: "/orientacion",
    icon: UserPlus,
    label: "Orientación",
    roles: [
      "ORIENTADOR",
      "TUTOR",
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
    ],
  },

  // ===== Reportes =====
  {
    href: "/reportes",
    icon: BarChart3,
    label: "Reportes",
    roles: [
      "PSICOLOGO",
      "ADMIN_INSTITUCION",
      "SUPER_ADMIN_INSTITUCION",
      "SUPER_ADMIN_NACIONAL",
      "ORIENTADOR",
      "TUTOR",
    ],
  },
];
