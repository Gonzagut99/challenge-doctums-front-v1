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
| 005  | 2025-05-16  | Error de claves duplicadas en React: Se encontraron dos elementos hijos con la misma clave `5`. Este error ocurre en el componente PageContainer y puede causar problemas de renderizado y comportamiento inesperado en la interfaz. | Siempre          | 🔴 Abierto      |
| 006  | 2025-05-16  | Error de ref en componentes funcionales: El componente WhiteContainerXL no puede recibir refs directamente. El error ocurre en la cadena de componentes LegacyRewards -> Modal -> WhiteContainerXL. | Siempre          | 🔴 Abierto      |

---

## ✅ Resueltos

| ID   | Fecha       | Descripción   | Solución | Fecha de solución |
|------|-------------|---------------|----------|-------------------|
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

