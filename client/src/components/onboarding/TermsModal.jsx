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
    if (acceptTerms && hasScrolledToBottom) {
      onAccept();
    }
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
                Términos y Condiciones
              </h2>
              <p className="text-white/90 mt-1 text-sm md:text-base">
                Lee y acepta nuestros términos para continuar
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
                Bienvenido al Sistema Neuroflora
              </h3>
              <p>
                Una plataforma educativa desarrollada por el Instituto
                Tecnológico Nacional de México, Campus Tuxtepec. Este sitio web
                y sistema está diseñado para proporcionar herramientas
                educativas y de apoyo psicológico a estudiantes, facilitando la
                detección temprana de condiciones como ansiedad y depresión a
                través de cuestionarios y tests validados.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Te explicamos lo esencial
              </h4>
              <p>
                <b>¿Qué es Neuroflora?</b>
                <p>
                  Es una plataforma educativa del Instituto Tecnológico Nacional
                  de México, Campus Tuxtepec, diseñada para apoyar tu bienestar
                  académico y emocional mediante cuestionarios de ansiedad y
                  depresión.
                </p>
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Aplicabilidad
              </h4>
              <p>
                Estos Términos se aplican a todos los usuarios, incluyendo
                estudiantes, tutores, personal autorizado y cualquier otra
                persona que acceda al Sistema. El Instituto se reserva el
                derecho de modificar estos Términos en cualquier momento,
                notificando los cambios a través del Sistema o por correo
                electrónico.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Responsable del Tratamiento
              </h4>
              <p>
                <strong>Responsable:</strong> Tu institución educativa.
              </p>
              <p>
                <strong>Finalidades:</strong> Brindar acompañamiento
                psicológico, gestionar citas, generar estadísticas agregadas y
                reportes institucionales.
              </p>
              <p>
                <strong>Datos tratados:</strong> Identificación, contacto y
                académicos; resultados de evaluaciones psicológicas.
              </p>
              <p>
                <strong>Base de tratamiento:</strong> Consentimiento y
                cumplimiento de obligaciones institucionales.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Conservación y Derechos
              </h4>
              <p>
                <strong>Conservación:</strong> Por el periodo necesario para las
                finalidades señaladas o lo establecido por normativa interna.
              </p>
              <p>
                <strong>Derechos ARCO:</strong> Puedes solicitar acceso,
                rectificación, cancelación u oposición escribiendo al área
                correspondiente.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Transferencias y Seguridad
              </h4>
              <p>
                <strong>Transferencias:</strong> No se realizan a terceros
                ajenos sin tu consentimiento, salvo requerimientos legales o
                situaciones de riesgo inminente para tu integridad o la de
                terceros.
              </p>
              <p>
                <strong>Seguridad:</strong> Se aplican medidas administrativas,
                técnicas y físicas para proteger tus datos.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Vigencia</h4>
              <p>
                Las modificaciones entrarán en vigor inmediatamente después de
                su publicación, y el uso continuado del Sistema implica la
                aceptación de las mismas.
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
                He leído completamente y acepto los términos y condiciones de
                uso, así como el tratamiento de mis datos personales para los
                fines descritos. Entiendo que puedo ejercer mis derechos ARCO en
                cualquier momento.
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
            No acepto
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
                Acepto y continuar
              </span>
            ) : (
              "Acepto y continuar"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;