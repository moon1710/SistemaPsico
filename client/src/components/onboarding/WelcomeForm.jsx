// client/src/components/onboarding/WelcomeForm.jsx
import React, { useState } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';

const WelcomeForm = () => {
  const { user, completeOnboarding } = useOnboarding();
  
  // Obtener el rol del usuario
  const userRole = user?.instituciones?.[0]?.rol || 'ESTUDIANTE';
  
  const [formData, setFormData] = useState({
    // Campos básicos para todos
    telefono: '',
    fechaNacimiento: '',
    genero: '',
    ciudad: '',
    estado: '',
    
    // Campos específicos para estudiantes
    ...(userRole === 'ESTUDIANTE' && {
      matricula: '',
      semestre: '',
      grupo: '',
      turno: '',
      carreraId: '',
      trabajaActualmente: false,
      lugarTrabajo: '',
      nombrePadre: '',
      telefonoPadre: '',
      nombreMadre: '',
      telefonoMadre: '',
      contactoEmergenciaNombre: '',
      contactoEmergenciaTelefono: '',
      contactoEmergenciaRelacion: '',
      tieneComputadora: false,
      tieneInternet: false,
      medioTransporte: '',
      nivelSocioeconomico: '',
      // Campos opcionales
      pasatiempos: '',
      deportesPractica: '',
      idiomasHabla: '',
      tieneBeca: false,
      tipoBeca: '',
      participaActividades: false
    }),
    
    // Campos para personal (psicólogos, orientadores, admins)
    ...((['PSICOLOGO', 'ORIENTADOR', 'ADMIN_INSTITUCION'].includes(userRole)) && {
      numeroEmpleado: '',
      cedulaProfesional: '',
      departamento: '',
      especialidades: '',
      fechaContratacion: '',
      telefonoEmergencia: ''
    })
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      const response = await fetch('http://localhost:4000/api/onboarding/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Perfil completado exitosamente:', result);
        // Solo completar si la API respondió OK
        completeOnboarding();
      } else {
        // Mostrar error detallado al usuario
        const errorData = await response.json().catch(() => null);
        console.error('❌ Error al completar perfil:', errorData || response.statusText);

        // Mostrar error al usuario en lugar de completar de todas formas
        alert(`Error al guardar el perfil: ${errorData?.message || 'Error desconocido'}. Por favor, intenta nuevamente.`);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);

      // Mostrar error al usuario en lugar de completar de todas formas
      alert('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Información Personal Básica */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Información Personal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 2221234567"
              />
            </div>

            <div>
              <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
                Género *
              </label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona una opción</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="NO_BINARIO">No binario</option>
                <option value="PREFIERO_NO_DECIR">Prefiero no decir</option>
              </select>
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <input
                type="text"
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Puebla"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: Puebla de Zaragoza"
              />
            </div>
          </div>
        </div>

        {/* Campos específicos para estudiantes */}
        {userRole === 'ESTUDIANTE' && (
          <>
            {/* Información Académica */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🎓 Información Académica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-1">
                    Matrícula *
                  </label>
                  <input
                    type="text"
                    id="matricula"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: 2023123456"
                  />
                </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona</option>
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(sem => (
                      <option key={sem} value={sem}>{sem}° Semestre</option>
                    ))}
                  </select>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: A, B, C"
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona</option>
                    <option value="MATUTINO">Matutino</option>
                    <option value="VESPERTINO">Vespertino</option>
                    <option value="NOCTURNO">Nocturno</option>
                    <option value="MIXTO">Mixto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información Familiar y de Emergencia */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">👨‍👩‍👧‍👦 Contactos de Emergencia</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombrePadre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Padre
                  </label>
                  <input
                    type="text"
                    id="nombrePadre"
                    name="nombrePadre"
                    value={formData.nombrePadre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="telefonoPadre" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono del Padre
                  </label>
                  <input
                    type="tel"
                    id="telefonoPadre"
                    name="telefonoPadre"
                    value={formData.telefonoPadre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="nombreMadre" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Madre
                  </label>
                  <input
                    type="text"
                    id="nombreMadre"
                    name="nombreMadre"
                    value={formData.nombreMadre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="telefonoMadre" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de la Madre
                  </label>
                  <input
                    type="tel"
                    id="telefonoMadre"
                    name="telefonoMadre"
                    value={formData.telefonoMadre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="contactoEmergenciaNombre" className="block text-sm font-medium text-gray-700 mb-1">
                    Contacto de Emergencia *
                  </label>
                  <input
                    type="text"
                    id="contactoEmergenciaNombre"
                    name="contactoEmergenciaNombre"
                    value={formData.contactoEmergenciaNombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <label htmlFor="contactoEmergenciaTelefono" className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Emergencia *
                  </label>
                  <input
                    type="tel"
                    id="contactoEmergenciaTelefono"
                    name="contactoEmergenciaTelefono"
                    value={formData.contactoEmergenciaTelefono}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="contactoEmergenciaRelacion" className="block text-sm font-medium text-gray-700 mb-1">
                    Relación *
                  </label>
                  <select
                    id="contactoEmergenciaRelacion"
                    name="contactoEmergenciaRelacion"
                    value={formData.contactoEmergenciaRelacion}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona la relación</option>
                    <option value="Padre">Padre</option>
                    <option value="Madre">Madre</option>
                    <option value="Hermano/a">Hermano/a</option>
                    <option value="Tío/a">Tío/a</option>
                    <option value="Abuelo/a">Abuelo/a</option>
                    <option value="Amigo/a">Amigo/a</option>
                    <option value="Otro">Otro familiar</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Información Socioeconómica */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💼 Información Socioeconómica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nivelSocioeconomico" className="block text-sm font-medium text-gray-700 mb-1">
                    Nivel Socioeconómico
                  </label>
                  <select
                    id="nivelSocioeconomico"
                    name="nivelSocioeconomico"
                    value={formData.nivelSocioeconomico}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona</option>
                    <option value="BAJO">Bajo</option>
                    <option value="MEDIO_BAJO">Medio Bajo</option>
                    <option value="MEDIO">Medio</option>
                    <option value="MEDIO_ALTO">Medio Alto</option>
                    <option value="ALTO">Alto</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="medioTransporte" className="block text-sm font-medium text-gray-700 mb-1">
                    Medio de Transporte
                  </label>
                  <select
                    id="medioTransporte"
                    name="medioTransporte"
                    value={formData.medioTransporte}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona</option>
                    <option value="A pie">A pie</option>
                    <option value="Bicicleta">Bicicleta</option>
                    <option value="Transporte público">Transporte público</option>
                    <option value="Auto propio">Auto propio</option>
                    <option value="Auto familiar">Auto familiar</option>
                    <option value="Moto">Motocicleta</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    id="trabajaActualmente"
                    name="trabajaActualmente"
                    type="checkbox"
                    checked={formData.trabajaActualmente}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="trabajaActualmente" className="ml-3 text-sm text-gray-700">
                    Trabajo actualmente
                  </label>
                </div>

                {formData.trabajaActualmente && (
                  <div>
                    <label htmlFor="lugarTrabajo" className="block text-sm font-medium text-gray-700 mb-1">
                      Lugar de Trabajo
                    </label>
                    <input
                      type="text"
                      id="lugarTrabajo"
                      name="lugarTrabajo"
                      value={formData.lugarTrabajo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <input
                    id="tieneComputadora"
                    name="tieneComputadora"
                    type="checkbox"
                    checked={formData.tieneComputadora}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="tieneComputadora" className="ml-3 text-sm text-gray-700">
                    Tengo computadora propia
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="tieneInternet"
                    name="tieneInternet"
                    type="checkbox"
                    checked={formData.tieneInternet}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="tieneInternet" className="ml-3 text-sm text-gray-700">
                    Tengo acceso a internet en casa
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="tieneBeca"
                    name="tieneBeca"
                    type="checkbox"
                    checked={formData.tieneBeca}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="tieneBeca" className="ml-3 text-sm text-gray-700">
                    Tengo beca
                  </label>
                </div>

                {formData.tieneBeca && (
                  <div className="ml-7">
                    <label htmlFor="tipoBeca" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Beca
                    </label>
                    <input
                      type="text"
                      id="tipoBeca"
                      name="tipoBeca"
                      value={formData.tipoBeca}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: BENITO JUÁREZ, Institucional"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Campos para personal (psicólogos, orientadores, admins) */}
        {(['PSICOLOGO', 'ORIENTADOR', 'ADMIN_INSTITUCION'].includes(userRole)) && (
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💼 Información Profesional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="numeroEmpleado" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Empleado *
                </label>
                <input
                  type="text"
                  id="numeroEmpleado"
                  name="numeroEmpleado"
                  value={formData.numeroEmpleado}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {userRole === 'PSICOLOGO' && (
                <div>
                  <label htmlFor="cedulaProfesional" className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula Profesional *
                  </label>
                  <input
                    type="text"
                    id="cedulaProfesional"
                    name="cedulaProfesional"
                    value={formData.cedulaProfesional}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="telefonoEmergencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono de Emergencia *
                </label>
                <input
                  type="tel"
                  id="telefonoEmergencia"
                  name="telefonoEmergencia"
                  value={formData.telefonoEmergencia}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="especialidades" className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidades/Certificaciones
                </label>
                <textarea
                  id="especialidades"
                  name="especialidades"
                  rows={3}
                  value={formData.especialidades}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Psicología clínica, Terapia cognitivo-conductual..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Completar mi perfil y comenzar
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