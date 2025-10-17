import { useState } from "react";

const input =
  "w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#527ceb] focus:border-[#527ceb]";
const card =
  "rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-gray-100";

export default function UserForm({ role, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`${card} space-y-6`}>
      <div className="space-y-4">
        {role === "ESTUDIANTE" && (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Matrícula
              </label>
              <input
                name="matricula"
                placeholder="Ej: 2025XXXX"
                onChange={handleChange}
                className={input}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Carrera
              </label>
              <input
                name="carrera"
                placeholder="Ingeniería en Sistemas..."
                onChange={handleChange}
                className={input}
              />
            </div>
          </>
        )}

        {(role === "PSICOLOGO" || role === "ORIENTADOR") && (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Cédula profesional
              </label>
              <input
                name="cedula"
                placeholder="12345678"
                onChange={handleChange}
                className={input}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Especialidad
              </label>
              <input
                name="especialidad"
                placeholder="Clínica, educativa..."
                onChange={handleChange}
                className={input}
              />
            </div>
          </>
        )}

        {/* Campos generales para todos los roles */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Sexo asignado al nacer
          </label>
          <select
            name="genero"
            onChange={handleChange}
            className={input}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMENINO">Femenino</option>
            <option value="NO_BINARIO">No binario</option>
            <option value="PREFIERO_NO_DECIR">Prefiero no decir</option>
          </select>
        </div>

        {/* Dirección */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Ciudad
            </label>
            <input
              name="ciudad"
              placeholder="Ciudad"
              onChange={handleChange}
              className={input}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Estado
            </label>
            <input
              name="estado"
              placeholder="Estado"
              onChange={handleChange}
              className={input}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Código Postal
            </label>
            <input
              name="codigoPostal"
              placeholder="12345"
              onChange={handleChange}
              className={input}
              maxLength="10"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Colonia
            </label>
            <input
              name="colonia"
              placeholder="Colonia"
              onChange={handleChange}
              className={input}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#527ceb] to-[#6762b3] text-white font-medium hover:from-[#019fd2] hover:to-[#48b0f7] transition-all"
      >
        Guardar
      </button>
    </form>
  );
}
