import React, { useState, useEffect } from "react";
import {
  PencilIcon,
  PhotoIcon,
  LinkIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const InstitutionDescriptionEditor = ({ institution, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: "",
    logoUrl: "",
    sitioWeb: "",
  });

  useEffect(() => {
    if (institution) {
      setFormData({
        descripcion: institution.descripcion || "",
        logoUrl: institution.logoUrl || "",
        sitioWeb: institution.sitioWeb || "",
      });
    }
  }, [institution]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/institutions/${institution.id}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...institution,
            ...formData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      if (data.success) {
        setEditing(false);
        if (onUpdate) {
          onUpdate();
        }
        alert("Información actualizada correctamente");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error actualizando institución:", error);
      alert("Error al actualizar la información: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      descripcion: institution?.descripcion || "",
      logoUrl: institution?.logoUrl || "",
      sitioWeb: institution?.sitioWeb || "",
    });
    setEditing(false);
  };

  if (!institution) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              Información Institucional
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Gestiona la descripción, logo y sitio web de la institución
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Editar
            </button>
          )}
        </div>

        <div className="mt-6">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                  Descripción de la Institución
                </label>
                <div className="mt-1">
                  <textarea
                    id="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, descripcion: e.target.value }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Describe la institución, su misión, visión, valores, programas académicos..."
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Esta descripción aparecerá en el perfil público de la institución.
                </p>
              </div>

              {/* URL del Logo */}
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                  <PhotoIcon className="inline h-4 w-4 mr-1" />
                  URL del Logo
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, logoUrl: e.target.value }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  URL pública del logo de la institución (formato PNG, JPG, SVG).
                </p>
              </div>

              {/* Sitio Web */}
              <div>
                <label htmlFor="sitioWeb" className="block text-sm font-medium text-gray-700">
                  <LinkIcon className="inline h-4 w-4 mr-1" />
                  Sitio Web Oficial
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    id="sitioWeb"
                    value={formData.sitioWeb}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, sitioWeb: e.target.value }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://www.universidad.edu.mx"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Sitio web oficial de la institución.
                </p>
              </div>

              {/* Botones */}
              <div className="flex items-center space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Vista de solo lectura */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Descripción</h4>
                {formData.descripcion ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{formData.descripcion}</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No hay descripción configurada para esta institución.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <PhotoIcon className="h-4 w-4 mr-1" />
                    Logo
                  </h4>
                  {formData.logoUrl ? (
                    <div className="space-y-2">
                      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                        <img
                          src={formData.logoUrl}
                          alt="Logo de la institución"
                          className="h-16 object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                        <div className="text-red-500 text-sm" style={{ display: "none" }}>
                          Error al cargar la imagen
                        </div>
                      </div>
                      <a
                        href={formData.logoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 truncate block"
                      >
                        {formData.logoUrl}
                      </a>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No hay logo configurado.</p>
                  )}
                </div>

                {/* Sitio Web */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Sitio Web
                  </h4>
                  {formData.sitioWeb ? (
                    <a
                      href={formData.sitioWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    >
                      {formData.sitioWeb}
                    </a>
                  ) : (
                    <p className="text-gray-500 italic">No hay sitio web configurado.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDescriptionEditor;