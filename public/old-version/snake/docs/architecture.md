# Arquitectura — Snake

**Estado:** Actualizada tras el cierre de la Fase 1 (2026-11-02, ADR-007). La lista de ficheros y las reglas de dependencia de este documento son fuente de verdad; cada fichero nuevo se incorpora aquí.

## 1. Visión general

Aplicación web estática sin build (módulos ES cargados por el navegador, ADR-001), organizada en capas con módulos pequeños de una única responsabilidad (R36, ADR-007):

- **Lógica (DOM-free)** — `board.js`, `snake.js`, `food.js`, `logic.js`
- **Configuración y soporte (DOM-free)** — `config.js`, `i18n.js`, `storage.js`, `utils.js`
- **Presentación** — `index.html`, `style.css`, `ui.js`, `main.js`, `audio.js` (+ `vendor/zzfx.js`, + `assets/audio/`)
- **Validación** — `tests/`

## 2. Módulos y responsabilidades

| Fichero | Capa | Responsabilidad | Prohibido |
|---|---|---|---|
| `index.html` | Presentación | Estructura: envoltorio `#stage` full contenido (F7/R34), título/nombre, fila de botones (R30), canvas, D-pad táctil (R40), overlays (inicial, nombre, ranking; la pantalla de game over se dibuja en canvas, R28). Carga `main.js` como módulo. | Lógica. |
| `style.css` | Presentación | Estética completa (layout, botones, overlays, canvas, responsive R40, D-pad solo táctil). | Lógica; textos de UI (uso de i18n). |
| `main.js` | Presentación | Bootstrap y wiring: teclado WASD + flechas (R15, R19, R21, R28 y caso límite R27), D-pad táctil (R40), bucle del juego y temporizador del spawn progresivo de comida (F7/C-2), escalado de `#stage` en fullscreen (R34/F7), conexión `logic.js ↔ ui.js ↔ i18n.js ↔ storage.js ↔ audio.js`. | Reglas del juego; render. |
| `ui.js` | Presentación | Render del estado en canvas (tablero, serpiente con cabeza de color distintivo R39, N comidas F7, mensajes), overlays y botones (R29/R30/R35), nombre del jugador (R32), ranking visual, victoria por tablero lleno (R22). | Reglas del juego; textos incrustados (R31). |
| `logic.js` | Lógica | Máquina de estados de la partida (pausa inicial, corriendo, pausa, game over; R19/R21/R28), tick del juego, composición de reglas, colisiones (R24/R27), puntuación (R18), velocidad (R25) y `spawnFood` (comida múltiple F7/ADR-014): añade UN alimento bajo máximo; el ritmo de spawn lo lleva `main.js` (C-2). | DOM/browser. |
| `board.js` | Lógica | Rejilla (R13), límites y wrap (R23), celdas ocupadas/libres. | DOM/browser. |
| `snake.js` | Lógica | Cuerpo y dirección de la serpiente; avance por tick; crecimiento (R14/R16/R20). | DOM/browser. |
| `food.js` | Lógica | Colocación aleatoria del alimento en celda libre (R16/R22). | DOM/browser. |
| `config.js` | Config | Único punto de ajuste manual (R26): geometría, `BASE_TICK_MS`, velocidades 0.8/1/1.5 y progresión 0.02, valores por defecto. Constantes nombradas + comentario de ajuste. | Lógica; DOM. |
| `i18n.js` | Soporte | Diccionarios ES/EN y API de texto por clave (R31); conmutación de idioma en caliente. | Textos incrustados en otros módulos. |
| `storage.js` | Soporte | Adaptador de persistencia: ranking, nombre del jugador (F4) y preferencias de audio (F6) (interfaz estable; ADR-008, C-4). Hoy: localStorage; se sustituirá por Firebase mediante el mismo adaptador. | Nadie accede a localStorage fuera de esta interfaz. |
| `audio.js` | Presentación | Motor de audio (F6/ADR-013 + F7/ADR-015): sfx sintetizados con zzfx según recetas de `config.js` (sección AUDIO); música multi-tema por sondeo de nombre (`theme.wav, theme1.wav…`) con crossfade entre temas; mutes con estado. Solo lo gobierna `main.js` según el estado del juego. | Reglas del juego; textos; storage. **Excluido de los tests Node** (usa AudioContext/HTMLAudio). |
| `vendor/zzfx.js` | Terceros (vendido) | ZzFX v1.4.0 (MIT, Frank Force) — Zuper Zmall Zound Zynth: sintetizador de efectos. Fichero upstream sin modificar. | Modificaciones locales (es código de terceros). |
| `assets/audio/` | Recursos | Tema de fondo aportado por el desarrollador (nombre configurado en `MUSIC_FILE`). Falta ⇒ fallo silencioso. | Lógica. |
| `utils.js` | Soporte | Helpers compartidos (matemáticas, formateo de fecha…). | Depender de presentación/lógica; acoplarse a las reglas del juego. |
| `tests/*.test.js` | Validación | node:test para los módulos DOM-free. | Ser importado por producción. |

## 3. Reglas de dependencia (obligatorias)

1. Los módulos lógicos (`board.js`, `snake.js`, `food.js`, `logic.js`) NO tocan el DOM ni APIs del navegador: deben poder probarse en Node (R38).
2. `i18n.js`, `utils.js` y `config.js` tampoco; `storage.js` exporta una interfaz DOM-free y solo accede a localStorage dentro de sus métodos (nunca al nivel de import).
3. Los módulos lógicos solo dependen de soporte/config: `{board,snake,food} → {config,utils}`; `logic.js → {config,utils}` (más los módulos lógicos que necesite).
4. `ui.js` puede importar de `logic.js`, `i18n.js`, `config.js` y `utils.js`; NO maneja datos del ranking: el guardado lo orquesta `main.js` mediante `storage.js`.
5. `main.js` orquesta y puede importar todo; **ningún módulo importa `main.js`**.
6. Nadie accede al almacenamiento directamente (solo `storage.js`, ADR-008); nada accede a los textos directamente (solo `i18n.js`, ADR-009).
7. Sin dependencias circulares. Sin dependencias de terceros sin ADR (R8): `vendor/zzfx.js` es la excepción aprobada (ADR-013, MIT, vendido verbatim, solo lo usa `audio.js`).
8. Los tests pueden importar cualquier módulo DOM-free; el código de producción jamás importa de `tests/`. `audio.js` y `vendor/zzfx.js` NO se importan en Node (crean `AudioContext` al importar): entran únicamente en `npm run check` (sintaxis).

## 4. Flujo de información


       teclado (WASD / espacio / Enter)
                     │
                     ▼
   ┌──────────── main.js (bucle + input) ───────────┐
   │       │                          │             │
   │       ▼                          ▼             ▼
   │   logic.js                    ui.js        storage.js (C-4)
   │ (estado,tick,  ── estado ──► (canvas +      (ranking:
   │  colisiones,                    overlays)    guardar/listar)
   │  score, velocidad)
   │       ▲
   │       └── config.js (ajustables) / i18n.js (textos)
   └────────────────────────────────────────────────┘

1. El teclado produce eventos que `main.js` traduce (WASD → dirección; espacio → pausa; Enter → rearma tras game over; bloqueo durante overlays, AC-7).
2. `main.js` invoca `logic.js` con estado + entrada; recibe el nuevo estado.
3. `logic.js` usa `board.js`/`snake.js`/`food.js` y `config.js` para aplicar reglas (movimiento, comida, colisiones, score, velocidad).
4. `ui.js` pinta el estado (canvas + overlays) con textos de `i18n.js`.
5. En game over, `main.js` persiste la puntuación vía `storage.js` (R33).
6. Los tests node:test validan toda la capa Lógica + soporte DOM-free (R38).

## 5. Decisiones arquitectónicas establecidas

Ver detalle en `docs/decisions.md`: ADR-001 (stack, sin build) · ADR-002 (adopción de ficheros originales; parcialmente superada) · ADR-003 (harness node) · ADR-007 (estructura modular amplia + `config.js`) · ADR-008 (adaptador de almacenamiento) · ADR-009 (i18n) · ADR-010 (modelo de velocidad).

## 6. Pendiente de diseñar en la Fase 2 (contratos C-1…C-5)

- Forma exacta del estado del juego y de sus clases; firma de funciones de cada módulo lógico (C-1).
- Franja de intercambio presentación↔lógica (C-2): qué expone `logic.js` a `ui.js` y con qué garantías.
- Definición del diccionario de claves i18n (C-3) y de la interfaz de almacenamiento (C-4) con su invariante de orden/ordenación.
- Invariantes de `config.js` (C-5): qué cambia no puede romper el juego y cómo se valida.
