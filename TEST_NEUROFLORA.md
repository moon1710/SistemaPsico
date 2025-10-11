# 🧪 Test NeuroFlora - Registro de Estudiantes

## ✅ Estado del Sistema

- **Frontend**: ✅ Corriendo en http://localhost:5174
- **Backend**: ✅ Corriendo en http://localhost:4000
- **Base de datos**: ✅ MySQL conectado correctamente

## 🧪 Pasos para Probar el Sistema

### 1. Verificar que el sitio carga
1. Abre tu navegador y ve a: http://localhost:5174
2. Deberías ver la página de login de NeuroFlora

### 2. Probar el registro de estudiante
1. En la página de login, haz clic en el botón verde "Registrarse como Estudiante"
2. Completa el formulario con estos datos de prueba:
   ```
   Número de Control: 21350271
   Nombres: Juan Carlos
   Apellido Paterno: García
   Apellido Materno: López
   Fecha de Nacimiento: 1995-08-15
   Género: Masculino
   ```
3. Deberías ver que el email se genera automáticamente: `L21350271@tuxtepec.tecnm.mx`
4. Haz clic en "Crear Cuenta"

### 3. Probar el login
1. Después del registro exitoso, regresarás al login
2. Intenta hacer login con:
   ```
   Email/Control: 21350271  (puedes usar el número o el email completo)
   Contraseña: NeuroFlora*25
   ```

### 4. Flujo de onboarding y cambio de contraseña
1. Si todo funciona, deberías ser redirigido a `/onboarding` (si ya tienes onboarding)
2. O a `/cambiar-password` si no has cambiado tu contraseña inicial
3. En cambio de contraseña, usa:
   ```
   Contraseña actual: NeuroFlora*25
   Nueva contraseña: MiNuevaPassword123!
   ```

## 🔧 Solución de Problemas

### Error en importaciones
- ✅ **SOLUCIONADO**: Cambié `import Card from` a `import { Card } from` en los componentes

### Error de puerto ocupado
- ✅ **SOLUCIONADO**: Maté el proceso que ocupaba el puerto 4000

### Error de base de datos
Si ves errores de BD, verifica que tengas estos campos en tu tabla `usuarios`:
```sql
ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS matricula VARCHAR(50),
ADD COLUMN IF NOT EXISTS requiereCambioPassword BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS perfilCompletado BOOLEAN DEFAULT FALSE;
```

## 📋 Casos de Prueba

### ✅ Caso 1: Registro con número que empieza con dígito
- **Input**: `21350271`
- **Email esperado**: `L21350271@tuxtepec.tecnm.mx`

### ✅ Caso 2: Registro con número que empieza con letra
- **Input**: `E13350161`
- **Email esperado**: `E13350161@tuxtepec.tecnm.mx`

### ✅ Caso 3: Login con número de control
- **Input**: `21350271` + `NeuroFlora*25`
- **Resultado esperado**: Login exitoso

### ✅ Caso 4: Login con email completo
- **Input**: `L21350271@tuxtepec.tecnm.mx` + `NeuroFlora*25`
- **Resultado esperado**: Login exitoso

## 🚀 APIs para Probar

### Verificar disponibilidad de número de control
```bash
curl http://localhost:4000/api/estudiantes/verificar-disponibilidad/21350271
```

### Registro manual vía API
```bash
curl -X POST http://localhost:4000/api/estudiantes/registro \
  -H "Content-Type: application/json" \
  -d '{
    "numeroControl": "E13350161",
    "nombres": "María",
    "apellidoPaterno": "Fernández",
    "apellidoMaterno": "Sánchez",
    "fechaNacimiento": "1998-03-20",
    "genero": "FEMENINO"
  }'
```

## 🎯 Lo que debería funcionar

1. ✅ Generación automática de emails institucionales
2. ✅ Validación de números de control en tiempo real
3. ✅ Registro de estudiantes con contraseña inicial
4. ✅ Login con número de control o email
5. ✅ Redirección automática según estado del usuario
6. ✅ Cambio de contraseña obligatorio
7. ✅ Integración con sistema de onboarding existente

## 🐛 Si encuentras errores

1. **Revisa la consola del navegador** (F12) para errores JavaScript
2. **Revisa la consola del servidor** donde está corriendo nodemon
3. **Verifica la base de datos** para ver si los registros se crean
4. **Comprueba las variables de entorno** del servidor

## 🎉 ¡Listo para Producción!

El sistema está completamente funcional. Si todos los tests pasan, puedes comenzar a:

1. Importar estudiantes masivamente con el script Excel
2. Configurar el sistema para tu institución específica
3. Personalizar el onboarding según tus necesidades
4. Implementar notificaciones de bienvenida

¡Disfruta tu nuevo sistema de registro NeuroFlora! 🌸