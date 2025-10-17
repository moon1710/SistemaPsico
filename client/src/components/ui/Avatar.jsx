import React from 'react';
import { Shield } from 'lucide-react';

const Avatar = ({
  user,
  size = 'md',
  showRoleBadge = false,
  className = '',
  role = null
}) => {
  const getRoleAvatarColor = (userRole) => {
    const colors = {
      SUPER_ADMIN_NACIONAL: "bg-gradient-to-br from-purple-500 to-purple-700 text-white",
      SUPER_ADMIN_INSTITUCION: "bg-gradient-to-br from-blue-500 to-blue-700 text-white",
      PSICOLOGO: "bg-gradient-to-br from-green-500 to-green-700 text-white",
      ESTUDIANTE: "bg-gradient-to-br from-orange-500 to-orange-700 text-white",
      ORIENTADOR: "bg-gradient-to-br from-indigo-500 to-indigo-700 text-white",
    };
    return colors[userRole] || "bg-gradient-to-br from-gray-500 to-gray-700 text-white";
  };

  const getUserRole = () => {
    if (role) return role;
    if (user?.instituciones && user.instituciones.length > 0) {
      return user.instituciones[0].rol;
    }
    return user?.rol;
  };

  const getUserInitials = () => {
    const firstName = user?.nombre || '';
    const lastName = user?.apellidoPaterno || '';

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getRoleBadgeColor = (userRole) => {
    const colors = {
      ESTUDIANTE: 'text-orange-600',
      PSICOLOGO: 'text-green-600',
      ORIENTADOR: 'text-indigo-600',
      SUPER_ADMIN_NACIONAL: 'text-purple-600',
      SUPER_ADMIN_INSTITUCION: 'text-blue-600'
    };
    return colors[userRole] || 'text-gray-600';
  };

  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-lg',
    lg: 'w-24 h-24 text-2xl',
    xl: 'w-32 h-32 text-4xl'
  };

  const badgeSizes = {
    xs: 'w-3 h-3 p-0.5',
    sm: 'w-4 h-4 p-1',
    md: 'w-5 h-5 p-1',
    lg: 'w-6 h-6 p-1',
    xl: 'w-7 h-7 p-1.5'
  };

  const userRole = getUserRole();

  return (
    <div className={`relative ${className}`}>
      <div className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        shadow-lg
        border-2 border-white/20
        font-bold
        ${getRoleAvatarColor(userRole)}
      `}>
        {getUserInitials()}
      </div>

      {showRoleBadge && (
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-lg">
          <Shield className={`${badgeSizes[size]} ${getRoleBadgeColor(userRole)}`} />
        </div>
      )}
    </div>
  );
};

export default Avatar;