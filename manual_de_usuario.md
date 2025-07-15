# Manual de Usuario - Doctums Challenge

Este manual describe las funcionalidades principales de cada vista de la aplicación de juego empresarial Doctums Challenge, una simulación multijugador donde los participantes asumen roles de liderazgo para enfrentar desafíos empresariales.

## 1. Página Principal (Landing Page)

### Funcionalidades Core:
- **Información del juego**: Presenta los beneficios y características del simulador empresarial
- **Acceso a reglas**: Explica la mecánica del juego y objetivos
- **Información del equipo**: Muestra los desarrolladores y colaboradores
- **Navegación**: Enlaces para ingresar al juego o unirse a una partida

### Elementos principales:
- Header con navegación
- Sección hero con información destacada
- Sección de beneficios del juego
- Información de precios/modalidades
- Footer con contacto

---

## 2. Vista Home - Inicio del Juego

### Funcionalidades Core:

#### 2.1 Pantalla Principal
- **Crear partida**: Genera una nueva sesión de juego con código único
- **Unirse a partida**: Permite ingresar a una partida existente con código
- **Controles de audio**: Música de fondo y efectos de sonido

#### 2.2 Selección de Personaje (`/home/chooseCharacter`)
- **6 Personajes disponibles**:
  1. **Líder Estratégico** - Gestión de proyectos y toma de decisiones
  2. **Analista de Datos** - Manejo de información y organización
  3. **Ingeniero de Software** - Soluciones técnicas y creatividad
  4. **Comunicadora** - Gestión de stakeholders y empatía
  5. **Consultor Ágil** - Metodologías ágiles y colaboración
  6. **Gestora de Riesgos** - Identificación y mitigación de riesgos

- **Funcionalidades**:
  - Navegación entre personajes con flechas
  - Ingreso de nombre de jugador (mín. 3 caracteres)
  - Validación de formulario
  - Conexión automática a WebSocket al confirmar

#### 2.3 Unirse a Partida (`/home/joinGame`)
- **Ingreso de código**: Campo para código UUID de sesión (36 caracteres)
- **Validación**: Verifica formato de código válido
- **Redirección**: Lleva a selección de personaje si el código es válido

---

## 3. Sala de Espera (Game Hall)

### Funcionalidades Core:
- **Visualización de jugadores conectados**: Muestra avatares y nombres de todos los participantes
- **Identificación del host**: El primer jugador es automáticamente el anfitrión
- **Copia de código de partida**: Botón para compartir código con otros jugadores
- **Inicio de partida**: Solo el host puede iniciar el juego
- **Notificaciones sonoras**: Sonido cuando se une un nuevo jugador
- **Controles de audio**: Gestión de música y efectos

### Elementos visuales:
- Header con código de partida
- Grid de jugadores con sus personajes seleccionados
- Botón "Iniciar Partida" (solo para host)
- Indicador "Tú" para el jugador local

---

## 4. Juego Principal (Game)

### Funcionalidades Core:

#### 4.1 Canvas del Juego
- **Mapa de tablero**: Representación visual del año con 12 meses
- **Movimiento de personajes**: Los jugadores avanzan según dados lanzados
- **Posiciones en tiempo real**: Sincronización de ubicaciones entre jugadores
- **Indicadores visuales**: Casillas con niveles de dificultad de eventos

#### 4.2 Sistema de Turnos
- **Orden de turnos**: Determinado por lanzamiento inicial de dados
- **Lanzamiento de dados**: Solo el jugador en turno puede lanzar
- **Avance de días**: Cada casilla representa días del mes
- **Progresión temporal**: 12 meses de simulación empresarial

#### 4.3 Plan de Acción
**Acceso**: Modal que se abre para planificar estrategias mensuales

**Categorías de modificadores**:
- **Productos**: Mejoras a eficiencias específicas
- **Proyectos**: Inversiones a largo plazo con tiempo de duración
- **Recursos**: Herramientas temporales para superar desafíos

**Funcionalidades**:
- Selección múltiple de modificadores
- Cálculo automático de presupuesto restante
- Validación de fondos disponibles
- Confirmación y envío de plan

#### 4.4 Sistema de Eventos
- **Eventos aleatorios**: Desafíos que aparecen al avanzar días
- **Niveles de dificultad**: Basados en la posición en el tablero
- **Prueba de eficiencias**: Los eventos evalúan diferentes habilidades
- **Resultados**: Éxito o fallo basado en modificadores adquiridos

#### 4.5 Información del Jugador
**Panel lateral con**:
- Nombre y avatar del personaje
- Presupuesto actual
- Puntuación acumulada
- Fecha actual en la simulación
- Eficiencias por categoría (1-12)

#### 4.6 Modificadores Activos
**Visualización de**:
- Productos adquiridos y su estado
- Proyectos en curso con tiempo restante
- Recursos disponibles
- Historial de compras

---

## 5. Modales del Juego

### 5.1 Eventos y Desafíos (`/game/challenge/[eventId]`)
- **Descripción del evento**: Contexto del desafío empresarial
- **Requisitos**: Eficiencias necesarias para superar el reto
- **Opciones de respuesta**: Decisiones estratégicas disponibles
- **Retroalimentación**: Resultado inmediato de la decisión

### 5.2 Notificaciones Especiales
- **Recompensas de legado**: Productos heredados de turnos anteriores
- **Confirmación de plan**: Éxito al enviar plan de acción
- **Mensajes de éxito/fallo**: Resultados de eventos completados

### 5.3 Visualización de Modificadores
- **Todos los productos**: Catálogo completo disponible
- **Todos los proyectos**: Lista de inversiones posibles
- **Todos los recursos**: Herramientas temporales
- **Mis modificadores**: Estado actual del jugador

---

## 6. Características Transversales

### 6.1 Sistema de Audio
- **Música de fondo**: Ambiente sonoro del juego
- **Efectos de sonido**: Feedback para acciones (dados, botones, notificaciones)
- **Control global**: Activar/desactivar música y sonidos por separado

### 6.2 Comunicación en Tiempo Real
- **WebSocket**: Sincronización instantánea entre jugadores
- **Notificaciones push**: Alertas de cambios de turno y eventos
- **Estado compartido**: Todos los jugadores ven los mismos datos

### 6.3 Interfaz Responsiva
- **Diseño adaptativo**: Funciona en diferentes tamaños de pantalla
- **Controles táctiles**: Optimizado para dispositivos móviles
- **Feedback visual**: Hover states y animaciones

---

## 7. Flujo de Juego Típico

1. **Ingreso**: Desde landing page → crear/unirse a partida
2. **Configuración**: Seleccionar personaje → sala de espera
3. **Inicio**: Host inicia partida → determinación de orden de turnos
4. **Turnos mensuales**:
   - Lanzar dados para avanzar días
   - Crear plan de acción con presupuesto
   - Enfrentar eventos según posición
   - Ganar/perder eficiencias según resultados
5. **Progresión**: Repetir durante 12 meses simulados
6. **Final**: Comparación de puntuaciones y logros

---

## 8. Objetivos del Juego

- **Maximizar puntuación**: A través de decisiones estratégicas efectivas
- **Desarrollar eficiencias**: En las 12 categorías empresariales
- **Gestionar recursos**: Presupuesto limitado requiere planificación
- **Superar desafíos**: Eventos aleatorios prueban la preparación
- **Aprender liderazgo**: Simulación realista de situaciones empresariales

Este manual cubre las funcionalidades esenciales de cada vista. Para detalles específicos de mecánicas avanzadas, consulte la documentación técnica del proyecto. 