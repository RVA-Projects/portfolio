# Estrategia de pruebas y harness — Snake

**Estado:** Harness de Fase 4. Este documento es la fuente de verdad de la validación; distingue explícitamente lo que existe de lo que no.

## 1. Validaciones automatizadas — DISPONIBLES

Herramientas: solo Node.js v24 (runner nativo `node:test`, `node --check`). Cero dependencias (ADR-003).

| Comando | Qué valida | Cuándo ejecutarlo |
|---|---|---|
| `npm run check` | Sintaxis correcta de los 12 ficheros JS de producción, incluido `audio.js` y el fichero vendido `vendor/zzfx.js` | Antes de cerrar cualquier tarea que toque `.js` |
| `npm test` | Pruebas automatizadas de `tests/` (`node --test`) | Antes de cerrar cualquier tarea |

Implementación actual:

- `tests/harness.test.js` — suite de contratos:
  - **C-0:** importabilidad de los 7 módulos DOM-free (`logic`, `board`, `snake`, `food`, `utils`, `config`, `i18n` + matiz `storage`) sin efectos al importar e invariantes DOM-free (sin `window`/`document`; en `storage.js` solo se admite `localStorage` dentro de sus métodos, y sin navegador devuelve lista limpia).
  - **C-3:** las claves mínimas existen y no están vacías en ES y EN; idioma por defecto español (R31). Si se añade una clave de UI, se añade aquí y en ambos diccionarios (F7 añade 4 de accesibilidad del D-pad: `dpadUp…dpadRight`).
- `tests/logic.test.js` — reglas del juego (contrato C-1, R13–R27 + enmienda F7), sobre tableros pequeños:
  - Estado inicial (R19/R25): pausa, centrado, 1 comida colocada fuera de la serpiente (`foods[]`, enmienda F7); `rng` inyectable determinista.
  - Arranque (R20): `ready → running`, serpiente reorientada al pulsar WASD (cualquier dirección es segura al reconstruirse).
  - Movimiento y pureza (R14): un tick = una celda; el estado de entrada no se muta.
  - Wrap (R23): el borde rebota por el lado opuesto, también en las 4 esquinas.
  - Colisiones (R24/R27): la celda que la cola libera en el mismo tick NO mata (caso del anillo; y con crecimiento pendiente); choque contra el cuerpo → `gameover` con estado congelado; dirección inválida → `Error` de contrato; inversión de 180° ignorada. *(Las flechas del teclado viven en `main.js` — validación manual §2.)*
  - Comida (R16/R18): +1 score, evento `food`, crecimiento en el mismo tick; el alimento comido se retira SIN reposición inmediata (F7); los demás alimentos sobreviven al picoteo.
  - Spawn progresivo (F7/ADR-014): añade bajo el máximo respetando celdas ocupadas; no-op al máximo/fuera de running/sin celdas libres.
  - Velocidad (R25): cap y progresión calculados desde las constantes de config (no literales: siguen válidos tras cambiar `SPEED_MIN`/`SPEED_STEP`).
  - Victoria (R22): comer la última celda libre → `foods: []`, `victory`, y ya no avanza.
  - Pausa (R21): `running ⇄ paused`; `step` en pausa es identidad.

## 2. Validaciones manuales

| Comprobación | Procedimiento | Aplicable |
|---|---|---|
| La página abre y funciona | Abrir `index.html` en un navegador moderno; consola sin errores ni warnings | ✅ Activa desde Fase 3 |
| Overlays, botones e idioma | Nombre (guardar/vacío→«Jugador»; el nombre persiste entre recargas), ranking (lista/vacío), idioma ES⇄EN en caliente (AC-8, también reetiqueta los mensajes del canvas), Escape cierra (R35), fullscreen (R34) | ✅ Activa desde Fase 3 |
| Partida completa de principio a fin | WASD arranca desde el overlay (R19/R20); comer y crecer; espacio pausa/reanuda (R21; nunca inicia); Play/Pause botón; game over canvas con Enter (R28) → overlay; victoria solo alcanzable manipulando constantes (ver nota) | ✅ Activa desde Fase 4 |
| Audio (F6/ADR-013) | Click suena en TODOS los botones; sfx de comer/pausa/reanudar/fin; música solo mientras la partida corre (para en pausa, retoma la posición al reanudar, se reinicia al morir); los dos mutes son independientes y persistentes tras recargar; sin `theme.wav` el juego abre limpio (fallo silencioso); al cambiar idioma se reetiquetan Música/Efectos con su estado | ✅ Activa desde F6 (música: requiere `assets/audio/theme.wav`) |
| Jugabilidad F7 (R15/R40/R34) | Flechas ↑↓→← mueven como WASD (y arrancan) sin scroll de página; el D-pad SOLO aparece en táctil (emulable con devtools móvil), bajo el canvas que no tapa; vertical y horizontal sin solapamientos; fullscreen: TODO el contenido llenará la ventana centrado y SIN scrollbar, título «Snake» incluido (probar con zoom 100% y 125%, y ventanas de proporciones distintas); separación visible entre botones y canvas | ✅ Activa desde F7 (fullscreen corregido el 2026-11-03) |
| Música multi-tema (F7/ADR-015) | Con theme.wav + theme1.wav… en `assets/audio/`: los temas succeden AL AZAR con paso suave (crossfade), sin repetirse hasta agotar la lista completa; con UN solo fichero, bucle natural. Ranking (R30/R33): con muchas partidas, el card se topa al 70% del alto con barra de scroll en la lista; título y botón siempre visibles. Los avisos de red por ficheros no existentes son inofensivos | ✅ Activa desde F7 (música: ≥1 tema; orden aleatorio: F7.1) |
| Regresión visual del juego | Reproducir los comportamientos ya implementados tras cada cambio que toque presentación | Desde F4 |

> Nota (victoria R22): llenar un tablero 40×24 a mano es inviable; para validar la victoria visualmente se pueden ajustar temporalmente `BOARD_COLS`/`BOARD_ROWS` en `config.js` (p. ej. 4×3) — la lógica está probada y automatizada en §1.

## 3. Validaciones pendientes de implementar (declaradas, no existen todavía)

| Validación | Estado | Fase del plan |
|---|---|---|
| Registro de regresión manual en navegador, formalizado | Por definir (checklist de cierre de Fase 5) | 5 |
| Validación de HTML/CSS (p. ej. W3C, si se considera necesaria) | Opción no decidida | 5 |
| Pruebas del bucle de `main.js` | Manual (necesita navegador); la lógica ya está separada y probada en Node | Si se justifica |

## 4. Procedimiento de validación por tipo de cambio

- Cambio solo en módulos lógicos (`logic.js`, `board.js`, `snake.js`, `food.js`, `utils.js`): `npm run check` + `npm test`.
- Cambio en `main.js`, `ui.js`, `index.html`, `style.css`: `npm run check` + `npm test`, más validación manual del navegador (§2).
- Cambio en documentación: sin validaciones de código; comprobar coherencia con los documentos dominantes (auditoría de referencias).

## 5. Estrategia de pruebas de la lógica del juego (a aplicar desde Fase 4)

- Se testea a través del contrato de `logic.js` (`docs/contracts.md`), no de detalles internos, para que los tests NO frenen refactorizaciones legítimas.
- Prioridad de comportamientos (sin coberturas arbitrarias):
  1. Movimiento por celdas y wrap en bordes (R14/R23).
  2. Comer alimento → crecer → puntuación (R16/R18).
  3. Choque con el cuerpo propio → game over (R24/R28).
  4. Celda liberada por la cola en el mismo tick → NO es colisión (R27: colisión solo si dos bloques de la serpiente coexisten en una celda).
  5. Colocación de alimento en celda libre; tablero lleno → victoria (R16/R22).
  6. Comportamiento del input entre ticks: dirección vigente y cambios legales (R20/R21).
- Los casos límite están confirmados y trazados en `docs/requirements.md` (§5 y §7); sin cuestiones abiertas.
- Regresión: toda prueba que pase queda en la suite; los cambios posteriores no la degradan (los tests son minuciosos con los comportamientos críticos ya cubiertos).

## 6. Criterios de aceptación de las validaciones

- Toda tarea cierra con las validaciones de §4 en verde y el resultado reflejado en `memory.md`.
- Si una validación automatizada indicada aquí aún no se ha configurado, el agente lo declara y no la menciona como automatizada.

## 7. Extensiones futuras del harness (decisiones, no de serie)

Si el proyecto creciera y se justificara (ADR nuevo), candidato a valorar: linter ligero y/o verificación de tipos (TypeScript). Hoy: no entran por la regla de cero dependencias. El agente no debe añadirlos unilateralmente.
