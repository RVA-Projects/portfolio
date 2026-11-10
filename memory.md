# memory.md — RVA Portfolio

> Memoria operativa del agente. Actualizar tras cada cambio relevante.
> Última actualización: 2026-11-10 (Fases 0–2 cerradas; Fase 3 pendiente de aprobación).

## Estado actual

- **Fases:** 0 ✅ · 1 ✅ · 2 ✅ (pendiente tu revisión) — **Fase 3 (modelos/esqueletos) es la siguiente**.
- **Implementación funcional:** ninguna todavía. Solo documentación y `AGENTS.md`.
- **Git:** no inicializado; se hará en Fase 4.1 (scaffold junto a Vite).
- **Entorno:** Windows · Node v24.22.1 · npm 12.2.1 · VS Code + OpenCode.

## Decisiones cerradas con el propietario (2026-11-10)

Ver detalle en `docs/decisions.md` (D01–D12). Resumen:

- El nuevo portfolio ocupa el repo del viejo (base `/portfolio/`); el viejo queda en `public/old/` como "Older Portfolio".
- Contacto solo por email (sin formulario EmailJS).
- PDFs de certificados/CV: en Drive por ahora, pero se abren SIEMPRE embebidos en DocumentViewerOverlay (no en pestaña nueva). Recomendada copia local a `public/docs/`.
- Idiomas: Castellano (nativo), Valenciano (C1, cert), Rumano (nativo), Inglés (B2, cert), Alemán (inicial).
- Inventario validado por el propietario.
- Español por defecto con detección de navegador; elección manual en localStorage.
- Foto personal: sí (el propietario la pondrá en `assets/img`).
- Especialización: texto estático único y directo (sin rotador).

## Funcionalidades implementadas

- Ninguna. Documentación creada: `AGENTS.md`, `memory.md` y `docs/` (requirements, architecture, contracts, decisions, design-system, testing, implementation-plan, content-inventory).

## Pendientes del propietario (para Fase 7 y despliegue)

1. Acceso/URL del repo remoto `RVA-Projects/portfolio` (clonar o conectar en F4.1).
2. Copiar PDFs (CV + certificados) — preferible a `public/docs/`.
3. Copiar foto personal a `public/assets/img/`.
4. Revisar `docs/decisions.md` D03 (PDFs) y D04 (¿alemán "A1 inicial"?), y `docs/content-inventory.md` si hay cambios.
5. Contenido es/en definitivo de proyectos (descripción, objetivos, resultados) — se pedirá en F7.1.

## Problemas conocidos

- MiniCRM apuntaba al repo `flashcards` en el site anterior: verificar repo real en F7.
- El contenido EN del site anterior tiene erratas ("develpment"); se reescribirá, no se copiará.
- Animación rotatoria de especialización del site anterior NO se reproduce (D11).

## Últimos cambios

- 2026-11-10: Fases 1–2 — creados `AGENTS.md` y docs de especificación/arquitectura/contratos/decisiones/design-system/testing/plan. Corregidos varios tokens corruptos.
- 2026-11-10 (mañana): Fase 0 — `memory.md` + `docs/content-inventory.md`.

## Próxima tarea recomendada

- **Fase 3** (`docs/implementation-plan.md` §F3): `src/models/*.ts` + esqueletos de componentes con props tipadas y TODO. Antes: tu "visto bueno" a `architecture.md` + `contracts.md` (Fase 2). Después Fase 4 (Git + Vite + harness).
