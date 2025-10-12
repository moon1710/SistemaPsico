import React from "react";
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
  Moon,
  Shield,
  Users,
  Smartphone,
  FileText,
  Phone,
  Clock,
  Activity,
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
          title="Recursos disponibles"
          value="9"
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
              <h3 className="text-lg font-semibold text-[#21252d] mb-4">
                Recursos de Bienestar
              </h3>
              <div className="space-y-3 text-sm">
                {/* Crisis inmediata */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-red-800">Crisis Inmediata</span>
                  </div>
                  <p className="text-red-700 text-xs mb-2">
                    ¿Necesitas ayuda ahora? Contacta inmediatamente:
                  </p>
                  <div className="flex gap-2">
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                      <Phone className="w-3 h-3 inline mr-1" />
                      Emergencias: 911
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors">
                      Psicología Campus
                    </button>
                  </div>
                </div>

                {/* Primeros auxilios emocionales */}
                <div className="hover:bg-blue-50 rounded-lg transition-colors p-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-[#21252d]">Respiración Guiada</p>
                      <p className="text-[#7c777a] text-xs">Técnica 4-7-8 y ejercicios de calma</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6762b3] ml-auto" />
                  </div>
                </div>

                <div className="hover:bg-green-50 rounded-lg transition-colors p-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="font-medium text-[#21252d]">Técnica 5-4-3-2-1</p>
                      <p className="text-[#7c777a] text-xs">Grounding para ansiedad</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6762b3] ml-auto" />
                  </div>
                </div>

                <div className="hover:bg-purple-50 rounded-lg transition-colors p-3 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="font-medium text-[#21252d]">Relajación Muscular</p>
                      <p className="text-[#7c777a] text-xs">Ejercicios de tensión-relajación</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#6762b3] ml-auto" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sección adicional de recursos */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Hábitos y estilo de vida */}
          <div className={`${glass} transition-all duration-300 hover:scale-[1.02] p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <Moon className="w-5 h-5 text-indigo-600" />
              <h4 className="font-semibold text-[#21252d]">Hábitos Saludables</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="hover:bg-indigo-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Guía de Sueño</p>
                <p className="text-[#7c777a]">Higiene del sueño y rutinas</p>
              </div>
              <div className="hover:bg-indigo-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Alimentación Simple</p>
                <p className="text-[#7c777a]">Tips nutricionales básicos</p>
              </div>
            </div>
          </div>

          {/* Académico y estrés */}
          <div className={`${glass} transition-all duration-300 hover:scale-[1.02] p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-[#21252d]">Apoyo Académico</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="hover:bg-orange-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Método Pomodoro</p>
                <p className="text-[#7c777a]">Gestión del tiempo de estudio</p>
              </div>
              <div className="hover:bg-orange-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Exámenes sin Ansia</p>
                <p className="text-[#7c777a]">Estrategias anti-estrés</p>
              </div>
            </div>
          </div>

          {/* Seguridad y protección */}
          <div className={`${glass} transition-all duration-300 hover:scale-[1.02] p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-[#21252d]">Seguridad</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="hover:bg-green-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Violencia y Acoso</p>
                <p className="text-[#7c777a]">Guía de documentación y ayuda</p>
              </div>
              <div className="hover:bg-green-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Ciberseguridad</p>
                <p className="text-[#7c777a]">Protección en redes sociales</p>
              </div>
            </div>
          </div>

          {/* Red de apoyo */}
          <div className={`${glass} transition-all duration-300 hover:scale-[1.02] p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-teal-600" />
              <h4 className="font-semibold text-[#21252d]">Red de Apoyo</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="hover:bg-teal-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Mapa de Apoyo</p>
                <p className="text-[#7c777a]">Identifica tu red de soporte</p>
              </div>
              <div className="hover:bg-teal-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Cómo Pedir Ayuda</p>
                <p className="text-[#7c777a]">Mensajes modelo y consejos</p>
              </div>
            </div>
          </div>

          {/* Diversidad e inclusión */}
          <div className={`${glass} transition-all duration-300 hover:scale-[1.02] p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-pink-600" />
              <h4 className="font-semibold text-[#21252d]">Diversidad</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="hover:bg-pink-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Grupos Estudiantiles</p>
                <p className="text-[#7c777a]">Directorio de comunidades</p>
              </div>
              <div className="hover:bg-pink-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Atención Sensible</p>
                <p className="text-[#7c777a]">Recursos inclusivos</p>
              </div>
            </div>
          </div>

          {/* Políticas y privacidad */}
          <div className={`${glass} transition-all duration-300 hover:scale-[1.02] p-4`}>
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-[#21252d]">Privacidad</h4>
            </div>
            <div className="space-y-2 text-xs">
              <div className="hover:bg-gray-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Uso de Datos</p>
                <p className="text-[#7c777a]">Cómo protegemos tu información</p>
              </div>
              <div className="hover:bg-gray-50 rounded p-2 cursor-pointer transition-colors">
                <p className="font-medium">Políticas</p>
                <p className="text-[#7c777a]">Términos y condiciones</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Estudiante;
