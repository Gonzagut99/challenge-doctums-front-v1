# 🐞 Registro de Bugs - Optimización de Imágenes y Rendimiento

> Este archivo contiene un listado de errores encontrados durante el desarrollo y pruebas, relacionados con el rendimiento general, la optimización de imágenes y la ejecución fluida del juego.

---

## 🗂️ Índice

- [🔧 Abiertos](#abiertos)
- [✅ Resueltos](#resueltos)
- [❓ Pendientes por verificar](#pendientes-por-verificar)
- [📌 Notas](#notas)

---

## 🔧 Abiertos

| ID   | Fecha       | Descripción                                                                                             | Reproducibilidad | Estado         |
|------|-------------|---------------------------------------------------------------------------------------------------------|------------------|----------------|

---

## ✅ Resueltos

| ID   | Fecha       | Descripción   | Solución | Fecha de solución |
|------|-------------|---------------|----------|-------------------|
| 001  | 2025-05-08 | Stutter: interrupción temporal en la fluidez del juego, donde las animaciones se "pegan" momentáneamente. | Se optimizó el renderizado y se revisaron los ciclos de animación para evitar bloqueos. | 2025-06-19 |
| 003  | 2025-05-08 | El WebSocket service no mantiene el estado correctamente entre recargas. | Se implementó persistencia de estado con localStorage y sincronización con el servidor. | 2025-06-19 |
| 004  | 2025-05-08 | Llamadas `fetch` redundantes desde `use-live-loader.ts`, causando lag y sobrecarga de red. | Se optimizó la lógica de hooks y se implementó throttling para evitar llamadas innecesarias. | 2025-06-19 |
| 005  | 2025-05-16 | Error de claves duplicadas en React: Se encontraron dos elementos hijos con la misma clave `5`. Este error ocurre en el componente PageContainer y puede causar problemas de renderizado y comportamiento inesperado en la interfaz. | Se revisaron las keys en los componentes y se aseguraron claves únicas y estables. | 2025-06-19 |
| 006  | 2025-05-16 | Error de ref en componentes funcionales: El componente WhiteContainerXL no puede recibir refs directamente. El error ocurre en la cadena de componentes LegacyRewards -> Modal -> WhiteContainerXL. | Se implementó React.forwardRef en WhiteContainerXL para permitir el paso correcto de refs. | 2025-06-19 |
| 006 | 2025-05-16 | Error de claves duplicadas en React: Se encontraron dos elementos hijos con la misma clave `5`. Este error ocurre en el componente PageContainer y puede causar problemas de renderizado y comportamiento inesperado en la interfaz. | Se revisaron las keys en los componentes y se aseguraron claves únicas y estables. | 2025-06-19 |
| 007  | 2024-07-16 | Error al crear una partida (Lado del cliente, manejo incorrecto de `useState`). | Se corrigió el manejo de estado en el cliente para la creación de partidas. | 2025-06-19 |
| 008  | 2024-07-16 | El canvas del mapa del juego no renderiza cuando el host inicia una partida. | Se corrigió la inicialización del canvas y la sincronización con el host. | 2025-06-19 |
| 009  | 2024-07-16 | Error `TypeError: Cannot read properties of undefined (reading 'emit')` en eventos WebSocket. | Se validó la existencia de objetos antes de llamar a 'emit' en los eventos WebSocket. | 2025-06-19 |
| 010  | 2024-07-16 | `app/routes/game+/_layout.tsx`: Estados (`avatarId`, etc.) mal manejados pueden afectar navegación/modales. | Se revisó y refactorizó el manejo de estados para navegación y modales. | 2025-06-19 |
| 011  | 2024-07-16 | `app/routes/game+/_layout.tsx`: Falla de `useLiveLoader` puede bloquear o causar comportamiento inesperado. | Se mejoró el manejo de errores y fallback en `useLiveLoader`. | 2025-06-19 |
| 012  | 2024-07-16 | `app/routes/game+/_gameCanvas/index.tsx`: Estado `grabbing` podría no actualizarse bien (deps `useEffect`). | Se ajustaron las dependencias de `useEffect` para actualizar correctamente el estado `grabbing`. | 2025-06-19 |
| 013  | 2024-07-16 | `app/routes/game+/_gameCanvas/index.tsx`: `localDivRef` no asignado correctamente puede romper el canvas. | Se corrigió la asignación de refs para asegurar el funcionamiento del canvas. | 2025-06-19 |
| 014  | 2024-07-16 | `app/components/custom/music/SoundContext.tsx`: Falla en reproducción de audio por `audioRef` o archivo. | Se revisó la gestión de refs y archivos de audio para asegurar la reproducción. | 2025-06-19 |
| 015  | 2024-07-16 | `app/components/custom/music/SoundContext.tsx`: Alternar música/sonido podría no funcionar (contexto). | Se corrigió la lógica de alternancia en el contexto de sonido/música. | 2025-06-19 |
| 002  | 2025-05-08  | Error al acceder a los Recursos: `Cannot read properties of undefined (reading 'getAlreadyAcquiredModifiers')`. | Implementación de verificación de estado en WebSocket service y manejo de casos undefined | 2025-05-08 |

---

## ❓ Pendientes por verificar

| ID   | Fecha       | Descripción                                                                 | Solución tentativa                                                                 |
|------|-------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------|

---

## 📌 Notas

- Usa el **ID** como referencia en nombres de ramas (`fix/bug-001`, `bugfix/002-handler-error`, etc.).
- Usa **emojis** y colores para facilitar lectura visual rápida.
- Priorizar la optimización de imágenes que **superen los 2MB** o se repitan sin necesidad.
- Evitar llamadas `fetch` en bucle innecesario, especialmente en hooks como `useEffect` o `use-live-loader`.
- Los bugs en "Pendientes por verificar" ya tienen solución implementada, pero **requieren pruebas adicionales**.
- El bug `004` puede estar causando stuttering, alto LCP y retrasos visibles al usuario. Se recomienda implementar *throttling* o revisar lógica de actualización.
- Para el bug `005`, se recomienda revisar los componentes que renderizan listas dentro de PageContainer y asegurar que cada elemento tenga una clave única y estable. Evitar usar índices de array como keys cuando los elementos pueden cambiar de orden.
- Para el bug `006`, se debe implementar React.forwardRef() en el componente WhiteContainerXL para permitir el paso correcto de refs desde el componente Modal. Esto es necesario para la correcta integración con Framer Motion y el sistema de animaciones.

