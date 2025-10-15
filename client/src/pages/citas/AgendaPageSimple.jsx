// Página simplificada que redirige al sistema de chat
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Heart,
  Calendar,
  AlertTriangle,
  Clock,
  User,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const AgendaPageSimple = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: "Chat Directo",
      description: "Comunícate en tiempo real con estudiantes",
      color: "from-blue-500 to-blue-600",
      action: () => navigate('/chat')
    },
    {
      icon: Heart,
      title: "Apoyo Psicológico",
      description: "Brinda atención personalizada y continua",
      color: "from-pink-500 to-red-500",
      action: () => navigate('/chat')
    },
    {
      icon: User,
      title: "Seguimiento de Casos",
      description: "Mantén historial de conversaciones",
      color: "from-purple-500 to-purple-600",
      action: () => navigate('/chat')
    }
  ];

  const upcomingFeatures = [
    {
      icon: Calendar,
      title: "Sistema de Citas Avanzado",
      description: "Programación automática de citas",
      status: "Próximamente"
    },
    {
      icon: Clock,
      title: "Recordatorios Automáticos",
      description: "Notificaciones por email y SMS",
      status: "En desarrollo"
    },
    {
      icon: CheckCircle,
      title: "Reportes Detallados",
      description: "Análisis de patrones y seguimiento",
      status: "Planificado"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Centro de Atención Psicológica
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sistema integrado de comunicación y seguimiento
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <MessageCircle className="w-4 h-4 mr-2" />
            ¡Sistema de chat activo y funcionando!
          </div>
        </motion.div>

        {/* Funcionalidades Actuales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ✅ Funcionalidades Disponibles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={feature.action}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                  Usar ahora <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Acceso Rápido al Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white mb-16"
        >
          <MessageCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Comienza una Conversación
          </h2>
          <p className="text-xl mb-6 opacity-90">
            El sistema de chat está listo para conectarte con tus estudiantes
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Abrir Chat
          </button>
        </motion.div>

        {/* Funcionalidades Futuras */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            🚀 Próximas Funcionalidades
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 opacity-75"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {feature.status}
                  </span>
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-16 text-center bg-gray-100 rounded-xl p-6"
        >
          <p className="text-gray-600">
            <strong>Nota:</strong> Mientras desarrollamos las funcionalidades avanzadas de citas,
            puedes usar el sistema de chat para mantener comunicación directa con los estudiantes.
            Es más eficiente y permite un seguimiento continuo.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AgendaPageSimple;