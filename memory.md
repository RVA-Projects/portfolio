# memory.md — RVA Portfolio

> Memoria operativa del agente. Actualizar tras cada cambio relevante.
> Última actualización: 2026-11-12 (Fase 1 del plan de actualización: temas claro/oscuro, D18; 92 tests).

## Estado actual

- **Fases:** 0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ (deploy pendiente de remoto) · 5 ✅ (revisión móvil aplazada a post-despliegue, decisión del propietario) · 6 🔶 (F6.1–F6.7 hechas) · **PLAN DE ACTUALIZACIÓN 2026-11 en curso: Fase 1 (temas, D18) ✅ · Fase 2.1 (carrusel) ✅ · Fase 2.2 (filtros) ✅ · Fase 4 (flechas+fullscreen) ✅ · Fase 6 (integración experiencia) ✅ · Fase 5 (rediseño experiencia) ✅ · Fase 3 (visor ampliado/zoom, D21) ✅; sigue Fase 7** (orden aprobado: 1 → 2.1 → 2.2 → 4 → 6 → 5 → 3 → 7).
- **Harness:** `npm run validate` en VERDE (92 tests pasando; 1 warning aceptable react-refresh en `src/i18n/index.tsx`).
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
- **Plan de actualización 2026-11 — Fase 2.1:** `ProjectCard.module.css` — `width` por breakpoint con `calc` sobre el viewport (gap 16px): 1 tarjeta <576px, 2 en 576–1023, 3 ≥1024; sustituye `min(82vw,320px)` que recortaba la 4ª tarjeta. `useCarousel` intacto.
- **Plan de actualización 2026-11 — Fase 3 (D21):** visor ampliado de imágenes. Galería CONTROLADA (`galleryIndex` en ProjectOverlay, se conserva al cerrar la capa); botón lupa SIEMPRE visible en imágenes/gif (`projectOverlay.zoom`); `ImageZoomOverlay` nuevo en el slot `aside` del Modal (no es 2º Modal: dentro del backdrop+focus-trap, sustituye la nav flotante): zoom botones/rueda/pinch 1–4, pan con clamp, swipe >60px a 1:1 cambia imagen, ←/→ fase captura (imagen, no proyecto; listener ←/→ del overlay desactivado con zoom abierto), jerarquía Escape ×2 (1ª capa → overlay, 2ª overlay), X/clic-fuera cierran, foco inicial al close (IconButton → forwardRef). i18n `zoomOverlay.*` es/en. Tests 103→109.
- **Plan de actualización 2026-11 — Fase 5 (D20):** ExperienceCard MINIMALISTA (título+periodo+TechIcon 20px; botón estirado `inset:0` con aria-label `experience.open + name`); `ExperienceOverlay` nuevo sobre Modal (header+bloques, una columna, sin galería/prev-next) con descripción/funciones/logros/tags/enlaces + «Proyectos asociados»; `Experience.projectIds?` con mapeo aprobado (cmV-web/redes/agente-IA→centro-medico-sector-v, signature, loki-home; Upwork sin proyectos); «Ver proyecto» cierra overlay de experiencia y abre ProjectOverlay (estados coordinados en ExperienceSection; sin doble Escape); helper `technologyById` en technologies.ts. Tests 100→103.
- **Plan de actualización 2026-11 — Fase 6:** experiencia = LISTA PLANA de 7 profesionales (D19); eliminadas las 6 entradas independent/collab (snake, mini-crm, flashcards-app, task-manager, gb-utility, dawdam-top — su contenido ya vive íntegro en las fichas de Proyectos; auditoría campo a campo sin datos únicos que fusionar); modelo sin `ExperienceKind`/`kind`; ExperienceSection sin grupos, ExperienceCard sin Tag de kind; i18n sin `experience.groups`. Auditoría: los links de dawdam/flashcards/task/gb/snake y el outcome "En uso diario propio" etc. ya estaban en fichas. Tests 98→100.
- **Plan de actualización 2026-11 — Fase 4:** 4.1 flechas — `className` SIEMPRE con `navPrev`/`navNext` (antes se perdía la clase de posición al deshabilitar y saltaban al centro); deshabilitado solo visual con `:disabled` (ya existía). 4.2 iframe modo juego con `allow="fullscreen"` + `allowFullScreen` (el juego en GitHub Pages necesita que el iframe delegue el permiso). Snake no se toca. Tests 96→98.
- **Plan de actualización 2026-11 — Fase 2.2:** filtros por CATEGORÍA (5 siempre visibles, Java/Python con 0 proyectos hoy): `FilterCategoryId` + `FILTER_CATEGORIES` + `FILTER_CATEGORY_BY_TECH` en `data/technologies.ts` (sqlite/room/git sin categoría — decisión del propietario); `utils/filter.ts` reescrito (puro, por categoría); `TechnologyFilter` props `categories/activeId/onChange` + `FilterCategoryValue`; `ProjectCarousel` muestra «0 proyectos» en estado vacío (ya no retorna null). Tests 92→96.
- **F6.7 (2026-11-12):** `src/data/languages.ts` (5 idiomas D04: castellano nativo, valenciano C1, rumano nativo, inglés B2, alemán starter; sin desglose conversación/escrito — decisión del propietario, nivel único); `LanguageCard` + `LanguagesSection` (grid, kicker «05 — Languages») integrada en App tras Educación; reutiliza `DocumentViewerOverlay` sin cambios. Sin documentos declarados (PDFs valenciano/inglés pendientes F7.3: al subirlos, añadir `document` a los 2 idiomas + existsSync). i18n `languages.*` es/en. Tests 80→88.
- **Plan de actualización 2026-11 — Fase 1 (D18):** temas claro/oscuro. `tokens.css`: `:root` = oscuro; `:root[data-theme='light']` reescribe solo las 12 vars de color (acento #c0212c en claro); tokens nuevos `--color-backdrop`, `--color-media-stage` (oscuro en ambos), `--shadow-overlay` (menú adaptable). Hook `src/hooks/useTheme.ts` (localStorage `rva-portfolio-theme` ?? `prefers-color-scheme`, fallback oscuro con guard); toggle IconSun/IconMoon en TopBar (labels `nav.toLight`/`toDark`); Modal backdrop tokenizado; auditoría de colores hardcoded: #fff sobre acento OK en ambos, SVG devicon OK. Tests 88→92 (`tests/theme.test.tsx`).

## Pendientes del propietario (para Fase 7 y despliegue)

0. ~~Captura de Snake~~ ✅ RESUELTO (2026-11-12): 3 capturas reales en `public/media/projects/snake/`.
1. Acceso/URL del repo remoto `RVA-Projects/portfolio` (clonar o conectar en F4.1).
2. **Foto personal:** pegarla en `public/assets/img/` (F7.4; el nombre lo declara el agente al integrar).
3. Contenido es/en definitivo de proyectos (descripción, objetivos, resultados) — se pedirá en F7.1.
4. **Compresión de media pesada (F7):** lokihome2.png 796KB, mm.png 1.7MB, sig1/sig2 ~500KB (guía <300KB).

## Problemas conocidos

- MiniCRM apuntaba al repo `flashcards` en el site anterior: verificar repo real en F7 (TODO en `mini-crm.ts`).
- El contenido EN del site anterior tiene erratas ("develpment"); se reescribe desde cero, no se copia.
- jsdom no implemente `Element.scrollTo`: stub no-op añadido a `src/test/setup.ts`.
- Los ficheros de media de proyectos ya están integrados y verificados con existsSync (2026-11-12).
- **Media pesada sin comprimir:** `lokihome2.png` 796KB, `mm.png` 1.7MB, `sig1/sig2.png` ~500KB — comprimir en F7 (guía <300KB).
- Los PDFs de los 6 cursos OpenWebinars están en `public/docs/` y verificados con existsSync (2026-11-12). Faltan los certificados de idiomas (valenciano C1, inglés B2) y el CV (F7.3): nombres propuestos `valenciano-c1.pdf` / `english-b2.pdf`.

## Últimos cambios

- 2026-11-12 (9): **Fase 3** — visor ampliado de imágenes (D21): galería controlada, lupa siempre visible, ImageZoomOverlay en slot aside (zoom botones/rueda/pinch, pan, swipe, Escape ×2, índice compartido); IconButton forwardRef; tests 103→109.
- 2026-11-12 (8): **Fase 5** — tarjetas de experiencia minimalistas (título+periodo+TechIcon) + ExperienceOverlay sobre Modal con proyectos asociados («Ver proyecto» abre la ficha del proyecto); `Experience.projectIds` (mapeo aprobado); tests 100→103.
- 2026-11-12 (7): **Fase 6** — experiencia plana (7 profesionales, D19): 6 entradas independent/collab eliminadas (contenido íntegro ya en fichas de Proyectos), modelo sin kind, sección sin grupos, i18n limpio; tests 98→100.
- 2026-11-12 (6): **Fase 4** — flechas del overlay siempre posicionadas (clase navPrev/navNext fija, bug del salto al centro en extremos); iframe del juego con `allow="fullscreen"` + `allowFullScreen`; tests 96→98.
- 2026-11-12 (5): **Fases 2.1 + 2.2** — carrusel con anchos calc (1/2/3 por breakpoint, sin cortes); filtros por categoría (Android/Web/C#/Python/Java, siempre visibles; sqlite/room/git fuera del filtro); estado vacío «0 proyectos» en carrusel; tests 92→96.
- 2026-11-12 (4): **Fase 1 — temas claro/oscuro (D18)** — tokens claro en `tokens.css` (solo vars de color), `useTheme` + toggle en TopBar, Modal backdrop tokenizado, `--color-media-stage`/`--shadow-overlay` nuevos; tests 88→92.

- 2026-11-12 (3): **F6.7 LanguagesSection** — 5 idiomas D04 (niveles únicos, sin desglose), LanguageCard/LanguagesSection reutilizando DocumentViewerOverlay (kicker «05»); sin documentos declarados hasta que el propietario suba los PDFs de Valenciano C1 e Inglés B2 (entonces: `document` + existsSync). Tests 74→88.

- 2026-11-12 (2): **Snake jugable en el overlay (D17)** — `Project.playUrl`; botón «Jugar ahora» en ProjectOverlay (solo snake) con iframe a todo el panel, «Cerrar juego» sin cerrar el overlay, Modal `dismissable` (clic fuera no cierra jugando), Escape cierra solo el juego, ←/→ deshabilitados en modo juego; i18n es/en; `tests/snake-play.test.tsx` (6 tests). Tests 74→80.

- 2026-11-12: **Media + PDFs integrados** — 26 imágenes movidas a `public/media/projects/<slug>/` con renames a los nombres declarados (`dawdam.png`→`coding.png`, `fc.icon.png`→`fcicon.png`); Snake con 3 capturas reales (snake1 portada, alts verificados mirando las imágenes); MiniCRM con mcrm0 como portada (9 capturas); 3 PDFs renombrados a los slugs declarados (`react-fundamentals`, `javascript-fundamentals`, `spring-boot-spring-mvc-5`); tests `existsSync` para toda la media local y los PDFs (74 tests). Pendiente: foto personal, compresión de media pesada.

- 2026-11-11: **F6.6** — EducationSection + DocumentViewerOverlay (D16): datos desde inventario §4 con enlaces reales, `issuer` opcional, PDFs locales pendientes de subida, visor embebido con error controlado (timeout 8s) y acciones abrir/descargar. Tests 53→72. Pendiente: subir los 6 PDFs a `public/docs/` (F7.3).

- 2026-11-10 (noche 4): **F6-ajustes (commits `35b235e`, `a1f9734`)** — experiencia sin freelance (D13) con fechas reales y Upwork real; Snake como proyecto `ai-assisted` (9 fichas); TechIcon con devicon local + PNGs propios (D14) y grid icono+nombre en Introduction; flechas del overlay flotantes fuera del panel con Modal `aside` (D15). Tests 40→53, build 105.93KB gzip. Pendiente: snake-cover.png.

- 2026-11-10 (noche 3): **Fase 6 (F6.5)** — datos de experiencia del inventario (8 entradas re-clasificadas, sin fechas sin verificar: `period` opcional en modelo+contratos), ExperienceCard + ExperienceSection con agrupación por tipo, claves i18n `experience`, integrada en App tras Proyectos. Inputs del propietario marcados en F7 (fechas; ¿experiencia empleada?). Tests 40/40, build 87.48KB gzip.
- 2026-11-10 (noche 2): **Fase 6 (F6.3–F6.4)** — ProjectOverlay completo sobre Modal base (nueva prop `flush`), MediaGallery con YouTube lazy y fallbacks sin crash, navegación prev/next entre proyectos respetando filtro, teclado por niveles (galería stopPropagation; overlay ←/→), claves i18n nuevas + separación semántica de botones carrusel vs overlay. contracts.md sincronizado (ProjectOverlay/MediaGallery/Modal). Tests 30/30, build 85.32KB gzip.
- 2026-11-10 (noche): **Fase 6 (F6.1–F6.2)** — datos reales es/en de 8 proyectos + catálogo tecnologías; filtro puro (`utils/filter.ts`) + carrusel (`hooks/useCarousel.ts`, scroll-snap nativo sin librerías); TechnologyFilter/ProjectCard (botón a toda tarjeta, fallback de media)/ProjectCarousel/ProjectsSection integrados en App; `.visually-hidden` en base.css; polyfill scrollTo en test setup. Corregidos tokens corruptos en textos es (grep de verificación).
- 2026-11-10 (tarde 2): **Fase 5 (5.1–5.5)** — fuentes + tokens definitivos, componentes base con CSS Modules, TopBar+NavigationMenu funcionales, Introduction, Footer, Modal con focus-trap, LanguageProvider (D12).
- 2026-11-10 (tarde): **Fases 3–4** — modelos TS, esqueletos, Git init (`e31ab2b`), Vite+TS strict+ESLint+Prettier+Vitest, workflow deploy, README. `validate` verde (JS 69KB gzip). D03/D04 actualizadas (PDFs locales + visor tolerante; alemán "Starter"). Fase 5 pendiente.
- 2026-11-10 (mañana): Fases 0–2 — docs de especificación/arquitectura/decisiones + AGENTS.md.

## Próxima tarea recomendada

0. **Foto personal:** el propietario la pega en `public/assets/img/` y se integra en la Introduction (F7.4).
1. **F6.7 LanguagesSection** reutilizando `DocumentViewerOverlay` (ya probado): datos de idiomas (Castellano nativo, Valenciano C1 cert, Rumano nativo, Inglés B2 cert, Alemán Starter), `LanguageCard` con botón de documento para los certificados (pendientes los PDFs de valenciano/inglés/CV).
2. Después F6.8 Contact → F6.10 Canvas. La revisión móvil se hace post-despliegue.
