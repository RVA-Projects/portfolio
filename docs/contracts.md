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
export type TechnologyTier = 'core' | 'project' | 'tool'

export interface Technology extends BaseEntity {
  name: string
  tier: TechnologyTier // core | project | tool
  icon?: 'python' | 'unity' | 'xampp' | 'odoo' // PNG custom en /assets/img/icons/; resto ⇒ SVG inline (TechIcon)
} // nombre canónico sin traducir; icon opcional (PNG custom) o SVG inline resuelto por TechIcon
```

- Los proyectos referencian tecnologías por `technologyIds: string[]`, nunca copian el nombre.
- `All` es estado del filtro (`null`), no una tecnología.

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
  /** Ruta local (/docs/…) si el propietario copia el PDF al repo; o URL de Drive/YouTube. */
  src: string
  name: LocalizedText // nombre del documento para el visor
}
```

## 5. Experiencia

```ts
// models/Experience.ts
export type ExperienceKind = 'professional' | 'independent' | 'collab'
// 'freelance' eliminado: 'profesional' incluye el trabajo freelance remunerado (decisión propietario 2026-11)

export interface Experience extends BaseEntity {
  kind: ExperienceKind
  organization: LocalizedText // o nombre del proyecto independiente
  period?: { start: string; end?: string } // "YYYY" | "YYYY-MM"; sin fecha confirmada ⇒ ausente (no se inventan)
  role?: LocalizedText
  responsibilities: { id: string; text: LocalizedText }[]
  description?: LocalizedText
  technologyIds: string[]
  outcomes?: { id: string; text: LocalizedText }[]
  links?: { id: string; url: string }[]
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

## 7. Contacto

```ts
// models/ContactLink.ts
export interface ContactLink extends BaseEntity {
  id: 'github' | 'linkedin' | 'email' | 'cv'
  url: string // email → mailto:…
  ariaLabel: LocalizedText
}
```

## 8. Contratos de componentes (props, resumidos)

Todos los componentes reciben datos por props; ninguno importa entidades concretas de `data/` (la inyección es del árbol de secciones).

| Componente              | Props (esencia)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SectionHeading`        | `kicker: string; title: string; subtitle?: string` — textos ya traducidos por la sección (i18n resuelve a strings)                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `Tag`                   | `label: string; variant?: 'tech' \| 'category' \| 'accent'; onClick?`                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `Button`                | `label: string; onClick?; href?; external?: boolean; download?: boolean; variant; icon?; ariaLabel?; disabled?` (`href` ⇒ `<a>`; `download` añade el atributo download, usado por el visor de documentos)                                                                                                                                                                                                                                                                                                                                       |
| `ProjectCard`           | `project; onSelect(projectId)`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `TechnologyFilter`      | `technologies; activeId: TechnologyFilterValue; onChange(id: TechnologyFilterValue)`                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `ProjectCarousel`       | `projects; onSelect(projectId)` — interno: keyboard/táctil/botones en hook `useCarousel`                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `ProjectOverlay`        | `project \| null; onClose(); onPrev?(); onNext?(); hasPrev; hasNext` — textos vía `useLanguage()` (justificación: evita pasar language + tablas duplicadas por props). Proyectos con `playUrl` ofrecen botón «Jugar ahora»: modo juego con iframe a todo el panel, «Cerrar juego» sin cerrar el overlay, `dismissable: false` (clic fuera no cierra) y Escape cierra solo el juego                                                                                                                                                              |     |
| `MediaGallery`          | `items` — interna: índice activo, teclado ←/→, miniaturas, indicador 1/N aria-live; YouTube lazy (facade + botón ▶)                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `EducationCard`         | `item: Education; onOpenDocument(document: DocumentRef)` — botón «Ver acreditación» solo con `document`                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `ExperienceCard`        | `experience` (agrupa por `kind` en la sección)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `LanguageCard`          | `item: LanguageProfile; onOpenDocument(document: DocumentRef)` — botón «Ver certificado» solo con `document` (PDFs de idiomas pendientes, F7.3)                                                                                                                                                                                                                                                                                                                                                                                                 |
| `DocumentViewerOverlay` | `document: DocumentRef \| null; onClose(); ui: { close; openNewTab; download; errorTitle; errorBody }` — embebido inline, NUNCA pestaña nueva; Drive se transforma a `/preview` (`googleDriveEmbedUrl`); timeout/onError ⇒ error controlado con acciones abrir/descargar                                                                                                                                                                                                                                                                        |
| `Modal` (OverlayBase)   | `open; onClose(); labelledById; flush?; aside?; dismissable?=true; children` — encapsula focus-trap, Escape, clic-fuera, scroll-lock; `flush` desactiva el scroll del panel (layout 50/50 del ProjectOverlay); `aside` renderiza contenido complementario dentro del backdrop (fuera del `overflow` del panel, p. ej. flechas flotantes del ProjectOverlay) y queda cubierto por el focus-trap, que ahora abarca TODO el backdrop; `dismissable: false` ignora backdrop y Escape (modo juego: el cliente mantiene su propio escape por teclado) |
| `TopBar`                | `menuOpen: boolean; onToggleMenu(); visible: boolean; theme: ThemeId ('dark' \| 'light'); onToggleTheme()` — menú + toggle de tema (D18); oculto al deslizar abajo (RF-04, cambia en F7.1)                                                                                                                                                                                                                                                                                                                                                      |

**Temas (D18):** hook `useTheme()` en `src/hooks/useTheme.ts` — inicial = `localStorage('rva-portfolio-theme')` ?? `prefers-color-scheme` (fallback oscuro); solo la elección manual persiste. Aplica `data-theme='light'` en `<html>` (oscuro = `:root` base, sin atributo). Tokens nuevos: `--color-backdrop`, `--color-media-stage` (oscuro en ambos temas) y `--shadow-overlay`.

`TechnologyFilterValue = string | null` (`null` = All).

## 9. Filtro (lógica pura, testeable)

```ts
// utils/filter.ts
export function filterProjects(projects: Project[], tech: TechnologyFilterValue): Project[]
export function technologiesInProjects(projects: Project[]): Technology[] // para construir el filtro
```

```ts
// utils/media.ts (además de extractYouTubeId)
export function googleDriveEmbedUrl(src: string): string | null // Drive /view → /preview para embeber (DocumentViewerOverlay)
```

## 10. Reglas de validación de datos (`audit:content` en Vitest)

1. IDs de `technologyIds` existen en el catálogo de tecnologías.
2. No hay IDs duplicados en ninguna colección.
3. Todo `LocalizedText` tiene `es` y `en` no vacíos.
4. URLs: absolutas `https://` o de `mailto:`; `src` de media/documentos existen bajo `public/` (o son URLs de Drive/YouTube válidas).
5. `Project.media` con ≥1 item y `alt` siempre presente en píxeles de imagen.
6. Certificados con `document.src` habilitados para verificar antes de entrar a Fase 7.
7. Campos obligatorios de ProjectOverlay (goal/problem/role/architecture/outcomes/learnings) con contenido en ambos idiomas.
