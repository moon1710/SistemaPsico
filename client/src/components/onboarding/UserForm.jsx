import { useState } from "react";

export default function UserForm({ role, onSubmit }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {role === "ESTUDIANTE" && (
        <>
          <input
            name="matricula"
            placeholder="Matrícula"
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="carrera"
            placeholder="Carrera"
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </>
      )}

      {(role === "PSICOLOGO" || role === "ORIENTADOR") && (
        <>
          <input
            name="cedula"
            placeholder="Cédula Profesional"
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            name="especialidad"
            placeholder="Especialidad"
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </>
      )}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Guardar
      </button>
    </form>
  );
}