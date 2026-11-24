# implementation-plan.md — Plan de implementación

Desglose en fases y tareas verificables, con dependencias, criterios de aceptación (CA) y estado. Tarea = unidad pequeña y comprobable. Al completar una tarea se actualiza su estado y `memory.md`.

Estados: `pendiente · en curso · hecha · bloqueada`

---

## Fase 0 — Inspección y análisis ✅ hecha

- F0.1 Inspección de entorno y estado git ✅ (directorio vacío, sin repo; Node 24/npm 12)
- F0.2 Análisis del portfolio anterior e inventario ✅ (`docs/content-inventory.md`)
- F0.3 Registro de requisitos y estado `memory.md` ✅

## Fase 1 — Especificación ✅ hecha

- F1.1 `requirements.md` ✅ (RF-01…RF-26, RNF-01…08)
- F1.2 Contraste con el inventario y cierre de bloqueantes con el propietario ✅ (2026-11-10)

## Fase 2 — Arquitectura ✅ hecha (pendiente revisión del propietario)

- F2.1 `architecture.md` ✅
- F2.2 `contracts.md` ✅
- F2.3 `decisions.md` (D01–D12) ✅
- F2.4 `AGENTS.md` maestro ✅

## Fase 3 — Contratos y esqueletos ✅ hecha

- F3.1 `src/models/*.ts` (common, Technology, Project, Education, Experience, LanguageProfile, ContactLink) ✅
- CA: compila con strict; modelos completos para todas las entidades, con `LocalizedText` en los campos de contenido. ✅
- F3.2 Esqueletos de componentes con props y `TODO` (sin estilos ni lógica real) ✅
- CA: `typecheck` verde; nada de datos particulares hardcodeados. ✅

## Fase 4 — Harness y entorno ✅ hecha

- F4.1 Git init + `.gitignore` + primer commit de scaffold ✅ | CA: repo limpio, histórico con commit inicial ✅
- F4.2 Vite + React + TS strict + ESLint/Prettier + Vitest ✅ | CA: `npm run validate` verde ✅
- F4.3 `vite.config.ts` con `base: '/portfolio/'` + estilos tokens/base ✅ | CA: build verde respetando base ✅ (verificado: assets en `/portfolio/assets/…`)
- F4.4 Workflow `deploy.yml` — despliega `dist/` al hacer push a `redesign` con Pages Actions; configuración del repositorio pendiente de seleccionar GitHub Actions
- F4.5 README mínimo de operación ✅

## Fase 5 — Sistema visual 🔶 en curso (5.1–5.5 hechas; está en revisión del propietario)

- F5.1 tokens.css + base.css + fuentes cargadas ✅ (Space Grotesk / Inter / JetBrains Mono, latin+latin-ext, display=swap)
- F5.2 `base/`: Button (+href), Tag, IconButton, SectionHeading, Modal (OverlayBase con focus-trap + scroll-lock + Escape) ✅
- F5.3 `layout/`: TopBar + NavigationMenu ✅ (anclas, indicador activo via useScrollSpy, cierre por Escape/clic-fuera/selección, auto-ocultación al scroll con useMenuVisibility)
- F5.4 `sections/Introduction` ✅ (nombre, rol estático, ubicación, descripción, contacto rápido con copiar email aria-live, tecnologías 3 niveles; aparición progresiva; solo falta foto/CV F7) + Footer con "Older Portfolio" ✅
- F5.5 `OverlayBase (Modal)` con focus-trap + scroll-lock ✅
- CA pendiente: revisión del propietario en móvil (375–414px) ANTES de afrontar todas las secciones. | i18n LanguageProvider ya conectado (D12: localStorage > navigator > es).

## Fase 6 — Componentes y funcionalidades — en curso

Orden por dependencia (cada bloque tiene su CA propia en `testing.md`):

1. F6.1 Datos: tecnologías 3 niveles + catálogo de proyectos (es/en, ids estables, `year` opcional) ✅
2. F6.2 ProjectCard (botón a toda tarjeta + fallback de imagen) + TechnologyFilter (aria-pressed) + ProjectCarousel (scroll-snap nativo, prev/next, teclado ←/→, indicador 1/N aria-live) + `utils/filter.ts` (puro/testeado) + `hooks/useCarousel.ts` ✅
3. F6.3 ProjectOverlay (Modal flush 50/50, foco-trap/Escape/backdrop/scroll-lock) + MediaGallery (miniaturas, prev/next, indicador 1/N, YouTube lazy con facade, fallback de media ausente sin crash) + `utils/media.ts` (extractYouTubeId testeado) ✅
4. F6.4 Navegación entre proyectos prev/next (botones + teclado ←/→ a nivel overlay; la galería consume sus propias flechas con stopPropagation) RESPECTA el filtro activo: índice dentro de filteredProjects ✅
5. F6.5 ExperienceSection ✅ — **revisada en F6-ajustes (D13):** `freelance` eliminado; 13 entradas (professional ×7 incl. redes sociales y agente IA como entradas propias, independent ×5, collab ×1); fechas reales del propietario (`period` acepta `YYYY`|`YYYY-MM`); perfil real de Upwork enlazado con etiqueta dedicada; snake como entrada independent.
6. F6-ajustes (ronda del 2026-11-10, ADRs D13–D15): Snake como proyecto `ai-assisted` (9 fichas, años reales, Room en MiniCRM); catálogo tecnologías +Python/C#/Java (core) +room/github; grid icono+nombre con `TechIcon` (devicon SVG local + PNG propios, D14); flechas del overlay flotantes fuera del panel con slot `aside` en Modal (D15) ✅. ⚠ Pendiente: `public/media/projects/snake/snake-cover.png` (media declarada; generación de imagen bloqueada por cuota — alternativas: captura real del propietario o reintentar).
7. F6.6 EducationSection + DocumentViewerOverlay ✅ (2026-11-11, D16): 11 entradas desde inventario §4 con enlaces reales extraídos del portfolio anterior; jerarquía official → certification → course; `issuer` opcional (DAM sin organismo); Java Foundations sin documento; badges Credly/CertView como URL externa real; PDFs OpenWebinars → `/portfolio/docs/<slug>.pdf` locales (D03, pendientes de subida); `DocumentViewerOverlay` sobre `Modal` con Drive→`/preview` (`googleDriveEmbedUrl`) y error controlado por timeout/onError con acciones abrir/descargar; `EducationCard` + `EducationSection` (patrón Experience, kicker «04 — Education»). ⚠ Pendiente: subir los 6 PDFs a `public/docs/` (F7.3).
8. F6.7 LanguagesSection reutilizando DocumentViewerOverlay ✅ (2026-11-12): 5 idiomas de D04 (niveles únicos; sin desglose conversación/escrito); LanguageCard con botón «Ver certificado» solo con documento — PDFs de Valenciano/Inglés pendientes de subida (al añadirlos: campo `document` + existsSync en tests); reutiliza DocumentViewerOverlay de F6.6 sin cambios.
9. F6.8 ContactSection (email + enlaces) + Footer ( enlace "Older Portfolio")
10. F6.9 i18n completo (es/en tablas + cambio persistente + overlay conservado)
11. F6.10 Canvas ParticlesCanvas (rAF, dpr, pausa, reduced-motion)

- CA consolidada: `npm run validate` verde + checklist de interacción de `testing.md` en local.

## Fase 7 — Integración de contenido — pendiente (bloqueada por los PDFs del propietario)

- F7.1 Substituir contenido es/en de proyectos por el definitivo (con revisión del propietario)
- F7.2 Copiar media al repo (`public/media/projects/<slug>/`) ✅ (2026-11-12: 26 imágenes integradas y verificadas con existsSync) + **compresión ✅ (2026-11-13: 4 PNG grandes → WebP q82 con ffmpeg, −89% en esos ficheros)**
- F7.3 PDFs a `public/docs/` 🔶 (cursos OpenWebinars ✅ + valenciano C1 e inglés B2 ✅ integrados en LanguagesSection el 2026-11-13; falta CV)
- ~~F7.4 Foto personal~~ — RETIRADA (D10 cancelada, 2026-11-13)
- F7.5 Revisión del contenido en ambos idiomas por el propietario
- CA: `audit:content` verde; cero referencias/URLs/assets rotos; sin textos vacíos es/en.

## Fase 8 — Validación final — pendiente

- F8.1 Playwright: escenarios de `testing.md` en 6 viewports + axe-core
- F8.2 Build de producción y comprobación real en la URL de Pages (no dev server)
- F8.3 Auditoría Lighthouse CWV + presupuesto de bundle (JS ≤180KB gzip)
- F8.4 Navegación 100% con teclado + NVDA por parte del propietario
- F8.5 Congelado y cierre: lista de regresiones conocidas; copia del portfolio anterior conservada en `public/old/`
- CA: checklist completa verde + aprobación del propietario.

---

## Riesgos abiertos

| Riesgo                                                               | Mitigación                                                                                                |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Configuración de Pages en el repositorio                             | Seleccionar GitHub Actions en Settings → Pages; verificar el primer despliegue de `redesign`             |
| Drive PDFs bloqueados en algunos navegadores si no se copian locales | D03 recomienda copia local; visor soporta ambos                                                           |
| Contenido pesado (imágenes grandes heredadas del site anterior)      | Presupuestos de `testing.md` + conversión/comprimación en F7                                              |
| Dependencia del propietario para PDFs/fotos/EN-ES definitivos        | Fase 7 marcada como bloqueada hasta entrega                                                               |
| Localización del viejo portfolio en `/portfolio/old/`                | Copiar ficheros del repo actual a `public/old/` en F4 antes del primer deploy del nuevo                   |
