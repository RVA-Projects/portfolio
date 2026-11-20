# Registro de decisiones (ADR)

Reglas de este documento:

- Solo se registran decisiones **aprobadas**. Las propuestas pendientes viven en `docs/requirements.md`.
- No se registran decisiones triviales. Cada entrada debe permitir entender en el futuro qué se decidió, por qué y con qué coste.
- Una decisión puede quedar `Superada` por otra posterior; no se borra el historial.

Formato: id · título · Estado · Contexto · Decisión · Justificación · Alternativas consideradas · Consecuencias.

---

## ADR-001 · Stack tecnológico: JavaScript puro, sin build

**Estado:** Aprobada (confirmada por el desarrollador, 2026-10-31).

**Contexto:** Workspace con ficheros web ya creados (`index.html`, `*.js`, `style.css`) para un juego sencillo en navegador. La verificación de tipos, el servidor de desarrollo y el rendimiento a escala no son requisitos.

**Decisión:** HTML + CSS + JavaScript (ES modules). Sin frameworks, sin TypeScript, sin bundler ni herramientas de build. Dependencias de desarrollo: ninguna (harness con el Node.js ya instalado).

**Justificación:** Prioriza simplicidad (R25) y evita dependencias sin justificación; el tamaño del proyecto no compensa ninguna toolchain.

**Alternativas consideradas:**
- TypeScript con Vite: verificación de tipos y HMR, a cambio de dependencias y paso de compilación (rechazada por el desarrollador).

**Consecuencias:**
- Sin verificación de tipos estática; la calidad depende de contratos, pruebas y la disciplina del harness.
- Despliegue equivalente a copiar ficheros.
- Los módulos ES compartidos navegador/Node condicionan la estructura (`"type": "module"`, lógica libre de DOM).

## ADR-002 · Estructura de módulos = ficheros ya existentes

**Estado:** Aprobada; **parcialmente superada por ADR-007** (2026-11-02): la estructura de ficheros se amplió; la adopción de los ficheros originales y la eliminación de `players.json` siguen vigentes.

**Contexto:** El workspace incluía cinco ficheros de código con una separación clara: presentación (`index.html`, `style.css`, `main.js`), lógica (`logic.js`), utilidades (`utils.js`). Había además un `players.json` sin propósito definido.

**Decisión:** Adoptar los ficheros existentes como estructura de módulos del proyecto (responsabilidades y dependencias en `docs/architecture.md`). `players.json` se eliminó a petición del desarrollador: sin propósito definido, no debe inventarse una función.

**Justificación:** Respeta decisiones previas del desarrollador y la estructura encaja con la separación lógica/presentación necesaria para probar lógica en Node.

**Alternativas consideradas:**
- Reorganizar a `src/`: sin valor añadido para cinco ficheros (descartada).
- Mantener `players.json` indefinido: un fichero sin propósito genera expectativas infundadas (descartada).

**Consecuencias:**
- Si los contratos de la Fase 2 no justifican utilidades compartidas, `utils.js` podría quedar vacío o eliminarse (decisión a tomar entonces, no antes).
- Los tests viven en `tests/` (añadida por el harness).

## ADR-003 · Harness mínimo con `node --test` (cero dependencias)

**Estado:** Aprobada.

**Contexto:** Se necesita validación automatizada reproducible sin infraestructura superflua. Node.js v24 está disponible y su runner de pruebas es nativo.

**Decisión:** Harness compuesto por `node --check` (sintaxis de módulos) y `node --test` (smoke test de importabilidad de `logic.js` y `utils.js`), expuestos como scripts `check` y `test` de `package.json`. Sin frameworks de test ni linter adicionales.

**Justificación:** Cero dependencias nuevas, comandos reproducibles y verificación objetiva desde la primera tarea de código. Node garantiza que la lógica es DOM-free (R26).

**Alternativas consideradas:**
- Vitest/Jest: más madurez y DX, a cambio de dependencias y configuración (descartada por ADR-001).
- No montar harness hasta implementar el juego: dejaría las tareas previas sin verificación objetiva (descartada).

**Consecuencias:**
- La lógica del juego, cuando se escriba, se validará con `node:test` sobre `logic.js` (Fase 4).
- La validación del navegador (render, input) es manual (ver `docs/testing.md`).

## ADR-004 · Eliminación de `players.json`

**Estado:** Aprobada (a petición del desarrollador, 2026-10-31).

**Contexto:** `players.json` existía vacío, no correspondía a ningún requisito y sugería una funcionalidad de datos de jugadores no especificada.

**Decisión:** Eliminar el fichero. Los requisitos lo anotan como fuera de alcance (R6) para impedir que cualquier agente restaure implícitamente una funcionalidad de persistencia no solicitada.

**Alternativas consideradas:**
- Mantenerlo «reservado para puntuaciones»: inventaría requisitos y genera expectativas infundadas (descartada).

**Consecuencias:** Si en algún momento se aprueba persistencia, se hará con requisitos propios, ADR y contrato de datos nuevos.

## ADR-005 · Sin repositorio Git por ahora

**Estado:** Superada por ADR-016 (2026-11-04): se aprueba Git y GitHub. Se conserva el historial.

**Contexto:** No existe repositorio en el workspace. Git aportaría control de cambios, historial y capacidad de revertir errores en el desarrollo iterativo.

**Decisión:** No inicializar Git de momento. Las redes de protección en esta etapa son: fuentes de verdad documentales, contratos estables, harness y memoria operativa.

**Alternativas consideradas:**
- `git init` + commit inicial con la estructura actual (descartada por el desarrollador, por ahora).

**Consecuencias:**
- No hay historial ni rollback ante errores. Riesgo asumido por el desarrollador.
- Verificación de accidentalidad extra al sobrescribir ficheros: solo mediante el listado de archivos del plan aprobado.
- Puede revisarse en cualquier momento; si se aprueba Git, bastará `git init` + primer commit.

## ADR-006 · Configuración de OpenCode minimalista

**Estado:** Aprobada.

**Contexto:** OpenCode descubre automáticamente `AGENTS.md` de la raíz. Los documentos especializados deben estar disponibles cuando se necesiten, sin duplicar contenido ni inflar el contexto de cada sesión (§6 de la tarea).

**Decisión:** `opencode.json` en la raíz únicamente con `$schema` e `instructions: ["memory.md", "docs/requirements.md"]`. `AGENTS.md`, además, instruye leer los documentos especializados relacionados con cada tarea. Sin agentes secundarios ni permisos a medida (no hay necesidad real).

**Justificación:** `memory.md` es obligatorio al inicio de cada sesión y `docs/requirements.md` fija el marco de qué se puede hacer y qué no (prevención de requisitos inventados). El resto de documentos se leen bajo demanda, manteniendo el contexto ligero.

**Alternativas consideradas:**
- Cargar todos los documentos como instrucciones: infla el contexto de cada turno con información no relevante a la acción en curso (descartada).
- Agentes secundarios (p. ej. revisor): sin necesidad real hoy (descartada).

**Consecuencias:** Si revisar documentos bajo demanda resultara insuficiente en fases posteriores, pueden añadirse globs adicionales a `instructions`.

## ADR-007 · Estructura modular amplia y punto único de ajuste (`config.js`)

**Estado:** Aprobada (2026-11-02, decisión del desarrollador).

**Contexto:** Los requisitos de UI (overlays, ranking, i18n), persistencia (R33) y la exigencia de código segmentado sin ficheros monolíticos (R36) superan lo razonable en cinco ficheros. ADR-002 limitaba la estructura; además, el desarrollador quiere ajustar a mano canvas y velocidad cambiando solo valores (R26).

**Decisión:** Se permiten todos los ficheros y clases necesarios (módulos ES, clases ligeras de una única responsabilidad). Cada ajuste manual vive como constante nombrada en `config.js`, con comentario exacto de ajuste. `utils.js` conserva helpers compartidos. La lista de ficheros y las reglas de dependencia son fuente de verdad en `docs/architecture.md`.

**Justificación:** Ficheros pequeños = contratos claros, tests enfocados y módulos reutilizables sin clases gigantes. El punto único de ajuste evita valores mágicos dispersos.

**Alternativas consideradas:**
- Mantener cinco ficheros con secciones internas: ficheros grandes, contratos difusos (rechazada).

**Consecuencias:**
- ADR-002 queda parcialmente superada (ver su estado).
- El contrato C-0 se amplía a todos los módulos DOM-free nuevos (ver `docs/contracts.md`).
- Cada fichero nuevo debe incorporarse a `architecture.md` y a los tests de importabilidad al crearse.

## ADR-008 · Persistencia de puntuaciones: adaptador de almacenamiento (localStorage ahora, Firebase después)

**Estado:** Aprobada (2026-11-02, decisión del desarrollador).

**Contexto:** El ranking (R33) guarda todas las partidas (nombre, puntuación, fecha) y debe sobrevivir entre sesiones. La ejecución local por `file://` (R9) no permite escribir ficheros `.json` en disco desde el navegador. El desarrollador quiere poder cambiar a Firebase más adelante sin tocar otras partes del programa. R6 quedó anulada por esta decisión.

**Decisión:** Módulo `storage.js` con una interfaz estable de listar/guardar entradas de ranking, implementada **ahora** con `localStorage`. Los demás módulos dependen solo de la interfaz (contrato C-4), nunca de localStorage directamente.

**Justificación:** Cero dependencias (R8), funciona abriendo el fichero localmente (R9) y aísla el transporte: migrar a Firebase será sustituir el adaptador, sin cambios en UI ni lógica.

**Alternativas consideradas:**
- Fichero `.json` real en disco: requiere servidor local (rompe R9 y añade instalación; descartada por ahora).
- localStorage consumido directo desde `ui.js`/`main.js`: acopla presentación a tecnología y complica la migración (descartada).

**Consecuencias:** Los datos viven por navegador/dispositivo (no sincronizados entre equipos). La huella de datos esenciales queda limitada a nombre, puntuación y fecha.

## ADR-009 · i18n centralizado y conmutable en caliente (ES/EN)

**Estado:** Aprobada (2026-11-02, decisión del desarrollador).

**Contexto:** R31 exige cambiar de idioma en caliente y preparación para futuros idiomas.

**Decisión:** Módulo `i18n.js` con diccionarios por idioma (ES/EN) y una API de texto por clave. Idioma por defecto: español. Ningún texto de interfaz incrustado en módulos de presentación; el cambio reetiqueta la UI en caliente.

**Justificación:** Sencillo, cero dependencias, testable en Node (validación de claves completas en ambas lenguas desde la Fase 4).

**Alternativas consideradas:**
- Textos inline en UI: imposible conmutar en caliente (descartada).
- Librería i18n externa: dependencia sin necesidad para dos idiomas (descartada, R8).

**Consecuencias:** Cada texto nuevo debe registrarse en ambos diccionarios; los tests podrán detectar claves faltantes.

## ADR-010 · Modelo de velocidad: multiplicador lineal del tick base

**Estado:** Aprobada (2026-11-02, decisión del desarrollador).

**Contexto:** El desarrollador fijó velocidad inicial 0.8, normal 1 y máx 1.5, progresiva por comida, sin definir unidades; pidió al agente fijar la semántica.

**Decisión:** El multiplicador escala el tick base: `intervalo = BASE_TICK_MS / multiplicador`. Progresión **lineal +0.02 por alimento** desde 0.8 (normal 1.0 a las 10 comidas, cap 1.5 a las 35). Defaults de `config.js`: `BASE_TICK_MS = 150`, `SPEED_MIN = 0.8`, `SPEED_MAX = 1.5`, `SPEED_STEP = 0.02` (todos ajustables, R26/AC-6).

**Justificación:** Un solo número interpretable; el intervalo resultante se siente adecuadamente (150 ms por celda al inicio; 100 ms en el cap); la fórmula es trivial de testear.

**Alternativas consideradas:**
- Tick fijo con saltos por umbrales de puntuación: progresión brusca (descartada).
- Definir la velocidad directamente en ms por celda: obligaría a recalcular el cap manualmente en cada ajuste (descartada).

**Consecuencias:** A velocidad máxima el intervalo es el 66,7% del base. El caso límite de colisión con la celda liberada por la cola (R27) se decidió aparte (años confirmado en R27, requisitos §7).

## ADR-011 · La victoria también se registra en el ranking

**Estado:** Aprobada (2026-11-02, decisión del desarrollador en la planificación de Fase 4).

**Contexto:** R33 (texto original) solo exigía guardar al terminar «por game over». La victoria por tablero lleno (R22) también termina una partida, y el ranking proclama guardar **todas** las partidas; dejar fuera al jugador perfecto era incoherente.

**Decisión:** Toda partida finalizada —por game over o por victoria— se registra en el ranking (nombre, puntuación, fecha). R33 fue enmendada en `docs/requirements.md` y el contrato C-4 no cambia su interfaz.

**Justificación:** Coherencia con «el ranking guarda todas las partidas»; evita una regla invisible que castigue la mejor jugada.

**Alternativas consideradas:**
- Respetar el literal original (solo game over): incoherente con el propósito del ranking (descartada por el desarrollador).

**Consecuencias:** La pantalla de victoria también dispara `saveScore`; sin efecto en el orden del ranking.

## ADR-012 · Persistencia del nombre del jugador entre sesiones

**Estado:** Aprobada (2026-11-02, decisión del desarrollador en la planificación de Fase 4).

**Contexto:** En Fase 3 quedó abierto: el nombre introducido no sobrevivía a una recarga (cada sesión arrancaba «Jugador», R32). En Fase 4 la decisión del desarrollador persistió.

**Decisión:** `storage.js` guarda el nombre en `localStorage` bajo `'snake.playerName'` vía `savePlayerName(name)` / `loadPlayerName()` (contrato C-4 enmendado). Nombre vacío en el formulario = borrar el guardado; sin nombre guardado, la UI muestra el nombre por defecto de i18n (R32). El nombre vivo de la sesión se usa igualmente al guardar partidas.

**Justificación:** Reescribir el nombre en cada sesión es fricción pura; la clave vive junto al resto de la persistencia (R33/ADR-008) y conserva la interfaz del adaptador para el futuro Firebase.

**Alternativas consideradas:**
- No persistir (estado hasta F4): fricción repetida en cada carga (descartada por el desarrollador).

**Consecuencias:** El nombre es por navegador/dispositivo, como las puntuaciones. Los valores «Jugador»/«Player» jamás se guardan como nombre real: si se queda el vacío, se borra.

## ADR-013 · Audio: síntesis con zzfx vendido + tema por fichero

**Estado:** Aprobada (2026-11-03, decisión del desarrollador dentro de la F6).

**Contexto:** El desarrollador pidió efectos sin cargar muchos `.wav`, generados automáticamente con una herramienta gratuita, con música de fondo por fichero `.wav` (solo mientras la partida corre), mutes separados con persistencia y todo tunable desde `config.js`. (F6.) La regla vigente impedía dependencias de terceros sin ADR (R8/ADR-001).

**Decisión:**
- SFX: librería **ZzFX v1.4.0** (Frank Force, licencia **MIT**) vendida verbatim en `vendor/zzfx.js` (sin build, sin npm, sin modificaciones). Cada efecto (`click`, `food`, `pause`, `resume`, `gameover`) vive como **receta** (arrays de parámetros) en `config.js` §AUDIO — ajustable a mano, incluida la web oficial de diseño de sonidos. Excepción documentada a «cero dependencias».
- Música: `HTMLAudio` en bucle con `MUSIC_FILE` (`assets/audio/theme.wav`, aportado por el desarrollador; faltante ⇒ fallo silencioso). Sonando **solo** con el estado `'running'`; en pausa se detiene y al reanudar retoma la posición; al terminar la partida se reinicia.
- Mutes (`btnMusic`/`btnSfx`) **persistentes** (`snake.audioPrefs`), defaults: ambos activados.
- El tres módulo `audio.js` (uso exclusivo de `main.js`, patrón C-2); la lógica y `ui.js` no conocen el audio.

**Justificación:** zzfx cumple las tres condiciones (gratis/MIT, genera en runtime sin ficheros, recetas editables en config); el tema por fichero es el formato natural del «tema del juego»; la exclusión de `audio.js` del harness Node se arrastra con la excepción ya documentada (usa AudioContext/HTMLAudio).

**Alternativas consideradas:**
- Web Audio artesanal (0 dependencias): más trabajo de afinado con peores resultados (descartada).
- Kenney.nl / freesound (ficheros wav): rompe el requisito «sin cargar muchos .wav» (descartado para sfx; la música sí va por fichero a petición del desarrollador).
- Sintetizar también la música con ZzFXM: el desarrollador quiere aportar su propio tema (descartada).

**Consecuencias:** `vendor/zzfx.js` exige revisión manual si hay actualizaciones upstream (fichero congelado). El audio se valida manualmente en navegador (§2 testing.md): el módulo crea `AudioContext` al importar y es inhabitable en Node.

## ADR-014 · Comida múltiple progresiva (hasta 4, cada 3 s)

**Estado:** Aprobada (2026-11-03, decisión del desarrollador dentro de la F7).

**Contexto:** El desarrollador pidió pasar a un máximo de 4 alimentos en tablero, apareciendo de forma progresiva (no todos a la vez) con un retardo de 3 s calibrable desde `config.js`. La F4 mantenía un único alimento (`food: Cell|null`).

**Decisión:**
- `GameState.comida` pasa a **`foods: Cell[]`** con tope `MAX_FOODS_ON_BOARD` (4, C-5). La partida empieza con 1.
- Nueva función pura `logic.spawnFood(state, rng)` → añade UN alimento en celda libre (sin serpiente ni otros alimentos); no-op fuera de `'running'`, al superar el máximo o sin celda libre (victoria R22). La lógica solo ejecuta la colocación.
- **El ritmo vive en `main.js` (C-2):** temporizador de `FOOD_SPAWN_DELAY_MS` (3000 ms, C-5) desde el arranque/reanudación; en pausa se congela y al reanudar recomienza; al terminar la partida se detiene. La comprobación se hace por tick (la lógica no conoce ms).
- Comer un alimento lo retira y su reposición NO es inmediata: llega por el temporizador progresivo. +1 score por alimento (R18) sin cambiar el cálculo de velocidad.
- Victoria (R22) ahora se detecta por tamaño del cuerpo ≥ celdas del tablero (antes: «sin celda libre para reponer»).

**Consecuencias:** el estado acumula hasta 4 comidas; el render (`ui.js`) itera `state.foods`. El sondeo de spawn tiene granularidad de tick (un spawn como mucho por tick), irrelevante con 3 s de delay ante ticks de ~33–83 ms.

## ADR-015 · Plataforma y audio: flechas, táctil, fullscreen escalado y música multi-tema

**Estado:** Aprobada (2026-11-03, decisión del desarrollador dentro de la F7).

**Contexto:** Cuatro peticiones del desarrollador: (1) jugar también con las flechas del teclado; (2) soporte móvil/tablet con D-pad que no tape el juego y CSS responsive (vertical y horizontal); (3) fullscreen que reescale TODO el contenido al viewport, centrado y sin scrollbar; (4) la música de fondo enlazando todos los temas llamados `theme.wav, theme1.wav, …` con paso suave (crossfade) y vuelta al primero al acabar la lista. El nombre de temas se detecta automáticamente (decisión del desarrollador, descartada la lista manual).

**Decisión:**
- **Flechas (R15 enmendada):** mapeadas al mismo camino `handleDirection` que WASD en `main.js`, con `preventDefault` (nunca scroll de página).
- **D-pad táctil (R40):** 4 botones bajo el canvas (dentro de `.board-area`, fuera del área de juego), visibles SOLO con `@media (hover:none) and (pointer:coarse)`; disparan `handleDirection` vía `pointerdown` (sin retardo táctil); sfx de click como el resto de botones. CSS responsive: canvas `max-width:100%`, toolbar compactada en pantallas estrechas. Las etiquetas de accesibilidad viajan por i18n (C-3).
- **Fullscreen escalado (R34 enmendada):** todo el contenido vive en `#stage`; en fullscreen `main.js` aplica `translate(-50%,-50%) scale(min(vw/W, vh/H)·0.995)` con el bloque anclado al centro del viewport (`body.fullscreen #stage { position: fixed; top: 50%; left: 50% }`): el zoom gira en torno al propio centro del contenido y nada queda cortado en ninguna pantalla ni combinación de zoom del navegador (el margen del 0,5% evita el recorte de 1 px por redondeo). `body.fullscreen` oculta el overflow: sin scrollbar. Los overlays fijos de nombre/ranking viven FUERA de `#stage` (el transform alteraría su posicionamiento `fixed`). *(Corrección post-prueba del desarrollador: el primer intento anclaba arriba y cortaba el título con scale>1.)*
- **Música multi-tema (ampliación de ADR-013):** sondeo POR NOMBRE al primer arranque de música (`theme.wav, theme1.wav …` hasta `MUSIC_MAX_TRACKS`), cacheado de una sola vez; reproducción con dos `<audio>` alternos y crossfade de `MUSIC_FADE_MS`, **en ORDEN ALEATORIO** *(enmienda F7.1, decisión del desarrollador)*: bolsa barajada (Fisher–Yates) sin repetir tema hasta agotar la lista completa; al agotarla se vuelve a barajar (evitando doblar el tema en curso); la bolsa sobrevive entre partidas. Con un solo tema detectado, loop natural. Matiz aceptado: los ficheros inexistentes del sondeo pueden dejar avisos de red inofensivos en consola.
- **SFX más graves (decisión del desarrollador):** las recetas `SFX_RECIPES` se retocaron a la baja en frecuencia (food ~220 Hz, pausa/reanudar ±150 Hz sobre 330 Hz, gameover ~110 Hz, click 392 Hz triángulo). Siguen editables a mano en `config.js`.

**Alternativas consideradas:** lista manual de temas en `config.js` (descartada: escribe el desarrollador lo que la detección automática hace solo); D-pad siempre visible en escritorio (descartado: ruido visual); escala solo hacia abajo en fullscreen (discutido: el zoom también sube para llenar, a costa de una ligera pixelación del canvas).

**Consecuencias:** comportamiento responsivo ligado a CSS moderno (`pointer:coarse`) — navegadores que no lo soporten quedan en escritorio (correcto). El crossfade sobre `<audio>` no es sample-accurate: el empalme depende del buffering del navegador.

## ADR-016 · Repositorio Git + GitHub (`RVA-Projects/snake`)

**Estado:** Aprobada (decisión del desarrollador, 2026-11-04). Supera ADR-005 («sin repositorio Git por ahora», 2026-10-31).

**Contexto:** El juego está completo (F0–F4, F6–F7, 79/79 pruebas en verde) y a la vista de un futuro proyecto aparte (SnakeUp) el desarrollador pidió subir el proyecto al repositorio GitHub ya creado en `https://github.com/RVA-Projects/snake` (repo vacío, sin commits prev). Sin Git, la protección ante errores descansa solo en prudencia de escritura, que deja de ser razonable con esta cantidad de ficheros.

**Decisión:**
- Repositorio git local en la raíz del proyecto, ramificación inicial `main`, remoto `origin` = `https://github.com/RVA-Projects/snake`, subida con `-u origin main`.
- Se incluye TODO el proyecto: código, `docs/` (fuentes de verdad), `AGENTS.md`, `memory.md` (metodología AI-assisted parte del producto, R2), `tests/`, `vendor/zzfx.js` y `assets/audio/`.
- Ignorados vía `.gitignore` solo artefactos locales (`node_modules/`, basura de SO, ficheros temporales de editor).

**Justificación:** Control de cambios, historial y rollback (riesgo asumido por ADR-005 que ahora desaparece). Zero impacto en el stack: git no cambia el runtime ni introduce dependencias.

**Alternativas consideradas:**
- Mantener sin Git: el historial de correcciones (R27, fullscreen F7) evidencia que el rollback falta (descartada por el desarrollador).
- Subir solo código sin `docs/`/`memory.md`: pierde el entorno de aprendizaje metodológico, parte del producto (R2) (descartada).

**Consecuencias:**
- ADR-005 queda superada: a partir de ahora, commits frecuentes y descripciones claras; prudencia solo para reescrituras de historial (nunca hacer force push sin decisión explícita del desarrollador).
- `memory.md` ya no documenta los problemas conocidos como mitigación de la ausencia de rollback.
- Nota histórica: un intento previo dejó una inicialización de git sin commits a nivel del perfil de usuario (`C:\Users\Dovi\.git`, abarcando todo el perfil como archivos candidatos con riesgo de subir ficheros sensibles); eliminada a decisión del desarrollador antes del primer commit del proyecto.
