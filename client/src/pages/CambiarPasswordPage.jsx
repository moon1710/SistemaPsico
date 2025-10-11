import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import { ROUTES } from '../utils/constants';

const CambiarPasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  // Validaciones en tiempo real
  const validateField = (field, value) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'currentPassword':
        if (!value) {
          newErrors.currentPassword = 'Contraseña actual es requerida';
        } else {
          delete newErrors.currentPassword;
        }
        break;

      case 'newPassword':
        if (!value) {
          newErrors.newPassword = 'Nueva contraseña es requerida';
        } else if (value.length < 8) {
          newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          newErrors.newPassword = 'Debe incluir: mayúscula, minúscula, número y símbolo';
        } else if (value === formData.currentPassword) {
          newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
        } else {
          delete newErrors.newPassword;
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirmar contraseña es requerido';
        } else if (value !== formData.newPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
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
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);

    // Revalidar confirmPassword si se cambió newPassword
    if (name === 'newPassword' && formData.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar todos los campos
      let isValid = true;
      Object.keys(formData).forEach(field => {
        if (!validateField(field, formData[field])) {
          isValid = false;
        }
      });

      if (!isValid) {
        setIsLoading(false);
        return;
      }

      // Llamar a la API para cambiar contraseña
      const response = await fetch('/api/auth/cambiar-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Actualizar perfil para reflejar que ya no requiere cambio de contraseña
        await updateProfile();

        // Mostrar mensaje de éxito y redirigir
        alert('Contraseña cambiada exitosamente');
        navigate(ROUTES.DASHBOARD, { replace: true });
      } else {
        setErrors({ submit: result.message || 'Error al cambiar contraseña' });
      }

    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      setErrors({ submit: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para omitir cambio de contraseña (solo para casos especiales)
  const handleSkip = () => {
    if (window.confirm('¿Estás seguro de continuar sin cambiar tu contraseña? Se recomienda cambiarla por seguridad.')) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <h2 className="text-2xl font-bold text-gray-900">Cambiar Contraseña</h2>
            <p className="text-gray-600 text-sm mt-2">
              Por seguridad, debes cambiar tu contraseña inicial
            </p>
          </div>

          {/* Información del usuario */}
          <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 text-blue-600 mr-2" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">
                  Hola, {user?.nombre} {user?.apellidoPaterno}
                </p>
                <p className="text-blue-600">
                  Cambia tu contraseña inicial para mayor seguridad
                </p>
              </div>
            </div>
          </div>

          {errors.submit && (
            <Alert type="error" className="mb-4">
              <AlertCircle className="w-4 h-4" />
              {errors.submit}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Contraseña Actual */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña Actual *
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu contraseña actual"
                  className={errors.currentPassword ? 'border-red-500' : ''}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
              )}
            </div>

            {/* Nueva Contraseña */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva Contraseña *
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nueva contraseña"
                  className={errors.newPassword ? 'border-red-500' : ''}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
              )}

              {/* Indicadores de fortaleza de contraseña */}
              {formData.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex space-x-1">
                    <div className={`h-1 w-1/4 rounded ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`h-1 w-1/4 rounded ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`h-1 w-1/4 rounded ${/[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div className={`h-1 w-1/4 rounded ${/[\d@$!%*?&]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Debe incluir: 8+ caracteres, mayúscula, minúscula, número y símbolo
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nueva Contraseña *
              </label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirma tu nueva contraseña"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
              {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
                <div className="flex items-center mt-1">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <p className="text-green-600 text-xs">Las contraseñas coinciden</p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || Object.keys(errors).length > 0}
                loading={isLoading}
              >
                {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>

              {/* Botón para omitir (solo si es rol ESTUDIANTE y es la primera vez) */}
              {user?.rol === 'ESTUDIANTE' && user?.requiereCambioPassword && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors border border-gray-300 rounded-md py-2 px-4"
                >
                  Continuar sin cambiar (no recomendado)
                </button>
              )}
            </div>

            {/* Información de seguridad */}
            <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400 mt-4">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Consejos de seguridad:</p>
                  <ul className="text-yellow-600 text-xs mt-1 space-y-1">
                    <li>• No uses información personal obvia</li>
                    <li>• No compartas tu contraseña con nadie</li>
                    <li>• Cambia tu contraseña periódicamente</li>
                    <li>• Usa una contraseña única para esta plataforma</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default CambiarPasswordPage;