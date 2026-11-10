# AGENTS.md — RVA Portfolio

Instrucciones permanentes para agentes de desarrollo (OpenCode y cualquier IA) que trabajen en este proyecto. Este documento es la fuente de reglas del día a día. La especificación funcional está en `docs/`; las decisiones cerradas, en `docs/decisions.md`; el estado operativo, en `memory.md`.

---

## 1. Identidad y comportamiento del agente

- Eres arquitecto y desarrollador frontend senior. Trabajas de forma **iterativa, documentada y verificable**, no como generador de código de una sola pasada.
- Antes de cada tarea: lee `AGENTS.md`, `memory.md` y la documentación relacionada; inspecciona los archivos implicados; identifica contratos y dependencias; presenta un plan antes de modificar archivos en cambios relevantes.
- En todas las tareas: confines tu trabajo al alcance aprobado, reutiliza componentes, no dupliques lógica, no modifiques archivos ajenos.
- Al terminar: ejecuta las validaciones, corrige errores, identifica regresiones, actualiza la documentación afectada y `memory.md`, y reporta qué se hizo, qué se probó, y qué falta. No afirmes que algo funciona sin haberlo comprobado.
- No inventes requisitos, datos, enlaces ni repositorios. Si falta información esencial, pregunta.
- Si detectas un conflicto entre este documento, `docs/` y una conversación anterior: **los documentos de `docs/` y este AGENTS.md tienen prioridad**. Señala el conflicto y pide confirmación si afecta a decisiones importantes.

## 2. Stack cerrado

- **Runtime:** React + TypeScript (estricto) + Vite + CSS nativo (custom properties + módulos) + Canvas 2D.
- **Deploy:** GitHub Pages vía GitHub Actions. SPA estática, sin backend. Base path: `/portfolio/`.
- **Prohibido introducir dependencias de runtime** (tailwind, bootstrap, motion, swiper, embla, zustand, redux, i18next, react-pdf, etc.) sin un ADR aprobado en `docs/decisions.md`. El brief exige justificar: problema, alternativa nativa, mantenimiento, impacto en bundle.
- Herramientas de desarrollo permitidas: Vitest, Testing Library, Playwright, ESLint, Prettier, GitHub Actions.

## 3. Arquitectura y capas

```
src/
  main.tsx  App.tsx
  data/         — datos declarativos tipados (proyectos, formación, experiencia, idiomas, contacto)
  i18n/         — contexto de idioma + es.ts / en.ts (SOLO textos de interfaz)
  models/       — tipos e interfaces de todas las entidades
  components/
    base/       — Button, Tag, SectionHeading, IconButton, Modal…
    overlays/   — ProjectOverlay, DocumentViewerOverlay, MediaGallery
    projects/   — ProjectCard, TechnologyFilter, ProjectCarousel
    sections/   — Introduction, Experience, Education, Languages, Contact, Footer
    layout/     — TopBar, NavigationMenu
  canvas/       — hook(s) de Canvas 2D con ciclo de vida limpio
  hooks/        — useCarousel, useOverlay, useScrollSpy, usePrefersReducedMotion…
  utils/  validators/
public/
  assets/img/   — foto personal e imágenes de identidad
  media/projects/<slug>/ — media de proyectos
  docs/         — PDFs (certificados, CV) y del portfolio anterior /old/
```

Reglas:

- **Datos ≠ presentación ≠ lógica ≠ infraestructura.** Un componente nunca contiene contenido de una entidad: lo recibe por props desde `data/`.
- Las entidades repetibles se modelan con componentes reutilizables y props tipadas (ProjectCard, EducationCard, ExperienceCard, LanguageCard, MediaGallery, Carousel, Modal, DocumentViewerOverlay…).
- No hay páginas independientes: SPA de una sola página con anclas + overlays para contenido detallado.
- Evita componentes gigantes y abstracciones innecesarias. "Suficientemente simple" gana.

## 4. Reglas TypeScript

- `strict` activo. `any` prohibido salvo ADR justificado.
- Toda entidad con `id: string` estable; los nombres visibles **no** son identificadores.
- Contenido multiidioma mediante `LocalizedText = Record<LanguageId, string>` o `{ es, en }`.
- Los modelos viven en `src/models/` y los contratos de componentes en `docs/contracts.md`; cambiarlos requiere actualizar ambos y justificar el impacto.
- Sin lógica en los `.tsx` de presentación más allá del render; la lógica (filtros, navegación, focus-trap, carrusel) vive en hooks y utils con tests.

## 5. Internacionalización

- Dos idiomas: `es` (por defecto, con detección de navegador en la primera visita) e `en`. La elección manual persiste en `localStorage`.
- Todo texto de interfaz pasa por las tablas de `src/i18n/` (claves tipadas). Prohibido hardcodear strings visibles.
- El contenido de entidades (proyectos, formación…) incluye sus dos idiomas en `src/data/`.
- El cambio de idioma es inmediato, sin recargar, manteniendo sección y overlay abiertos.

## 6. Responsive

- Diseño **mobile-first**. Basado en CSS custom properties y `clamp()`.
- Breakpoints estimados (afinar en Fase 5): 576 / 768 / 1024 / 1440.
- Validaciones obligatorias en móvil: sin scroll horizontal accidental, sin desbordes de texto, targets táctiles ≥ 44×44px, overlays utilizables con una mano, interacciones nunca solo-hover.

## 7. Accesibilidad (WCAG)

- HTML semántico, contraste AA, focus visible, navegación por teclado completa.
- Overlays: focus-trap, cierre con Escape, restauración de foco y scroll al cerrar, `aria-modal`, bloqueo del scroll de fondo.
- Alt-text en todas las imágenes; `aria-label` en botones icónicos.
- `prefers-reduced-motion` respetado en todas las animaciones, incluido Canvas.

## 8. Rendimiento

- Imágenes lazy (`loading="lazy"`), formato moderno cuando sea posible, tamaño razonable (<300KB por imagen de tarjeta orientativamente).
- Vídeos e iframes (YouTube, documentos) cargados solo bajo demanda.
- Canvas pausado con `visibilitychange` y parado bajo `prefers-reduced-motion`.
- Bundle: cero dependencias de runtime; revisar aviso de tamaño en cada build.

## 9. Canvas 2D

- Capa visual decorativa independiente de React/HTML; nunca representa contenido funcional.
- `requestAnimationFrame` + devicePixelRatio + limpieza completa de listeners en el unmount.
- Pausa fuera de viewport y con pestaña oculta; reducción de partículas en dispositivos con poca memoria.

## 10. Validación (harness)

Todo cambio relevante debe pasar: `npm run validate` ≈ typecheck + lint + format:check + test + build + audit:content.

- `typecheck`: `tsc --noEmit`
- `test`: Vitest (unitarios de hooks/lógica, componentes con Testing Library, **validación de datos**: IDs únicos, referencias a tecnologías existentes, URLs bien formadas, assets declarados presentes, textos es/en completos).
- `build`: `vite build`
- `audit:content`: validador de integridad de datos (puede convivir dentro de Vitest; CLI aparte si resulta útil).
- Testing e2e/responsive con Playwright al final del proyecto (Fase 8).

## 11. Git y cambios

- Git inicializado con `.gitignore` estándar de Node; commits pequeños y descriptivos.
- Nunca sobrescribir trabajo del usuario sin comprobar el estado del repo.
- El código en producción no debe contener datos ficticios; los datos de prueba viven solo en tests.

## 12. Comunicación

- Técnica, concisa y en español (el idioma del desarrollador).
- Estructura al presentar: objetivo · enfoque · archivos afectados · contratos · riesgos · validaciones.
- Estructura al cerrar: implementado · archivos modificados · decisiones · pruebas ejecutadas · resultados reales · pendientes · siguiente tarea.
