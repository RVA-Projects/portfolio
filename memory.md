# memory.md — RVA Portfolio

> Memoria operativa del agente. Actualizar tras cada cambio relevante.
> Última actualización: 2026-11-10 (F6.1–F6.5 completas — proyectos, experiencia).

## Estado actual

- **Fases:** 0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ (deploy pendiente de remoto) · 5 ✅ (revisión móvil aplazada a post-despliegue, decisión del propietario) · **6 🔶 (F6.1–F6.5 hechas; sigue F6.6 EducationSection + DocumentViewerOverlay)**.
- **Harness:** `npm run validate` en VERDE (40 tests pasando; 1 warning aceptable react-refresh en `src/i18n/index.tsx`).
- **Build:** JS 280.76KB (87.48KB gzip) / CSS 17.63KB; base `/portfolio/` verificada.

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

- **Fase 3:** modelos TS completos (`src/models/`) + esqueletos tipados de todos los componentes.
- **Fase 4:** Git + Vite 7 + TS strict + ESLint 9/Prettier + Vitest/jsdom + testing-library; scripts `validate`, workflow `deploy.yml`, README; estilos tokens/base.
- **Fase 5:** fuentes + tokens, base (Button/Tag/IconButton/SectionHeading/Modal focus-trap), TopBar+NavigationMenu, Introduction, Footer, LanguageProvider (D12).
- **Fase 6 (F6.1–F6.5):** datos de 8 proyectos reales es/en (`src/data/projects/`), catálogo tecnologías 3 niveles; `utils/filter.ts` + `hooks/useCarousel.ts`; TechnologyFilter/ProjectCard/ProjectCarousel/ProjectsSection; **ProjectOverlay** (Modal base + variante `flush`, layout 50/50 desktop, móvil apilado) + **MediaGallery** (miniaturas, prev/next, indicador 1/N aria-live, teclado ←/→ con stopPropagation, YouTube lazy con facade ▶, fallback de media ausente) + navegación prev/next entre proyectos respeta el filtro activo; `utils/media.ts`; **ExperienceSection** con datos del inventario en `src/data/experience.ts` (8 entradas: freelance ×5 incl. 2 de Upwork, collab dawdam, independientes TaskManager/GB-Utility) + ExperienceCard agrupada por kind (grupo _professional_ vacío no se renderiza) + i18n `experience`; `Experience.period` opcional (inventario sin fechas; igual justificación que `Project.year`). Tests 40/40.
  - `year` ahora opcional en `Project` (no se inventan fechas; sync con contracts.md).

## Pendientes del propietario (para Fase 7 y despliegue)

1. Acceso/URL del repo remoto `RVA-Projects/portfolio` (clonar o conectar en F4.1).
2. Copiar PDFs (CV + certificados) — preferible a `public/docs/`.
3. Copiar foto personal a `public/assets/img/`.
4. Subir PDFs a `public/docs/` y la foto a `public/assets/img/` (Fase 7).
5. Contenido es/en definitivo de proyectos (descripción, objetivos, resultados) — se pedirá en F7.1.

## Problemas conocidos

- MiniCRM apuntaba al repo `flashcards` en el site anterior: verificar repo real en F7 (TODO en `mini-crm.ts`).
- El contenido EN del site anterior tiene erratas ("develpment"); se reescribe desde cero, no se copia.
- jsdom no implemente `Element.scrollTo`: stub no-op añadido a `src/test/setup.ts`.
- Los ficheros de media de proyectos (`public/media/projects/<slug>/`) aún no existen (F7): ProjectCard muestra fallback controlado sin crash.

## Últimos cambios

- 2026-11-10 (noche 3): **Fase 6 (F6.5)** — datos de experiencia del inventario (8 entradas re-clasificadas, sin fechas sin verificar: `period` opcional en modelo+contratos), ExperienceCard + ExperienceSection con agrupación por tipo, claves i18n `experience`, integrada en App tras Proyectos. Inputs del propietario marcados en F7 (fechas; ¿experiencia empleada?). Tests 40/40, build 87.48KB gzip.
- 2026-11-10 (noche 2): **Fase 6 (F6.3–F6.4)** — ProjectOverlay completo sobre Modal base (nueva prop `flush`), MediaGallery con YouTube lazy y fallbacks sin crash, navegación prev/next entre proyectos respetando filtro, teclado por niveles (galería stopPropagation; overlay ←/→), claves i18n nuevas + separación semántica de botones carrusel vs overlay. contracts.md sincronizado (ProjectOverlay/MediaGallery/Modal). Tests 30/30, build 85.32KB gzip.
- 2026-11-10 (noche): **Fase 6 (F6.1–F6.2)** — datos reales es/en de 8 proyectos + catálogo tecnologías; filtro puro (`utils/filter.ts`) + carrusel (`hooks/useCarousel.ts`, scroll-snap nativo sin librerías); TechnologyFilter/ProjectCard (botón a toda tarjeta, fallback de media)/ProjectCarousel/ProjectsSection integrados en App; `.visually-hidden` en base.css; polyfill scrollTo en test setup. Corregidos tokens corruptos en textos es (grep de verificación).
- 2026-11-10 (tarde 2): **Fase 5 (5.1–5.5)** — fuentes + tokens definitivos, componentes base con CSS Modules, TopBar+NavigationMenu funcionales, Introduction, Footer, Modal con focus-trap, LanguageProvider (D12).
- 2026-11-10 (tarde): **Fases 3–4** — modelos TS, esqueletos, Git init (`e31ab2b`), Vite+TS strict+ESLint+Prettier+Vitest, workflow deploy, README. `validate` verde (JS 69KB gzip). D03/D04 actualizadas (PDFs locales + visor tolerante; alemán "Starter"). Fase 5 pendiente.
- 2026-11-10 (mañana): Fases 0–2 — docs de especificación/arquitectura/decisiones + AGENTS.md.

## Próxima tarea recomendada

1. **F6.6:** EducationSection + DocumentViewerOverlay (PDF embebido inline, tolerante a fichero ausente — D03) + categorías. Requiere revisar `src/data/education.ts` (pendiente de crear desde inventario §4) y `DocumentRef`.
2. Después F6.7 Languages → F6.8 Contact → F6.10 Canvas. La revisión móvil se hace post-despliegue.
