# Documentacion de Despliegue: Challenge Doctums

## 1. Servicios y Recursos a Utilizar

### 1.1. Tecnologías Principales
- **Framework Full-Stack:** Remix (v2)
- **Frontend:** React + Tailwind CSS
- **Motor de Juego:** Phaser 3
- **Lenguaje:** TypeScript
- **Bundler:** Vite
- **Servidor:** Node.js (>=18.0.0)
- **Contenerización:** Docker

### 1.2. Proveedores y Plataformas
- **Proveedor de Hosting Gratuito:** [Render.com](https://render.com/) (recomendado para despliegue gratuito)
- **Repositorio de Código:** GitHub, GitLab o Bitbucket
- **Certificados SSL:** Incluidos automáticamente por Render
- **Dominio:** Subdominio gratuito de Render (`onrender.com`) o dominio propio (opcional)

### 1.3. Recursos y Configuración
- **Variables de Entorno:**
  - `NODE_ENV=production`
  - `SESSION_SECRET` (cadena segura)
  - `BACKEND_URL` (si aplica)
- **Archivos de configuración:**
  - `Dockerfile` o `Dockerfile.prod`
  - `package.json`, `tsconfig.json`, etc.

---

## 2. Fases de Despliegue

### 2.1. Preparación
- Verificar que el código esté en la rama principal y actualizado en el repositorio remoto.
- Asegurarse de que el `Dockerfile` esté listo para producción (ver ejemplo multi-stage en este documento).
- Definir y documentar las variables de entorno necesarias.

### 2.2. Build y Pruebas Locales
- Construir la imagen Docker localmente para validar que el build es exitoso:
  ```sh
  docker build -f Dockerfile.prod -t challenge-doctums:latest .
  ```
- Probar la imagen localmente:
  ```sh
  docker run -p 3000:3000 -e NODE_ENV=production -e SESSION_SECRET=tu_secreto challenge-doctums:latest
  ```
- Verificar que la aplicación funcione correctamente en `http://localhost:3000`.

### 2.3. Despliegue en Render.com
- Crear una cuenta en [Render](https://render.com/).
- Conectar el repositorio de código fuente.
- Crear un nuevo "Web Service" y seleccionar la opción "Deploy from a Dockerfile".
- Seleccionar el repositorio y rama a desplegar.
- Configurar el puerto de servicio en `3000`.
- Agregar las variables de entorno necesarias.
- Iniciar el despliegue y monitorear el proceso desde el panel de Render.

### 2.4. Post-Despliegue y Verificación
- Acceder a la URL pública proporcionada por Render (`https://<tu-app>.onrender.com`).
- Verificar el funcionamiento de la aplicación, incluyendo:
  - Flujo de autenticación y registro
  - Creación y unión a partidas
  - Renderizado del juego y comunicación en tiempo real
- Revisar los logs y métricas desde el panel de Render para detectar posibles errores o advertencias.
- (Opcional) Configurar un dominio personalizado y redireccionamiento HTTPS.

---

## 3. Consideraciones Adicionales
- El plan gratuito de Render puede poner la app en "sleep" tras 15 minutos de inactividad.
- Para escalar horizontalmente, considerar la integración de un sistema Pub/Sub como Redis para eventos en tiempo real.
- Mantener actualizadas las dependencias y revisar periódicamente la seguridad del stack.

---

**Este reporte técnico resume el proceso recomendado para desplegar Challenge Doctums de forma profesional y eficiente en un entorno gratuito y moderno.** 