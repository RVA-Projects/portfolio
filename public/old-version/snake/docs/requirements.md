# Requisitos — Snake

**Estado:** Fase 1 completada (cierre de requisitos, 2026-11-02). Confirmados por el desarrollador salvo donde se indique lo contrario.

**Clasificación de cada requisito:**
- `CONFIRMADO` — acordado con el desarrollador. Base de la implementación y de los criterios de aceptación.
- `PROPUESTA` — interpretación razonable pendiente de aprobación explícita. No implementar hasta pasar a `CONFIRMADO`.
- `PENDIENTE` — decisión abierta que requiere intervención del desarrollador. El agente identifica qué falta y propone alternativas; no decide.
- `ANULADO` / `SUPERADA` — histórico; no aplicar.

---

## 1. Objetivo del producto

- R1 · `CONFIRMADO` — Desarrollar un videojuego sencillo basado en el clásico **Snake**, jugable en un navegador web.
- R2 · `CONFIRMADO` — El proyecto es además un entorno de aprendizaje para metodologías de desarrollo asistido por IA; la disciplina metodológica (documentación, contratos, validación) es parte del producto. Ver `AGENTS.md`.
- R3 · `CONFIRMADO` — No añadir funcionalidades que no estén justificadas por los requisitos.

## 2. Alcance

### 2.1 Dentro del alcance
- R4 · `CONFIRMADO` — Un solo jugador.
- R5 · `CONFIRMADO` — Partida jugable de principio a fin: pausa inicial, desarrollo (comer y crecer), final de partida y reinicio.
- R6 · `ANULADO` (2026-11-02, decisión del desarrollador) — La persistencia de puntuaciones entra en alcance. Ver R33 y ADR-008.

### 2.2 Fuera del alcance (salvo decisión contraria del desarrollador)
- R7 · `PROPUESTA` — Multijugador, IA, menús complejos, opciones de configuración in-game, niveles, obstáculos, tipos de comida adicionales. *(🔊 Único slot relevado el 2026-11-03: el SONIDO (efectos + música + mutes, F6/ADR-013) ahora está dentro del alcance a petición del desarrollador; el resto sigue fuera.)*

## 3. Restricciones técnicas

- R8 · `CONFIRMADO` — Tecnologías: HTML, CSS y JavaScript puro (ES modules). Sin frameworks, sin compilación/build, sin dependencias de runtime. Ver ADR-001.
- R9 · `CONFIRMADO` — Ejecución local sin servidor: abrir `index.html` en un navegador moderno (la persistencia usa APIs del navegador; ver R33).
- R10 · `CONFIRMADO` — Arquitectura modular según `docs/architecture.md`; lógica del juego separada del DOM y testable en Node.
- R11 · `SUPERADA por ADR-007` (2026-11-02) — La estructura de módulos ya no se limita a los cinco ficheros originales. Ver R36 y `docs/architecture.md`.
- R12 · `CONFIRMADO` — Visualización con `<canvas>` 2D.

## 4. Reglas del juego

- R13 · `CONFIRMADO` — Tablero de rejilla rectangular de tamaño fijo: **40×24 celdas**, celda de **20 px** (canvas 800×480 px). Ajustable cambiando solo valores de `config.js` (ver R26 y contrato C-5).
- R14 · `CONFIRMADO` — La serpiente se mueve por celdas a intervalos regulares (ticks), no píxel a píxel.
- R15 · `CONFIRMADO` — Controles de movimiento: **WASD** (W arriba, A izquierda, S abajo, D derecha) y, *(enmienda F7, decisión del desarrollador)* las **flechas de dirección del teclado** como equivalentes. Las flechas no hacen scroll de página.
- R16 · `CONFIRMADO` — Siempre hay **hasta `MAX_FOODS_ON_BOARD` (4) alimentos** visibles simultáneos *(enmienda F7)*: la partida empieza con 1 y aparecen de forma **progresiva cada `FOOD_SPAWN_DELAY_MS` (3 s, configurable en `config.js`)** mientras la partida corre. Al comer un alimento la serpiente crece una celda (+1, R18) y el alimento no se repone de inmediato: lo hace el temporizador progresivo. *(Enmienda F7 sobre la F4: "un alimento" → "hasta 4 progresivos"; adaptación del texto de la F4 asimilada aquí.)*
- R17 · `CONFIRMADO` — El único modo de morir es **chocar contra el propio cuerpo**. Los bordes son infinitos (R23): no existe choque con pared.
- R18 · `CONFIRMADO` — Puntuación: **+1 por alimento**. La lógica se diseña segmentada para que en el futuro pueda añadirse más de un tipo de comida con puntuaciones distintas (solo si se pide).

## 5. Flujo de partida

- R19 · `CONFIRMADO` — Estado inicial: partida preparada **en pausa**, con overlay «Pulsa una dirección para empezar» sobre el tablero. El espacio no arranca el juego (ver R21).
- R20 · `CONFIRMADO` — La primera pulsación WASD cierra el overlay y arranca la partida: la serpiente se mueve **en la dirección de esa tecla**.
- R21 · `CONFIRMADO` — Pausa/reanudación durante una partida en curso: tecla **espacio** o botón Play/Pause. El espacio nunca inicia ni rearraanca una partida, y al reanudar el movimiento sigue con la dirección vigente. Colisión entre pausa y reanudación: ninguna (la partida queda congelada).
- R22 · `CONFIRMADO` (2026-11-02) — Si el tablero se llena por completo (límite teórico con 40×24 celdas) y no queda celda libre para el alimento: **victoria**; la partida finaliza.
- R23 · `CONFIRMADO` — Bordes infinitos: al cruzar un borde, la cabeza reaparece por el lado opuesto (wrap), sin efectos adicionales.
- R24 · `CONFIRMADO` — Muerte: choque con el propio cuerpo → fin de la partida y pantalla de game over (R28); la puntuación queda guardada en el ranking (R33).

## 6. Velocidad, temporización y configuración

- R25 · `CONFIRMADO` — Velocidad progresiva: multiplicador del tick base. Inicial **0.8**, normal **1.0**, máximo **1.5**. Progresión **lineal: +0.02 por alimento** (1.0 a las 10 comidas; cap 1.5 a las 35). Intervalo entre ticks = `BASE_TICK_MS / multiplicador`.
- R26 · `CONFIRMADO` — Ajustes manuales: geometría (celdas y tamaño), `BASE_TICK_MS` y velocidades extremas (**0.8 / 1 / 1.5**, con paso **+0.02 por alimento** y valor base **150 ms** como defaults) están definidos como **constantes nombradas en `config.js`**, con comentario exacto de ajuste. Cambiar un valor no rompe el funcionamiento (ver AC-6 y contrato C-5).

## 7. Caso límite de movimiento y fin de partida

- R27 · `CONFIRMADO` (2026-11-02) — Caso límite del movimiento: chochar con la celda que la cola acaba de vaciar **en el mismo tick** NO es colisión. Regla general de colisión: solo hay choque si coexisten **dos bloques de la serpiente en la misma celda**. (Resuelve el bloqueo de F4.2.)
- R28 · `CONFIRMADO` — Al morir se muestra: mensaje **«GAME OVER»** centrado en el canvas y, debajo, **«Pulsa Enter para volver a jugar»**. Al pulsar Enter el juego queda preparado en pausa (overlay R19); la siguiente dirección WASD arranca la nueva partida (puntuación a cero, serpiente y comida recolocadas).

## 8. Interfaz de usuario

- R29 · `CONFIRMADO` — Orden en pantalla, de arriba a abajo: **nombre del jugador** · fila de **botones** · **canvas del juego**.
- R30 · `CONFIRMADO` — Botones: **Introducir nombre** (overlay con textbox; mientras el textbox tiene el foco, WASD y espacio no afectan al juego), **Ver ranking** (overlay con todas las partidas registradas, ordenadas por puntuación descendente; campos: nombre, puntuación y fecha), **Pantalla completa**, **Cambiar idioma**, **Música sí/no** y **Efectos sí/no** (mutes separados, persistentes; F6) y **Play/Pause** (también con espacio). Todos los botones emiten un efecto de click (F6/ADR-013).
- R31 · `CONFIRMADO` — Idiomas: todos los textos de UI centralizados en un motor i18n **ES⇄EN**, conmutable en caliente con el botón de idioma. Idioma por defecto: **español**. Ningún texto de UI incrustado en módulos de presentación.
- R32 · `CONFIRMADO` — Nombre del jugador: si nunca se introduce, se muestra **«Jugador»** (etiqueta localizada vía i18n).
- R33 · `CONFIRMADO` (2026-11-02; enmienda F4: la victoria también guarda) — Persistencia: al finalizar una partida (por game over **o por victoria**) se guarda automáticamente en el ranking **nombre, puntuación y fecha** (fecha del momento). Vía **localStorage** detrás de un adaptador de almacenamiento intercambiable (futuro Firebase sin tocar UI ni lógica; contrato C-4). El ranking guarda **todas** las partidas y se ordena por puntuación descendente.
- R34 · `CONFIRMADO` — Pantalla completa mediante la API estándar del navegador (`requestFullscreen`). *(Enmienda F7, decisión del desarrollador: en fullscreen TODO el contenido (título, botones, canvas) se **reescala con zoom para llenar la ventana al máximo posible, centrado y sin scrollbar**, de forma que quepa a la perfección. Sin opciones extra.)*
- R39 · `CONFIRMADO` (2026-11-02) — Diseño visual: el bloque de la **cabeza** se dibuja con un color distinto al del cuerpo/cola para facilitar su identificación.
- R40 · `CONFIRMADO` (2026-11-03, F7) — Soporte móvil/tablet: en dispositivos táctiles aparece un **D-pad de 4 botones de dirección** (mismo camino de inicio que WASD/flechas), situado **bajo el canvas sin tapar nunca el área de juego**, oculto en escritorio. CSS **responsive** en vertical y horizontal (canvas a ancho máximo, toolbar compactada).
- R35 · `CONFIRMADO` — Cierre de overlays (nombre y ranking): con botón de cierre y con la tecla Escape; al cerrar, el foco vuelve al juego y las teclas WASD recuperan su efecto normal.
- R36 · `CONFIRMADO` — Código segmentado: clases/módulos pequeños con una única responsabilidad; ningún fichero monolítico. `utils.js` conserva helpers compartidos.

## 9. Requisitos no funcionales

- R37 · `CONFIRMADO` — Legibilidad y mantenibilidad: código claro, pequeño, sin abstracciones innecesarias.
- R38 · `CONFIRMADO` — Toda la lógica del juego debe poder validarse con el harness sin navegador (ver `docs/testing.md`).

## 10. Criterios de aceptación globales

- `AC-1` — El juego se ejecuta en un navegador moderno abriendo `index.html`, sin errores en consola.
- `AC-2` — Cada comportamiento implementado traza a un requisito `CONFIRMADO`; nada más.
- `AC-3` — `npm run check` y `npm test` pasan sin errores (ver `docs/testing.md`).
- `AC-4` — La lógica del juego se valida con pruebas automatizadas (desde Fase 4 del plan).
- `AC-5` — Documentación afectada (contratos, plan, decisiones, memoria) actualizada tras cada tarea.
- `AC-6` — Cambiar una constante de `config.js` (celdas, tamaño de celda, `BASE_TICK_MS`, velocidades) no rompe el funcionamiento (R13/R25/R26).
- `AC-7` — Con el textbox del nombre con foco, WASD y espacio no afectan al juego (R30).
- `AC-8` — El cambio de idioma en caliente reetiqueta toda la UI visible (R31).

## 11. Cuestiones abiertas restantes

- Ninguna. El bloque de requisitos quedó cerrado el 2026-11-02: R27 y R22 resueltas y confirmadas por el desarrollador.

## Historial de cambios de este documento

- 2026-11-03 · F7 (jugabilidad extendida y audio pulido): R15 enmendada (flechas del teclado como equivalentes de WASD); R16 enmendada (hasta 4 alimentos con aparición progresiva — ADR-014); R34 enmendada (fullscreen con zoom ajustado al viewport, centrado y sin scrollbar); nuevo R40 (D-pad táctil y responsive móvil — ADR-015). La música multi-tema traza en ADR-015 (sin cambio de requisito: ampliación del slot de sonido de R7/F6).
- 2026-11-03 · F6 (audio): R7 relevada para el slot de sonido; R30 ampliada con los mutes de Música/Efectos y el click unificado de todos los botones (ADR-013).
- 2026-11-02 · Fase 4: R33 enmendada — la victoria por tablero lleno también guarda en el ranking (decisión del desarrollador). El nombre del jugador se persiste entre sesiones vía adaptador C-4.
- 2026-11-02 · R27 y R22 confirmadas por el desarrollador (celda liberada por la cola = libre; tablero lleno = victoria). Nuevo R39: cabeza con color distintivo. Cuestiones abiertas: ninguna.
- 2026-11-02 · Cierre de Fase 1: reglas del juego, flujo de partida, UI, persistencia e idioma confirmados; R6 anulada; R11 superada por ADR-007; R19–R38 definidos con numeración coherente; casos límite consolidados en §5, §7 y §11.
