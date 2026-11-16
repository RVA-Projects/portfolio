# architecture.md — RVA Portfolio

Documenta la arquitectura aprobada. Compaginar siempre con `contracts.md` (interfaces) y `decisions.md` (por qué). Cambiar cualquiera de los tres exige coherencia en los que dependen.

## 1. Vista de capas

```
┌ Infraestructura ─ i18n · configuración (vite.config, Actions) · utils/validators
├ Datos           ─ src/data/* (estático, tipado, declarativo, es+en)
├ Presentación    ─ src/components/* (base/layout/sections/projects/overlays/canvas)
└ Orquestación    ─ src/App.tsx · hooks de dominio (filtro, overlays, idioma, scroll-spy)
```

Flujo de datos unidireccional: `data/` → (selección en UI) → props → render. El estado global se restringe a dos contextos: `LanguageContext` y `OverlayContext`.

## 2. Estructura de directorios

```
NewPortfolio/
├ AGENTS.md · memory.md · docs/ · .github/workflows/deploy.yml · vite.config.ts
├ public/
│   ├ assets/img/          — imágenes de identidad (sin foto: D10 cancelada)
│   ├ media/projects/<slug>/ — media de cada proyecto
│   ├ docs/                — CV y PDFs de acreditaciones (locales)
│   └ old/                 — copia del portfolio anterior (versiones)
├ src/
│   ├ main.tsx · App.tsx
│   ├ models/    Project.ts · Technology.ts · Education.ts · Experience.ts · LanguageProfile.ts · common.ts (LocalizedText, LanguageId…)
│   ├ data/      site.ts · technologies.ts · projects/<slug>.ts · education.ts · experience.ts · languages.ts
│   ├ i18n/      index.tsx (proveedor+hook) · es.ts · en.ts · keys.ts (tipo de claves)
│   ├ components/
│   │   ├ base/      Button · IconButton · Tag · SectionHeading · Modal(OverlayBase)
│   │   ├ layout/    TopBar (ronda 5 F2: nav horizontal permanente, sin menú desplegable)
│   │   ├ sections/  Introduction · ExperienceSection · EducationSection · LanguagesSection · Footer
│   │   ├ projects/  ProjectCarousel · ProjectCard · TechnologyFilter
│   │   ├ overlays/  ProjectOverlay · MediaGallery · DocumentViewerOverlay
│   │   └ canvas/    ParticlesCanvas
│   ├ hooks/     useLanguage · useOverlays · useCarousel · useScrollSpy · useFocusTrap · usePrefersReducedMotion · useBodyScrollLock
│   └ utils/     filter.ts · media.ts · url.ts · validators/
```

## 3. Gestión de estado

| Tipo       | Mecanismo               | Qué contiene                                                                                                              |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Local      | `useState`/`useReducer` | menú abierto, índices de carrusel, pestaña/galería activa                                                                 |
| Compartido | Contextos               | `LanguageContext` (idioma + texto `t()`), `OverlayContext` (proyecto o documento activo, orden de proyectos para navegar) |
| Derivado   | `useMemo`               | proyectos filtrados, proyectos visibles por tecnología                                                                    |
| Estático   | imports de `src/data/`  | entidades completas (tipadas, tree-shakeables)                                                                            |

Regla: nada que pueda derivarse de otro estado vive en estado duplicado (p. ej., el contador del filtro se calcula, no se guarda).

## 4. Overlays (contrato operativo)

`OverlayContext` gestiona dos slots mutuamente excluyentes: `activeProjectId` y `activeDoc`. Responsabilidades del slot:

1. Bloqueo del scroll del body (`useBodyScrollLock`) al abrir, restauración al cerrar.
2. Focus-trap + cierre con Escape + clic-fuera cuando proceda + `aria-modal`.
3. Restauración del foco al elemento disparador al cerrar.
4. En ProjectOverlay: navegación prev/next entre proyectos respetando el filtro activo, con scroll reducido/reset de galería al cambiar.

## 5. Canvas 2D

- Componente `ParticlesCanvas` detrás del contenido (`position: fixed; z-index:-1`) en la primera sección; se detiene al salir del viewport (IntersectionObserver) y con `visibilitychange`.
- Densidad adaptada: recompute si `devicePixelRatio` > 2 u pantalla pequeña; 0 en `prefers-reduced-motion` (en su lugar, fondo estático con el mismo gradiente radial).
- Ciclo de vida en un único hook con cleanup completo (listeners + rAF).

## 6. Estilos

- `src/styles/` — `tokens.css` (paleta, tipografía, espaciado, breakpoints como custom properties), `base.css` (reset + tipografía base) y un módulo `.module.css` por componente.
- Mobile-first: estilos base = móvil; `@media (min-width: …)` para escalar.
- Breakpoints (afinar en Fase 5): 576 / 768 / 1024 / 1440 px.

## 7. i18n

- `init`: se calcula el idioma inicial en este orden → 1) valor de `localStorage`, 2) `navigator.language` si empieza por `es` o `en`, 3) fallback `es`.
- `t(key)` tipado en las claves de `keys.ts`; los textos de Quick UI en `es.ts`/`en.ts` comparten estructura exacta (verificada por tipo).
- El cambio de idioma solo dispara re-render del árbol: no toca rutas ni recarga, ni cierra menú/overlay.

## 8. Despliegue (GitHub Pages)

- Repo: `RVA-Projects/portfolio` (el repo histórico del portfolio anterior). `vite build --base=/portfolio/`.
- Workflow (`deploy.yml`): Node 22 · `npm ci` · `validate` (typecheck+lint+test) · `vite build` · subida del `dist/` a Pages.
- El portfolio anterior se servirá desde `public/old/` (copia de su sitio estático preservada como versión anterior), enlazado con el enlace discreto "Older Portfolio".
- SPA sin rutas de servidor: navegación por anclas; no existe el problema de 404 en rutas profundas.
- Verificación post-deploy (obligatoria): probar la versión de producción en la URL real, no solo `npm run dev`.
