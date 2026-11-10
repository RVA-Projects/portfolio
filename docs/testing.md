# testing.md — Estrategia de validación

Principio: toda funcionalidad afirmada debe tener prueba ejecutable y reproducible. El harness vive en `package.json` (`npm run validate`) y en CI (GitHub Actions, mismo comando).

## 1. Niveles de prueba

| Nivel                   | Herramienta                           | Qué cubre                                                                                       |
| ----------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Tipado estático         | `tsc --noEmit` (strict)               | Contratos, props, LocalizedText completo                                                        |
| Lint/format             | ESLint (react-hooks, a11y) + Prettier | Reglas de proyecto y accesibilidad estática                                                     |
| Unitarios de lógica     | Vitest                                | Filtros, derivación de tecnologías, helpers de media, sanitización de URLs                      |
| Hooks                   | Vitest + Testing Library              | `useCarousel` (teclado, índices, límites), `useFocusTrap`, `useBodyScrollLock`, `useScrollSpy`  |
| Componentes             | Vitest + Testing Library (`jsdom`)    | Render con props, a11y mínima (roles, labels), interacción (clic filtro, abrir overlay, Escape) |
| Datos (`audit:content`) | Vitest sobre `src/data/`              | Ver sección 3                                                                                   |
| E2E / responsive        | Playwright (Fase 8)                   | Recorridos completos en 6 viewports, teclado, overlay, galería, visor PDF, i18n                 |

## 2. Pruebas de interacción mínimas (Fase 6)

1. Filtro por tecnología: cambian tarjetas + contador + estado activo; `All` restaura.
2. Carrusel: botones prev/next mueven exactamente una tarjeta; indicador de posición correcto; táctil simulado en Playwright.
3. Overlay de proyecto: abre con tarjeta, cierra con Escape/botón/clic-fuera; foco devuelto al trigger; scroll del body bloqueado al abrir y verificado como restaurado al cerrar.
4. Navegación entre proyectos: prev/next conservando overlay; cambio actualiza galería y reinicia índice de media.
5. Overlay de documento: `DocumentViewerOverlay` reutilizado en formación e idiomas (solo cambia el documento, no el componente). No crashea si el PDF no está disponible: muestra aviso controlado.
6. i18n: cambiar idioma no recarga, no cierra overlay, ni rompe el menú; se conservan sección y foco.
7. Menú: cierre por ancla, por clic fuera y con Escape; indicador de sección activa sigue el scroll.
8. Canvas: sin listeners huérfanos tras unmount; se detiene con pestaña oculta (test liviano con mocks de rAF).

## 3. Validación de datos (`audit:content`, Tests en Vitest)

- IDs únicos por colección; `technologyIds` referencian tecnologías existentes.
- Todo `LocalizedText` con `es` y `en` no vacíos (prohibido publicar sin traducción).
- URLs: absolutas con `https://` bien formado o `mailto:`; URLs a Drive/YouTube con formato esperado.
- Assets: cada `src` de media/documento/certificado con ruta local existe bajo `public/` (comprobación con `fs` en los tests).
- Sin datos ficticios: proyectos de prueba etiquetados `status: 'draft'` no aparecen en producción (se filtran y se testea).
- IDs de experiencias/enlaces bien formados (sin caracteres prohibidos).

## 4. Pruebas responsive (Fase 8, Playwright)

Viewports: 320, 375, 414, 768, 1024, 1440 × densidad 2 · orientaciones portrait/landscape en tablets.

Checks automáticos por viewport: sin overflow horizontal (`scrollWidth <= innerWidth`), sin elementos cortados, navegación táctil operativa (swipe del carrusel), targets ≥ 44px, overlays utilizables, focus visible. Informe con screenshots.

## 5. Accesibilidad

- ESLint jsx-a11y en desarrollo.
- Playwright con axe-core (`axe-core/playwright` — devDependency, no runtime) para 3 páginas/estado clave: home, overlay de proyecto, visor PDF.
- Auditoría MANUAL final con lector de pantalla en Windows (Narrator/NVDA) y navegación 100% por teclado: lista de hallazgos en el informe de Fase 8.

## 6. Rendimiento

- Build analizado en cada fase relevante (`vite build` + nota de chunk).
- Presupuestos orientativos: JS ≤ 180KB gzip; CSS ≤ 30KB; imagen de tarjeta ≤ 300KB; foto personal ≤ 200KB.
- Lighthouse Core Web Vitals en producción (URL real de Pages) al terminar Fase 8.

## 7. Comando maestro

```
npm run validate  →  typecheck + lint + format:check + test + build (+ audit:content si está en Vitest)
npm run e2e       →  Playwright (solo Fase 8)
```
