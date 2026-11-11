# memory.md — RVA Portfolio

> Memoria operativa del agente. Actualizar tras cada cambio relevante.
> Última actualización: 2026-11-11 (F6.6: EducationSection + DocumentViewerOverlay, D16).

## Estado actual

- **Fases:** 0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ (deploy pendiente de remoto) · 5 ✅ (revisión móvil aplazada a post-despliegue, decisión del propietario) · **6 🔶 (F6.1–F6.6 hechas; sigue F6.7 LanguagesSection reutilizando DocumentViewerOverlay)**.
- **Harness:** `npm run validate` en VERDE (72 tests pasando; 1 warning aceptable react-refresh en `src/i18n/index.tsx`).
- **Build:** JS 332.47KB (105.93KB gzip) / CSS 18.60KB; base `/portfolio/` verificada; cero dependencias de runtime (iconos como assets).

## Decisiones cerradas con el propietario (2026-11-10)

Ver detalle en `docs/decisions.md` (D01–D15). Resumen:

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
- **Fase 6 (F6.1–F6.5):** datos de 8 proyectos reales es/en (`src/data/projects/`), catálogo tecnologías 3 niveles; `utils/filter.ts` + `hooks/useCarousel.ts`; TechnologyFilter/ProjectCard/ProjectCarousel/ProjectsSection; **ProjectOverlay** (Modal base + variante `flush`, layout 50/50 desktop, móvil apilado) + **MediaGallery** (miniaturas, prev/next, indicador 1/N aria-live, teclado ←/→ con stopPropagation, YouTube lazy con facade ▶, fallback de media ausente) + navegación prev/next entre proyectos respeta el filtro activo; `utils/media.ts`; ExperienceSection con datos del inventario + ExperienceCard agrupada por kind + i18n `experience`.
  - `year` ahora opcional en `Project` (no se inventan fechas; sync con contracts.md).
- **F6-ajustes (ronda del 2026-11-10, ADRs D13–D15):**
  - **Experiencia reclasificada (D13):** `ExperienceKind` sin `freelance`; 13 entradas en `src/data/experience.ts` (professional ×7 —incluye redes sociales Meta Business Suite y agente IA Echo KB + Gemini API como entradas propias—, independent ×5, collab ×1); fechas reales (`period` acepta `YYYY`|`YYYY-MM`); 2 entradas Upwork con el perfil real enlazado y etiqueta "Perfil de Upwork". Group order: professional → independent → collab.
  - **Snake:** proyecto nuevo `ai-assisted` (categoría "Con IA"/"AI-assisted"), 9 fichas con años reales; MiniCRM con Room; demo `https://rva-projects.github.io/snake/` + repo real. ⚠ Media `snake-cover.png` declarada pero fichero PENDIENTE.
  - **TechIcon (D14):** componente `src/components/base/TechIcon.tsx` con devicon SVG como assets locales (`src/components/base/icons/*.svg` via `import.meta.glob`) + PNGs propios python/unity/xampp en `public/assets/img/icons/`; grid icono+nombre en los 3 niveles de Introduction (deriva del catálogo). `tests/technologies.test.ts` garantiza que toda tecnología tiene icono. Catálogo: core + Python/C#/Java; añadidos room, github.
  - **Flechas flotantes (D15):** prev/next del overlay fuera del panel (slot `aside` nuevo en Modal, focus-trap sobre todo el backdrop; IconButton acepta `className`); ocultas <768px; ←/→ a nivel documento. Cerrar único botón del header.
  - **Chore:** `@types/node` dev-dep (tests con node:fs); `vite/client` en tsconfig types; `oldPortfolio/` fuera de ESLint/Vitest/gitignore; HTML/CSS del catálogo mapeados (`html.svg`/`css.svg` desde html5/css3 de devicon).
- **F6.6 (2026-11-11, D16):** `src/data/education.ts` (11 entradas del inventario §4 con enlaces REALES extraídos de `oldPortfolio/index.html`: 2 Credly, 1 CertView, 6 PDFs OpenWebinars → rutas locales `/portfolio/docs/<slug>.pdf`); `issuer` opcional en `Education` (DAM sin organismo, no se inventa); Java Foundations sin documento; sin fechas/duraciones. `EducationCard` + `EducationSection` (patrón Experience, kicker «04 — Education», grupos official→certification→course, grupos vacíos ocultos) integrada en App tras Experiencia. **DocumentViewerOverlay** sobre `Modal`: iframe embebido, Drive→`/preview` (`googleDriveEmbedUrl` en `utils/media.ts`), timeout 8s/onError ⇒ error controlado con «Abrir en pestaña nueva» + «Descargar» (`Button.download` nuevo). i18n `education.*` + `documentViewer.*` es/en. Tests: `education.test.ts` (integridad+Drive), `education-section.test.tsx`, `document-viewer.test.tsx` (timeout con fake timers + act).

## Pendientes del propietario (para Fase 7 y despliegue)

0. **Captura de Snake:** screenshot real del juego en `https://rva-projects.github.io/snake/` → `public/media/projects/snake/snake-cover.png` (decisión 2026-11-10; la media ya declarada).
1. Acceso/URL del repo remoto `RVA-Projects/portfolio` (clonar o conectar en F4.1).
2. Copiar PDFs (CV + certificados) — preferible a `public/docs/`. Los 6 PDFs de OpenWebinars de formación ya declarados: `react-fundamentals`, `javascript-fundamentals`, `spring-boot-spring-mvc-5`, `python`, `kotlin`, `git` (nombres exactos de fichero).
3. Copiar foto personal a `public/assets/img/`.
4. Subir PDFs a `public/docs/` y la foto a `public/assets/img/` (Fase 7).
5. Contenido es/en definitivo de proyectos (descripción, objetivos, resultados) — se pedirá en F7.1.

## Problemas conocidos

- MiniCRM apuntaba al repo `flashcards` en el site anterior: verificar repo real en F7 (TODO en `mini-crm.ts`).
- El contenido EN del site anterior tiene erratas ("develpment"); se reescribe desde cero, no se copia.
- jsdom no implemente `Element.scrollTo`: stub no-op añadido a `src/test/setup.ts`.
- Los ficheros de media de proyectos (`public/media/projects/<slug>/`) aún no existen (F7): ProjectCard muestra fallback controlado sin crash.
- **`snake-cover.png` pendiente del propietario (decisión 2026-11-10):** captura REAL del juego en `https://rva-projects.github.io/snake/` → `public/media/projects/snake/snake-cover.png` (la media ya está declarada en `snake.ts`; ProjectCard/galería muestran fallback sin crash mientras tanto). Al añadir el fichero, extender `tests/projects.test.ts` con `existsSync` para media local.

## Últimos cambios

- 2026-11-11: **F6.6** — EducationSection + DocumentViewerOverlay (D16): datos desde inventario §4 con enlaces reales, `issuer` opcional, PDFs locales pendientes de subida, visor embebido con error controlado (timeout 8s) y acciones abrir/descargar. Tests 53→72. Pendiente: subir los 6 PDFs a `public/docs/` (F7.3).

- 2026-11-10 (noche 4): **F6-ajustes (commits `35b235e`, `a1f9734`)** — experiencia sin freelance (D13) con fechas reales y Upwork real; Snake como proyecto `ai-assisted` (9 fichas); TechIcon con devicon local + PNGs propios (D14) y grid icono+nombre en Introduction; flechas del overlay flotantes fuera del panel con Modal `aside` (D15). Tests 40→53, build 105.93KB gzip. Pendiente: snake-cover.png.

- 2026-11-10 (noche 3): **Fase 6 (F6.5)** — datos de experiencia del inventario (8 entradas re-clasificadas, sin fechas sin verificar: `period` opcional en modelo+contratos), ExperienceCard + ExperienceSection con agrupación por tipo, claves i18n `experience`, integrada en App tras Proyectos. Inputs del propietario marcados en F7 (fechas; ¿experiencia empleada?). Tests 40/40, build 87.48KB gzip.
- 2026-11-10 (noche 2): **Fase 6 (F6.3–F6.4)** — ProjectOverlay completo sobre Modal base (nueva prop `flush`), MediaGallery con YouTube lazy y fallbacks sin crash, navegación prev/next entre proyectos respetando filtro, teclado por niveles (galería stopPropagation; overlay ←/→), claves i18n nuevas + separación semántica de botones carrusel vs overlay. contracts.md sincronizado (ProjectOverlay/MediaGallery/Modal). Tests 30/30, build 85.32KB gzip.
- 2026-11-10 (noche): **Fase 6 (F6.1–F6.2)** — datos reales es/en de 8 proyectos + catálogo tecnologías; filtro puro (`utils/filter.ts`) + carrusel (`hooks/useCarousel.ts`, scroll-snap nativo sin librerías); TechnologyFilter/ProjectCard (botón a toda tarjeta, fallback de media)/ProjectCarousel/ProjectsSection integrados en App; `.visually-hidden` en base.css; polyfill scrollTo en test setup. Corregidos tokens corruptos en textos es (grep de verificación).
- 2026-11-10 (tarde 2): **Fase 5 (5.1–5.5)** — fuentes + tokens definitivos, componentes base con CSS Modules, TopBar+NavigationMenu funcionales, Introduction, Footer, Modal con focus-trap, LanguageProvider (D12).
- 2026-11-10 (tarde): **Fases 3–4** — modelos TS, esqueletos, Git init (`e31ab2b`), Vite+TS strict+ESLint+Prettier+Vitest, workflow deploy, README. `validate` verde (JS 69KB gzip). D03/D04 actualizadas (PDFs locales + visor tolerante; alemán "Starter"). Fase 5 pendiente.
- 2026-11-10 (mañana): Fases 0–2 — docs de especificación/arquitectura/decisiones + AGENTS.md.

## Próxima tarea recomendada

0. **snake-cover.png:** el propietario aporta captura real (pendiente 0 arriba). Al llegar: verificar que el fichero cae en `public/media/projects/snake/snake-cover.png` y extender `tests/projects.test.ts` con `existsSync` para media local declarada.
1. **F6.7 LanguagesSection** reutilizando `DocumentViewerOverlay` (ya probado): datos de idiomas (Castellano nativo, Valenciano C1 cert, Rumano nativo, Inglés B2 cert, Alemán Starter), `LanguageCard` con botón de documento para los certificados.
2. Después F6.8 Contact → F6.10 Canvas. La revisión móvil se hace post-despliegue.
