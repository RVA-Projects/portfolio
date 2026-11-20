# Contratos entre componentes

**Estado:** Fase 2 completada (2026-11-02). C-0 y C-1…C-5 están **definidos y vigentes**. Hoy no existe ningún contrato pendiente de redacción: el código futuro (Fase 3–4) debe cumplirlos.

Este documento es la **única fuente de verdad de los contratos**. Reglas de uso:

1. Un contrato no se modifica arbitrariamente durante una implementación; su cambio es una tarea separada, motivada y trazada.
2. Cada contrato tiene trazabilidad: requisitos de `docs/requirements.md` y decisiones de `docs/decisions.md`.
3. Una discrepancia código ↔ contrato es un defecto: se corrige a propósito (código o contrato, con decisión explícita).

---

## Contrato vigente C-0 · Infraestructura de módulos

- **Aplica a:** módulos DOM-free de producción: `logic.js`, `board.js`, `snake.js`, `food.js`, `config.js`, `i18n.js`, `utils.js`; con matiz `storage.js`. Los de presentación (`main.js`, `ui.js`) quedan fuera: la sintaxis la cubre `npm run check` y su comportamiento se valida manualmente en navegador.
- **Motivación:** R8–R10, R36, R38 y validez del harness (ADR-001, ADR-003, ADR-007).
- **Definición:**
  - Módulos ES válidos (`"type": "module"` en `package.json`), importables sin error por Node y por el navegador.
  - **Importar NO produce efectos:** ninguna acción al nivel superior ni errores (los módulos pueden estar vacíos hasta su fase de implementación).
  - **Invariantes:** al importarlos en Node no referencian `window`, `document` ni `localStorage` a nivel superior. La cadena lógica (C-1) no los usa ni en ejecución; solo `storage.js` accede a `localStorage`, dentro de sus métodos y jamás al importar (ADR-008).
- **Verificación:** `npm run check` (sintaxis de los ficheros listados en el script `check`) y `npm test` (importabilidad + invariantes). El smoke test `tests/harness.test.js` se amplía a la lista de módulos DOM-free a medida que se crean; en F3 se amplía también el script `check`.

---

## Contrato C-1 · Núcleo lógico

- **Aplica a:** `board.js`, `snake.js`, `food.js`, `logic.js`.
- **Motivación:** R13–R18, R22–R27 · ADR-007, ADR-010.
- **Tipos** (compartidos; los literales de tipo se documentan aquí y las const en `board.js`):
  - `DIRS = { UP: {x:0,y:-1}, DOWN: {x:0,y:1}, LEFT: {x:-1,y:0}, RIGHT: {x:1,y:0} }` — únicas direcciones válidas.
  - `Cell = { x: number, y: number }` — `x` columna `0..cols-1`, `y` fila `0..rows-1`.
  - `GameState = { cols, rows, snake: { body: Cell[], dir, pendingGrow }, foods: Cell[], score, speedMult, status }`, con `status ∈ 'ready' | 'running' | 'paused' | 'over' | 'victory'`. *(Enmienda F7: `food: Cell|null` → `foods: Cell[]` — hasta `MAX_FOODS_ON_BOARD` alimentos simultáneos; el vacío `[]` solo se observa cuando el tablero se llena, que es victoria R22.)* Serializable (snapshot plano).
- **Interfaz:**
  - `class Board { constructor(cols, rows) }` · `board.allCells() → Cell[]` · `board.wrap(cell) → Cell` (bordes infinitos R23) · `board.isInside(cell) → boolean` · `board.occupiedBySnake(cell, bodyCells) → boolean` (duplicado en celdas; R27 lo resuelve la lógica: la celda que la cola libera en el tick ya no está en `bodyCells`).
  - `class Snake { constructor(startCell, dir, length = START_SNAKE_LENGTH) }` — cuerpo reconstruido detrás de la cabeza en contra de `dir`. Las direcciones se pasan como **vectores de `DIRS`** (la validación de nombres vive en `logic.js`). Métodos: `setDirection(dirVec)` (ignora la inversión de 180° respecto a la dir vigente; queda pendiente para el siguiente tick) · `peekNext() → Cell` (celda destino sin avanzar: cabeza + dir pendiente o vigente, **sin wrap**) · `step(nextHead) → { head, freedCell }` (avanza INTO `nextHead` ya resuelto por la lógica; aplica dir pendiente; devuelve la celda que libera la cola, si libera) · `headCell()` · `bodyCells()` · `grow(n = 1)` (encola crecimiento) · `toSnapshot() → { body, dir, pendingGrow }` · `Snake.fromSnapshot(snapshot)` (para componer estados puros). *(F4: firma refinada — `step(nextHead)` en vez de `step()` — para que el wrap lo aplique la lógica con el Board, sin violar la regla de dependencias `snake ↛ board`.)*
  - `class Food { place(freeCells, rng = Math.random) → Cell | null }` — elige al azar entre libres; `null` si no queda ninguna (victoria, R22).
  - `createInitialState({ cols, rows }, rng = Math.random) → GameState` — serpiente de `START_SNAKE_LENGTH` centrada mirando a la derecha, alimento ya colocado y `speedMult = SPEED_MIN` (R25: velocidad inicial 0.8); status `'ready'` (R19).
  - `startInDirection(state, dirName) → GameState` — primer arranque (R20): reconstruye la serpiente con la misma cabeza central y el cuerpo en contra de la dirección elegida (así cualquier dirección es segura), y pasa de `'ready'` a `'running'`. En otros estados no cambia nada.
  - `step(state, input) → { state: GameState, events: string[] }` — aplica un tick completo a `state` sin mutarlo: dirección entrada (nombre `UP/DOWN/...` o `null`) → avance con wrap (R23) → colisión (R24/R27: la celda liberada por la cola este tick no mata) → alimento, crecimiento y score (R16/R18) → velocidad (R25: `speedMult = min(SPEED_MAX, SPEED_MIN + SPEED_STEP·score)`). `events` ⊆ `'food'`, `'gameover'`, `'victory'`; con game over o victoria el nuevo estado pasa al `status` correspondiente y la serpiente no avanza más. Si `status` no es `'running'`, el tick no hace nada (estado idéntico, sin eventos).
  - `togglePause(state) → GameState` — solo entre `'running'` y `'paused'` (R21).
  - *(Enmienda F7)* `spawnFood(state, rng = Math.random) → { state, events }` — añade UN alimento en una celda libre (sin serpiente ni otros alimentos) cuando `status === 'running'` y `foods.length < MAX_FOODS_ON_BOARD`; en cualquier otro caso no-op idéntico (`events: []`). Sin celda libre ⇒ no-op (el tablero lleno es victoria R22, que decide `step`). NUEVO evento `'spawn'`. El RITMO (ms) no vive aquí: lo gobierna `main.js` (C-2).
- **Responsabilidades:** composición de reglas puras; no conoce DOM, textos, colores ni tiempo real.
- **Entradas/salidas:** estados válidos según las precondiciones; si fallan (estado inválido), el módulo lanza `Error` descriptivo (falla de contrato, no comportamiento del juego).
- **Validaciones:** direcciones solo de `DIRS`; avances solo con `status 'running'`.
- **Invariantes:**
  - **Puras:** las funciones devuelven el nuevo estado; no mutan. El estado de entrada pasa como argumento en cada tick.
  - Único elemento no determinista: el `rng` de `food.js` (inyectable; por defecto `Math.random`).
  - Auto-colisión exclusivamente si dos bloques coexisten en la misma celda tras el avance (R27: la celda que la cola libera en ese tick no mata).
  - Sin DOM ni APIs del navegador (C-0/R38). Sin dependencias de textos (C-3).
- **Efectos secundarios permitidos:** ninguno.
- **Dependencias permitidas:** `{logic,board,snake,food} → {config,utils}` (ver `docs/architecture.md` §3); sin ciclos.

## Contrato C-2 · Frontera presentación ↔ lógica

- **Aplica a:** `logic.js` ↔ `ui.js` (orquestado por `main.js`).
- **Motivación:** R10, R19, R21, R28, R29 · ADR-007.
- **Definición:**
  - `ui.js` lee únicamente el `GameState` serializable y pinta; **no** calcula reglas ni muta el estado.
  - El único canal de sucesos lógicos → UI es `events` del `step` (C-1); `main.js` lo traduce: `'gameover'` → persistencia vía `storage.saveScore` y pantalla final; `'victory'` → pantalla de victoria; `'food'` → nada de UI especial.
  - El bucle temporizado vive en `main.js`: intervalo = `BASE_TICK_MS / speedMult` recalculado tras cada cambio de `speedMult` (R25). `logic.js` no conoce ms ni temporizadores.
  - *(Enmienda F7)* El temporizador del **spawn progresivo de comida** también vive en `main.js` (C-2): cada `FOOD_SPAWN_DELAY_MS` de partida en curso llama a `logic.spawnFood`. En pausa el temporizador se congela y al reanudar recomienza; con game over/victoria se detiene. La lógica solo ejecuta la colocación sin saber de tiempo real.
  - Pantallas: overlay inicial (`ready`), overlay game over dibujado en canvas o DOM a elección de `ui.js` (R28) siempre con textos vía C-3.
- **Invariantes:** ningún módulo de presentación toca el backend de almacenamiento: el guardado lo ejecuta `main.js` vía el adaptador (R33); `ui.js` no conoce los detalles de persistencia (C-4). La presentación no decide el comportamiento del juego. La traducción de eventos a AUDIO la hace `main.js` (F6, ADR-013): `ui.js` y la lógica no llaman a `audio.js`.
- **Efectos secundarios permitidos:** render (canvas/DOM) por parte de `ui.js` y `main.js` únicamente.
- **Dependencias permitidas:** `ui.js → {logic, i18n, config, utils}`; `main.js → todos` (orquestación); nadie importa `main.js`.

## Contrato C-3 · Textos i18n

- **Aplica a:** `i18n.js` ↔ módulos de presentación.
- **Motivación:** R31, R32 · ADR-009.
- **Interfaz:**
  - `i18n.setLanguage(lang) → 'es' | 'en'`
  - `i18n.get(lang, key) → string`, y un atajo: `i18n.t(key) → string` usa el idioma activo.
- **Claves mínimas** (obligatorias, completas en ambos diccionarios): `title`, `playerName`, `btnName`, `btnRanking`, `btnFullscreen`, `btnLanguage`, `btnPause`, `btnMusic`, `btnSfx`, `audioOn`, `audioOff`, `overlayStart`, `overlayGameOver`, `overlayEnterToPlay`, `overlayVictory`, `overlayPause`, `rankTitle`, `rankEmpty`, `nameInputPlaceholder`, `btnSaveName`, `btnCloseOverlay`, `defaultPlayerName` («Jugador» / «Player»). *(Enmienda F3: `btnSaveName` sustituye al provisional `btnDeleteName` y se añade `rankTitle`. Enmienda F4: `overlayPause` para el aviso de pausa en canvas. Enmienda F6: `btnMusic`/`btnSfx` etiquetas de los mutes y `audioOn`/`audioOff` para pintar su estado.)*
- **Validaciones:** clave inexistente ⇒ log de error en consola y devolución de la propia clave (la aplicación nunca se rompe).
- **Invariantes:** idioma por defecto español (R31); los diccionarios tienen TODAS las claves definidas en ambos casos (comprobable por test de clave en F4); ningún texto de UI incrustado en módulos UI (R31); la conmutación es en caliente (re-render sin recargar).
- **Efectos secundarios permitidos:** ninguno (no graba `localStorage`; el idioma activo vive en la memoria de la sesión. Si en el futuro se decide persistirlo, se añadiría como nueva sub-decisión).
- **Dependencias:** ninguna (C-0 DOM-free).

## Contrato C-4 · Almacenamiento de puntuaciones

- **Aplica a:** `storage.js` ↔ `main.js`.
- **Motivación:** R33 · ADR-008.
- **Interfaz:**
  - `storage.saveScore({ name, score, date })` — registra una entrada de ranking.
  - `storage.listScores() → Array<{ name, score, date }>` — TODAS, ordenadas por puntuación descendente; en empate, la más reciente primero (ISO 8601 se compara lexicográficamente).
  - `storage.savePlayerName(name) | storage.loadPlayerName() → string` — recuerda el nombre entre sesiones (F4: decisión del desarrollador, 2026-11-02). Devuelve `''` si no hay nombre guardado.
  - `storage.saveAudioPrefs({music, sfx}) | storage.loadAudioPrefs() → {music, sfx}` — mutes de música y efectos, persistentes (F6: ADR-013). Defaults: ambos activados; corrupción ⇒ defaults. *(Enmienda F4: almacenamiento del nombre; F6: preferencias de audio — claves `'snake.playerName'` y `'snake.audioPrefs'`.)*
- **Tipos:** `name: string`, `score: número entero ≥ 0`, `date: string ISO 8601` (UTC).
- **Validaciones:** si el parámetro no es válido (score negativo, `name` vacío…), el adaptador no persiste la entrada y la señala por consola.
- **Invariantes:**
  - Solo `storage.js` toca `localStorage` con las claves `'snake.scores'` (array serializado JSON), `'snake.playerName'` (string simple) y `'snake.audioPrefs'` (JSON con mutes). Ningún otro fichero accede a ellas (R33, ADR-008).
  - Ausencia o corrupción de datos ⇒ inicialización limpia (silenciosa; se devuelve lista vacía / `''`); nunca se rompe la ejecución.
  - El orden en la lista es SIEMPRE puntuación desc.; empate: fecha desc.
- **Efectos secundarios permitidos:** escritura en `localStorage` únicamente desde dentro del adaptador.
- **Dependencias:** ninguna (interfaz estable para sustituirla más adelante por Firebase; `main.js` solo ve el adaptador).

## Contrato C-5 · Configuración ajustable

- **Aplica a:** `config.js` ↔ todos los consumidores.
- **Motivación:** R13, R25, R26 · AC-6, ADR-010.
- **Contenido (consts exportadas):**

```js
// ── AJUSTE DE TABLERO (cambiar solo el valor; el derivado se recalcula solo) ──
export const BOARD_COLS = 40;   // celdas en horizontal
export const BOARD_ROWS = 24;   // celdas en vertical
export const CELL_SIZE  = 20;   // px por celda; canvas = BOARD_COLS*CELL_SIZE × BOARD_ROWS*CELL_SIZE

// ── AJUSTE DE VELOCIDAD ──
export const BASE_TICK_MS = 150; // ms por celda al multiplicador 1.0
export const SPEED_MIN  = 0.8;   // multiplicador inicial de la partida
export const SPEED_MAX  = 1.5;   // máximo (cap)
export const SPEED_STEP = 0.02;  // avance lineal por alimento (R25)

// ── OTROS ──
export const START_SNAKE_LENGTH = 3;   // largo inicial de la serpiente

// ── COMIDA MÚLTIPLE (enmienda F7, ADR-014) ──
export const MAX_FOODS_ON_BOARD  = 4;    // alimentos simultáneos máximos (R16)
export const FOOD_SPAWN_DELAY_MS = 3000; // ms entre apariciones progresivas

// ── MÚSICA MULTI-TEMA (enmienda F7, ADR-015) ──
export const MUSIC_MAX_TRACKS = 8;       // sondea theme.wav, theme1.wav… hasta este límite
export const MUSIC_FADE_MS    = 1500;    // ms de crossfade entre temas (0 = corte en seco)

// ── VISUAL (colores hex; añadido en F3 por R26/R39, decisión del desarrollador) ──
export const BOARD_BG_COLOR   = '#0f172a'; // fondo del tablero
export const GRID_LINE_COLOR  = '#1e293b'; // líneas de la rejilla
export const SNAKE_HEAD_COLOR = '#22d3ee'; // cabeza (distinta del cuerpo, R39)
export const SNAKE_BODY_COLOR = '#15803d'; // cuerpo y cola
export const FOOD_COLOR       = '#f87171'; // alimento

// ── AUDIO (F6, ADR-013) ──
export const MUSIC_FILE   = 'assets/audio/theme.wav'; // ruta del tema de fondo (fichero aportado)
export const MUSIC_VOLUME = 0.5;                      // 0.0–1.0
export const SFX_VOLUME   = 0.6;                      // 0.0–1.0
export const SFX_RECIPES = { click: [...], food: [...], pause: [...], resume: [...], gameover: [...] };
// Recetas zzfx (arrays de 21 parámetros, ver vendor/zzfx.js): cada efecto
// queda editable a mano en config.js.
```

- **Validaciones (por tests, no en runtime):** `BOARD_COLS ≥ 5`, `BOARD_ROWS ≥ 5`, `CELL_SIZE > 0`, `BASE_TICK_MS > 0`, `SPEED_MIN ≤ 1.0 ≤ SPEED_MAX`, `0 < SPEED_STEP`, el conjunto de velocidades no rompe el cálculo `BASE_TICK_MS / speedMult` con valores finitos.
- **Invariantes:** son la única ubicación de estos valores (sin valores mágicos en el resto de módulos); los consumidores derivan todo a partir de ellos; **cambiar cualquier valor no rompe el juego** (AC-6).
- **Efectos secundarios:** ninguno. Sin DOM. Comentarios de ajuste manual junto a cada constante (R26).

---

## Contratos no previstos

Ninguno. Si surge la necesidad de un contrato adicional, se declara aquí y se aprueba antes de implementar.

## Plantilla para contratos futuros

```markdown
### C-n · <Nombre>
- **Aplica a:** módulo(s) / componente(s).
- **Motivación:** requisitos implicados (ids de docs/requirements.md) + ADR si aplica.
- **Tipos:** <tipos de datos intercambiados, con su forma exacta>.
- **Interfaz:** <firmas exportadas: nombre, parámetros, retorno>.
- **Responsabilidades:** <qué debe hacer>.
- **Entradas / salidas:** <dominios y precondiciones / postcondiciones>.
- **Validaciones:** <qué debe validar el implementador de entradas>.
- **Invariantes:** <condiciones que se mantienen siempre>.
- **Efectos secundarios permitidos:** <exactamente los necesarios; por defecto ninguno>.
- **Dependencias permitidas:** <según docs/architecture.md>.
```
