# memory.md — RVA Portfolio

> Memoria operativa del agente. Actualizar tras cada cambio relevante.
> Última actualización: 2026-11-10 (Fase 5 casi completa — revisión móvil del propietario pendiente).

## Estado actual

- **Fases:** 0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ (F4.4 deploy parcial: falta remoto) · **5 🔶 (F5.1–F5.5 hechas, falta tu revisión en móvil)**.
- **Harness:** `npm run validate` en VERDE (7 tests pasando).
- **Build:** JS 69.39KB gzip / CSS 0.32KB; base `/portfolio/` verificado en `dist/index.html`.

## Decisiones cerradas con el propietario (2026-11-10)

Ver detalle en `docs/decisions.md` (D01–D12). Resumen:

- El nuevo portfolio ocupa el repo del viejo (base `/portfolio/`); el viejo queda en `public/old/` como "Older Portfolio".
- Contacto solo por email (sin formulario EmailJS).
- PDFs: **copia local a `public/docs/`** (opción aprobada); el visor SIEMPRE embebido en DocumentViewerOverlay y debe tolerar fichero ausente con error controlado (no crashea) mientras el propietario los sube.
- Idiomas: Castellano (nativo), Valenciano (C1, cert), Rumano (nativo), Inglés (B2, cert), **Alemán (Starter)** — etiqueta decidida por el propietario.
- Inventario validado por el propietario. contracts.md y architecture.md **revisados y aprobados por el propietario**.
- Español por defecto con detección de navegador; elección manual en localStorage.
- Foto personal: sí (el propietario la pondrá en `public/assets/img/`).
- Especialización: texto estático único y directo (sin rotador).
- Mandato: "apruebo todo, si tienes dudas decide tú, lo puliremos una vez esté completo".

## Funcionalidades implementadas

- **Fase 3:** modelos TS completos (`src/models/`: common con DocumentRef, Technology, Project, Education, Experience, LanguageProfile, ContactLink) + esqueletos tipados de todos los componentes con TODO de fase.
- **Fase 4:** Git + Vite 7 + TS strict + ESLint 9/Prettier + Vitest/jsdom + testing-library; scripts `validate`, workflow `deploy.yml`, README operativo, estilos tokens/base mínimos.
- Tests actuales: smoke test de App (1/1 verde).

## Pendientes del propietario (para Fase 7 y despliegue)

1. Acceso/URL del repo remoto `RVA-Projects/portfolio` (clonar o conectar en F4.1).
2. Copiar PDFs (CV + certificados) — preferible a `public/docs/`.
3. Copiar foto personal a `public/assets/img/`.
4. Subir PDFs a `public/docs/` y la foto a `public/assets/img/` (Fase 7).
5. Contenido es/en definitivo de proyectos (descripción, objetivos, resultados) — se pedirá en F7.1.

## Problemas conocidos

- MiniCRM apuntaba al repo `flashcards` en el site anterior: verificar repo real en F7.
- El contenido EN del site anterior tiene erratas ("develpment"); se reescribirá, no se copiará.
- Animación rotatoria de especialización del site anterior NO se reproduce (D11).

## Últimos cambios

- 2026-11-10 (tarde 2): **Fase 5 (5.1–5.5)** — fuentes + tokens definitivos, componentes base con CSS Modules, TopBar+NavigationMenu funcionales (anclas/Escape/clic-fuera/auto-ocultación/scroll-spy), Introduction con contenido real (3 niveles de tecnología, copiar-email), Footer, Modal con focus-trap, LanguageProvider (D12). Tests 7/7. Build JS 74KB gzip.
- 2026-11-10 (tarde): **Fases 3–4** — modelos TS, esqueletos, Git init (`e31ab2b`), Vite+TS strict+ESLint+Prettier+Vitest, workflow deploy, README. `validate` verde (JS 69KB gzip). D03/D04 actualizadas (PDFs locales + visor tolerante; alemán "Starter"). Fase 5 pendiente.
- 2026-11-10 (mañana): Fases 0–2 — docs de especificación/arquitectura/decisiones + AGENTS.md.

## Próxima tarea recomendada

1. **Revisión del propietario en móvil** de lo hecho (CA de Fase 5): `npm run dev` y comprobar en un móvil real o devtools 375px: menú, contacto, tecnologías, sin overflow horizontal.
2. Después **Fase 6** en orden del plan: datos de proyectos (F6.1) → tarjetas/filtro/carrusel (F6.2) → overlay+galería (F6.3–6.4) → resto de secciones + DocumentViewerOverlay + Canvas.
