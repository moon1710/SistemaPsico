import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, FileText } from "lucide-react";

const TermsModal = ({ onAccept, onDecline }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (acceptTerms && hasScrolledToBottom) onAccept();
  };

  return (
    <div className="max-w-4xl mx-auto pb-4">
      {/* Header */}
      <div className="mb-6">
        <div
          className="rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-5 md:p-6"
          style={{
            background: "linear-gradient(135deg, #527ceb 0%, #6762b3 100%)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Términos y Política de Privacidad
              </h2>
              <p className="text-white/90 mt-1 text-sm md:text-base">
                Lee y acepta para continuar usando el Sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100 p-5 md:p-6">
        <div
          className="max-h-96 overflow-y-auto pr-2 text-sm text-gray-700 leading-relaxed space-y-4"
          onScroll={handleScroll}
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ¡Bienvenido(a) al Sistema Neuroflora!
              </h3>
              <p>
                Antes de continuar, te pedimos leer y aceptar nuestros{" "}
                <strong>Términos y Condiciones</strong> y{" "}
                <strong>Política de Privacidad</strong>. Aquí te explicamos lo
                esencial:
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ¿Qué es Neuroflora?
              </h4>
              <p>
                Es una plataforma educativa del Instituto Tecnológico Nacional
                de México, Campus Tuxtepec, diseñada para apoyar tu bienestar
                académico y emocional mediante cuestionarios de ansiedad y
                depresión.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ¿Qué datos recopilamos?
              </h4>
              <p>
                Información como tu nombre, correo institucional, carrera,
                semestre y<strong> respuestas a los cuestionarios</strong>.
                Estos últimos son <strong>datos sensibles</strong>, ya que están
                relacionados con tu salud mental.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ¿Para qué usamos tus datos?
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Para permitirte acceder al Sistema y obtener resultados de los
                  cuestionarios.
                </li>
                <li>
                  Para que tutores y personal autorizado te brinden seguimiento
                  académico y psicológico.
                </li>
                <li>
                  Opcionalmente, para crear{" "}
                  <strong>estadísticas anónimas</strong> que mejoren el Sistema.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                ¿Cómo protegemos tus datos?
              </h4>
              <p>
                Usamos <strong>cifrado</strong>,{" "}
                <strong>acceso restringido</strong> y{" "}
                <strong>auditorías periódicas</strong> para garantizar la
                seguridad de tu información.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Tus derechos (ARCO)
              </h4>
              <p>
                Puedes acceder, corregir, cancelar u oponerte al uso de tus
                datos enviando una solicitud a{" "}
                <a
                  href="mailto:cyd_tuxtepec@tecnm.mx"
                  className="text-[#527ceb] underline"
                >
                  cyd_tuxtepec@tecnm.mx
                </a>
                .
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Importante</h4>
              <p>
                Los cuestionarios son <strong>herramientas educativas</strong>,
                no un diagnóstico médico. Si los resultados sugieren problemas
                de salud mental, te recomendamos buscar ayuda profesional.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Confirmación</h4>
              <p>
                Al hacer clic en <strong>“Aceptar”</strong>, confirmas que has
                leído y aceptas los Términos y Condiciones y la Política de
                Privacidad. Si no estás de acuerdo, selecciona{" "}
                <strong>“Cancelar”</strong> y no podrás usar el Sistema.
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {!hasScrolledToBottom && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              Por favor, desplázate hasta el final para continuar
            </p>
          </div>
        )}

        {/* Acceptance checkbox */}
        {hasScrolledToBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#527ceb] focus:ring-[#527ceb]"
              />
              <span>
                He leído completamente y acepto los Términos y Condiciones y la
                Política de Privacidad, así como el tratamiento de mis datos
                personales para los fines descritos. Entiendo que puedo ejercer
                mis derechos ARCO en cualquier momento.
              </span>
            </label>
          </motion.div>
        )}

        {/* Action buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDecline}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <motion.button
            whileHover={{
              scale: acceptTerms && hasScrolledToBottom ? 1.01 : 1,
            }}
            whileTap={{ scale: acceptTerms && hasScrolledToBottom ? 0.99 : 1 }}
            onClick={handleAccept}
            disabled={!acceptTerms || !hasScrolledToBottom}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              acceptTerms && hasScrolledToBottom
                ? "bg-gradient-to-r from-[#527ceb] to-[#6762b3] text-white hover:from-[#019fd2] hover:to-[#48b0f7]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {acceptTerms && hasScrolledToBottom ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Aceptar y continuar
              </span>
            ) : (
              "Aceptar y continuar"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
