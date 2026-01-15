import React, { useState } from "react";
import {
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const SolicitudModal = ({ solicitud, onClose, onUpdate }) => {
  const [processing, setProcessing] = useState(false);
  const [showDecisionForm, setShowDecisionForm] = useState(false);
  const [decision, setDecision] = useState(""); // 'aprobar', 'rechazar', 'revision'
  const [notasAdmin, setNotasAdmin] = useState("");
  const [motivoRechazo, setMotivoRechazo] = useState("");

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDIENTE":
        return "text-yellow-600 bg-yellow-100";
      case "EN_REVISION":
        return "text-blue-600 bg-blue-100";
      case "APROBADA":
        return "text-green-600 bg-green-100";
      case "RECHAZADA":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleDecision = (type) => {
    setDecision(type);
    setShowDecisionForm(true);
    setNotasAdmin("");
    setMotivoRechazo("");
  };

  const submitDecision = async () => {
    if (processing) return;

    // Validaciones
    if (decision === "rechazar" && motivoRechazo.trim().length < 10) {
      alert("El motivo de rechazo debe tener al menos 10 caracteres");
      return;
    }

    setProcessing(true);

    try {
      const endpoint = `${import.meta.env.VITE_API_URL}/api/admin/solicitudes/${solicitud.id}/${decision === "aprobar" ? "aprobar" : decision === "rechazar" ? "rechazar" : "revision"}`;

      const body = decision === "rechazar"
        ? { motivoRechazo, notasAdmin }
        : { notasAdmin };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Error: ${response.status}`);
      }

      if (data.success) {
        alert(data.message);
        onUpdate(); // Refresh the list
        onClose(); // Close modal
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error procesando solicitud:", error);
      alert("Error al procesar la solicitud: " + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const canTakeAction = () => {
    return solicitud.status === "PENDIENTE" || solicitud.status === "EN_REVISION";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Solicitud de Institución
                  </h3>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(solicitud.status)} mt-1`}>
                    {solicitud.status === "PENDIENTE" && <ClockIcon className="w-3 h-3 mr-1" />}
                    {solicitud.status === "EN_REVISION" && <ExclamationCircleIcon className="w-3 h-3 mr-1" />}
                    {solicitud.status === "APROBADA" && <CheckCircleIcon className="w-3 h-3 mr-1" />}
                    {solicitud.status === "RECHAZADA" && <XCircleIcon className="w-3 h-3 mr-1" />}
                    {solicitud.status.replace("_", " ")}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información de la institución */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    Información de la Institución
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombre del Campus</label>
                      <p className="text-base text-gray-900">{solicitud.institucionNombre}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Ciudad</label>
                        <p className="text-base text-gray-900">{solicitud.institucionCiudad}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Estado</label>
                        <p className="text-base text-gray-900">{solicitud.institucionEstado}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Dirección</label>
                      <p className="text-base text-gray-900">{solicitud.institucionDireccion || "No especificada"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Teléfono</label>
                        <p className="text-base text-gray-900 flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {solicitud.institucionTelefono}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email Institucional</label>
                        <p className="text-base text-gray-900 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {solicitud.institucionEmail}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Clave Institucional</label>
                      <p className="text-base text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                        {solicitud.cedulaProfesional}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del responsable */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Responsable de la Solicitud
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                      <p className="text-base text-gray-900">
                        {solicitud.nombre} {solicitud.apellidoPaterno} {solicitud.apellidoMaterno || ""}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Cargo</label>
                      <p className="text-base text-gray-900">{solicitud.cargoInstitucion}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Email Institucional</label>
                      <p className="text-base text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {solicitud.email}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600">Teléfono Personal</label>
                      <p className="text-base text-gray-900 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {solicitud.telefono}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Fecha de Solicitud</label>
                      <p className="text-base text-gray-900">{formatDate(solicitud.createdAt)}</p>
                    </div>

                    {solicitud.motivoSolicitud && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Comentarios</label>
                        <p className="text-base text-gray-900 bg-white p-2 rounded border">
                          {solicitud.motivoSolicitud}
                        </p>
                      </div>
                    )}

                    {solicitud.procesadoAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Fecha de Procesamiento</label>
                        <p className="text-base text-gray-900">{formatDate(solicitud.procesadoAt)}</p>
                      </div>
                    )}

                    {solicitud.notasAdmin && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Notas del Administrador</label>
                        <p className="text-base text-gray-900 bg-white p-2 rounded border">
                          {solicitud.notasAdmin}
                        </p>
                      </div>
                    )}

                    {solicitud.motivoRechazo && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Motivo de Rechazo</label>
                        <p className="text-base text-red-900 bg-red-50 p-2 rounded border border-red-200">
                          {solicitud.motivoRechazo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de decisión */}
            {showDecisionForm && (
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {decision === "aprobar" && "Aprobar Solicitud"}
                  {decision === "rechazar" && "Rechazar Solicitud"}
                  {decision === "revision" && "Poner en Revisión"}
                </h4>

                <div className="space-y-4">
                  {decision === "rechazar" && (
                    <div>
                      <label htmlFor="motivoRechazo" className="block text-sm font-medium text-gray-700">
                        Motivo de Rechazo *
                      </label>
                      <textarea
                        id="motivoRechazo"
                        rows={3}
                        value={motivoRechazo}
                        onChange={(e) => setMotivoRechazo(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Explique el motivo del rechazo (mínimo 10 caracteres)"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="notasAdmin" className="block text-sm font-medium text-gray-700">
                      Notas del Administrador {decision === "rechazar" ? "(Opcional)" : ""}
                    </label>
                    <textarea
                      id="notasAdmin"
                      rows={3}
                      value={notasAdmin}
                      onChange={(e) => setNotasAdmin(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Notas internas para el equipo..."
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={submitDecision}
                      disabled={processing}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                        decision === "aprobar"
                          ? "bg-green-600 hover:bg-green-700"
                          : decision === "rechazar"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                    >
                      {processing ? "Procesando..." :
                       decision === "aprobar" ? "Aprobar y Crear Institución" :
                       decision === "rechazar" ? "Rechazar Solicitud" :
                       "Poner en Revisión"}
                    </button>

                    <button
                      onClick={() => setShowDecisionForm(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {canTakeAction() && !showDecisionForm && (
              <div className="flex space-x-3 sm:ml-3">
                <button
                  onClick={() => handleDecision("aprobar")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Aprobar
                </button>

                <button
                  onClick={() => handleDecision("revision")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  En Revisión
                </button>

                <button
                  onClick={() => handleDecision("rechazar")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Rechazar
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudModal;