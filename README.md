# RVA Portfolio

Portfolio profesional SPA de **Andrei Ronai** — React + TypeScript + Vite + CSS nativo + Canvas 2D, desplegado en GitHub Pages dentro del repo `RVA-Projects/portfolio` (base `/portfolio/`).

> Documentación de referencia: `AGENTS.md` (reglas), `docs/` (spec, arquitectura, contratos, decisiones, design system, testing, plan), `memory.md` (estado operativo).

## Comandos

| Comando              | Qué hace                                          |
| -------------------- | ------------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo (sirve bajo `/portfolio/`) |
| `npm run build`      | Build de producción en `dist/`                    |
| `npm run preview`    | Sirve el build en local (con base)                |
| `npm run validate`   | typecheck + lint + format:check + tests + build   |
| `npm run test:watch` | Vitest en modo watch                              |

## Convenciones operativas

- Las reglas permanentes están en `AGENTS.md`; cualquier agente debe leerlo antes de tocar código.
- Ante cambios: actualizar la documentación de `docs/` afectada y `memory.md`.
- El despliegue lo hace `.github/workflows/deploy.yml`: valida, construye y publica en Pages (fuentes de Pages = GitHub Actions).
- Los assets estáticos (media, PDFs) viven en `public/`.

## Estado

Ver `memory.md` y `docs/implementation-plan.md`.
