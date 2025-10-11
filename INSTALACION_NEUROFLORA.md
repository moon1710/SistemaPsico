# 🌸 NeuroFlora - Sistema de Registro de Estudiantes

## 📋 Resumen de Implementación

Sistema completo de registro e importación de estudiantes para el TecNM Instituto Tecnológico de Tuxtepec, con generación automática de emails institucionales y flujo de onboarding.

## 🚀 Funcionalidades Implementadas

### ✅ 1. Generación de Emails Institucionales
- **Regla numérica**: `21350271` → `L21350271@tuxtepec.tecnm.mx`
- **Regla alfabética**: `E13350161` → `E13350161@tuxtepec.tecnm.mx`
- Validación automática de formato de número de control (8 caracteres)

### ✅ 2. Script de Importación Masiva
- Procesamiento de archivos Excel con estudiantes
- Creación automática de cuentas con contraseña inicial `NeuroFlora*25`
- Mapeo completo de campos desde Excel a base de datos
- Validaciones y manejo de errores

### ✅ 3. Formulario de Registro Manual
- Registro individual de estudiantes en la interfaz
- Validaciones en tiempo real
- Previsualización del email generado
- Integración con sistema de autenticación

### ✅ 4. Autenticación Mejorada
- Login con email institucional O número de control
- Detección automática de tipo de credencial
- Flujo de redirección inteligente

### ✅ 5. Flujo de Onboarding y Cambio de Contraseña
- Redirección automática según estado del usuario
- Pantalla de cambio de contraseña obligatorio
- Validaciones de seguridad de contraseña

## 📁 Archivos Creados/Modificados

### 🔧 Backend (Server)
```
server/src/
├── utils/emailInstitucional.js          ✨ NUEVO - Funciones de email
├── routes/estudiantes.routes.js         ✨ NUEVO - API de estudiantes
├── controllers/auth.controller.js       📝 MODIFICADO - Login + cambio password
├── routes/auth.routes.js                📝 MODIFICADO - Nueva ruta cambio password
└── app.js                               📝 MODIFICADO - Registro rutas estudiantes
```

### 🎨 Frontend (Client)
```
client/src/
├── utils/emailInstitucional.js          ✨ NUEVO - Funciones compartidas
├── components/auth/RegistroEstudiante.jsx ✨ NUEVO - Formulario registro
├── pages/CambiarPasswordPage.jsx        ✨ NUEVO - Cambio de contraseña
├── pages/LoginPage.jsx                  📝 MODIFICADO - Registro + login con control
├── contexts/AuthContext.jsx             📝 MODIFICADO - Lógica redirección
├── utils/constants.js                   📝 MODIFICADO - Nueva ruta
└── App.jsx                              📝 MODIFICADO - Nueva ruta
```

### 📜 Scripts
```
scripts/
└── importarEstudiantes.js               ✨ NUEVO - Importación masiva Excel
```

## 🛠️ Instalación y Setup

### 1. Instalar Dependencias Adicionales
```bash
# Para el script de importación (Excel)
npm install xlsx uuid

# Verificar que ya tienes:
# bcryptjs, mysql2, express-validator
```

### 2. Estructura de Base de Datos Requerida
Asegúrate de que tu tabla `usuarios` tenga estos campos:
```sql
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS matricula VARCHAR(50),
ADD COLUMN IF NOT EXISTS requiereCambioPassword BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS perfilCompletado BOOLEAN DEFAULT FALSE;

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_matricula ON usuarios(matricula);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
```

### 3. Configuración de Variables de Entorno
```env
# En tu archivo .env del servidor
DB_HOST=localhost
DB_USER=root
DB_PASS=tu_password
DB_NAME=sistemapsico
DB_PORT=3306
JWT_SECRET=tu_secret_key
JWT_EXPIRES_IN=8h
NODE_ENV=development
```

## 🧪 Testing y Uso

### 1. Importación Masiva desde Excel
```bash
# Desde la carpeta scripts/
node importarEstudiantes.js ruta/al/archivo.xlsx
```

**Formato del Excel requerido:**
| Nombre del Instituto Tecnológico | No. Control | Apellido Paterno | Apellido Materno | Nombre(s) | RFC | Fecha de Nacimiento | Género |
|----------------------------------|-------------|------------------|------------------|-----------|-----|-------------------|--------|
| TecNM Tuxtepec | 21350271 | García | López | Juan Carlos | GALJ950815AB1 | 1995-08-15 | M |

### 2. Registro Manual
1. Ve a `/login`
2. Haz clic en "Registrarse como Estudiante"
3. Completa el formulario con número de control
4. El email se genera automáticamente

### 3. Flujo de Primer Login
1. **Login** con número de control o email + `NeuroFlora*25`
2. **Redirección automática** a:
   - `/onboarding` si `perfilCompletado = false`
   - `/cambiar-password` si `requiereCambioPassword = true`
   - `/dashboard` si todo está completo

### 4. APIs Disponibles

#### Registro de Estudiante
```http
POST /api/estudiantes/registro
Content-Type: application/json

{
  "numeroControl": "21350271",
  "nombres": "Juan Carlos",
  "apellidoPaterno": "García",
  "apellidoMaterno": "López",
  "fechaNacimiento": "1995-08-15",
  "genero": "MASCULINO"
}
```

#### Verificar Disponibilidad
```http
GET /api/estudiantes/verificar-disponibilidad/21350271
```

#### Cambiar Contraseña
```http
POST /api/auth/cambiar-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "NeuroFlora*25",
  "newPassword": "MiNuevaPassword123!"
}
```

#### Login con Número de Control
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "21350271",  // ← Puede ser email o número de control
  "password": "NeuroFlora*25"
}
```

## 🔍 Funciones Disponibles

### Generación de Email
```javascript
import { generarEmailInstitucional } from './utils/emailInstitucional';

const email1 = generarEmailInstitucional('21350271');    // L21350271@tuxtepec.tecnm.mx
const email2 = generarEmailInstitucional('E13350161');   // E13350161@tuxtepec.tecnm.mx
```

### Validación de Número de Control
```javascript
import { validarNumeroControl } from './utils/emailInstitucional';

const esValido = validarNumeroControl('21350271');  // true
const noValido = validarNumeroControl('123');       // false
```

### Mapeo de Género
```javascript
import { mapearGenero } from './utils/emailInstitucional';

const genero1 = mapearGenero('M');        // 'MASCULINO'
const genero2 = mapearGenero('F');        // 'FEMENINO'
const genero3 = mapearGenero('NB');       // 'NO_BINARIO'
```

## 🚨 Consideraciones de Seguridad

1. **Contraseña Inicial**: Todos los estudiantes empiezan con `NeuroFlora*25`
2. **Cambio Obligatorio**: El sistema fuerza cambio de contraseña después del onboarding
3. **Validaciones**: La nueva contraseña debe cumplir criterios de seguridad
4. **Tokens JWT**: Se incluyen campos `requiereCambioPassword` y `perfilCompletado`

## 🎯 Próximos Pasos

### Pendientes de Implementar
1. **Sistema de notificaciones** para bienvenida de estudiantes
2. **Validación de emails institucionales** (verificación por correo)
3. **Recuperación de contraseña** específica para estudiantes
4. **Dashboard específico** para estudiantes recién registrados
5. **Auditoría de registros** y logs de seguridad

### Mejoras Sugeridas
1. **Rate limiting** en endpoints de registro
2. **Captcha** para prevenir registros automatizados
3. **Validación adicional** con sistemas externos del TecNM
4. **Templates de email** para comunicaciones automatizadas

## 📞 Soporte

Para dudas o problemas con la implementación:
1. Revisar logs del servidor en consola
2. Verificar configuración de base de datos
3. Comprobar variables de entorno
4. Validar formato de archivos Excel para importación

## 🎉 ¡Listo para Producción!

El sistema está completo y listo para probar. Comienza con el registro manual de un estudiante de prueba para verificar todo el flujo:

1. Registro → 2. Login → 3. Onboarding → 4. Cambio de contraseña → 5. Dashboard

¡Bienvenido a NeuroFlora! 🌸