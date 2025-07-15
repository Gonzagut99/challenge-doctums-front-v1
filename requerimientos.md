# Requerimientos del Sistema - Challenge

A continuación se detallan los requerimientos funcionales y no funcionales para el simulador de negocios "Challenge".

## Requerimientos Funcionales

Los requerimientos funcionales (RF) describen las funciones y características que el sistema debe realizar.

| ID | Requerimiento | Descripción | Prioridad |
| :-- | :--- | :--- | :---: |
| **Gestión de Usuarios y Sesiones** |
| RF-001 | Registro de Nuevos Usuarios | Los usuarios (estudiantes, moderadores) deben poder crear una cuenta nueva en el sistema proporcionando sus datos básicos. | Alta |
| RF-002 | Inicio de Sesión | Los usuarios registrados deben poder iniciar sesión con sus credenciales (email y contraseña). | Alta |
| RF-003 | Panel de Moderador | Los usuarios con rol de "moderador" o "educador" deben tener acceso a un panel para crear, gestionar y supervisar las salas de juego y los grupos de estudiantes. | Alta |
| RF-004 | Crear Sala de Juego | Los jugadores o moderadores deben poder crear una nueva sala de juego (sesión). | Alta |
| RF-005 | Unirse a Sala de Juego | Los jugadores deben poder unirse a una sala de juego existente mediante un código o desde una lista de partidas disponibles. | Alta |
| RF-006 | Sala de Espera (Lobby) | Debe existir una sala de espera donde los jugadores puedan ver quiénes están conectados antes de que el moderador inicie la partida. | Alta |
| **Mecánicas del Juego** |
| RF-007 | Selección de Personaje | Al inicio de una partida, los jugadores deben poder elegir un avatar o personaje que los representará. | Alta |
| RF-008 | Tablero y Movimiento | El juego debe presentar un tablero visual. Los jugadores se moverán por las casillas según el resultado del lanzamiento de un dado virtual. | Alta |
| RF-009 | Sistema de Turnos | El juego debe seguir un sistema de turnos, donde cada jugador realiza sus acciones en un orden preestablecido (ej. por lanzamiento de dado inicial). | Alta |
| RF-010 | Lanzamiento de Dados | Los jugadores deben poder lanzar uno o más dados virtuales para determinar su movimiento o para resolver eventos. | Alta |
| RF-011 | Gestión de Presupuesto | Cada jugador debe tener un presupuesto inicial y recibir asignaciones mensuales. Todas las compras (recursos, productos, proyectos) deben deducirse de este presupuesto. | Alta |
| RF-012 | Plan de Acción | Debe existir una fase o menú donde los jugadores puedan tomar decisiones estratégicas, como comprar recursos, productos o iniciar proyectos para mejorar sus "eficiencias". | Alta |
| RF-013 | Sistema de Eventos | Al caer en ciertas casillas, se activará un evento de negocio (desafío) que el jugador debe resolver. El contenido del evento debe mostrarse en una ventana modal. | Alta |
| RF-014 | Sistema de "Eficiencias" | Los jugadores pueden mejorar sus habilidades ("eficiencias"). El nivel de estas eficiencias determinará si un evento se supera automáticamente o si se requiere un lanzamiento de dados. | Alta |
| RF-015 | Notificaciones en Tiempo Real | El sistema debe notificar a los jugadores sobre eventos importantes: inicio de turno, resultados de eventos, acciones de otros jugadores, etc. | Alta |
| RF-016 | Sistema de Puntuación | El sistema debe calcular y mostrar la puntuación de cada jugador en tiempo real, basada en su desempeño, recursos y eventos superados. | Alta |
| RF-017 | Finalización del Juego | El juego debe terminar después de un número determinado de turnos (ej. 360 "días"). Al final, se debe mostrar una pantalla de resultados con el ranking de jugadores. | Alta |
| RF-018 | Control de Música y Sonido | Los jugadores deben poder activar o desactivar la música de fondo y los efectos de sonido del juego. | Media |
| **Informativos** |
| RF-019 | Página de Inicio (Landing Page) | Debe existir una página de presentación con información sobre el juego, beneficios, planes de precios y un llamado a la acción. | Alta |
| RF-020 | Reglas del Juego | Debe haber una sección o página accesible donde se expliquen claramente las reglas y mecánicas del juego. | Alta |

## Requerimientos No Funcionales

Los requerimientos no funcionales (RNF) describen las cualidades del sistema y las restricciones bajo las cuales debe operar.

| ID | Categoría | Requerimiento | Descripción |
| :-- | :--- | :--- | :--- |
| **Rendimiento** |
| RNF-001 | Usabilidad | La interfaz de usuario debe ser intuitiva, atractiva y fácil de usar, minimizando la curva de aprendizaje para nuevos jugadores. |
| RNF-002 | Rendimiento del Cliente | El juego debe ejecutarse de forma fluida (mínimo 30 FPS) en los navegadores web modernos sin requerir hardware especializado. |
| RNF-003 | Latencia de Red | Las actualizaciones en tiempo real (movimiento de jugadores, notificaciones) deben tener una latencia inferior a 500ms para garantizar una experiencia de juego síncrona. |
| RNF-004 | Tiempos de Carga | La carga inicial del juego y la transición entre diferentes pantallas (lobby, tablero, modales) no debe exceder los 5 segundos en una conexión de banda ancha promedio. |
| **Seguridad** |
| RNF-005 | Autenticación Segura | Las contraseñas de los usuarios deben almacenarse de forma segura (hasheadas y salteadas). La comunicación de credenciales debe ser a través de HTTPS. |
| RNF-006 | Anti-Cheat | Todas las acciones críticas del juego (lanzamiento de dados, compras, resolución de eventos) deben ser validadas en el servidor para prevenir trampas. |
| RNF-007 | Autorización | Los usuarios solo deben poder acceder a las funciones y datos correspondientes a su rol (un jugador no puede acceder al panel de moderador). |
| **Confiabilidad** |
| RNF-008 | Disponibilidad | El sistema debe tener una disponibilidad del 99.5% durante el horario operativo definido. |
| RNF-009 | Gestión de Desconexiones | Si un jugador se desconecta, el sistema debe permitirle reconectarse a la partida en curso sin perder su progreso. |
| RNF-010 | Persistencia de Datos | El estado de las partidas en curso debe persistir en una base de datos para recuperarse ante una caída del servidor. |
| **Escalabilidad** |
| RNF-011 | Concurrencia | El servidor debe ser capaz de soportar al menos 10 salas de juego simultáneas con 6 jugadores cada una sin degradación del rendimiento. |
| **Compatibilidad** |
| RNF-012 | Compatibilidad de Navegadores | La aplicación debe ser completamente funcional en las últimas dos versiones de los principales navegadores web (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge). |
| **Mantenibilidad** |
| RNF-013 | Calidad del Código | El código fuente debe seguir una estructura modular y organizada (principios SOLID), estar debidamente comentado y seguir las convenciones de estilo del lenguaje (TypeScript/JavaScript). |
| RNF-014 | Documentación Técnica | Debe existir documentación técnica que describa la arquitectura del sistema, el flujo de datos y el despliegue. | 