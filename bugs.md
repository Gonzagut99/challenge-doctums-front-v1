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
| 003  | 2025-05-16  | Error `TypeError: Cannot read properties of undefined (reading 'emit')` en eventos WebSocket.         | Ocasional        | 🔴 Abierto      |
| 004  | 2025-05-08  | Llamadas `fetch` redundantes desde `use-live-loader.ts`, causando lag y sobrecarga de red.              | Siempre          | 🔴 Abierto      |
| 005  | 2025-05-16  | Error al crear una partida (Lado del cliente, manejo incorrecto de `useState`).                           | Frecuente        | 🔴 Abierto      |
| 007  | 2025-05-16  | El canvas del mapa del juego no renderiza cuando el host inicia una partida.                              | Frecuente        | 🔴 Abierto      |
| 008  | 2025-05-08 | El WebSocket service no mantiene el estado correctamente entre recargas.    | Implementar persistencia de estado usando localStorage y sincronización con el servidor. | 🔴 Abierto  
---

## ✅ Resueltos

| ID   | Fecha       | Descripción   | Solución | Fecha de solución |
|------|-------------|---------------|----------|-------------------|
| 002  | 2025-05-08  | Error al acceder a los Recursos: `Cannot read properties of undefined (reading 'getAlreadyAcquiredModifiers')`. | Implementación de verificación de estado en WebSocket service y manejo de casos undefined | 2025-05-08 |
| 006  | 2025-05-16  | Error de claves duplicadas en React: Hijos con misma clave `5` en `PageContainer`. | Usar `index` del `.map()` para `key` única en renderizado de listas de dados en `app/routes/game+/_layout.tsx`. | 2025-05-28 |

---

## ❓ Pendientes por verificar

| ID   | Fecha       | Descripción                                                                 | Solución tentativa                                                                 |
|------|-------------|-----------------------------------------------------------------------------|------------------------------------------------------------------------------------|


---
