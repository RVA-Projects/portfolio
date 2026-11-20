# Plan de implementación — Snake

**Estado:** Plan inicial (Fase 0). Es la única ubicación del estado de las tareas: actualizarlo tras cada tarea, junto con `memory.md`.

**Estados posibles:** `Pendiente` · `En curso` · `Hecha` · `Bloqueada` (indicar qué falta).

**Reglas de trabajo:** Tareas pequeñas y verificables, alineadas con `docs/testing.md`. Cada tarea cierra con las validaciones disponibles y actualización de memoria. Las fases marcadas con ⛔ requieren aprobación del desarrollador (modo Plan) antes de empezar.

---

## Fase 0 — Inicialización del entorno · **Hecha**

| Tarea | Estado |
|---|---|
| F0.1 · Inspección del workspace y decisiones del desarrollador iniciales | Hecha |
| F0.2 · Jerarquía documental (`docs/*`, `AGENTS.md`, `memory.md`) | Hecha |
| F0.3 · Harness mínimo (`package.json`, `tests/harness.test.js`, scripts `check` y `test`) | Hecha |
| F0.4 · Configuración de OpenCode (`opencode.json` con `instructions`) | Hecha |
| F0.5 · Auditoría de coherencia de toda la configuración y corrección de defectos | Hecha |

**Criterios de salida de la Fase 0:** Los 10 puntos de auditoría de la sección 10 de la tarea se verifican y corrigen; `npm run check` y `npm test` pasan.

**Tecnologías ya aprobadas (ADR-001..006):** JS vanilla sin build · módulos del workspace · harness node · sin `players.json`. Repositorio Git + GitHub: ADR-016 (2026-11-04, supera ADR-005).

---

## Fase 1 — Cierre de requisitos (depende de: nada; puerta del resto) · **Hecha (2026-11-02)**

| Tarea | Estado |
|---|---|
| F1.1 · Confirmar reglas base, flujo de partida, UI, persistencia e idioma con el desarrollador | Hecha |
| F1.2 · Actualizar `docs/requirements.md`: propuestas a `CONFIRMADO`, nuevos requisitos, casos límite | Hecha |
| F1.3 · Registrar ADR-007…ADR-010 en `docs/decisions.md` | Hecha |

**Criterios de salida:** Cumplidos. Requisitos base sin ambigüedad (`CONFIRMADO`), dos casos límite formalmente abiertos y acotados a tareas concretas (R27 → F4.2; R22 → F4.4). Persistencia e i18n entran en alcance (ADR-008/009); estructura modular ampliada (ADR-007).

## Fase 2 — Diseño arquitectónico y contratos ⛔ (depende de Fase 1) · **Hecha (2026-11-02)**

| Tarea | Estado |
|---|---|
| F2.1 · Diseñar las clases y funciones del núcleo lógico (`board.js`, `snake.js`, `food.js`, `logic.js`) de acuerdo con las reglas confirmadas (R13-R28) | Hecha (materializado en contrato C-1) |
| F2.2 · Redactar en `docs/contracts.md` los contratos declarados: C-1 (núcleo), C-2 (frontera presentación↔lógica), C-3 (i18n), C-4 (almacenamiento), C-5 (config ajustable) | Hecha |
| F2.3 · Completar `index.html`/`style.css`/`ui.js` a nivel estructural (IDs y clases necesarias para los contratos) | Reasignada a F3.1/F3.2 (la estructura material también es código) |
| F2.4 · Decidir el contenido final de `utils.js` a partir de lo que exija el diseño | Hecha: se mantiene como módulo de helpers compartidos (R36); lista concreta de helpers según demanda al implementar |

**Criterios de salida:** Cumplidos. `docs/contracts.md` define y traza C-0…C-5 (requisitos + ADRs); sin secciones por redactar. Los casos R27 y R22 ya están confirmados en requisitos (2026-11-02). No se editó código de producción.

## Fase 3 — Estructura del proyecto y wiring ⛔ (depende de Fase 2) · **Hecha (2026-11-02)**

| Tarea | Estado |
|---|---|
| F3.1 · Crear `config.js` (C-5 + ajuste visual en el propio `config.js`), `i18n.js` (C-3) y `storage.js` (C-4); ampliar script `check` a los 7 módulos y smoke tests (C-0 + C-3 + C-4 en Node) | Hecha |
| F3.2 · `index.html` y `style.css` con la estructura R29: nombre, fila de 5 botones, canvas, overlays inicial/nombre/ranking | Hecha |
| F3.3 · `main.js` y `ui.js`: wiring de botones/overlays/idioma/fullscreen + render estático del tablero derivado de `config.js` | Hecha |

**Criterios de salida:** Cumplidos. La página abre con layout R29, overlays y rankings vacíos funcionales, reetiquetado en caliente (AC-8) y cierre con Escape (R35); partida renderizada estática en pausa (R19) pero sin reglas: WASD/espacio/Enter aún inertes (F4.2). `npm run check` ✓ (7 módulos) y `npm test` ✓ (46/46). Enmienda de contratos aplicada y trazada: C-3 (claves btnSaveName/rankTitle) y C-5 (colores en config.js).

## Fase 4 — Implementación incremental del juego ⛔ (depende de Fase 3) · **Hecha (2026-11-02)**

| Tarea | Estado |
|---|---|
| F4.1 · Núcleo lógico: `board.js`, `snake.js`, `food.js`, `logic.js` con tick, wrap (R23) y colisiones (R24/R27), con pruebas unitarias | Hecha (`tests/logic.test.js`; C-1 materializado con refinements trazados: `Snake.step(nextHead)`, `occupiedBySnake(cell, bodyCells)`) |
| F4.2 · Input WASD (R15), arranque desde overlay (R19/R20), pausa/reanudación con espacio (R21) | Hecha (R27 decidida: la celda liberada por la cola no mata; última tecla gana entre ticks) |
| F4.3 · Comida + puntuación + velocidad progresiva (R16, R18, R25) con pruebas (incl. cap 1.5 a las 35) | Hecha (crecimiento en el mismo tick de la comida; recálculo exacto `SPEED_MIN + SPEED_STEP·score`) |
| F4.4 · Game over en canvas + Enter (R28); reinicio; guardar en ranking vía `storage.js` (R33); victoria por tablero lleno (R22) | Hecha (R33 enmendada por ADR-011: la victoria también guarda) |
| F4.5 · UI completa: overlays de nombre (R30, AC-7) y ranking; Play/Pause y pantalla completa (R34); textos i18n ES/EN en caliente (R31, AC-8) | Hecha (overlays/rankings/i18n ya hechos en F3; aquí: render de serpiente con cabeza distintiva R39, comida, pantallas de fin en canvas y botón Play/Pause funcional) |
| F4.6 · Persistencia del nombre del jugador entre sesiones (C-4 enmendada, ADR-012) | Hecha |

**Criterios de salida:** Cumplidos. Juego completo de principio a fin (pausa inicial → partida con velocidad progresiva → game over/victoria → reinicio), ranking vivo en localStorage con nombre persistente. `npm run check` ✓ (10 módulos) · `npm test` ✓ (72/72: C-0/C-3/C-4/26 pruebas del núcleo). Validación manual de partida completa: **confirmada por el desarrollador (2026-11-03)**, incluido el ajuste manual de constantes (AC-6).

## Fase 6 — Audio del juego classic ⛔ (depende de Fase 4) · **Hecha (2026-11-03, pendiente de validar a mano)**

| Tarea | Estado |
|---|---|
| F6.1 · Contratos y ADR | Hecha (ADR-013: zzfx vendido MIT + música por fichero; C-2 mapeo events→audio en main.js; C-3 +4 claves; C-4 + snake.audioPrefs; C-5 + sección AUDIO; R7/R30 enmendados) |
| F6.2 · `vendor/zzfx.js` + `audio.js` + sección AUDIO en `config.js` | Hecha (sfx sintetizados por recetas ajustables a mano; música `<audio>` en bucle, solo en `'running'`; fallo silencioso sin tema) |
| F6.3 · Wiring + botones de mute + título | Hecha (event→sfx, click unificado en todos los botones, mutes persistentes, título a 2.25rem) |

**Criterios de salida:** `npm run check` ✓ (12 ficheros, incl. `vendor/zzfx.js` y `audio.js`) · `npm test` ✓ (74/74, núcleo intacto). Pendiente del desarrollador: ronda manual de audio (§2 testing.md) y reconfirmar el aviso de pausa — asumida en la ronda de inicio de F7 (2026-11-03).
**Nota de alcance (2026-11-03):** el modo incremental (SnakeUp) NO entra en este plan; se desarrollará como proyecto aparte a partir de una copia de este juego cuando el classic esté cerrado (decisión del desarrollador).

## Fase 7 — Jugabilidad extendida y audio pulido ⛔ (depende de Fases 4 y 6) · **Hecha (2026-11-03, pendiente de verificar a mano)**

| Tarea | Estado |
|---|---|
| F7.1 · Contratos/requisitos/ADRs | Hecha (C-1 `foods[]` + `spawnFood`; C-2 temporizador de spawn en main.js; C-5 + `MAX_FOODS_ON_BOARD`/`FOOD_SPAWN_DELAY_MS`/`MUSIC_MAX_TRACKS`/`MUSIC_FADE_MS`; R15 flechas, R16 comida múltiple, R34 fullscreen escalado, R40 nuevo móvil; ADR-014 y ADR-015) |
| F7.2 · Comida múltiple progresiva (ADR-014) | Hecha (`logic.spawnFood` + `foods[]` en núcleo y tests; render N comidas; temporizador en `main.js`: arma/reanuda, congela en pausa, corta al terminar) |
| F7.3 · Flechas + D-pad táctil (R15/R40) | Hecha (flechas→`handleDirection` con preventDefault; D-pad bajo el canvas, solo en táctil por `pointer:coarse`; aria-labels vía i18n) |
| F7.4 · Música multi-tema + crossfade (ADR-015) | Hecha (sondeo por nombre hasta `MUSIC_MAX_TRACKS`, cacheado; 2 `<audio>` alternos, crossfade `MUSIC_FADE_MS`, bucle de lista; con un solo tema, loop natural) |
| F7.5 · Fullscreen escalado + responsive (R34/R40) | Hecha (`#stage` con `transform: scale(min(vw/W, vh/H))` en fullscreen; `body.fullscreen` sin scrollbar; canvas `max-width:100%`; toolbar compacta en pantallas estrechas) |
| F7.6 · SFX graves + separación canvas/botones | Hecha (recetas reafinadas a frecuencias bajas — editables siempre; `margin-top` en `.board-area`) |

**Criterios de salida:** El desarrollador ajustó `config.js` a mano (64×30 celdas, tick 50 ms, speedMin 0.6) y quedó respetado; los tests se derivan de las constantes, no de literales. `npm run check` ✓ (12 ficheros) · `npm test` ✓ (79/79, núcleo adaptado a `foods[]` con 5 pruebas nuevas de `spawnFood`). Pendiente del desarrollador: ronda manual F7 (§2 testing.md: flechas, D-pad táctil, fullscreen sin scrollbar, crossfade, tono de sfx).

## Fase 5 — Validación final y revisión (depende de Fase 4)

| Tarea | Estado |
|---|---|
| F5.1 · Batería manual de regresión en navegador (checklist en `docs/testing.md`) | Pendiente |
| F5.2 · Sincronización de documentación (contratos ↔ código, requisitos ↔ implementado) | Pendiente |
| F5.3 · Memory sweep: estado final en memoria y cierre del plan | Pendiente |

**Criterios de salida:** Documento y código consistentes; sin incidencias abiertas; memoria actualizada.
