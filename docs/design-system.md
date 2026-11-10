# design-system.md — RVA Portfolio

Sistema visual aprobado y tokens. Estado: propuesta para validar en móvil al terminar la Fase 5 (los valores exactos de tipografía/espaciado se ajustan con maquetas reales antes de construir todas las secciones).

## 1. Dirección artística

- Estética minimalista, tecnológica y profesional: negro/blanco/gris con **rojo como único acento**.
- El rojo se reserva para: elementos activos, indicadores, estados seleccionados, botones importantes, foco y detalles funcionales. Nunca en degradados decorativos ni en superficies grandes.
- Identidad por composición, tipografía y jerarquía; sin mascotas, logos ficticios ni ornamentos.

## 2. Tokens de color (`src/styles/tokens.css`)

| Token                | Valor (propuesto)                   | Uso                                                                                                   |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `--color-bg`         | `#0B0B0C`                           | fondo principal                                                                                       |
| `--color-surface`    | `#141416`                           | tarjetas, paneles                                                                                     |
| `--color-surface-2`  | `#1E1E21`                           | superficie elevada (overlays)                                                                         |
| `--color-line`       | `#2A2A2E`                           | bordes, separadores                                                                                   |
| `--color-text`       | `#F4F4F5`                           | texto principal (≥ 14:1 sobre bg)                                                                     |
| `--color-text-muted` | `#9A9AA0`                           | texto secundario (≥ 4.5:1 sobre bg/surface)                                                           |
| `--color-accent`     | `#E23744`                           | acento (hover/activo/indicadores) — validar contraste con texto blanco ≥ 3:1 en UI y ≥ 4.5:1 en texto |
| `--color-focus`      | `#FFFFFF / #E23744` (outline doble) | anillo de foco visible                                                                                |

Modo claro no previsto (identidad por tema oscuro); si se pide, requeriría tokens alternativos + ADR.

## 3. Tipografía (Google Fonts, carga eficiente con `display=swap`)

| Rol                 | Fuente (propuesta)           | Uso                                                                                   |
| ------------------- | ---------------------------- | ------------------------------------------------------------------------------------- |
| Títulos / display   | **Space Grotesk** (500/700)  | titulares de sección, nombre, datos protagonistas                                     |
| Cuerpo              | **Inter** (400/500/600)      | párrafos, descripciones, botones                                                      |
| Técnica / etiquetas | **JetBrains Mono** (400/500) | etiquetas de tecnologías, contadores, "meta" (fechas, IDs visibles), bloques de datos |

- Cargar con `preconnect` + subsets `latin` y `latin-ext` (valenciano/rumano).
- Fallbacks de sistema equivalentes (`system-ui`, `ui-monospace`) para evitar FOIT.

## 4. Escala tipográfica y fluida

- `--font-size-hero: clamp(2.4rem, 6vw, 4.5rem)` (nombre)
- `--font-size-h2: clamp(1.6rem, 3.6vw, 2.4rem)` (títulos de sección)
- `--font-size-h3: clamp(1.15rem, 2vw, 1.5rem)`
- `--font-size-body: clamp(0.95rem, 1.05vw, 1.05rem)`
- `--font-size-small: 0.85rem` (etiquetas/meta)
- Interlineado: 1.6 en cuerpo, 1.1–1.2 en display.

## 5. Espaciado / ritmo (escala 4px)

`--space-1 … --space-10`: 4, 8, 12, 16, 24, 32, 48, 72, 96, 128 px. Márgenes de sección: 72–128px en escritorio, 48–72 en móvil (`clamp()`). Contenedor: `max-width: 1200px`, padding lateral `clamp(20px, 5vw, 48px)`.

## 6. Radios, sombras y movimiento

- Radios: `--radius-sm: 6px` (tags/botones), `--radius-md: 10px` (tarjetas), `--radius-lg: 16px` (overlays).
- Sombras mesuradas: profundidad solo en overlays y elementos flotantes; tarjetas se diferencian por superficie + borde.
- Duraciones: 150ms (hover/focus), 240ms (transiciones de tarjeta/filtro), 320ms (apertura/cierre de overlays). Easing estándar `cubic-bezier(0.2, 0, 0, 1)`.
- `prefers-reduced-motion: reduce` ⇒ sin transiciones ni animaciones (excepto cambios de opacidad instantáneos) y Canvas estático.

## 7. Componentes base (Fase 5)

- `Button` — 3 variantes: `primary` (rojo, reservado a acciones protagonicas), `secondary` (borde gris), `ghost` (solo texto/icono). Altura mínima 44px táctil.
- `Tag` — chip de tecnología (`small`, mono), tag de categoría (`accent` si recibe el estado activo).
- `SectionHeading` — número de sección + `h2` + subtítulo; generada una sola vez y reutilizada (coherencia).
- `OverlayBase (Modal)` — `fixed inset-0`, superficie `--color-surface-2`, focus-trap, `Escape`, clic-fuera, scroll-lock, restore de foco. ProjectOverlay y DocumentViewerOverlay se componen sobre él.
- `ProjectCard` — imagen 16:10, nombre, resumen, tags de tecnologías (máx. visibles) y badge de categoría; uniforme por breakpoint.
- `MediaGallery` — principal + tiras de miniaturas + navegación + "1/N" (también accesible/con ind. de posición).

## 8. Foto personal

- Ubicación de fichero: `public/assets/img/` (el propietario la coloca).
- Composición propuesta: busto con recorte, tratamiento duotono/gris con acento rojo sutil (a validar en móvil). Si no se copia la imagen, fallará la validación de datos (`audit:content`).
