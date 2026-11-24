# contracts.md — RVA Portfolio

Contratos TypeScript de dominio y de props de componentes. Es la referencia que delimita responsabilidades: quien implementa un componente respeta este documento; cambiar un contrato exige actualizar aquí y en `src/models/` (cuando existan), y registrar el motivo en `decisions.md`.

Estado: **borrador aprobado para Fase 3 (esqueletos)**. Los nombres pueden afinarse en implementación, pero la semántica no cambia sin ADR.

## 1. Primitivas comunes

```ts
// models/common.ts
export type LanguageId = 'es' | 'en'

/** Cualquier contenido de entidad localizable: ES y EN obligatorios. */
export interface LocalizedText {
  es: string
  en: string
}

export type CategoryId = 'web' | 'desktop' | 'android' | 'collab' | 'ai-assisted'
export type FilterCategoryId = 'android' | 'web' | 'csharp' | 'python' | 'java'

export interface LinkDefinition {
  id: LinkId // 'github' | 'demo' | 'web' | 'docs' | 'cv' | 'older-portfolio'
  url: string // validado por audit:content (https, bien formada)
  ariaLabel: LocalizedText
}

export interface BaseEntity {
  id: string // estable, kebab-case, NO nombre visible
}
```

## 2. Tecnologías

```ts
// models/Technology.ts
export type TechnologyTier = 'core' | 'explored' | 'project'

export interface Technology extends BaseEntity {
  name: string
  tier: TechnologyTier // project = fichas de proyectos, fuera de los dos grids del Stack
  icon?: 'python' | 'unity' | 'xampp' | 'odoo' | 'codex' | 'opencode' // PNG custom en /assets/img/icons/; resto ⇒ SVG inline (TechIcon)
  adapt?: 'mono' | 'dim' // D28: mono = silueta mask+currentColor · dim = aclara solo en oscuro
} // nombre canónico sin traducir; icon opcional (PNG custom) o SVG inline resuelto por TechIcon
```

- Los proyectos referencian tecnologías por `technologyIds: string[]`, nunca copian el nombre.
- `All` es estado del filtro (`null`), no una tecnología.
- D27: `explored` NO exige aparecer en fichas de proyectos. `project` incluye tecnologías de fichas que no forman parte del Stack visible (p. ej. TypeScript).

## 3. Proyectos

```ts
// models/Project.ts
export type MediaKind = 'image' | 'gif' | 'video-local' | 'video-youtube' | 'external-demo'

export interface MediaItem extends BaseEntity {
  kind: MediaKind
  src: string // ruta local bajo /media/projects/<slug>/ o URL externa
  alt: LocalizedText // obligatorio para imagenes; descripción para vídeo
  thumbnail?: string
}

export type ProjectLinkId = 'github' | 'demo' | 'web' | 'docs'

export interface ProjectLink {
  id: ProjectLinkId
  url: string
}

export interface Project extends BaseEntity {
  slug: string // coincide con carpeta de media y con el fichero de datos
  /** Año de realización si se conoce; ausente si no hay dato verificado. */
  year?: number
  name: LocalizedText
  summary: LocalizedText // texto de tarjeta
  category: CategoryId
  filterCategories: FilterCategoryId[] // badges de tarjeta y filtro; puede incluir más de una categoría
  technologyIds: string[]
  media: MediaItem[] // ≥1; el primero es el principal
  links: ProjectLink[] // solo los que existan (sin inventar)
  /** URL jugable embebida en el overlay (botón «Jugar ahora»). Solo snake. */
  playUrl?: string

  // Detalle del overlay (RF-09/RF-12)
  goal: LocalizedText // objetivo y problema resuelto (puede dividirse en dos campos si el contenido lo necesita: goal / problem)
  problem: LocalizedText
  role: LocalizedText // responsabilidad del desarrollador
  architecture: LocalizedText
  features: { id: string; text: LocalizedText }[]
  technicalDecisions: { id: string; text: LocalizedText }[]
  outcomes: LocalizedText
  learnings: LocalizedText
}
```

## 4. Formación

```ts
// models/Education.ts
export type EducationKind = 'official' | 'certification' | 'course'

export interface Education extends BaseEntity {
  kind: EducationKind
  name: LocalizedText
  issuer?: string // organismo emisor; opcional (DAM no declara organismo — no se inventa)
  date?: string // ISO 8601 (YYYY-MM | YYYY) — opcional, ausente si no hay dato verificado
  duration?: string // texto libre, ej: "40 h" — opcional
  description?: LocalizedText
  document?: DocumentRef // acreditación, opcional
}

export interface DocumentRef {
  /** Ruta local (/docs/…) o URL externa validada. */
  src: string
  /** D-E: 'pdf' ⇒ visor overlay; 'external' ⇒ pestaña nueva (target=_blank + noopener). */
  kind: 'pdf' | 'external'
  name: LocalizedText // nombre del documento para el visor
}
```

## 5. Experiencia

```ts
// models/Experience.ts — Fase 6 (plan 2026-11): lista plana, SIN kind.
// 'freelance' eliminado (D13) y 'independent'/'collab' eliminados (Fase 6):
// los proyectos propios/colaboraciones viven como fichas en Proyectos.

export interface Experience extends BaseEntity {
  organization: LocalizedText // empresa, cliente, plataforma o entidad (subtítulo)
  period?: { start: string; end?: string } // "YYYY" | "YYYY-MM"; en experiencia solo se muestra el año start
  role: LocalizedText // trabajo realizado; título principal visible en tarjeta y overlay
  responsibilities: { id: string; text: LocalizedText }[]
  description?: LocalizedText
  technologyIds: string[]
  outcomes?: { id: string; text: LocalizedText }[]
  links?: { id: string; url: string }[]
  projectIds?: string[] // Fase 5: fichas de Proyectos asociadas (ids validados en tests)
}
```

## 6. Idiomas

```ts
// models/LanguageProfile.ts
export interface LanguageProfile extends BaseEntity {
  /** Código ISO del idioma, p. ej. 'ca' para valenciano, 'de' para alemán. */
  code: string
  name: LocalizedText
  cefr?: string // 'Nativo' | 'C1' | 'B2' | 'A1'…
  spoken?: string
  written?: string
  document?: DocumentRef // mismo DocumentRef del visor (valenciano C1, inglés B2)
}
```

## 7. Contratos de componentes (props, resumidos)

Todos los componentes reciben datos por props; ninguno importa entidades concretas de `data/` (la inyección es del árbol de secciones).

| Componente              | Props (esencia)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SectionHeading`        | `index: number; title: string; subtitle?: string` — ronda 3 F4/D35: el kicker es SOLO el número (sin nombre en inglés duplicado); `title` ya traducido por la sección (i18n)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `Tag`                   | `label: string; variant?: 'tech' \| 'category' \| 'accent'; onClick?` — fondo SIEMPRE sólido (`--color-surface`, D24: el badge de categoría se superpone a la imagen del proyecto)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `Button`                | `label: string; onClick?; href?; external?: boolean; download?: boolean; variant; icon?; ariaLabel?; disabled?` (`href` ⇒ `<a>`; `download` añade el atributo download, usado por el visor de documentos)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `IconButton`            | `ariaLabel: string; onClick(); icon: ReactNode; disabled?; className?; tooltipAlign?: 'left' \| 'right'` — ariaLabel OBLIGATORIO; `forwardRef` (Fase 3) para foco inicial desde capas superpuestas (ImageZoomOverlay); D24: tooltip CSS (::after de `data-tip`=ariaLabel, hover + focus-visible, retardo 380ms, `display:none` en táctil) — ancla derecha por defecto (extiende a la izquierda), `'left'` para flechas «anterior» del borde izquierdo                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `ProjectCard`           | `project; onSelect(projectId)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `TechnologyFilter`      | `categories: readonly FilterCategoryId[]; activeId: FilterCategoryValue; onChange(id)` — 5 categorías SIEMPRE (F2.2), etiquetas i18n `filter.categories`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `ProjectCarousel`       | `projects; onSelect(projectId)` — interno: keyboard/táctil/botones en hook `useCarousel`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `ProjectOverlay`        | `project \| null; onClose(); onPrev?(); onNext?(); hasPrev; hasNext` — textos vía `useLanguage()` (justificación: evita pasar language + tablas duplicadas por props). Proyectos con `playUrl` ofrecen botón «Jugar ahora»: modo juego con iframe a todo el panel, «Cerrar juego» sin cerrar el overlay, `dismissable: false` (clic fuera no cierra) y Escape cierra solo el juego. Fase 3: posee `galleryIndex`/`zoomOpen` (galería controlada); con zoom abierto renderiza ImageZoomOverlay en el slot `aside` (sustituye la nav flotante) y desactiva su listener ←/→ de proyecto. En móvil (≤767px), contenido y texto se ajustan al ancho del panel, medios usan ancho máximo 100%, tipografía al 80% y acciones compactas                                                                                                                                                     |     |
| `ImageZoomOverlay`      | `items: MediaItem[]; index; onIndexChange(n); onClose()` — capa `position: fixed` renderizada en el slot `aside` del Modal del proyecto (NO es un segundo Modal: dentro del backdrop y del focus-trap). Solo image/gif. Zoom botones (+/−, 1–4), rueda y pellizco; pan con clamp; swipe >60px a 1:1 cambia de imagen; ←/→ consumidos en fase captura (cambian imagen, no proyecto); Escape en fase captura cierra SOLO la capa (2ª cierra el overlay); clic en el fondo cierra; foco inicial al botón cerrar; counter aria-live                                                                                                                                                                                                                                                                                                                                                     |
| `MediaGallery`          | `items; index; onIndexChange(n); onOpenZoom()` — CONTROLADA (Fase 3): el índice activo lo posee ProjectOverlay y se comparte con el visor ampliado (se conserva al cerrar la capa). Teclado ←/→ con stopPropagation, miniaturas, indicador «1/N» aria-live; YouTube lazy (facade + botón ▶); imágenes/gif ofrecen botón lupa SIEMPRE visible (`Ampliar imagen`, solo si el medio cargó)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `EducationRow`          | `item: Education; onOpenDocument(document: DocumentRef)` — fila a ancho completo (ronda 4 F3, sustituye a EducationCard): título + emisor (mono versalitas) + descripción en línea, acción «Ver acreditación» solo con `document`, a la derecha; apertura POR `document.kind` (D42): `pdf` ⇒ botón overlay, `external` ⇒ `<a target=_blank rel=noopener noreferrer>` — sin documento (Java Foundations) no hay acción                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `ExperienceCard`        | `item: Experience; onOpen(experienceId)` — tarjeta minimalista: `role` como título descriptivo, `organization` como subtítulo, periodo y TechIcon; botón estirado a toda la tarjeta con aria-label que identifica trabajo y entidad (nunca solo-hover). Mantiene los anchos 100% / 50% ≥576 / 33% ≥1024 del carrusel                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `ExperienceOverlay`     | `experience: Experience \| null; onClose(); onOpenProject(projectId); projects: Project[]; onPrev?; onNext?; hasPrev; hasNext` — compone sobre Modal (patrón ProjectOverlay: `role` como título y `organization` como subtítulo); descripción/funciones/logros/tags/enlaces + «Proyectos asociados» (botones «Ver proyecto: X»); «Ver proyecto» cierra ESTE overlay y abre el ProjectOverlay (sin doble Escape). Ronda 6 F1: prev/next cambia de experiencia SIN cerrar — flechas SIEMPRE visibles en el header (en móvil no hay swipe de galería que las sustituya) + ←/→ a nivel documento; extremos deshabilitados sin wrap                                                                                                                                                                                                                                                      |
| `CaptchaPuzzleOverlay`  | `open; onClose(); onOpenCv(); challenge?` (challenge inyectable SOLO para pruebas) — compone sobre `Modal` (con `className` compacto); tablero Canvas 2D 320×180 con patrón determinista por semilla (`utils/captcha.ts`, mulberry32), hueco en x aleatoria ∈ [15%,85%] del recorrido, pieza recortada del MISMO patrón (pestaña arriba, muesca abajo), slider `input[type=range]` (ratón+táctil+teclado); al soltar: `isSolved` (±10px) ⇒ `snap + glow + `Button`«Ver CV» que invoca`onOpenCv`(ronda 7 D50: el componente NO conoce la URL del CV; el cliente cierra ESTE overlay y abre el DocumentViewerOverlay con`site.cvDocument`), fallo ⇒ shake + reintento con semilla nueva. Colores por tokens del tema activo (MutationObserver en `data-theme`). D49: barrera disuasoria — NO protege el PDF frente a acceso directo a su URL (Alternativa A)                          |
| `LanguageCard`          | `item: LanguageProfile; onOpenDocument(document: DocumentRef)` — botón «Ver certificado» solo con `document`; apertura POR `document.kind` (D42): `pdf` ⇒ overlay (valenciano C1, inglés B2), `external` ⇒ pestaña nueva                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `EducationSection`      | Sin props: agrupa por `EducationKind`, conserva el selector Lista/Tarjetas (Tarjetas predeterminada); ambas vistas reciben los mismos `Education` y reutilizan un único `DocumentViewerOverlay`. `EducationRow` mantiene íntegra la vista Lista; `EducationCard` muestra nombre completo (limitado visualmente si hace falta), emisor, descripción y acreditación.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `EducationCard`         | `item: Education; onOpenDocument(document: DocumentRef)` — tarjeta compacta dentro del grid responsive; nombre, emisor, descripción y acción centrados; la acción limita su ancho a la tarjeta. Distingue `pdf` (visor) y `external` (pestaña nueva) igual que `EducationRow`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `DocumentViewerOverlay` | `document: DocumentRef \| null; onClose(); ui: { close; openNewTab; download; errorTitle; errorBody }` — embebido inline, NUNCA pestaña nueva como visor; Drive se transforma a `/preview` (`googleDriveEmbedUrl`); timeout/onError ⇒ error controlado con acciones abrir/descargar. En móvil, el iframe ocupa el espacio disponible en un panel de hasta 82dvh para permitir lectura y zoom táctil en el visor PDF del navegador                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `Modal` (OverlayBase)   | `open; onClose(); labelledById; flush?; aside?; dismissable?=true; className?; children` — encapsula focus-trap, Escape, clic-fuera, scroll-lock; `flush` desactiva el scroll del panel (layout 50/50 del ProjectOverlay); `aside` renderiza contenido complementario dentro del backdrop (fuera del `overflow` del panel, p. ej. flechas flotantes del ProjectOverlay) y queda cubierto por el focus-trap, que ahora abarca TODO el backdrop; `dismissable: false` ignora backdrop y Escape (modo juego: el cliente mantiene su propio escape por teclado); `className` (ronda 6 F3) aplica una clase extra AL PANEL para overlays compactos (CaptchaPuzzleOverlay 420px)                                                                                                                                                                                                          |     |
| `TopBar`                | `activeId: SectionId \| null; onNavigate(id: SectionId); theme: ThemeId ('dark' \| 'light'); onToggleTheme()` — ronda 5 F2 (D-B/D-C): navegación horizontal PERMANENTE (fuera menú desplegable, hamburguesa y estado compacto): barra `position: fixed` SIEMPRE visible con fondo `--color-backdrop` + blur 8px y borde inferior; nav de `SECTIONS` a la IZQUIERDA (enlaces ancla + `aria-current` del spy `useScrollSpy`, pastilla activa), controles a la DERECHA: toggle de tema (D18, IconButton) + selector ES/EN (D36: botón `.langBtn`, etiqueta mono del idioma ACTIVO, click alterna vía `setLanguage`). Móvil: nav con scroll horizontal interno (scrollbar oculta; effect auto-alinea el enlace activo con `scrollLeft`); altura = token `--topbar-h` (64px) usado por `main` (padding-top) y `section[id]` (scroll-margin-top, D-D). PROHIBIDO reintroducir hamburguesa |

| `BackgroundCanvas` | `theme: ThemeId` (desde App: única instancia de useTheme) — capa decorativa fija a pantalla completa (D23): `aria-hidden`, `pointer-events: none`, z-index negativo; grid de puntos con atracción de cursor + colapso al clic (ambos botones); color blanco/casi-negro por tema con transición ~300ms; se atenúa (opacity 0.2) con `[role=dialog]`; estático bajo reduced-motion |

| `Introduction` | Sin props (usa `useLanguage()` + `site`): nombre, `site.role` + `site.roleNote` (D25), location, description y `quickLinks` — `EmailReveal` + **botón CV (ronda 6 F2: `IconButton` 44px + tooltip D24 `intro.cvTooltip` «Ver CV»; click ⇒ CAPTCHA F3, NUNCA descarga directa)** + GitHub/LinkedIn/**Upwork (ronda 7 D50: `Button` externo, `IconUpwork` simple-icons, `site.upwork`)** (`Button` piel por defecto: contenedor SIEMPRE visible, D33; externos) + `ClickerButton` interno (`IconButton` circular `.clickerBtn` + `IconTarget`, contador GLOBAL EN VIVO en caja: `useGlobalCounter` lee el total al montar, stream SSE empuja actualizaciones incl. clicks de otros visitantes —pista ~4s «¡Otros visitantes están acumulando clicks!» + pulso— y cada click suma optimista + hit keepalive; reconciliación por máximo; D24/D26/D38/D38.1). **Ronda 7 D50:** posee `activeDocument` y renderiza su propia `DocumentViewerOverlay` — `onOpenCv` del CAPTCHA cierra ESTE overlay y abre el visor con `site.cvDocument` (patrón EducationSection; sin doble modal). Los grids de tecnologías NO viven aquí (D27: `TechStackSection`). aria-label = `texts.sections.intro` |
| `EmailReveal` | Sin props (D26 + ronda 4 F2/D-A): caja ÚNICA `fit-content` que abraza el contenido — bloqueado: `intro.slideToReveal` (con min-width en `ch` que RESERVA el ancho del estado revelado: 24ch mono del email + gap + botón 44px; sin saltos); desbloqueado: `decodeEmail()` (XOR en `data/site.ts`, NUNCA plaintext en bundle/DOM) + `IconButton` copiar dentro, PEGADO al borde derecho (`padding-right: 0` de la caja; `IconCopy`, tooltip = `intro.copyEmail`) con confirmación transient `role=status` (`intro.emailCopied`, 2s). Slider `input[type=range]` 0–100 (aria-label) FUERA, debajo, alineado a la caja (`width: 100%` del block); al completar se sustituye por indicador verde (`--color-ok`, `IconCheck`) que muestra `emailRevealed`/`emailCopied`. Anti-scraping pasivo: mitigación, no seguridad fuerte |
| `TechStackSection` | Sin props (D27 + ronda 4 F2/D-B, `id="stack"` tras proyectos): `SectionHeading` + 2 grupos con títulos `stack.mainTitle` / `stack.exploredTitle` y listas icono+nombre ordenadas alfabéticamente por `technologiesByTier('core' \| 'explored')`. El hover amplía todos los iconos, incluidos `<img>` y siluetas `mask + currentColor`. La sección es una tarjeta translúcida (`--color-hero` + `--color-line` + `radius-lg`): títulos a la izquierda; filas centradas automáticamente con icono arriba y nombre abajo, cinco elementos por fila en escritorio y cuatro en móvil/tablet (≤1023px). Git pertenece a `explored`; Gemini queda en nivel `project`, fuera del Stack visible. aria-label = `texts.sections.stack` |
| `CursorSpot` | Sin props (D30, decorativo): `useCursorSpot(ref)` ⇒ bool; div fijo 38px `aria-hidden` + `pointer-events:none` con inercia (`nextSpot`), `data-press` al pulsar (glow neón vía tokens `--color-spot*`); z-index -1 (detrás del texto, encima del canvas/scrim); `spotOff` (display:none) en puntero no fino; oculto bajo reduced-motion. Escucha window mousemove/mousedown/mouseup/blur + mouseleave del root; cleanup completo |
| `Footer` | Sin props (ronda 3 F6/D37): copyright PULSABLE (`<button class=projectLink>`, piel de footer + subrayado punteado + hint sr-only `footer.projectHint`) que abre el `ProjectOverlay` reutilizado con `rvaPortfolio` (`data/projects/rva-portfolio.ts`) — ficha ÚNICA sin prev/next, FUERA del catálogo `projects`; + enlace `olderLink` |

**Temas (D18):** hook `useTheme()` en `src/hooks/useTheme.ts` — inicial = `localStorage('rva-portfolio-theme')` ?? `prefers-color-scheme` (fallback oscuro); solo la elección manual persiste. Aplica `data-theme='light'` en `<html>` (oscuro = `:root` base, sin atributo). Tokens nuevos: `--color-backdrop`, `--color-media-stage` (oscuro en ambos temas) y `--shadow-overlay`.

`FilterCategoryValue = 'android' | 'web' | 'csharp' | 'python' | 'java' | null` (`null` = Todas). `FilterCategoryId` vive en `data/technologies.ts` junto al mapa `FILTER_CATEGORY_BY_TECH` (SQLite y Room SIN categoría: nunca filtran solas, decisión del propietario).

## 8. Filtro (lógica pura, testeable)

```ts
// utils/filter.ts — RF-07 simplificado (F2.2): filtrado por CATEGORÍA
export function filterProjects(projects: Project[], category: FilterCategoryId | null): Project[]
```

```ts
// utils/media.ts (además de extractYouTubeId)
export function googleDriveEmbedUrl(src: string): string | null // Drive /view → /preview para embeber (DocumentViewerOverlay)
```

## 9. Reglas de validación de datos (`audit:content` en Vitest)

Los carruseles de Proyectos y Experiencia conservan navegación por flechas, teclado y scroll-snap, sin indicador visual de posición.

1. IDs de `technologyIds` existen en el catálogo de tecnologías.
2. No hay IDs duplicados en ninguna colección.
3. Todo `LocalizedText` tiene `es` y `en` no vacíos.
4. URLs: absolutas `https://` o de `mailto:`; `src` de media/documentos existen bajo `public/` (o son URLs de Drive/YouTube válidas).
5. `Project.media` con ≥1 item y `alt` siempre presente en píxeles de imagen.
6. Certificados con `document.src` habilitados para verificar antes de entrar a Fase 7.
7. Campos obligatorios de ProjectOverlay (goal/problem/role/architecture/outcomes/learnings) con contenido en ambos idiomas.
