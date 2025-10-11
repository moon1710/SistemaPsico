import React, { useState } from 'react';
import { Eye, EyeOff, User, Calendar, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { generarEmailInstitucional, validarNumeroControl, CONTRASEÑA_INICIAL } from '../../utils/emailInstitucional';
import { API_CONFIG } from '../../utils/constants';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card } from '../ui/Card';
import Alert from '../ui/Alert';

const RegistroEstudiante = ({ onSuccess, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    numeroControl: '',
    nombres: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    genero: ''
  });

  const [emailGenerado, setEmailGenerado] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [registroExitoso, setRegistroExitoso] = useState(false);

  // Validar formulario en tiempo real
  const validarCampo = (campo, valor) => {
    const newErrors = { ...errors };

    switch (campo) {
      case 'numeroControl':
        if (!valor) {
          newErrors.numeroControl = 'Número de control es requerido';
        } else if (!validarNumeroControl(valor)) {
          newErrors.numeroControl = 'Número de control debe tener 8 caracteres (puede empezar con letra o número)';
        } else {
          delete newErrors.numeroControl;
          // Generar email automáticamente si es válido
          try {
            const email = generarEmailInstitucional(valor);
            setEmailGenerado(email);
          } catch (error) {
            newErrors.numeroControl = error.message;
          }
        }
        break;

      case 'nombres':
        if (!valor.trim()) {
          newErrors.nombres = 'Nombre(s) es requerido';
        } else if (valor.trim().length < 2) {
          newErrors.nombres = 'Nombre(s) debe tener al menos 2 caracteres';
        } else {
          delete newErrors.nombres;
        }
        break;

      case 'apellidoPaterno':
        if (!valor.trim()) {
          newErrors.apellidoPaterno = 'Apellido paterno es requerido';
        } else if (valor.trim().length < 2) {
          newErrors.apellidoPaterno = 'Apellido paterno debe tener al menos 2 caracteres';
        } else {
          delete newErrors.apellidoPaterno;
        }
        break;

      case 'fechaNacimiento':
        if (!valor) {
          newErrors.fechaNacimiento = 'Fecha de nacimiento es requerida';
        } else {
          const fecha = new Date(valor);
          const hoy = new Date();
          const edad = hoy.getFullYear() - fecha.getFullYear();

          if (edad < 15 || edad > 100) {
            newErrors.fechaNacimiento = 'Edad debe estar entre 15 y 100 años';
          } else {
            delete newErrors.fechaNacimiento;
          }
        }
        break;

      case 'genero':
        if (!valor) {
          newErrors.genero = 'Género es requerido';
        } else {
          delete newErrors.genero;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Procesar número de control
    if (name === 'numeroControl') {
      const valorLimpio = value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8);
      setFormData(prev => ({ ...prev, [name]: valorLimpio }));
      validarCampo(name, valorLimpio);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      validarCampo(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar todos los campos
      let isValid = true;
      Object.keys(formData).forEach(campo => {
        if (!validarCampo(campo, formData[campo])) {
          isValid = false;
        }
      });

      if (!isValid) {
        setIsLoading(false);
        return;
      }

      // Preparar datos para envío
      const registroData = {
        numeroControl: formData.numeroControl,
        nombres: formData.nombres.trim(),
        apellidoPaterno: formData.apellidoPaterno.trim(),
        apellidoMaterno: formData.apellidoMaterno.trim() || null,
        fechaNacimiento: formData.fechaNacimiento,
        genero: formData.genero,
        emailInstitucional: emailGenerado
      };

      // Llamar a la API de registro
      const response = await fetch(`${API_CONFIG.API_BASE}/estudiantes/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registroData)
      });

      const result = await response.json();

      if (response.ok) {
        setRegistroExitoso(true);
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result);
          }
        }, 3000);
      } else {
        setErrors({ submit: result.message || 'Error al registrar estudiante' });
      }

    } catch (error) {
      console.error('Error en registro:', error);
      setErrors({ submit: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (registroExitoso) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <div className="text-center p-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">¡Registro Exitoso!</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p>Tu cuenta ha sido creada correctamente.</p>
            <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              <p><strong>Email institucional:</strong> {emailGenerado}</p>
              <p><strong>Contraseña inicial:</strong> {CONTRASEÑA_INICIAL}</p>
            </div>
            <p className="text-xs text-gray-500">
              Serás redirigido automáticamente al proceso de configuración de tu perfil.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-900">Registro de Estudiante</h2>
          <p className="text-gray-600 text-sm">Completa tus datos para crear tu cuenta</p>
        </div>

        {errors.submit && (
          <Alert type="error" className="mb-4">
            <AlertCircle className="w-4 h-4" />
            {errors.submit}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número de Control */}
          <div>
            <label htmlFor="numeroControl" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Control *
            </label>
            <Input
              type="text"
              id="numeroControl"
              name="numeroControl"
              value={formData.numeroControl}
              onChange={handleInputChange}
              placeholder="Ej: 21350271 o E13350161"
              maxLength={8}
              className={errors.numeroControl ? 'border-red-500' : ''}
              required
            />
            {errors.numeroControl && (
              <p className="text-red-500 text-xs mt-1">{errors.numeroControl}</p>
            )}
          </div>

          {/* Email generado (solo mostrar) */}
          {emailGenerado && !errors.numeroControl && (
            <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Tu email institucional será:</p>
                  <p className="text-sm text-green-600 font-mono">{emailGenerado}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nombres */}
          <div>
            <label htmlFor="nombres" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre(s) *
            </label>
            <Input
              type="text"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleInputChange}
              placeholder="Ej: Juan Carlos"
              className={errors.nombres ? 'border-red-500' : ''}
              required
            />
            {errors.nombres && (
              <p className="text-red-500 text-xs mt-1">{errors.nombres}</p>
            )}
          </div>

          {/* Apellido Paterno */}
          <div>
            <label htmlFor="apellidoPaterno" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido Paterno *
            </label>
            <Input
              type="text"
              id="apellidoPaterno"
              name="apellidoPaterno"
              value={formData.apellidoPaterno}
              onChange={handleInputChange}
              placeholder="Ej: García"
              className={errors.apellidoPaterno ? 'border-red-500' : ''}
              required
            />
            {errors.apellidoPaterno && (
              <p className="text-red-500 text-xs mt-1">{errors.apellidoPaterno}</p>
            )}
          </div>

          {/* Apellido Materno */}
          <div>
            <label htmlFor="apellidoMaterno" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido Materno
            </label>
            <Input
              type="text"
              id="apellidoMaterno"
              name="apellidoMaterno"
              value={formData.apellidoMaterno}
              onChange={handleInputChange}
              placeholder="Ej: López (opcional)"
            />
          </div>

          {/* Fecha de Nacimiento */}
          <div>
            <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento *
            </label>
            <Input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleInputChange}
              className={errors.fechaNacimiento ? 'border-red-500' : ''}
              required
            />
            {errors.fechaNacimiento && (
              <p className="text-red-500 text-xs mt-1">{errors.fechaNacimiento}</p>
            )}
          </div>

          {/* Género */}
          <div>
            <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
              Género *
            </label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.genero ? 'border-red-500' : ''
              }`}
              required
            >
              <option value="">Seleccionar género</option>
              <option value="MASCULINO">Masculino</option>
              <option value="FEMENINO">Femenino</option>
              <option value="NO_BINARIO">No binario</option>
              <option value="PREFIERO_NO_DECIR">Prefiero no decir</option>
            </select>
            {errors.genero && (
              <p className="text-red-500 text-xs mt-1">{errors.genero}</p>
            )}
          </div>

          {/* Información de contraseña */}
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Información importante:</p>
                <ul className="text-blue-600 text-xs mt-1 space-y-1">
                  <li>• Tu contraseña inicial será: <span className="font-mono">{CONTRASEÑA_INICIAL}</span></li>
                  <li>• Deberás cambiarla después de completar tu perfil</li>
                  <li>• Guarda esta información para tu primer inicio de sesión</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || Object.keys(errors).length > 0}
              loading={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Crear Cuenta'}
            </Button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default RegistroEstudiante;