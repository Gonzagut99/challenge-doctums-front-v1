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
| 001  | 2025-05-08 | Stutter: interrupción temporal en la fluidez del juego, donde las animaciones se "pegan" momentáneamente. | Ocasional        | 🔴 Abierto    |
| 003  | 2025-05-08 | El WebSocket service no mantiene el estado correctamente entre recargas.    | Implementar persistencia de estado usando localStorage y sincronización con el servidor. | 🔴 Abierto  
| 004  | 2025-05-08  | Llamadas `fetch` redundantes desde `use-live-loader.ts`, causando lag y sobrecarga de red.              | Siempre          | 🔴 Abierto      |
| 005  | 2024-07-16  | Error al crear una partida (Lado del cliente, manejo incorrecto de `useState`).                           | Frecuente        | 🔴 Abierto      |
| 006  | 2024-07-16  | El canvas del mapa del juego no renderiza cuando el host inicia una partida.                              | Frecuente        | 🔴 Abierto      |
| 007  | 2024-07-16  | Error `TypeError: Cannot read properties of undefined (reading 'emit')` en eventos WebSocket.         | Ocasional        | 🔴 Abierto      |
| 008  | 2024-07-16  | `app/routes/game+/_layout.tsx`: Estados (`avatarId`, etc.) mal manejados pueden afectar navegación/modales. | Potencial        | 🔴 Abierto      |
| 009  | 2024-07-16  | `app/routes/game+/_layout.tsx`: Falla de `useLiveLoader` puede bloquear o causar comportamiento inesperado. | Potencial        | 🔴 Abierto      |
| 010  | 2024-07-16  | `app/routes/game+/_gameCanvas/index.tsx`: Estado `grabbing` podría no actualizarse bien (deps `useEffect`). | Potencial        | 🔴 Abierto      |
| 011  | 2024-07-16  | `app/routes/game+/_gameCanvas/index.tsx`: `localDivRef` no asignado correctamente puede romper el canvas.  | Potencial        | 🔴 Abierto      |
| 012  | 2024-07-16  | `app/components/custom/music/SoundContext.tsx`: Falla en reproducción de audio por `audioRef` o archivo. | Potencial        | 🔴 Abierto      |
| 013  | 2024-07-16  | `app/components/custom/music/SoundContext.tsx`: Alternar música/sonido podría no funcionar (contexto). | Potencial        | 🔴 Abierto      |

---

## ✅ Resueltos

| ID   | Fecha       | Descripción   | Solución | Fecha de solución |
|------|-------------|---------------|----------|-------------------|
| 002  | 2025-05-08  | Error al acceder a los Recursos: `Cannot read properties of undefined (reading 'getAlreadyAcquiredModifiers')`. | Implementación de verificación de estado en WebSocket service y manejo de casos undefined | 2024-03-19 |

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

