import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#21252d] text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top */}
        <div className="py-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand / About */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="NeuroFlora Logo"
                className="w-8 h-8 object-contain"
              />
              <Link
                to={ROUTES.HOME}
                className="text-xl font-semibold tracking-tight hover:text-[#48b0f7] transition-colors"
              >
                NeuroFlora
              </Link>
            </div>
            <p className="mt-3 text-sm text-white/75 leading-6">
              Plataforma integral para el bienestar estudiantil, diseñada para
              instituciones educativas que priorizan la salud mental de su
              comunidad.
            </p>
          </div>

          {/* Información */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Información
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  to={ROUTES.ABOUTUS}
                  className="hover:text-[#48b0f7] transition-colors"
                >
                  Acerca de Nosotros
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.HELP}
                  className="hover:text-[#48b0f7] transition-colors"
                >
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.DOCUMENTACION}
                  className="hover:text-[#48b0f7] transition-colors"
                >
                  Documentación
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Soporte
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  to={ROUTES.SUPPORT}
                  className="hover:text-[#48b0f7] transition-colors"
                >
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.HELP}
                  className="hover:text-[#48b0f7] transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.DOCUMENTACION}
                  className="hover:text-[#48b0f7] transition-colors"
                >
                  Capacitación
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom */}
        <div className="py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="NeuroFlora Logo"
              className="w-5 h-5 object-contain"
            />
            <Link
              to={ROUTES.HOME}
              className="text-sm font-medium hover:text-[#48b0f7] transition-colors"
            >
              NeuroFlora
            </Link>
          </div>

          <p className="text-xs text-white/70">
            © {year} NeuroFlora. Todos los derechos reservados.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
            <Link
              to={ROUTES.TERMINOS}
              className="hover:text-[#48b0f7] transition-colors"
            >
              Términos de Servicio
            </Link>
            <Link
              to={ROUTES.PRIVACIDAD}
              className="hover:text-[#48b0f7] transition-colors"
            >
              Política de Privacidad
            </Link>
            <Link
              to={ROUTES.CONFINDENCIALIDAD}
              className="hover:text-[#48b0f7] transition-colors"
            >
              Confidencialidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
