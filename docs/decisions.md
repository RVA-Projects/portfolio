# decisions.md — RVA Portfolio

Registro de decisiones (ADR ligero). Pueden añadirse con cualquier estado: `propuesta | aprobada | descartada | obsoleta`. Las decisiones aquí aprobadas vinculan a los agentes; cambiarlas exige ADR y aprobación del propietario.

---

## D01 — El nuevo portfolio ocupa el repo del portfolio anterior — ✅ Aprobada (2026-11-10)

- **Decisión:** desplegar el nuevo portfolio en el repo existente (`RVA-Projects/portfolio`), con base path `/portfolio/`. El sitio anterior se preserva copiado en `public/old/` y se enlaza en la nueva app como "Older Portfolio".
- **Alternativas:** repo nuevo (descartada por el propietario: quiere heredar la URL y que el viejo quede "como versión anterior").
- **Impacto:** `vite.config.ts` (`base: '/portfolio/'`); hay que generar la URL de Pages sobre el repo con Actions; al empezar a desplegar, disponer del repositorio remoto en el local (clonar o conectar) y mover los ficheros del sitio anterior a `public/old/` antes del primer deploy para no romper la URL actual.
- **Riesgo:** la configuración exacta del repo (rama Pages, si usa Actions o rama `gh-pages`) solo se confirmará al tener el remoto conectado.

## D02 — Contacto solo por email (sin formulario) — ✅ Aprobada (2026-11-10)

- **Decisión:** sección de contacto mediante `mailto:` directo + enlaces a GitHub/LinkedIn. Se elimina el mecanismo EmailJS + reCAPTCHA del sitio anterior.
- **Motivo:** el propietario lo decide; simplifica, evita credenciales expuestas y claves de servicios de terceros en el cliente.
- **Extras:** botón discreto "copiar email al portapapeles" con feedback accesible (`aria-live`).

## D03 — Documentos: PDF embebido en el overlay (no pestaña nueva) — ✅ Aprobada (2026-11-10)

- **Decisión:** los certificados/CV se abren siempre dentro de `DocumentViewerOverlay` (embebido), no en pestaña nueva.
- **Origen de los ficheros:** el propietario copiará los PDFs directamente al repo (`public/docs/`). Mientras se recopilan, el visor **no debe fallar**: si el fichero no está disponible o la ruta no existe, muestra un estado de error controlado (aviso localizado + acciones secundarias), nunca crashea. `audit:content` lo detectará en Fase 7, pero la app sigue funcionando.
- **Alternativas evaluadas:** 1) iframe a `drive.google.com/file/d/<id>/preview` — funciona en la mayoría de navegadores de escritorio/móviles pero depende de Drive, lo bloquean algunos entornos y los controles de descarga son limitados; 2) react-pdf y similares — dependencia de runtime prohibida sin ADR; no aporta ventaja real para PDFs estáticos.
- **Estado operativo:** servimos el PDF por iframe local con mensaje de error controlado y acciones "abrir en nueva pestaña" y "descargar" como secundarias.

## D04 — Idiomas publicados — ✅ Aprobada (2026-11-10)

- **Contenido definitivo:** Castellano (nativo) · Valenciano (C1, certificado) · Rumano (nativo) · Inglés (B2, certificado) · Alemán (Starter, sin certificado).
- **Nota:** nivel de alemán publicado como **"Starter"** (eliminada la propuesta "A1 inicial"); activado de conformidad con el propietario.

## D05 — i18n propio sin librería — ✅ Aprobada (2026-11-10)

- **Decisión:** módulos `src/i18n/es.ts` / `en.ts` tipados + contexto React. Sin i18next ni similares.
- **Motivo:** solo 2 idiomas, se necesita tipado estricto de claves, y ~50 líneas propias cubren el requisito sin peso ni dependencia. Riesgos: el tipo de claves debe mantenerse sincronizado entre módulos (el tipo lo garantiza: `en.ts` debe estructurar igual que `es.ts`).

## D06 — Carrusel y overlays propios, sin librerías de componentes — ✅ Aprobada (2026-11-10)

- **Decisión:** implementación nativa (CSS scroll/snap + hooks tipados). Sin swiper/embla/shadcn.
- **Motivo:** los requisitos son específicos (tarjetas uniformes, overlay 50/50 con doble scroll, navegación entre proyectos, DocumentViewer genérico); las librerías aportarían peso y abstracciones ajenas al caso. Riesgo: más código propio a mantener, mitigado con tests.

## D07 — Sin frameworks de CSS (Tailwind/Bootstrap) — ✅ Aprobada (2026-11-10)

- **Decisión:** CSS nativo: `tokens.css` con custom properties + módulos por componente.
- **Motivo:** estética propia (negro/blanco/gris + acento rojo) con control fino; sin paso de build adicional; cero runtime.

## D08 — Canvas 2D como capa decorativa aislada — ✅ Aprobada (2026-11-10)

- **Decisión:** partículas + conexiones en un componente `ParticlesCanvas` con ciclo de vida encapsulado en hook; pausa con pestaña oculta / fuera de viewport / `prefers-reduced-motion` (0 partículas animadas).
- **Motivo:** requisito del brief y aporta identidad visual sin afectar a contenido (z-index decorativo, no interfiere en DOM/HTML).

## D09 — Testing: Vitest + Testing Library ahora; Playwright en Fase 8 — ✅ Aprobada (2026-11-10)

- **Decisión:** unitarias/hook/props en Vitest; validación de contenido (`audit:content`) también en Vitest; carga e2e y responsive con Playwright solo al final.
- **Motivo:** coste justo a la altura. Playwright necesita más setup y se justifica en fase de validación integral, no en build tempranas.

## D10 — Foto personal en el portfolio — ✅ Aprobada (2026-11-10)

- **Decisión:** se incluye foto personal; el propietario la colocará en `public/assets/img/`. En Fase 5 se define la composición exacta (proporción, recorte) en `design-system.md`.

## D11 — Texto de especialización estático — ✅ Aprobada (2026-11-10)

- **Decisión:** sin animación de texto rotatorio: descripción profesional estática, breve y directa (diferente del site anterior que usaba un typed-rotator con 3 variantes).

## D12 — Idioma por defecto español con detección de navegador — ✅ Aprobada (2026-11-10)

- **Decisión:** primera visita: `navigator.language` si `es|en`; fallback `es`. Elección manual persiste en `localStorage`. Cambio inmediato sin recargar, conservando scroll y overlays.
