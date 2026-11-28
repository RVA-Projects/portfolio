# memory.md — RVA Portfolio

## Ajustes de Stack y formación (2026-11-28)

- Java y React se clasifican como tecnologías exploradas; Git y VS Code pasan al Stack principal.
- Los encabezados de ambos grupos del Stack se centran y aumentan ligeramente. La descripción complementaria del DAM usa el mismo tamaño que la principal.
- El título de tecnologías del DAM ahora indica que fueron estudiadas durante el ciclo formativo (también actualizado en inglés).
- Decisión registrada en D57. Typecheck y lint correctos (lint mantiene el warning conocido de Fast Refresh); el formato de los archivos de código/documentación modificados pasa al comprobarlo directamente. `format:check` global señala `memory.md` y cuatro archivos sin relación con este cambio. Build correcto tras ejecutar fuera del sandbox (esbuild no podía leer el directorio padre bajo el sandbox). No se ejecutaron tests.

## Despliegue GitHub Pages (2026-11-24)

- El workflow solo escuchaba `main`, por lo que los cambios de `redesign` no generaban un despliegue. Si Pages publica una rama, el sitio recibiría código fuente en vez de la SPA compilada.
- `deploy.yml` ahora escucha `redesign`, instala con `npm ci`, compila con `npm run build` y sube únicamente `dist/` mediante las acciones oficiales de Pages. Permisos: `contents: read`, `pages: write`, `id-token: write`.
- Vite conserva `base: '/portfolio/'`. El favicon usa `%BASE_URL%`; Vite reemplaza la entrada `/src/main.tsx` con bundles bajo `/portfolio/assets/` durante build. El PNG de `public/media/projects/favicon.png` se copia a `dist/`.
- Pendiente en GitHub: Settings → Pages → Build and deployment → Source = **GitHub Actions**. El resultado remoto se confirmará en Actions tras el push.

## Ajuste visual (2026-11-24)

- Nombre del hero en una línea en pantallas mayores de 575px; en móvil puede partirse según el ancho disponible.
- Kicker de secciones muestra `- NN` en lugar de `INDEX / NN`, independientemente del idioma.
- Publicación preparada en `redesign`, basada en el estado que coincide con `origin/main`; `npm run validate` completó typecheck, lint, formato, 187 tests y build. Se ejecutó con permisos ampliados porque esbuild no podía leer un directorio padre bajo el sandbox.

## Rediseño visual Studio (2026-11-24)

- Se establece una nueva identidad editorial técnica: tinta y papel para los temas, acento naranja, DM Serif Display/DM Sans/DM Mono, hero tipográfica y secciones con reglas; se conserva Canvas, contenido, accesibilidad y controles.
- La composición elimina paneles uniformes; proyectos y experiencia mantienen sus carruseles y acciones, educación mantiene sus vistas, y la navegación/overlays siguen intactos.
- El perfil declara ahora “Desarrollador Full Stack / Full Stack Developer”, coherente con la descripción existente.
- Hallmark: `theme.mjs deal` comparó tres direcciones y `sloplint --before` hizo auditoría estática. No se pudo ejecutar su tier de navegador por falta de `puppeteer-core`; la revisión del render se hizo con Playwright. Unslop se investigó y es incompatible con este proyecto CSS nativo (su alcance es React+Tailwind). Better Interface: se aplicaron sus criterios de layout, tipografía, color, accesibilidad, escritura visual, movimiento y acabado.
- Validación final: `npm run validate` (typecheck, lint, formato, 187 tests y build) correcta; Playwright 18/18. Matriz de navegador verificada: 16 combinaciones de 375/768/1024/1440px, ambos temas e idiomas, sin overflow; el Clicker queda centrado en móvil. Warning preexistente de Fast Refresh y mensajes conocidos de Canvas/jsdom siguen en lint/tests.
- Se actualizaron pruebas que aún dependían del orden anterior y del indicador 1/N retirado; los datos y el comportamiento de colecciones no cambiaron.

## Cambio local (2026-11-24)

- Clicker: se oculta el cero durante la carga del total; las lecturas no exitosas no se toman como valor. El SSE descarta la instantánea en cada apertura/reconexión, ignora valores repetidos/anteriores por reconciliación monotónica y los hits propios ya no activan el pulso verde. Cada pulsación sigue generando un único `/hit`. En móvil el control queda centrado; escritorio conserva alineación.
- Pruebas Clicker: 10/10 del hook y 4/4 de integración correctas; Playwright 2/2 (recargas/hits simulados y alineación móvil/escritorio). TypeScript, ESLint y Prettier correctos; build correcto. En la suite completa, 6 aserciones anteriores siguen esperando el orden previo de Educación/Idiomas y el indicador de posición de Proyectos.

- Se eliminaron los indicadores de posición inferiores de los carruseles de Proyectos y Experiencia; se conservan recuentos de resultados, flechas, teclado y desplazamiento. El hook deja de exponer el total redundante.
- El fondo conserva sus eventos de partículas y descarta selecciones nuevas provocadas por clics cortos sobre texto no interactivo; los arrastres de selección y controles se preservan.
- Formación e Idiomas se ordenan por nombre visible dentro de sus grupos/listas según el idioma activo. Tecnologías de tarjetas, fichas y experiencias usan orden natural A–Z. El Stack mantiene su jerarquía y secuencia ordenada.
- Validación: typecheck, ESLint y Prettier correctos (permanece el warning conocido de Fast Refresh). Vitest y build no arrancan en este entorno porque esbuild no puede leer `../../..` al resolver `vite.config.ts` (`Access is denied`).

> Memoria operativa del agente. Actualizar tras cada cambio relevante.
> Última actualización: 2026-11-19 (D52: años de experiencia e iconos del Stack).

## Cambio local (2026-11-21, D55)

- Responsive de overlays en móvil: texto al 80%, ajuste de palabras y anchos acotados, medios limitados al contenedor y acciones más compactas preservando targets táctiles de 44px.
- Visor PDF móvil permanece embebido en el overlay y ocupa hasta 82dvh para aprovechar el visor PDF del navegador y sus gestos de zoom.
- Stack: Git pasa a tecnologías experimentadas; Google Gemini queda como tecnología de proyecto sin mostrarse en los grids. Móvil/tablet usa cuatro columnas con icono superior y nombre centrado.
- Se actualizaron `docs/contracts.md` y `docs/decisions.md`. Sin pruebas ejecutadas en esta ronda.

## Cambio local (2026-11-21, D56)

- Stack muestra el logo sobre el nombre en escritorio y móvil; flex-wrap centra filas incompletas. Cinco elementos por fila desde escritorio y cuatro hasta tablet.
- Tarjetas de formación centran nombre, emisor, descripción y acción; el botón queda limitado al ancho de la tarjeta.
- Contratos y decisiones actualizados. `npm run validate` correcta: typecheck, lint, formato, 185 pruebas y build; persisten el warning conocido de Fast Refresh y el stderr de Canvas/jsdom.

## Cambio operativo (2026-11-20)

- Favicon actualizado al PNG existente `public/media/projects/favicon.png`.
- El sitio histórico se sirve desde `public/old-version/`; el enlace del footer apunta a `/portfolio/old-version/`.
- `oldPortfolio/` sigue ignorada por Git y se usa como fuente local; la copia publicada está bajo `public/` para incluirla en el artefacto de Pages.
- Publicado en `RVA-Projects/portfolio` el 2026-11-20. El merge `63d8936` integra el historial previo (commit padre `33b040d`) y el release nuevo; Actions y Pages completados con éxito. Respuestas HTTP 200 en `/portfolio/`, `/portfolio/old-version/` y el favicon PNG.

## Cambio local (2026-11-21)

- D53: catálogo corrige `OpenCoDEX` a `OpenCode`; Codex y OpenCode muestran logos acordes al tema desde assets locales. Codex usa el mismo logo azul en ambos temas; OpenCode usa sus variantes claro/oscuro. Copias exactas de los tres logos presentes en `public/media/projects/` organizadas en `public/assets/img/icons/`.
- Formación ofrece selector Lista/Tarjetas (predeterminada), preservando `EducationRow` para Lista y añadiendo `EducationCard` compacta con todos los mismos datos, enlaces y visor; cuadrícula móvil 2, tablet 3 y escritorio 5 columnas. i18n es/en y contratos actualizados.
- Ajuste solicitado: selector visual de Formación usa iconos de cuadrícula/lista con nombres accesibles ocultos visualmente.
- Validación: `npm run validate` (typecheck, lint, formato, 180 tests y build) correcta; aviso de Fast Refresh existente y stderr conocido de Canvas/jsdom en tests.

## Estado actual

- **Fases:** 0 ✅ · 1 ✅ · 2 ✅ · 3 ✅ · 4 ✅ (deploy pendiente de remoto) · 5 ✅ (revisión móvil aplazada a post-despliegue, decisión del propietario) · 6 🔶 (F6.1–F6.7 hechas) · **PLAN DE ACTUALIZACIÓN 2026-11 en curso: Fase 1 (temas, D18) ✅ · Fase 2.1 (carrusel) ✅ · Fase 2.2 (filtros) ✅ · Fase 4 (flechas+fullscreen) ✅ · Fase 6 (integración experiencia) ✅ · Fase 5 (rediseño experiencia) ✅ · Fase 3 (visor ampliado/zoom, D21) ✅ · Fase 7 (menú compacto + grid tecnologías, D22) ✅ · Fase 8 (e2e Playwright) ✅ · D23 (fondo animado de puntos) ✅ · **D24 (clicker + tooltips + tags sólidos) ✅**.
- **Harness:** `npm run validate` en VERDE (179 tests; 1 warning react-refresh conocido en `src/i18n/index.tsx`). Playwright 16/16, incluido hover en iconos monocromos en ambos temas y responsive 375/768/1024/1440.
- **Build:** JS 375.10KB (120.68KB gzip) / CSS 33.11KB; base `/portfolio/` verificada; cero dependencias de runtime (iconos como assets).

## Decisiones cerradas con el propietario (2026-11-10)

Ver detalle en `docs/decisions.md` (D01–D15). Resumen:

- El nuevo portfolio ocupa el repo del viejo (base `/portfolio/`); el viejo queda en `public/old/` como "Older Portfolio".
- Contacto solo por email (sin formulario EmailJS).
- PDFs: **copia local a `public/docs/`** (opción aprobada); el visor SIEMPRE embebido en DocumentViewerOverlay y debe tolerar fichero ausente con error controlado (no crashea) mientras el propietario los sube.
- Idiomas: Castellano (nativo), Valenciano (C1, cert), Rumano (nativo), Inglés (B2, cert), **Alemán (Starter)** — etiqueta decidida por el propietario.
- Inventario validado por el propietario. contracts.md y architecture.md **revisados y aprobados por el propietario**.
- Español por defecto con detección de navegador; elección manual en localStorage.
- ~~Foto personal~~ — RETIRADA (2026-11-13): D10 cancelada, sin foto en el portfolio.
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
- **Plan de actualización 2026-11 — Fase 7 (D22):** 7.1 TopBar SIEMPRE accesible: `topbar--hidden` eliminado → `topbar--compact` (pastilla flotante translúcida + blur + sombra al deslizar abajo; `useMenuVisibility` alterna normal↔compacta; con menú abierto no se compacta). 7.2 grid tecnologías más grande y jerárquico: minmax 150→200px (≥768), gap mayor, texto `--fs-body` pleno, iconos 28→32px vía `--tech-icon-size`. Tests 109→114 (navigation +3, intro-tech nuevo ×2).
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
2. ~~Foto personal~~ — RETIRADA (2026-11-13, D10 cancelada).
3. Contenido es/en definitivo de proyectos (descripción, objetivos, resultados) — se pedirá en F7.1.
4. ~~Compresión de media pesada~~ ✅ RESUELTO (2026-11-13): los 4 PNG grandes convertidos a WebP q82 con ffmpeg (mm 1728→97KB, lokihome2 796→57KB, sig1 484→101KB, sig2 524→119KB; media total 5.0MB→1.9MB) y referencias actualizadas.

## Problemas conocidos

- MiniCRM apuntaba al repo `flashcards` en el site anterior: verificar repo real en F7 (TODO en `mini-crm.ts`).
- El contenido EN del site anterior tiene erratas ("develpment"); se reescribe desde cero, no se copia.
- jsdom no implemente `Element.scrollTo`: stub no-op añadido a `src/test/setup.ts`.
- Los ficheros de media de proyectos ya están integrados y verificados con existsSync (2026-11-12).
- **Media pesada sin comprimir:** `lokihome2.png` 796KB, `mm.png` 1.7MB, `sig1/sig2.png` ~500KB — comprimir en F7 (guía <300KB).
- Los PDFs de los 6 cursos OpenWebinars están en `public/docs/` y verificados con existsSync (2026-11-12). Faltan los certificados de idiomas (valenciano C1, inglés B2) y el CV (F7.3): nombres propuestos `valenciano-c1.pdf` / `english-b2.pdf`.

## Últimos cambios

- 2026-11-19: **D52 — años puntuales y ajuste del Stack** — las experiencias muestran solo el año confirmado (sin «Actualidad»); Stack principal y tecnologías experimentadas ordenadas alfabéticamente; OpenCoDEX en principal y Codex en experimentadas; zoom hover unificado en raíces `<img>` y máscaras. `npm run validate`: 180 tests y build correctos; Playwright 16/16, incluidos hover en ambos temas y los cuatro viewports.
- 2026-11-19: **D51 — jerarquía descriptiva de Experiencia** — `role` obligatorio como título y `organization` como subtítulo en tarjetas y overlays; copy profesional es/en para las 7 entradas; catálogo e iconos SVG locales de Meta Business Suite y Google Gemini; validación completa: `npm run validate` (178 pruebas) y Playwright 15/15.
- 2026-11-17 (5): **D50 Upwork en la Hero + CV en el visor de documentos (ronda 7)** — `site.upwork` + `IconUpwork` (simple-icons) + `Button` externo tras LinkedIn; `site.cvDocument: DocumentRef` y `CaptchaPuzzleOverlay.onOpenCv`: el éxito abre el `DocumentViewerOverlay` de Introduction (patrón EducationSection) y CIERRA el captcha (sin doble modal); copys a «Ver CV» (pill + éxito); la descarga sigue disponible dentro del visor; 176 unitarios + validate ✓; diag e2e (borrado): fila completa 1440/375, traspaso captcha→visor, nota headless sin visor PDF (iframe validado por src).
- 2026-11-17 (4): **Ronda 6 completa — F4 validación final** — suite e2e 15/15 (webServer build+preview); capturas fullPage 1440 oscuro/claro (carrusel experiencia 3 visibles 1/7, botón CV en quickLinks) + 375 oscuro/claro (sin overflow asertado); 174 unitarios + validate ✓. Estado: ronda 6 cerrada (D47-D49).
- 2026-11-17 (3): **D49 CAPTCHA puzzle del CV (ronda 6 F3)** — lógica pura `utils/captcha.ts` (mulberry32, hueco ∈ [15%,85%], tolerancia ±10px) + `CaptchaPuzzleOverlay` sobre `Modal` (Canvas 2D 320×180, patrón determinista, pieza en % alineada a cualquier escala, slider ratón+táctil+teclado, éxito⇒snap+glow+descarga, fallo⇒shake+retry); `Modal` gana prop `className` (panel 420px); i18n `captcha.*`; 174 unitarios + validate ✓; diag e2e (borrado) verificó fallo/retry/éxito/tema claro/móvil. **Limitación D49 (aprobada, Alternativa A): validación local, NO protege el PDF de acceso directo a `/portfolio/docs/cv.pdf`.**
- 2026-11-17 (2): **D48 Botón CV en la Hero (ronda 6 F2)** — pill 44px con `IconButton` reutilizado (etiqueta «CV» mono como el selector ES/EN de la TopBar, tooltip D24 `intro.cvTooltip` «Descargar CV»); orden email → CV → GitHub → LinkedIn; NO descarga directo: placeholder de click para el CAPTCHA (F3); 3 tests nuevos (cv-button: presencia, orden, no-enlace); 160 unitarios + validate ✓.
- 2026-11-17 (1): **D47 Experiencia en carrusel (ronda 6 F1)** — `ExperienceCarousel` reutiliza `useCarousel` + `ProjectCarousel.module.css` (import, sin duplicar CSS); `ExperienceCard` con anchos por breakpoint de `ProjectCard` (1/2/3 visibles); `ExperienceOverlay` con prev/next sin cerrar (flechas SIEMPRE visibles en header — en móvil no hay swipe de galería que las sustituya — + ←/→ a nivel documento); grid `.cards` eliminado; 157 unitarios + validate ✓.
- 2026-11-16 (10): **Ronda 5 completa — F4 validación final** — 18/18 e2e (15 suite + 3 de verificación F4, spec temporal borrado): nav por las 5 anclas con encabezados nunca bajo la barra (boundingBox verificado), sin hamburguesa ni `#contact`, contactos de la Hero con href correctos, tema persiste tras recarga e idioma persiste en localStorage; capturas 1440 claro/oscuro + 768 + 375 sin overflow y controles nunca cortados; 153 unitarios + validate ✓. Estado: ronda 5 cerrada (D44-D46).
- 2026-11-16 (9): **D46 Sin sección Contacto; «Sobre mí» (ronda 5 F3)** — borrados `ContactSection.tsx` (stub sin importar) y `models/ContactLink.ts`; `'contact'` fuera de `SectionId` y de i18n es/en; sección 1 renombrada es «Sobre mí» / en «About me» (`sections.intro`, id `'intro'` intacto); contactos de la Hero sin tocar; contracts −sección Contacto (renumerado), architecture.md sync; 153 unitarios + validate ✓.
- 2026-11-16 (8): **D45 Navegación horizontal permanente (ronda 5 F2)** — fuera hamburguesa, `NavigationMenu`, `useMenuVisibility`, `useDisclosure` y keys `nav.open/close`; `TopBar` fija siempre visible con nav `SECTIONS` a la izquierda (anclas + aria-current) y tema/idioma a la derecha; móvil con scroll interno auto-alineado; token `--topbar-h` + `scroll-margin-top`/`main` padding en base.css; `'contact'` fuera de `SECTIONS` (eliminación completa en F3); 153 unitarios + validate ✓.
- 2026-11-16 (7): **D44 Formación en tarjeta translúcida (ronda 5 F1)** — `EducationSection` adopta EXACTAMENTE el tratamiento de Hero/Stack (D-A: `--color-hero` + `--color-line` + `radius-lg`, mismo ancho; sin blur, como ellas). Filas/listas/enlaces intactos; capturas 1440 claro/oscuro + 375 sin overflow; 155 unitarios + validate ✓.

- 2026-11-16 (6): **D43 idiomas en fila compacta (ronda 4 F5)** — grid de LanguagesSection: 5 columnas en escritorio (una línea, homogéneas), 2 en móvil/tablet; LanguageCard compacto (padding/título reducidos, certificado anclado abajo sin determinar el tamaño). Capturas 1440 claro/oscuro + 768 + 375 sin overflow; 155 unitarios + validate ✓.

- 2026-11-16 (5): **D42 acreditaciones externas en pestaña nueva (ronda 4 F4)** — `DocumentRef.kind: 'pdf' \| 'external'` OBLIGATORIO (decisión por tipo de recurso, no por categoría): badges Credly ×2 + Oracle CertView → `external` (Button `href`+`external`, pestaña nueva con `rel=noopener noreferrer`; ya no fallan en el iframe); 6 PDFs OpenWebinars + 2 de idiomas → `pdf` (visor overlay intacto). EducationRow/LanguageCard eligen por kind. 155 unitarios (re-focalizado fixture del visor a PDF); diag e2e real: badge abre popup y overlay queda cerrado.

- 2026-11-16 (4): **D41 formación en lista vertical (ronda 4 F3)** — `EducationCard` → `EducationRow`: filas a ancho completo con separadores (acción a la derecha, emisor en mono versalitas); grid 1/2/3 columnas fuera. DAM destacado con `issuer: 'ILERNA'` (dato aportado por el propietario, test actualizado) y título mayor. Certificaciones Cisco/Pearson/Oracle con firma profesional; cursos OpenWebinars intactos. Capturas 1440 claro/oscuro + 375 ✓; 153 unitarios + validate ✓.

- 2026-11-16 (3): **D40 visuales Hero/Stack (ronda 4 F2)** — 2.1: caja del email `fit-content` (email+botón próximos, botón pegado al borde derecho, hint bloqueado reserva el mismo ancho en `ch`: sin huecos ni saltos); 2.2: título Stack y de grupos a la IZQUIERDA (grids siguen centrados); 2.3: Stack envuelto en tarjeta translúcida idéntica a la Hero (`--color-hero`+`--color-line`+`radius-lg`, tokens directos). Capturas verificadas 1440/375 en claro y oscuro; 153 unitarios + validate ✓.

- 2026-11-16 (2): **D39 orientación Full Stack** — `site.description` deja de decir «Foco en frontend»: ahora transmite enfoque Full Stack (interfaces + UX y también lógica/sistemas). Título y roleNote intactos; sin atribuirte tecnologías no respaldadas.

- 2026-11-16 (1): **D38.1 fix carrera + stream en vivo** — el bug del contador («se resetea al cambiar de tema y refrescar, luego se recupera acumulado») era una carrera: el GET inicial desfasado tapaba los clicks optimistas hechos durante la carga. Fix: reconciliación por máximo + `cache: no-store` + `keepalive` en hits. ADEMÁS: stream SSE en vivo — los clicks de otros visitantes aparecen al instante con pista de ~4s («¡Otros visitantes están acumulando clicks!» + pulso). 153 unitarios (8 del contador); verificado e2e real (hit externo → página sube en vivo). Contador reseteado a 0 para la publicación.

- 2026-11-13 (18): **D38 Clicker global** — el contador acumula los clicks de TODAS las visitas vía Abacus (sin clave/registro): lectura del total al montar, click optimista + hit fire-and-forget, persistente entre deploys (clave `rva-portfolio/clicker` vive en el servicio); tooltip «Recuento de clicks» (nativo + sr-only); degradación elegante sin servicio. 149 unitarios (4 nuevos) + guard de red en setup; verificado e2e contra el servicio real (carga → click → recarga persiste). Admin key del contador entregada al propietario (fuera del repo).

- 2026-11-13 (17): **Fix alineación + cursor** — GitHub/LinkedIn/Clicker alineados con la fila de la caja del email (`.quickLinks` flex-start, antes centrados respecto al bloque caja+slider); cursor del slider `grab`/`grabbing` (adiós a la flecha bidireccional). Verificado con screenshots (1440 + 375px, sin overflow) y `getComputedStyle` = grab.

- 2026-11-13 (16): **F6 RVA Portfolio desde el footer** — ficha especial del propio portfolio (fuera del catálogo): metodología IA, atribución honesta, captura real como media; footer pulsable con subrayado punteado reutilizando ProjectOverlay sin prev/next. 145 unitarios + 15 e2e.

- 2026-11-13 (15): **F5 selector ES/EN** — botón junto al de tema (etiqueta del idioma activo, alterna y persiste); la infraestructura i18n ya existía (D12), sin traducir nada. 140 unitarios (2 nuevos).

- 2026-11-13 (14): **F4 numeración y encabezados** — Hero = sección 0 sin número; kickers renumerados (Proyectos 01, Stack 02, Experiencia 03, Formación 04, Idiomas 05) y SOLO número (adiós al nombre hardcodeado en inglés duplicado bajo el título español). `SectionHeading` con prop `index`.

- 2026-11-13 (13): **F3 Hero como tarjeta** — la intro es una superficie translúcida uniforme (token `--color-hero`) en vez del scrim radial irregular; la descripción usa el ancho completo. 138 unitarios; verificado en ambos temas y móvil.

- 2026-11-13 (12): **F2 contacto Hero rediseñado** — EmailReveal con caja única de tamaño estable en ambos estados (email + copiar dentro, al borde derecho), slider debajo como elemento independiente, indicador verde de completado (nuevo token `--color-ok` + `IconCheck`); GitHub/LinkedIn con contenedor siempre visible (adiós al ghost). 138 unitarios; verificado en ambos temas y móvil.

- 2026-11-13 (11): **F1 visor de imágenes** — fix de las flechas del visor ampliado: el `pointerdown` sobre controles (flechas/lupa/X) burbujeaba a la capa, que capturaba el puntero y el `click` resultante se retargetizaba al contenedor → se interpretaba como «clic fuera» y cerraba (D32); ahora los controles se excluyen de la captura y navegan. Lupa con fondo sólido (`--color-surface` + borde) visible en ambos temas. Test de regresión añadido (138 unitarios); verificado con click real en Playwright (navega 1↔2 sin cerrar) en ambos temas.

- 2026-11-13 (10): **Certificados + compresión + foto retirada** — PDFs de valenciano C1 e inglés B2 (`public/docs/`, subidos por el propietario) conectados a LanguagesSection (`DocumentRef { src, name: {es,en} }`, D03); media comprimida (4 PNG grandes → WebP q82 con ffmpeg, 5.0→1.9MB, refs a `.webp`); D10 cancelada (sin foto personal) y docs sync. Fix de crash: los datos de idiomas declaraban `title`/`id` en vez de la forma del modelo `DocumentRef` (`name`) → TypeError en blanco al abrir el visor; añadido test de apertura para no volver a pasar inadvertido. Tests: 137 unitarios + 15 e2e.

- 2026-11-13 (9): **Ronda 2 · D31** — puntos del fondo animado redondos (arc en vez de fillRect, animado y estático, batching conservado); tests de canvas actualizados; 136 unitarios + 15 e2e.

- 2026-11-13 (8): **Ronda 2 · pulido visual** — scrollbar moderna global (fina, thumb flotante, hover acento) y punto lupa (D30): halo translúcido del acento que sigue al cursor con inercia, glow neón al pulsar, DETRÁS del texto; oculto en táctil/reduced-motion; tokens --color-spot*; 136 unitarios + 15 e2e.

- 2026-11-13 (7): **Ronda 2 · F5** — nueva paleta del modo claro (D29): neutros fríos + acento azul #0a66c2, overlays sin tinte cálido, partículas pizarra rgb(63,78,92); modo oscuro intacto; verificado con screenshots ambos temas y overlay.
- 2026-11-13 (6): **Ronda 2 · F4** — iconos de marca adaptables (D28): github/unity/wordpress/mysql como silueta `mask+currentColor`; eclipse/visual-studio/sqlite/csharp aclarados solo en oscuro; verificado en screenshots de ambos temas.
- 2026-11-13 (5): **Ronda 2 · F2+F3** — contacto: EmailReveal (slider + copia, email codificado XOR, sin plaintext ni mailto en bundle) y clicker circular con diana; stack: TechStackSection centrada tras Proyectos (tiers core/explored, TypeScript fuera, Kotlin en core), kickers renumerados; 133 unitarios + 15 e2e verdes.
- 2026-11-13 (4): **Ronda 2 · F1 — presentación y jerarquía**: padding superior de la intro reducido (nombre sube: y≈90px en 1440, 70px en 375); título profesional «Desarrollador de software» + línea secundaria mono «Perfil junior» (fuera del título y de la descripción, D25); description sin «junior».

- 2026-11-13 (3): **D24 — clicker + tooltips + tags sólidos**: botón «Clicker» con contador al extremo derecho del contacto rápido (el fondo D23 reacciona a cada pulsación); tooltips CSS en TODOS los IconButton (::after de data-tip=ariaLabel, hover+focus, ancla derecha con variante left) + `overflow-x: clip` en body; `Tag` con fondo sólido `--color-surface` (badge de categoría sobre imagen legible; 8 usos). Verificado con Playwright contra el build real; tests 123→124.

- 2026-11-13 (2): **D23 — bloque de ajustes unificado**: todas las constantes de la animación (tamaño de punto, boost, alfas, radios, malla, resorte, drift, anillo) agrupadas y comentadas al inicio de `useParticleGrid.ts`; números mágicos inline extraídos a constantes nombradas. Sin cambio de comportamiento.

- 2026-11-13 (1): **D23 fix** — canvas reemplazado no se estiraba con `inset:0` (300×150 top-left, grid recortado): `width/height:100%` en `.layer`; visibilidad +30% (0.55, atenuada 0.26); verificado con Playwright (canvas = viewport exacto en 1440 y 375, screenshots).

- 2026-11-12 (12): **D23 — fondo animado de puntos**: `BackgroundCanvas` + `useParticleGrid` (src/canvas/): grid con resorte al home, gravedad de cursor (sutil, puntero fino), colapso al clic (ambos botones) con retorno elástico; malla elástica, micro-drift, eco de anillo, color por tema con transición; scrim de legibilidad en la intro y atenuación con overlay abierto; reduced-motion/pausa/DPR/cleanup; tests 114→123.
- 2026-11-12 (11): **Fase 8** — Playwright e2e implementado: `@playwright/test` + Chromium, build+preview en :4173, 15 tests (humo/responsive 375-1440 sin scroll horizontal, overlays con jerarquía Escape del zoom D21, experiencia D20, temas D18 con persistencia, filtros con «0 proyectos», navegación D22); hallazgo: ContactSection sigue TODO F6.8 (sin #contact). `npm run test:e2e`.

- 2026-11-12 (10): **Fase 7** — TopBar compacta flotante (nunca desaparece) + grid de tecnologías más grande y jerárquico (D22); tests 109→114.
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

0. **Contenido es/en definitivo de proyectos y entidades (F7.1)** — ahora que el selector ES/EN es visible, el propietario debe revisar los textos ingleses existentes (provisionales de fases anteriores) y los de la ficha RVA Portfolio.
1. **F6.8 ContactSection real** (sigue `return null`).
2. CV (PDF pendiente del propietario) y repo remoto.
3. La revisión móvil se hace post-despliegue.

## Revisión final de proyectos (2026-11-21)

- D54: catálogo de 10 proyectos ordenado con MiniCRM y Snake tras LokiHome y RVA Portfolio al final; la ficha RVA se comparte entre tarjeta y footer. Tarjetas usan `filterCategories` y filtros emplean ese mismo dato; Signature Application tiene Web+C#.
- Se actualizan textos es/en de Centro Médico (Google Calendar, Gemini API y Eko Knowledge Base; sin WhatsApp), LokiHome, MiniCRM (TFG de rutas comerciales), Snake (aprendizaje OpenCode/SDD) y RVA Portfolio (OpenCode + Codex).
- TypeScript usa tier `project`, por lo que aparece en la ficha RVA sin entrar en los grupos visibles del Stack.
- Validación final: `npm run validate` en verde (185 tests; typecheck, lint, formato y build correctos). Se mantienen el warning Fast Refresh conocido y los mensajes Canvas/jsdom de pruebas.

## Ajustes de contenido y legibilidad (2026-11-26)

- Idiomas ordenados de forma declarativa: Castellano, Inglés, Valenciano, Rumano y Alemán; el cambio no afecta a otras secciones.
- Certificaciones: títulos ligeramente mayores y peso 500, manteniendo la tarjeta compacta.
- DAM: descripción ES/EN actualizada con inicio en 2024, asignaturas superadas y prácticas obligatorias aún pendientes; nota complementaria localizada; tecnologías formativas añadidas en orden explícito con iconos y nombres. La tarjeta oficial ocupa todo el ancho en la vista Tarjetas; la cuadrícula de tecnologías se adapta al espacio disponible.

- Validación de esta ronda: typecheck, lint (sin errores; warning preexistente Fast Refresh), build correcto con acceso ampliado, Vitest 16/16 (incluye orden ES/EN y orden de tecnologías), Playwright smoke 4/4 en 375/768/1024/1440 px. Canvas/jsdom emite los mensajes conocidos. El formato de archivos modificados se comprobó aparte; el check global sigue señalando docs/implementation-plan.md preexistente.

## Ajustes de presentación (2026-11-26, seguimiento)

- La tarjeta DAM reduce su título; descripción y texto complementario pueden ocupar todo el ancho. En modo Lista se reutiliza la tarjeta DAM completa, incluida la lista de tecnologías.
- El encabezado de tecnologías ahora indica ?estudiadas? en ES/EN. Títulos de cursos y certificaciones usan peso intermedio y envuelven el texto sin recortarlo.

- Validación de seguimiento: typecheck correcto, lint sin errores (warning Fast Refresh preexistente), Vitest afectadas 14/14 y Playwright smoke 4/4 a 375/768/1024/1440 px; se comprobó que nivel y botón comparten línea en todos esos anchos. Build de producción completado por el servidor de Playwright. Formato correcto para los archivos modificados; siguen los mensajes conocidos de Canvas/jsdom.

## Alineación de niveles de idiomas (2026-11-27)

- Chips de nivel y botones de certificado comparten una altura mínima de 44px; los niveles llenan uniformemente su espacio y quedan centrados en una fila común dentro de cada tarjeta.
- No se ejecutaron validaciones.

## Texto final de la hero (2026-11-27)

- La nota bajo el rol queda como ?Junior? en español e inglés. Se reemplaza la descripción ES por el texto proporcionado y se actualiza EN con su traducción equivalente. La ubicación ?Elche, España / Elche, Spain? se conserva.
- No se ejecutaron validaciones.

## Justificación de la descripción de la hero (2026-11-27)

- La descripción de la hero usa alineación justificada para ES y EN mediante una regla compartida.
- No se ejecutaron validaciones.

## Cola de incrementos del Clicker (2026-11-27)

- Se serializan los `/hit` con 450 ms mínimos entre solicitudes para respetar el límite de Abacus (30 solicitudes/10 s/IP). La cifra local sigue incrementando al instante; las respuestas 429 conservan el hit pendiente y lo reintentan tras `Retry-After` o 2 s por defecto.
- `npm run typecheck` correcto. No se ejecutaron pruebas.
