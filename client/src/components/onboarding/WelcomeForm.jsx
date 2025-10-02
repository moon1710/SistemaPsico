// client/src/components/onboarding/WelcomeForm.jsx
import React, { useState } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { API_CONFIG} from "../../utils/constants";

const WelcomeForm = () => {
  const { user, completeOnboarding } = useOnboarding();
  // Obtener el rol del usuario
  const userRole = user?.instituciones?.[0]?.rol || 'ESTUDIANTE';

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Campos básicos para todos
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    ciudad: '',
    estado: '',

    // Campos específicos para estudiantes (9 campos total)
    ...(userRole === 'ESTUDIANTE' && {
      semestre: '',
      grupo: '',
      turno: '',
      carrera: ''
    }),

    // Campos para psicólogos (9 campos total)
    ...(userRole === 'PSICOLOGO' && {
      numeroEmpleado: '',
      cedulaProfesional: '',
      departamento: '',
      telefonoEmergencia: ''
    }),

    // Campos para orientadores y admins (7 campos total)
    ...((['ORIENTADOR', 'ADMIN_INSTITUCION'].includes(userRole)) && {
      departamento: '',
      telefonoEmergencia: ''
    }),

    // Términos y condiciones para todos
    aceptaTerminos: false
  });

  // Función helper para obtener estilos de input con errores
  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
    const errorClasses = formErrors[fieldName] ? "border-red-500 bg-red-50" : "border-gray-300";
    return `${baseClasses} ${errorClasses}`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpiar errores previos
    setFormErrors({});
    setSubmitError('');
    setIsSubmitting(true);

    try {
      // Filtrar campos vacíos y preparar datos para envío
      const dataToSend = {};

      // Solo incluir campos que tienen valor
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        // Incluir si no es string vacía, no es null, y no es undefined
        if (value !== '' && value !== null && value !== undefined) {
          // Para booleans, siempre incluir
          if (typeof value === 'boolean') {
            dataToSend[key] = value;
          }
          // Para strings, solo si no están vacíos
          else if (typeof value === 'string' && value.trim() !== '') {
            dataToSend[key] = value.trim();
          }
          // Para números, siempre incluir
          else if (typeof value === 'number') {
            dataToSend[key] = value;
          }
        }
      });

      console.log('🚀 Datos a enviar al servidor:', dataToSend);

      // Llamar a la API para actualizar el perfil del usuario
      const response = await fetch(
        `${API_CONFIG.API_BASE}/onboarding/complete-profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('auth_token')}`, // Necesario para auth
          },
          credentials: "include", // <- importante para enviar la cookie
          body: JSON.stringify(dataToSend),
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Perfil completado exitosamente:', result);
        // Solo completar si la API respondió OK
        completeOnboarding();
      } else {
        // Mostrar error detallado al usuario
        const errorData = await response.json().catch(() => null);
        console.error('❌ Error al completar perfil:', errorData || response.statusText);

        // Si hay errores de validación, mostrarlos en los campos específicos
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          const fieldErrors = {};
          errorData.errors.forEach(error => {
            if (error.path) {
              fieldErrors[error.path] = error.msg;
            }
          });
          setFormErrors(fieldErrors);
          setSubmitError('Por favor corrige los errores marcados en rojo.');
        } else {
          // Error general
          setSubmitError(errorData?.message || 'Error al guardar el perfil. Por favor, intenta nuevamente.');
        }
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setSubmitError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener el primer nombre del usuario
  const firstName = user?.nombre || user?.nombreCompleto?.split(' ')[0] || 'Usuario';
  
  // Determinar el rol para el saludo
  const getRoleDisplay = () => {
    const roleNames = {
      'ESTUDIANTE': 'Estudiante',
      'PSICOLOGO': 'Psicólogo/a',
      'ORIENTADOR': 'Orientador/a',
      'ADMIN_INSTITUCION': 'Administrador',
      'SUPER_ADMIN_INSTITUCION': 'Super Administrador',
      'SUPER_ADMIN_NACIONAL': 'Super Administrador Nacional'
    };
    
    return roleNames[userRole] || 'Usuario';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Hola, {firstName}!
        </h2>
        <p className="text-xl text-gray-600 mb-4">
          Bienvenido/a como <span className="font-semibold text-blue-600">{getRoleDisplay()}</span>
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <p className="text-gray-700">
            Para completar tu registro, necesitamos algunos datos adicionales. 
            Esto nos ayudará a personalizar tu experiencia en la plataforma.
          </p>
        </div>
      </div>

      {/* Mostrar errores generales */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <h4 className="text-red-800 font-medium">Error al enviar el formulario</h4>
              <p className="text-red-700 text-sm mt-1">{submitError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Información Personal Básica */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Información Personal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono {userRole === 'ESTUDIANTE' && '*'}
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required={userRole === 'ESTUDIANTE'}
                className={getInputClasses('telefono')}
                placeholder="Ej: 2221234567"
              />
              {formErrors.telefono && (
                <p className="text-red-600 text-sm mt-1">{formErrors.telefono}</p>
              )}
            </div>

            <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento {userRole === 'ESTUDIANTE' && '*'}
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                required={userRole === 'ESTUDIANTE'}
                className={getInputClasses('fechaNacimiento')}
              />
              {formErrors.fechaNacimiento && (
                <p className="text-red-600 text-sm mt-1">{formErrors.fechaNacimiento}</p>
              )}
            </div>

            <div>
              <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
                Género {userRole === 'ESTUDIANTE' && '*'}
              </label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleInputChange}
                required={userRole === 'ESTUDIANTE'}
                className={getInputClasses('genero')}
              >
                <option value="">Selecciona una opción</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="NO_BINARIO">No binario</option>
                <option value="PREFIERO_NO_DECIR">Prefiero no decir</option>
              </select>
              {formErrors.genero && (
                <p className="text-red-600 text-sm mt-1">{formErrors.genero}</p>
              )}
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado {userRole === 'ESTUDIANTE' && '*'}
              </label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required={userRole === 'ESTUDIANTE'}
                className={getInputClasses('estado')}
                placeholder="Ej: Puebla"
              />
              {formErrors.estado && (
                <p className="text-red-600 text-sm mt-1">{formErrors.estado}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad {userRole === 'ESTUDIANTE' && '*'}
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                required={userRole === 'ESTUDIANTE'}
                className={getInputClasses('ciudad')}
                placeholder="Ej: Puebla de Zaragoza"
              />
              {formErrors.ciudad && (
                <p className="text-red-600 text-sm mt-1">{formErrors.ciudad}</p>
              )}
            </div>
          </div>
        </div>

        {/* Campos específicos para estudiantes */}
        {userRole === 'ESTUDIANTE' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🎓 Información Académica</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="semestre" className="block text-sm font-medium text-gray-700 mb-1">
                  Semestre *
                </label>
                <select
                  id="semestre"
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleInputChange}
                  required
                  className={getInputClasses('semestre')}
                >
                  <option value="">Selecciona</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(sem => (
                    <option key={sem} value={sem}>{sem}° Semestre</option>
                  ))}
                </select>
                {formErrors.semestre && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.semestre}</p>
                )}
              </div>

              <div>
                <label htmlFor="grupo" className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo
                </label>
                <input
                  type="text"
                  id="grupo"
                  name="grupo"
                  value={formData.grupo}
                  onChange={handleInputChange}
                  className={getInputClasses('grupo')}
                  placeholder="Ej: A, B, C"
                />
                {formErrors.grupo && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.grupo}</p>
                )}
              </div>

              <div>
                <label htmlFor="turno" className="block text-sm font-medium text-gray-700 mb-1">
                  Turno *
                </label>
                <select
                  id="turno"
                  name="turno"
                  value={formData.turno}
                  onChange={handleInputChange}
                  required
                  className={getInputClasses('turno')}
                >
                  <option value="">Selecciona</option>
                  <option value="MATUTINO">Matutino</option>
                  <option value="VESPERTINO">Vespertino</option>
                  <option value="NOCTURNO">Nocturno</option>
                  <option value="MIXTO">Mixto</option>
                </select>
                {formErrors.turno && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.turno}</p>
                )}
              </div>

              <div>
                <label htmlFor="carrera" className="block text-sm font-medium text-gray-700 mb-1">
                  Carrera *
                </label>
                <select
                  id="carrera"
                  name="carrera"
                  value={formData.carrera}
                  onChange={handleInputChange}
                  required
                  className={getInputClasses('carrera')}
                >
                  <option value="">Selecciona tu carrera</option>
                  <optgroup label="Licenciaturas">
                    <option value="Administración">Administración</option>
                    <option value="Contador Público">Contador Público</option>
                    <option value="Gestión Empresarial">Gestión Empresarial</option>
                  </optgroup>
                  <optgroup label="Ingenierías">
                    <option value="Ingeniería Química">Ingeniería Química</option>
                    <option value="Ingeniería Civil">Ingeniería Civil</option>
                    <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
                    <option value="Ingeniería Electromecánica">Ingeniería Electromecánica</option>
                    <option value="Ingeniería en Informática">Ingeniería en Informática</option>
                    <option value="Ingeniería en Sistemas Computacionales">Ingeniería en Sistemas Computacionales</option>
                    <option value="Ingeniería en Desarrollo de Aplicaciones">Ingeniería en Desarrollo de Aplicaciones</option>
                    <option value="Ingeniería Bioquímica">Ingeniería Bioquímica</option>
                  </optgroup>
                </select>
                {formErrors.carrera && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.carrera}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Campos para psicólogos */}
        {userRole === 'PSICOLOGO' && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💼 Información Profesional</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="numeroEmpleado" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Empleado
                </label>
                <input
                  type="text"
                  id="numeroEmpleado"
                  name="numeroEmpleado"
                  value={formData.numeroEmpleado}
                  onChange={handleInputChange}
                  className={getInputClasses('numeroEmpleado')}
                  placeholder="Ej: EMP001"
                />
                {formErrors.numeroEmpleado && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.numeroEmpleado}</p>
                )}
              </div>

              <div>
                <label htmlFor="cedulaProfesional" className="block text-sm font-medium text-gray-700 mb-1">
                  Cédula Profesional
                </label>
                <input
                  type="text"
                  id="cedulaProfesional"
                  name="cedulaProfesional"
                  value={formData.cedulaProfesional}
                  onChange={handleInputChange}
                  className={getInputClasses('cedulaProfesional')}
                  placeholder="Ej: 12345678"
                />
                {formErrors.cedulaProfesional && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.cedulaProfesional}</p>
                )}
              </div>

              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  className={getInputClasses('departamento')}
                  placeholder="Ej: Psicología Clínica"
                />
                {formErrors.departamento && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.departamento}</p>
                )}
              </div>

              <div>
                <label htmlFor="telefonoEmergencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  id="telefonoEmergencia"
                  name="telefonoEmergencia"
                  value={formData.telefonoEmergencia}
                  onChange={handleInputChange}
                  className={getInputClasses('telefonoEmergencia')}
                  placeholder="Ej: 2221234567"
                />
                {formErrors.telefonoEmergencia && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.telefonoEmergencia}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Campos para orientadores y admins */}
        {(['ORIENTADOR', 'ADMIN_INSTITUCION'].includes(userRole)) && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💼 Información Profesional</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <input
                  type="text"
                  id="departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleInputChange}
                  className={getInputClasses('departamento')}
                  placeholder="Ej: Orientación Educativa"
                />
                {formErrors.departamento && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.departamento}</p>
                )}
              </div>

              <div>
                <label htmlFor="telefonoEmergencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de Emergencia
                </label>
                <input
                  type="tel"
                  id="telefonoEmergencia"
                  name="telefonoEmergencia"
                  value={formData.telefonoEmergencia}
                  onChange={handleInputChange}
                  className={getInputClasses('telefonoEmergencia')}
                  placeholder="Ej: 2221234567"
                />
                {formErrors.telefonoEmergencia && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.telefonoEmergencia}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Términos y Condiciones para todos */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Términos y Condiciones</h3>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Política de Privacidad y Uso de Datos</h4>
              <p className="text-sm text-gray-600 mb-3">
                Al completar tu perfil, aceptas que tus datos serán utilizados exclusivamente para fines educativos y de apoyo psicológico dentro de la institución.
                Tus datos personales están protegidos conforme a la Ley Federal de Protección de Datos Personales.
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Tus datos se utilizarán para seguimiento académico y bienestar estudiantil</li>
                <li>• La información será confidencial y solo accesible al personal autorizado</li>
                <li>• Puedes solicitar la actualización o eliminación de tus datos en cualquier momento</li>
                <li>• No compartiremos tu información con terceros sin tu consentimiento</li>
              </ul>
            </div>

            <div className="flex items-start space-x-3">
              <input
                id="aceptaTerminos"
                name="aceptaTerminos"
                type="checkbox"
                checked={formData.aceptaTerminos}
                onChange={handleInputChange}
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="aceptaTerminos" className="text-sm text-gray-700">
                <span className="font-medium">He leído y acepto</span> los términos y condiciones de uso del sistema,
                así como el tratamiento de mis datos personales conforme a la política de privacidad. *
              </label>
            </div>
            {formErrors.aceptaTerminos && (
              <p className="text-red-600 text-sm">{formErrors.aceptaTerminos}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              'Completar mi perfil y comenzar'
            )}
          </button>
        </div>
      </form>

      {/* Skip Option */}
      <div className="text-center mt-4">
        <button
          onClick={completeOnboarding}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Completar más tarde
        </button>
      </div>
    </div>
  );
};

export default WelcomeForm;