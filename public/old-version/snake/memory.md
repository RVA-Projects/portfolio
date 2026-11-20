# Memoria operativa — Snake

> NO es una fuente de verdad: si contradice a un documento especializado, prevalece el especializado. Reglas de uso: mantener conciso, eliminar obsoleto, no convertirlo en historial.

**Última actualización:** 2026-11-04 — repo Git + GitHub creado (ADR-016); F7 cerrada y validada con el harness; F6 cerrada.

## Estado actual

- **Fases 0–4, 6, 7 cerradas** (2026-11-03): F7 añade, a petición del desarrollador sobre su config a mano (64×30, tick 50 ms, speedMin 0.6 — respetada): comida múltiple progresiva (max 4, cada 3 s, ADR-014), flechas del teclado + D-pad táctil (solo `pointer:coarse`) + fullscreen que reescala `#stage` al viewport sin scrollbar (ADR-015), música multi-tema `theme.wav, theme1, …` con crossfade y SFX reafinados a tonos graves.
- **Pendiente la Fase 5** (batería de cierre: ronda manual completa de F6+F7 + revisión documental final; ver `docs/implementation-plan.md`).
- Ficheros: `config.js`, `i18n.js`, `storage.js`, `utils.js`, `board.js`, `snake.js`, `food.js`, `logic.js`, `ui.js`, `main.js`, `audio.js`, `vendor/zzfx.js` (3.º), `assets/audio/` (temas aportados por el desarrollador), `index.html`, `style.css`, `tests/*`.
- **Repositorio Git + GitHub (ADR-016, 2026-11-04):** repo creado a petición del desarrollador en `https://github.com/RVA-Projects/snake` (remoto `origin`, rama `main`). Supera ADR-005; ahora sí hay rollback. *Nota histórica: un intento previo dejó un inicialización de git sin commits a nivel de perfil de usuario (`C:\Users\Dovi\.git`); eliminada a decisión del desarrollador.*
- **SnakeUp (modo incremental): fuera de este plan** — se hará como proyecto aparte desde una copia de este juego cuando el classic cierre (decisión del desarrollador; llegarán requisitos detallados por prompt).

## Funcionalidades implementadas

- Juego completo (F4): movimiento por ticks con wrap, WASD, comida/crecimiento/score, velocidad progresiva (ADR-010), autocolisión con R27, pausa (espacio y botón) con aviso «Pausa» en canvas, game over y victoria en canvas con Enter para reiniciar, ranking con localStorage (todas las partidas, guardadas también en victoria, ADR-011) y nombre del jugador persistente (ADR-012).
- Audio (F6, ADR-013): sfx sintetizados zzfx por recetas de `config.js` (click/food/pause/resume/gameover), click unificado en todos los botones, mutes de música/efectos persistentes.
- Jugabilidad extendida (F7, ADR-014/015): hasta 4 comidas con spawn progresivo cada `FOOD_SPAWN_DELAY_MS` (ritmo en main.js; congelado en pausa), flechas del teclado equivalentes a WASD, D-pad táctil bajo el canvas solo en `pointer:coarse` con CSS responsive, fullscreen con zoom de `#stage` centrado en viewport y sin scrollbar (fix: anclaje fijo + 0,5% margen), música multi-tema por sondeo de nombre con crossfade en orden aleatorio (sin repetir hasta agotar; F7.1) y SFX en tono grave. Overlay de ranking con tope del 70% del alto y scroll en la lista (F7.1).
- Infraestructura (F0–F3): documentación, harness de pruebas (79), config OpenCode, módulos de soporte, estructura UI con overlays/botones/idioma en caliente/fullscreen y render de tablero/serpiente/comida en canvas.

## Decisiones relevantes en vigencia

- Stack JS vanilla sin build (ADR-001); harness node sin dependencias (ADR-003); Git + GitHub en `RVA-Projects/snake` (ADR-016, supera ADR-005); config OpenCode (ADR-006) · **única excepción de dependencia 3.ª: `vendor/zzfx.js` (MIT, vendido; ADR-013)**.
- Estructura modular amplia con `config.js` como punto único de ajuste (ADR-007) · persistencia localStorage tras adaptador, Firebase-ready (ADR-008) · i18n ES/EN en caliente (ADR-009) · velocidad = BASE_TICK_MS / multiplicador lineal +0.02 por comida con SPEED_MIN/MAX de config (ADR-010) · la victoria también guarda en ranking (ADR-011) · nombre del jugador persistente (ADR-012) · audio zzfx + multi-tema con mutes persistentes (ADR-013), extiende a comida múltiple (ADR-014) y plataforma flechas/táctil/fullscreen escalado (ADR-015).
- Reglas clave implementadas: rejilla 40×24 por defecto (desarrollador: **64×30**, celda 20 px); espacio = solo pausa (nunca inicia) y Enter reinicia tras fin; wrap en bordes; muerte solo por autocolisión (la celda que la cola libera en el mismo tick NO mata; al comer la cola no se mueve ese tick); entre ticks gana la última dirección pulsada; tablero lleno = victoria (R22); `speedMult = min(SPEED_MAX, SPEED_MIN + SPEED_STEP·score)`; bucle = setTimeout recursivo en `main.js` (`BASE_TICK_MS / speedMult`); aviso «Pausa» dibujado en canvas (clave `overlayPause`); colores de JUEGO en `config.js` (C-5). Fullscreen F7 = `transform: scale(min(vw/W, vh/H))` sobre `#stage` + clase `body.fullscreen` (overflow oculto). Música F7 = sondeo de nombre en el primer arranque + crossfade vía 2 `<audio>` alternos; colores/labels C-5/C-3 vigentes.

## Problemas conocidos

- Ninguno técnico (79/79 pruebas en verde al cierre de F7). R27 y R22 implementadas y probadas.
- Sí hay repositorio Git (ADR-016) desde 2026-11-04: usar commits frecuentes para trazabilidad.
- Corregido históricamente: script `test` de `node --test` (sintaxis de ruta) → forma sin argumentos.
- Sondeo de temas de música: ficheros inexistentes del intervalo theme1..N dejan avisos de red inofensivos en consola (documentado en ADR-015).

## Validaciones del último cambio

- `npm run check` ✓ (12 ficheros, incl. `vendor/zzfx.js` y `audio.js`) · `npm test` ✓ (79/79, núcleo adaptado a `foods[]` con 5 pruebas nuevas de `spawnFood` y cap de velocidad derivado de config) — cierre de la Fase 7. Pendiente del desarrollador: ronda manual del §2 de `docs/testing.md` (F6 audio + F7 flechas/D-pad/fullscreen/crossfade).

## Próxima tarea recomendada

**Fase 5 (F5.1–F5.3), batería de cierre:** ronda manual completa del desarrollador (audio + F7 incluidos), revisión final de contratos ↔ código y memory sweep. No requiere modo Plan: es verificación, no implementación.

## Nota de arquitectura futura

**SnakeUp** (modo incremental con árbol de habilidades y Firebase): proyecto NUEVO a partir de copiar este classic como plantilla (decisión del desarrollador, 2026-11-03). Fuera de este plan; los requisitos llegarán por prompt cuando toque.
