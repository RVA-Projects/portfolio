# testing.md — Estrategia de validación

Principio: toda funcionalidad afirmada debe tener prueba ejecutable y reproducible. El harness vive en `package.json` (`npm run validate`) y en CI (GitHub Actions, mismo comando).

## 1. Niveles de prueba

| Nivel                   | Herramienta                               | Qué cubre                                                                                                                                                                                                                                                                            |
| ----------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tipado estático         | `tsc --noEmit` (strict)                   | Contratos, props, LocalizedText completo                                                                                                                                                                                                                                             |
| Lint/format             | ESLint (react-hooks, a11y) + Prettier     | Reglas de proyecto y accesibilidad estática                                                                                                                                                                                                                                          |
| Unitarios de lógica     | Vitest                                    | Filtros, derivación de tecnologías, helpers de media, sanitización de URLs                                                                                                                                                                                                           |
| Hooks                   | Vitest + Testing Library                  | `useCarousel` (teclado, índices, límites), `useFocusTrap`, `useBodyScrollLock`, `useScrollSpy`                                                                                                                                                                                       |
| Componentes             | Vitest + Testing Library (`jsdom`)        | Render con props, a11y mínima (roles, labels), interacción (clic filtro, abrir overlay, Escape)                                                                                                                                                                                      |
| Datos (`audit:content`) | Vitest sobre `src/data/`                  | Ver sección 3                                                                                                                                                                                                                                                                        |
| E2E / responsive        | Playwright (`@playwright/test`, Chromium) | Recorridos completos contra el build real (`vite preview`, base `/portfolio/`): humo + responsive 375/768/1024/1440, overlays (proyecto con zoom D21, experiencia D20), temas (D18), filtros por categoría, navegación por anclas (D22). Specs en `e2e/`; comando `npm run test:e2e` |

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

## 4. Pruebas responsive (Fase 8, Playwright — IMPLEMENTADA parcialmente)

Config: `playwright.config.ts` — Chromium; `colorScheme: 'dark'` (escenario determinista D18); `webServer` = `vite build && vite preview --port 4173 --strictPort` (base `/portfolio/`); español forzado vía `localStorage` (D12).

Cobertura actual (15 tests):

- **Humo + responsive** (`e2e/smoke.spec.ts`): 375/768/1024/1440 — sin scroll horizontal (`scrollWidth <= clientWidth`), menú SIEMPRE accesible tras desplazarse al final (D22), secciones presentes (`contact` pendiente de F6.8, excluido).
- **Overlays** (`e2e/overlays.spec.ts`): ficha de proyecto abrir/cerrar con Escape; zoom D21 (lupa → capa → Escape ×2); prev/next con ←/→; experiencia D20 («Ver proyecto» abre la ficha); navegación por anclas + barra compacta.
- **Temas + filtros** (`e2e/theme-filters.spec.ts`): html SIN atributo en oscuro (estado base), claro con persistencia tras recargar; filtros: categoría sin proyectos «0 proyectos», recuento = fichas, «Todas» restaura.

Pendiente (opcional, post-deploy): viewports 320/414 + landscape, targets ≥44px medidos, axe-core en 3 estados clave (sección 5), screenshots del informe.

## 5. Accesibilidad

- ESLint jsx-a11y en desarrollo.
- Playwright con axe-core (`axe-core/playwright` — devDependency, no runtime) para 3 páginas/estado clave: home, overlay de proyecto, visor PDF.
- Auditoría MANUAL final con lector de pantalla en Windows (Narrator/NVDA) y navegación 100% por teclado: lista de hallazgos en el informe de Fase 8.

## 6. Rendimiento

- Build analizado en cada fase relevante (`vite build` + nota de chunk).
- Presupuestos orientativos: JS ≤ 180KB gzip; CSS ≤ 30KB; imagen de tarjeta ≤ 300KB.
- Lighthouse Core Web Vitals en producción (URL real de Pages) al terminar Fase 8.

## 7. Comando maestro

```
npm run validate   →  typecheck + lint + format:check + test + build (+ audit:content en Vitest)
npm run test:e2e   →  Playwright (build + preview + 15 tests, Chromium)
```
