import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowLeft,
  Users,
  MessageCircle,
  Phone,
  Mail,
  Copy,
  CheckCircle,
  User,
  Calendar,
  Shield,
  AlertTriangle,
  Clock,
  BookOpen,
  Lightbulb,
  Target,
} from "lucide-react";
import { ROUTES } from "../../utils/constants";

const ComoPedirAyudaPage = () => {
  const [categoriaActiva, setCategoriaActiva] = useState("general");
  const [mensajeCopiado, setMensajeCopiado] = useState("");

  const categorias = [
    {
      id: "general",
      titulo: "Apoyo General",
      descripcion: "Cuando necesitas hablar con alguien",
      icon: Heart,
      color: "blue"
    },
    {
      id: "crisis",
      titulo: "Crisis o Emergencia",
      descripcion: "Situaciones urgentes que requieren ayuda inmediata",
      icon: AlertTriangle,
      color: "red"
    },
    {
      id: "academico",
      titulo: "Apoyo Académico",
      descripcion: "Problemas con estudios, profesores o carga académica",
      icon: BookOpen,
      color: "green"
    },
    {
      id: "profesional",
      titulo: "Ayuda Profesional",
      descripcion: "Contactar psicólogos, consejeros o especialistas",
      icon: User,
      color: "purple"
    }
  ];

  const plantillas = {
    general: [
      {
        titulo: "A un amigo cercano",
        situacion: "Cuando te sientes abrumado/a",
        canal: "Mensaje de texto o WhatsApp",
        plantilla: `Hola [nombre], espero que estés bien.

Últimamente me he sentido un poco abrumado/a y me gustaría hablar con alguien de confianza. ¿Podrías acompañarme a tomar un café o hablar por videollamada cuando tengas tiempo?

No es nada urgente, pero me haría mucho bien conversar contigo.

Gracias por siempre estar ahí 💙`,
        consejos: ["Sé específico sobre lo que necesitas", "Da opciones de tiempo flexibles", "Reconoce que valoras su amistad"]
      },
      {
        titulo: "A un familiar",
        situacion: "Cuando necesitas apoyo emocional",
        canal: "Llamada telefónica o presencial",
        plantilla: `Hola [nombre],

He estado pasando por un momento difícil y creo que me ayudaría mucho hablar contigo. ¿Podríamos encontrar un momento para conversar?

Me siento [describe brevemente: ansioso/a, triste, confundido/a] y sé que siempre puedo contar contigo.

¿Cuándo te viene bien?`,
        consejos: ["Los familiares a menudo prefieren llamadas", "Sé honesto sobre tus sentimientos", "Propón un momento específico"]
      },
      {
        titulo: "A un compañero de clase",
        situacion: "Cuando te sientes solo/a en la universidad",
        canal: "En persona o mensaje",
        plantilla: `Hey [nombre],

Espero que esté todo bien contigo. Últimamente me he sentido un poco desconectado/a y me preguntaba si te gustaría [estudiar juntos/tomar un café/almorzar] algún día de estos.

Me haría mucho bien tener más conexión con mis compañeros.

¿Qué te parece?`,
        consejos: ["Sugiere actividades específicas", "Se vulnerable pero no demasiado intenso", "Hazlo sentir como algo mutuamente beneficioso"]
      }
    ],
    crisis: [
      {
        titulo: "Mensaje de crisis a contacto de emergencia",
        situacion: "Cuando tienes pensamientos de autolesión",
        canal: "Llamada inmediata + mensaje de respaldo",
        plantilla: `URGENTE - [Tu nombre]

Estoy pasando por una crisis y tengo pensamientos de hacerme daño. Necesito hablar con alguien AHORA.

Por favor llámame inmediatamente: [tu número]

Si no puedes llamar, por favor ven a [tu ubicación] o envía a alguien.

Esto es real y necesito ayuda.`,
        consejos: ["Usa palabras claras como 'URGENTE'", "Sé directo sobre el riesgo", "Proporciona tu ubicación", "Ten múltiples contactos preparados"]
      },
      {
        titulo: "A psicología del campus",
        situacion: "Crisis durante horarios de oficina",
        canal: "Llamada telefónica o presencial",
        plantilla: `Buenos días/tardes,

Soy [tu nombre], estudiante de [carrera/semestre]. Estoy experimentando una crisis emocional y necesito hablar con alguien urgentemente.

Tengo pensamientos que me asustan y no me siento seguro/a solo/a.

¿Hay alguien disponible para atenderme ahora? Puedo ir al centro de bienestar inmediatamente.

Mi número es: [tu teléfono]`,
        consejos: ["Identifícate como estudiante", "Usa la palabra 'urgente' o 'crisis'", "Mantente disponible para responder"]
      },
      {
        titulo: "Mensaje a línea de crisis nacional",
        situacion: "Fuera de horarios regulares",
        canal: "Llamada a línea de vida",
        plantilla: `Al llamar a línea de crisis:

"Hola, estoy llamando porque estoy en crisis. Tengo [edad] años y soy estudiante universitario.

Estoy teniendo pensamientos de [autolesión/suicidio] y me siento [describe: desesperado/a, solo/a, sin esperanza].

Necesito hablar con alguien que me ayude a sentirme más seguro/a."`,
        consejos: ["Prepara esta información antes de llamar", "No minimices tu situación", "Estate en un lugar privado para hablar"]
      }
    ],
    academico: [
      {
        titulo: "Email a profesor",
        situacion: "Problemas personales afectando estudios",
        canal: "Correo electrónico formal",
        plantilla: `Asunto: Solicitud de reunión - [Tu nombre] - [Materia]

Estimado/a Profesor/a [apellido],

Espero que se encuentre bien. Soy [nombre completo], estudiante de su clase de [materia] en el horario de [hora].

Me dirijo a usted porque estoy atravesando algunas dificultades personales que están afectando mi rendimiento académico. Me gustaría solicitar una reunión para conversar sobre posibles opciones de apoyo o ajustes temporales.

¿Podría indicarme cuándo tendría disponibilidad para una breve conversación? Estoy disponible [días/horarios].

Agradezco mucho su tiempo y comprensión.

Atentamente,
[Tu nombre completo]
[Número de estudiante]
[Correo electrónico]`,
        consejos: ["Usa un asunto claro", "Sé profesional pero humano", "Propón horarios específicos", "No entres en detalles íntimos por email"]
      },
      {
        titulo: "A servicios estudiantiles",
        situacion: "Necesitas extensiones o ajustes académicos",
        canal: "Email o cita presencial",
        plantilla: `Buenos días,

Soy [nombre], estudiante de [carrera] con número de estudiante [número].

Estoy pasando por dificultades [de salud mental/familiares/económicas] que están impactando mi capacidad para cumplir con mis responsabilidades académicas.

Me gustaría conocer qué opciones de apoyo están disponibles, incluyendo:
- Extensiones de plazo para tareas
- Ajustes en exámenes
- Reducción temporal de carga académica
- Otros recursos de apoyo

¿Podrían orientarme sobre el proceso a seguir?

Agradezco su ayuda.

[Tu nombre]
[Contacto]`,
        consejos: ["Menciona recursos específicos que necesitas", "Pregunta sobre procesos y documentación", "Sé proactivo en buscar soluciones"]
      },
      {
        titulo: "A coordinador académico",
        situacion: "Considerando pausa temporal en estudios",
        canal: "Reunión presencial solicitada por email",
        plantilla: `Estimado/a [nombre/título],

Soy [nombre], estudiante de [carrera] en [semestre]. Me dirijo a usted porque estoy considerando tomar una pausa temporal en mis estudios debido a [motivos de salud/situación familiar/etc].

Me gustaría agendar una reunión para:
- Entender las opciones disponibles
- Conocer los procedimientos necesarios
- Discutir el impacto en mi plan de estudios
- Explorar alternativas antes de tomar esta decisión

¿Cuándo podríamos reunirnos? Estoy disponible [horarios].

Muchas gracias por su tiempo.

[Tu nombre]
[Datos de contacto]`,
        consejos: ["Expresa que estás 'considerando', no decidido", "Muestra que quieres explorar opciones", "Pide orientación sobre procedimientos"]
      }
    ],
    profesional: [
      {
        titulo: "Primera cita con psicólogo campus",
        situacion: "Solicitar cita inicial",
        canal: "Llamada telefónica",
        plantilla: `Al llamar:

"Buenos días, me gustaría agendar una cita con psicología.

Soy estudiante de [universidad/carrera] y estoy pasando por [ansiedad/depresión/estrés/duelo/etc] que está afectando mis estudios y bienestar.

¿Qué información necesitan para agendar la cita? ¿Cuál es la disponibilidad más próxima?"

Si preguntan detalles:
"Prefiero conversarlo en persona con el profesional, pero puedo decir que [síntoma principal] y creo que me beneficiaría hablar con alguien."`,
        consejos: ["No necesitas dar todos los detalles por teléfono", "Pregunta sobre tiempos de espera", "Confirma ubicación y qué llevar"]
      },
      {
        titulo: "Psicólogo privado por recomendación",
        situacion: "Buscar terapia externa",
        canal: "WhatsApp o llamada",
        plantilla: `Hola, buenos días.

Me contacto porque [nombre de quien lo recomendó] me compartió sus datos. Soy estudiante universitario de [edad] años y estoy buscando apoyo psicológico.

Estoy experimentando [ansiedad/depresión/estrés académico/etc] y creo que me beneficiaría iniciar terapia.

¿Podrían compartirme información sobre:
- Disponibilidad para nuevos pacientes
- Modalidad (presencial/virtual)
- Costo por sesión
- Disponibilidad de horarios

Muchas gracias por su tiempo.

[Tu nombre]`,
        consejos: ["Menciona quién lo recomendó", "Pregunta costos desde el inicio", "Se claro sobre tu disponibilidad de horarios"]
      },
      {
        titulo: "Seguimiento después de primera sesión",
        situacion: "Cuando no te sientes cómodo con el terapeuta",
        canal: "Email o mensaje directo",
        plantilla: `Estimado/a [nombre del terapeuta],

Gracias por la sesión del [fecha]. Quería comunicarle que, después de reflexionar, siento que quizás no es la mejor conexión terapéutica para mí en este momento.

Agradezco mucho su profesionalismo y tiempo. ¿Podrían orientarme sobre algún colega que manejen un enfoque diferente o que consideren podría ser mejor para mi situación?

Muchas gracias por su comprensión.

[Tu nombre]`,
        consejos: ["Es normal no conectar con el primer terapeuta", "Se honesto pero respetuoso", "Pide recomendaciones para otros profesionales"]
      }
    ]
  };

  const copiarMensaje = (texto, id) => {
    navigator.clipboard.writeText(texto);
    setMensajeCopiado(id);
    setTimeout(() => setMensajeCopiado(""), 2000);
  };

  const barreras = [
    {
      barrera: "No quiero ser una carga",
      respuesta: "Las personas que te quieren QUIEREN ayudarte. Pedir ayuda les da la oportunidad de estar ahí para ti.",
      icono: Heart
    },
    {
      barrera: "Debería poder manejarlo solo/a",
      respuesta: "Pedir ayuda es una señal de fortaleza, no debilidad. Los más fuertes saben cuándo necesitan apoyo.",
      icono: Target
    },
    {
      barrera: "No sé cómo empezar la conversación",
      respuesta: "Usa las plantillas de abajo. Un simple 'necesito hablar contigo' es suficiente para empezar.",
      icono: MessageCircle
    },
    {
      barrera: "Tengo miedo de que me juzguen",
      respuesta: "Las personas que realmente te importan no te juzgarán. Y los profesionales están entrenados para no juzgar.",
      icono: Shield
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700',
      red: 'bg-red-50 border-red-200 text-red-700',
      green: 'bg-green-50 border-green-200 text-green-700',
      purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    return colors[color] || colors.blue;
  };

  const getIconColor = (color) => {
    const colors = {
      blue: 'text-blue-600',
      red: 'text-red-600',
      green: 'text-green-600',
      purple: 'text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <Link
          to={ROUTES.RECURSOS}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="w-8 h-8 text-pink-600" />
            Cómo Pedir Ayuda
          </h1>
          <p className="text-gray-600 mt-2">
            Guía práctica para comunicar tus necesidades y recibir el apoyo que mereces
          </p>
        </div>
      </motion.div>

      {/* Barreras comunes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-pink-50 rounded-xl p-6 border border-pink-200"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-pink-600" />
          Primero, eliminemos las barreras mentales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {barreras.map((item, index) => {
            const IconComponent = item.icono;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg p-4 border border-pink-100"
              >
                <div className="flex items-start gap-3">
                  <IconComponent className="w-5 h-5 text-pink-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      "{item.barrera}"
                    </h3>
                    <p className="text-sm text-gray-700">{item.respuesta}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Navegación por categorías */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-900">Plantillas de Mensajes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categorias.map((categoria) => {
            const IconComponent = categoria.icon;
            return (
              <button
                key={categoria.id}
                onClick={() => setCategoriaActiva(categoria.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  categoriaActiva === categoria.id
                    ? getColorClasses(categoria.color)
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <IconComponent className={`w-6 h-6 mb-2 ${
                  categoriaActiva === categoria.id
                    ? getIconColor(categoria.color)
                    : 'text-gray-500'
                }`} />
                <h3 className="font-semibold text-gray-900 mb-1">{categoria.titulo}</h3>
                <p className="text-sm text-gray-600">{categoria.descripcion}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Plantillas de la categoría activa */}
      <AnimatePresence mode="wait">
        <motion.div
          key={categoriaActiva}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {plantillas[categoriaActiva]?.map((plantilla, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {plantilla.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Situación:</strong> {plantilla.situacion}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Canal recomendado:</strong> {plantilla.canal}
                  </p>
                </div>
                <button
                  onClick={() => copiarMensaje(plantilla.plantilla, `${categoriaActiva}-${index}`)}
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {mensajeCopiado === `${categoriaActiva}-${index}` ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Plantilla de mensaje:</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {plantilla.plantilla}
                </pre>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Consejos adicionales:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {plantilla.consejos.map((consejo, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      {consejo}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Contactos de emergencia */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-red-50 rounded-xl p-6 border border-red-200"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          Contactos de Emergencia
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to={ROUTES.CRISIS_INMEDIATA}
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-semibold">Centro de Crisis</p>
              <p className="text-sm text-gray-600">Recursos inmediatos</p>
            </div>
          </Link>
          <button
            onClick={() => window.open('tel:911', '_self')}
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Phone className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-semibold">911</p>
              <p className="text-sm text-gray-600">Emergencias nacionales</p>
            </div>
          </button>
          <button
            onClick={() => window.open('tel:800-911-2000', '_self')}
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Phone className="w-6 h-6 text-blue-500" />
            <div>
              <p className="font-semibold">Línea de la Vida</p>
              <p className="text-sm text-gray-600">800-911-2000</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Otros recursos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="bg-gray-50 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          ¿Qué hacer después de pedir ayuda?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to={ROUTES.AGENDAR_CITA}
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Calendar className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-semibold">Agendar Cita Profesional</p>
              <p className="text-sm text-gray-600">Con psicología del campus</p>
            </div>
          </Link>
          <Link
            to={ROUTES.RESPIRACION_GUIADA}
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow flex items-center gap-3"
          >
            <Heart className="w-6 h-6 text-pink-500" />
            <div>
              <p className="font-semibold">Técnicas de Calma</p>
              <p className="text-sm text-gray-600">Mientras esperas respuesta</p>
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ComoPedirAyudaPage;