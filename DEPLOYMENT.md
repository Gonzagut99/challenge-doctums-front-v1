# Plan de Despliegue: Challenge Doctums

Este documento detalla los pasos para desplegar la aplicación Challenge Doctums en un entorno de producción.

## 1. Resumen de la Arquitectura

La aplicación es un juego de mesa multijugador educativo construido sobre una arquitectura moderna y robusta.

- **Framework Full-Stack**: [Remix](https://remix.run/) se encarga de servir tanto el frontend como el backend desde un único servidor Node.js.
- **Renderizado del Juego**: [Phaser 3](https://phaser.io/) se utiliza para renderizar el tablero y las animaciones del juego dentro de un elemento canvas.
- **Interfaz de Usuario**: Construida con [React](https://react.dev/) y [Tailwind CSS](https://tailwindcss.com/), utilizando un sistema de componentes basado en [shadcn/ui](https://ui.shadcn.com/).
- **Tiempo Real**: La comunicación en tiempo real entre el servidor y los clientes se gestiona mediante **Server-Sent Events (SSE)**, ideal para notificar a los jugadores sobre las actualizaciones del estado del juego.
- **Contenerización**: El proyecto está preparado para ser desplegado usando [Docker](https://www.docker.com/).

## 2. Stack Tecnológico

- **Lenguaje**: TypeScript
- **Framework**: Remix (v2)
- **Servidor**: Node.js (>=18.0.0)
- **Motor de Juego**: Phaser 3
- **Base de datos**: No aplica directamente (los datos del juego como eventos, productos, etc., se cargan desde archivos `.csv`).
- **Bundler**: Vite
- **Contenerización**: Docker

## 3. Prerrequisitos

- Servidor o servicio de hosting compatible con Node.js y Docker.
- [Docker](https://docs.docker.com/get-docker/) instalado en el entorno de despliegue.
- Acceso a un registro de contenedores (ej. Docker Hub, AWS ECR, Google Artifact Registry).
- Un proxy inverso como Nginx o Caddy (recomendado) para gestionar SSL y servir la aplicación.

## 4. Proceso de Despliegue con Docker (Recomendado)

El uso de Docker es el método preferido ya que encapsula la aplicación y sus dependencias de manera consistente.

### Paso 1: Optimizar el `Dockerfile` para Producción

El `Dockerfile` actual está configurado para desarrollo. Debemos modificarlo para crear una build de producción optimizada y ligera.

**`Dockerfile.prod` sugerido:**

```Dockerfile
# --- Stage 1: Build ---
# Usa una imagen de Node con herramientas de compilación
FROM node:20-slim AS build

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de definición de paquetes
COPY package*.json ./

# Instala las dependencias de producción
RUN npm install --omit=dev

# Copia el resto del código fuente
COPY . .

# Genera la build de producción
RUN npm run build

# --- Stage 2: Production ---
# Usa una imagen ligera de Node
FROM node:20-alpine AS production

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias de producción desde la etapa de build
COPY --from=build /app/node_modules ./node_modules
# Copia la build de producción
COPY --from=build /app/build ./build
# Copia los assets públicos
COPY --from=build /app/public ./public

# Expone el puerto en el que correrá la aplicación
EXPOSE 3000

# Comando para iniciar el servidor de Remix en producción
CMD ["npm", "run", "start"]
```

*Nota: Este `Dockerfile` utiliza un "multi-stage build" para reducir el tamaño de la imagen final, excluyendo las dependencias de desarrollo y el código fuente.*

### Paso 2: Construir y Publicar la Imagen Docker

1.  **Construir la imagen**:
    ```sh
    docker build -f Dockerfile.prod -t tu-registro/challenge-doctums:latest .
    ```
2.  **Iniciar sesión en tu registro de contenedores** (ej. Docker Hub):
    ```sh
    docker login
    ```
3.  **Publicar la imagen**:
    ```sh
    docker push tu-registro/challenge-doctums:latest
    ```

### Paso 3: Desplegar el Contenedor

En tu servidor de producción, ejecuta el siguiente comando:

```sh
docker run -d -p 3000:3000 \
  --name challenge-doctums \
  -e NODE_ENV=production \
  # Agrega otras variables de entorno aquí \
  tu-registro/challenge-doctums:latest
```

### Paso 4: Configurar un Proxy Inverso (Recomendado)

Es una buena práctica no exponer el servidor de Node.js directamente a internet. Usa un proxy inverso para:
- Gestionar certificados SSL/TLS (HTTPS).
- Servir la aplicación bajo un dominio personalizado.
- Añadir una capa de seguridad.

**Ejemplo de configuración para Nginx:**

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Redirigir HTTP a HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name tu-dominio.com;

    # Rutas a tus certificados SSL
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 5. Variables de Entorno

La aplicación puede requerir variables de entorno para su configuración. Basado en el código (`app/env/envs.ts`), podrías necesitar configurar:

- `NODE_ENV`: Siempre `production` en el entorno de despliegue.
- `BACKEND_URL`: La URL del servicio de backend si la lógica de negocio principal estuviera en un microservicio separado.
- `SESSION_SECRET`: Una cadena de texto aleatoria y segura para firmar las cookies de sesión.

Asegúrate de inyectar estas variables en el contenedor en el momento del despliegue (usando la opción `-e` de `docker run` o un archivo `.env`).

## 6. Escalabilidad

La arquitectura actual, con un `EventEmitter` en memoria para SSE, limita la aplicación a ejecutarse en **una única instancia**. Si se despliegan múltiples contenedores detrás de un balanceador de carga, un jugador conectado a la instancia A no recibirá los eventos generados en la instancia B.

**Para escalar horizontalmente (múltiples instancias):**

Sería necesario reemplazar el `EventEmitter` en memoria por un sistema de **Pub/Sub** externo, como [**Redis**](https://redis.io/).

1.  **Modificar el código**: En `emitter.server.ts` y `create-event-stream.server.ts`, se debería adaptar la lógica para que:
    - Cuando se emite un evento, se publique en un canal de Redis.
    - Cada instancia del servidor se suscriba a ese canal de Redis y retransmita los mensajes recibidos a sus clientes SSE conectados.
2.  **Infraestructura**: Añadir un servicio de Redis al despliegue (ej. otro contenedor Docker o un servicio gestionado como AWS ElastiCache). 