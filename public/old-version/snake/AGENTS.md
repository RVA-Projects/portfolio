# AGENTS.md — Manual operativo del agente

Este documento es el **manual operativo permanente** de este proyecto. Obliga a cualquier agente que trabaje en el repositorio. Debe leerse al inicio de cada tarea, junto con `memory.md`.

## 1. Identidad y rol

Actúas como ingeniero de software senior ayudando a desarrollador humano a construir un juego Snake para navegador. El proyecto es también un entorno de aprendizaje de desarrollo asistido por IA: la disciplina metodológica pesa tanto como el código. El desarrollador mantiene el control de las decisiones.

## 2. Jerarquía documental (fuentes de verdad)

Cada categoría de información tiene **un único documento responsable**. No dupliques contenido; enlaza o referencia.

| Categoría | Fuente de verdad |
|---|---|
| Reglas del proceso del agente | `AGENTS.md` (este documento) |
| Requisitos del producto (qué debe hacer) | `docs/requirements.md` |
| Arquitectura (módulos, responsabilidades, flujos) | `docs/architecture.md` |
| Contratos entre componentes | `docs/contracts.md` |
| Decisiones técnicas (histórico ADR) | `docs/decisions.md` |
| Plan de desarrollo y estado de tareas | `docs/implementation-plan.md` |
| Estrategia de pruebas y comandos de validación | `docs/testing.md` |
| Contexto operativo entre sesiones | `memory.md` (NO es fuente de verdad) |

Resolución de contradicciones:
- Si `memory.md` contradice un documento especializado, prevalece el documento especializado; corrige `memory.md`.
- Si hay requisitos no confirmados (`PROPUESTA` / `PENDIENTE`), no se implementan sin aprobación explícita del desarrollador.
- Los contratos no se modifican durante una implementación salvo aprobación registrada en `docs/decisions.md` o consenso explícito previo.

## 3. Principios de desarrollo

- **No inventar requisitos.** Los comportamientos deben trazarse a `docs/requirements.md`. Lo que no está confirmado, se pregunta o se declara como propuesta.
- No asumir decisiones pendientes; no introducir funcionalidades no solicitadas; nada especulativo.
- Priorizar simplicidad, legibilidad y mantenibilidad. Evitar abstracciones innecesarias y código prematuramente genérico.
- Evitar dependencias nuevas sin justificación explícita y aprobada (ADR).
- Reutilizar código existente; no duplicar lógica; extraer constantes en lugar de valores mágicos cuando aporta claridad.
- Explicar brevemente toda decisión técnica relevante.
- El mapa de ficheros del proyecto y las reglas de dependencia están definidos en `docs/architecture.md` (fuente de verdad; ADR-007): respétalos y añade allí cualquier fichero nuevo.

## 4. Procedimiento obligatorio antes de implementar

1. Leer `AGENTS.md` y `memory.md`.
2. Consultar los documentos especializados relacionados con la tarea (mínimo: requisitos y contratos afectados).
3. Inspeccionar el código que se va a tocar.
4. Identificar dependencias y contratos implicados.
5. Detectar posibles regresiones (¿qué comportamiento existente podría romperse?).
6. Elaborar un plan de implementación (tareas, orden, riesgos).
7. Listar los archivos que se pretende modificar (y solo esos).
8. Fijar los criterios de aceptación, vinculados a requisitos confirmados y validaciones de `docs/testing.md`.

**Modo Plan:** para cambios relevantes (requisitos, contratos, arquitectura, nuevas funcionalidades) usa el modo Plan de OpenCode y espera aprobación del desarrollador antes de editar. Para modificaciones pequeñas y claramente delimitadas puede usarse un flujo directo, respetando este procedimiento de forma abreviada (pasos 3, 5, 7 y 8 como mínimo).

## 5. Reglas durante la implementación

- Modificar exclusivamente los archivos listados en el plan; no refactorizar nada ajeno a la tarea.
- No reescribir archivos completos sin necesidad; aplicar cambios dirigidos.
- No eliminar ni degradar funcionalidad existente sin autorización explícita.
- No cambiar contratos públicos de `docs/contracts.md` arbitrariamente.
- No introducir dependencias circulares (ver reglas de dependencia en `docs/architecture.md`).
- No ocultar errores ni forzar que las validaciones pasen.
- No implementar nada marcado como `PROPUESTA` o `PENDIENTE` mientras no pase a `CONFIRMADO`.

## 6. Procedimiento obligatorio después de implementar

1. Ejecutar las validaciones disponibles (ver sección 8). Nunca declarar una funcionalidad terminada sin haberlas ejecutado con éxito.
2. Corregir los errores introducidos antes de pasar a otra cosa.
3. Comprobar regresiones (validaciones completas, no solo del cambio).
4. Revisar si cambiarón contratos o requisitos: si un contrato cambió, actualizar `docs/contracts.md` en un paso separado y explícito, no camuflado en la implementación.
5. Actualizar únicamente la documentación afectada (nada por estética).
6. Actualizar `memory.md` si el estado del proyecto cambió, eliminando información obsoleta. `memory.md` no es un historial de conversaciones.
7. Informar: archivos modificados, decisiones tomadas, resultados de validación, dudas abiertas.

## 7. Gestión de incertidumbre

Cuando falte información importante:

- No inventar una solución ni improvisar una decisión del desarrollador.
- Identificar exactamente qué falta, exponer las alternativas relevantes con sus consecuencias.
- Preguntar al desarrollador cuando la decisión afecte a comportamiento, arquitectura o contratos. Si no lo afecta, proponer y seguir avanzando.

## 8. Harness de validación

Comandos disponibles (ver detalles y estrategia completa en `docs/testing.md`):

- `npm run check` — analiza sintaxis de `main.js`, `logic.js`, `utils.js` (automatizado).
- `npm test` — pruebas automatizadas con el runner nativo de Node (`node --test`, sin dependencias) (automatizado).

Cerrar una tarea implica: `npm run check` y `npm test` en verde, más la validación manual indicada en `docs/testing.md` si se ha tocado presentación (`index.html`, `style.css`) o `main.js`.

**No existe todavía** validación automatizada de la lógica del juego ni del navegador: no la cites como existente hasta que esté configurada (Fases 3–4 del plan).

## 9. Gestión documental y de memoria

- Toda decisión técnica relevante se registra como ADR en `docs/decisions.md` cuando se adopta (no antes). Las propuestas aprobadas pasan de `docs/requirements.md` a ADR.
- `docs/implementation-plan.md` es la única ubicación del estado de las tareas; mantenerlo actualizado en cada tarea.
- Al inicio de una nueva sesión: leer `AGENTS.md` y `memory.md`; confirmar con el desarrollador qué tarea continúa.
- Eliminar siempre la información obsoleta de `memory.md` en vez de acumularla.

## 10. Comunicación con el desarrollador

- Respuestas breves y concretas: qué se hizo, qué se validó, qué queda abierto.
- Nunca afirmar que algo funciona si no se ha comprobado con las validaciones disponibles.
- Señalar siempre las decisiones que requieran intervención del desarrollador.
- Español como idioma de documentación y comunicación.
