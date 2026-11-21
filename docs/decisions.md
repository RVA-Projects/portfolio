# decisions.md — RVA Portfolio

Registro de decisiones (ADR ligero). Pueden añadirse con cualquier estado: `propuesta | aprobada | descartada | obsoleta`. Las decisiones aquí aprobadas vinculan a los agentes; cambiarlas exige ADR y aprobación del propietario.

---

## D01 — El nuevo portfolio ocupa el repo del portfolio anterior — ✅ Aprobada (2026-11-10)

- **Decisión:** desplegar el nuevo portfolio en el repo existente (`RVA-Projects/portfolio`), con base path `/portfolio/`. El sitio anterior se preserva en `public/old-version/` y se enlaza en la nueva app como "Older Portfolio". La carpeta fuente `oldPortfolio/` se mantiene excluida por `.gitignore`; su copia publicable forma parte del artefacto de Pages.
- **Alternativas:** repo nuevo (descartada por el propietario: quiere heredar la URL y que el viejo quede "como versión anterior").
- **Impacto:** `vite.config.ts` (`base: '/portfolio/'`); hay que generar la URL de Pages sobre el repo con Actions; antes del deploy, copiar el sitio anterior a `public/old-version/` para conservarlo en la URL nueva.
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

## D10 — Foto personal en el portfolio — ❌ Cancelada (2026-11-13)

- **Decisión original:** se incluye foto personal; el propietario la colocará en `public/assets/img/`.
- **Cancelación (petición explícita del propietario):** NO habrá foto personal en el portfolio — el requisito queda eliminado (RF-02 retirada, F7.4 descartada). La presentación es solo tipográfica (D25).

## D11 — Texto de especialización estático — ✅ Aprobada (2026-11-10)

- **Decisión:** sin animación de texto rotatorio: descripción profesional estática, breve y directa (diferente del site anterior que usaba un typed-rotator con 3 variantes).

## D12 — Idioma por defecto español con detección de navegador — ✅ Aprobada (2026-11-10)

- **Decisión:** primera visita: `navigator.language` si `es|en`; fallback `es`. Elección manual persiste en `localStorage`. Cambio inmediato sin recargar, conservando scroll y overlays.

## D13 — Reclasificación de la experiencia: fin de `freelance` — ✅ Aprobada (2026-11-10)

- **Decisión:** el tipo `ExperienceKind` pierde `freelance`; todo el trabajo remunerado pasa a `professional` (7 entradas: web cmV 2025, redes sociales 2025, agente IA 2026, firma digital 2026, Loki Home 2025, Smarti DATA y comandos de voz vía Upwork sin fecha). Group order: professional → independent → collab.
- **Motivo:** decisión del propietario: "profesional" ya incluye el trabajo freelance remunerado; un grupo freelance separado fragmentaba sin aportar. El perfil real de Upwork se enlaza en las dos entradas de Upwork con etiqueta dedicada ("Perfil de Upwork").

## D14 — Iconos de tecnología híbridos (SVG devicon local + PNG propios) — ✅ Aprobada (2026-11-10)

- **Decisión:** componente `TechIcon` en `src/components/base/`: SVG originales de devicon descargados como assets locales (`src/components/base/icons/*.svg`, empaquetados por Vite, **sin CDN**) y PNGs propios (`python`, `unity`, `xampp`) en `public/assets/img/icons/` declarados vía `Technology.icon`. Grid uniforme icono+nombre en los 3 niveles de la Introduction (deriva del catálogo, no a mano).
- **Motivo:** fidelidad visual de marca (paths exactos de devicon en vez de aproximaciones a mano) manteniendo cero dependencias de runtime y sin peticiones externas en producción. `tests/technologies.test.ts` garantiza cobertura: toda tecnología del catálogo tiene icono (PNG o SVG).

## D15 — Flechas de navegación del overlay fuera del panel — ✅ Aprobada (2026-11-10)

- **Decisión:** prev/next del ProjectOverlay flotan (`position: fixed`) en los bordes izquierdo/derecho del viewport, centrados verticalmente, ocultos <768px (swipe + teclado cubren móvil). `Modal` incorpora un slot `aside` renderizado dentro del backdrop y el focus-trap pasa a abarcar todo el backdrop. El manejo de ←/→ sube a listener de documento (la galería mantiene su `stopPropagation`).
- **Motivo:** los botones en la cabecera competían con el título/cerrar y quedaban lejos de la galería; flotarlos fuera del panel evita el `overflow:hidden`+animación del panel y mantiene el trap. El botón de cerrar queda como único control del header.

## D16 — Clasificación de la formación y visor de documentos — ✅ Aprobada (2026-11-11)

- **Decisión:** `Education` con jerarquía RF-16 (`official` → `certification` → `course`), datos del inventario §4 + enlaces reales extraídos del portfolio anterior. Clasificación: DAM = `official` en curso, **sin `issuer`** (opcional en el modelo: no se inventa organismo); CCST Cybersecurity (Credly), IT Specialist Databases (Pearson/Credly) y Oracle Fusion AI Agent Studio (CertView) = `certification` con **badge externo real embebible como URL externa**; Oracle Java Foundations = `certification` **sin documento** (sin acreditación verificable, pendiente del propietario); los 6 cursos de OpenWebinars = `course` con **PDF servido localmente** en `/portfolio/docs/<slug>.pdf` (D03: local-first, ficheros pendientes de subida). Sin fechas ni duraciones (la fuente no las publica). `DocumentViewerOverlay` compone sobre `Modal`: iframe embebido (Drive transformado a `/preview` vía `googleDriveEmbedUrl`), detección de fallo por timeout/onError ⇒ **error controlado** con acciones «Abrir en pestaña nueva» y «Descargar» (`Button.download`). Reutilizable en idiomas (F6.7).
- **Motivo:** los badges externos (Credly/CertView) bloquean el embebido por X-Frame-Options; el fallback es el estado de error controlado con acciones (RF-18: el embebido es el visor, nunca pestaña nueva). Los PDFs de Drive pasan a copia local para no depender de un tercero y servirlos desde el propio repo; mientras no estén subidos, el visor degrada sin crash (tolerancia probada en tests con timeout).

## D17 — Snake jugable embebido en el overlay — ✅ Aprobada (2026-11-12)

- **Decisión:** `Project.playUrl?: string` (solo snake: `https://rva-projects.github.io/snake/`, su despliegue real). El ProjectOverlay ofrece un botón primario «Jugar ahora» que entra en modo juego: iframe del juego a todo el ancho/alto del panel (oculta galería, info y flechas flotantes), con «Cerrar juego» que vuelve a la vista del proyecto SIN cerrar el overlay. `Modal` incorpora `dismissable?: boolean` (default `true`): en modo juego vale `false`, así que el clic en el backdrop NO cierra (no se pierde la partida) y el Escape del Modal queda deshabilitado; el propio overlay captura Escape para cerrar SOLO el juego, garantizando la salida por teclado (a11y 2.1.2).
- **Motivo:** petición del propietario (2026-11-12): jugar sin abandonar el portfolio y sin perder la partida por un clic accidental. El `dismissable` como prop genérica de Modal (y no un hack de listeners) mantiene la primitiva reusable; la X del header sigue cerrando el overlay completo en cualquier modo.

## D18 — Tema claro/oscuro con tokens reescritos — ✅. Aprobada (2026-11-12)

- **Decisión:** paleta base `:root` = tema OSCURO (identidad actual); tema claro con `:root[data-theme='light']` reescribiendo SOLO las variables de color (bg #f7f7f8, texto #17171a, superficies/líneas grises, acento rojo oscurecido a #c0212c para contraste AA sobre claro). Tokens nuevos: `--color-backdrop` (elimina el rgba hardcoded del Modal), `--color-media-stage` (stage oscuro en ambos temas, identidad de visor) y `--shadow-overlay` (sombra del menú adaptable). Mecanismo: hook `useTheme` (patrón D12) — localStorage `rva-portfolio-theme` ?? `prefers-color-scheme` (fallback oscuro, guard defensivo si no hay matchMedia); solo la elección manual persiste; aplica `data-theme` en `<html>`. Toggle en TopBar con IconSun/IconMoon inline (labels i18n `nav.toLight`/`nav.toDark`: el botón ofrece el modo contrario).
- **Motivo:** petición del propietario (Fase 1 del plan de actualización). Centralizar en tokens evita duplicar estilos por componente; el tema claro se define una vez y toda la UI existente lo consume por custom properties. Los SVG de marca (devicon) y el texto blanco sobre acento (`Button`/`Tag`/chips/selection) son independientes del tema y se mantienen.

## D19 — Simplificación: fin de los grupos independent/collab de experiencia — ✅. Aprobada (2026-11-12)

- **Decisión:** la experiencia profesional queda como LISTA PLANA de 7 entradas (solo trabajo remunerado/cargos reales); se eliminan las 6 entradas independent/collab (snake, mini-crm, flashcards-app, task-manager, gb-utility, dawdam-top) y el campo `kind` del modelo. Su contenido vive íntegro en las fichas del catálogo de Proyectos (auditoría campo a campo: organization/period/role/description/responsibilities/outcomes/tech/links de cada entrada ya estaban en su ficha — sin dato único que fusionar).
- **Motivo:** petición del propietario (Fase 6): no mantener categorías separadas para contenidos representables en las dos secciones principales.

## D20 — Overlay de experiencia minimalista y proyectos asociados — ✅. Aprobada (2026-11-12)

- **Decisión:** `ExperienceCard` minimalista (título + periodo + TechIcon pequeños; botón estirado a toda la tarjeta con aria-label explícito, nunca solo-hover); `ExperienceOverlay` nuevo componiendo sobre `Modal` (patrón ProjectOverlay: header + bloques, una columna) con descripción/funciones/logros/tags/enlaces. Nuevo campo `Experience.projectIds?: string[]` con mapeo aprobado: cmV-web / redes-sociales / agente-IA → `centro-medico-sector-v`; signature → `signature-application`; loki-home → `loki-home`; Upwork ×2 → sin proyectos. «Ver proyecto» cierra el overlay de experiencia y abre el ProjectOverlay de la ficha (renderizado por ExperienceSection sin prev/next): sin dos Modales superpuestos ni doble Escape.
- **Motivo:** petición del propietario (Fase 5): tarjetas legibles tipo ProjectCard y detalle en overlay reutilizando la arquitectura.

## D21 — Visor ampliado de imágenes (lupa + capa de zoom) — ✅ Aprobada (2026-11-12)

- **Decisión:** la galería pasa a CONTROLADA (el índice `galleryIndex` lo posee ProjectOverlay y se comparte; se conserva al cerrar la capa de zoom). Las imágenes/gif de la galería ofrecen botón de lupa SIEMPRE visible (accesible con teclado y táctil, nunca solo-hover). El visor ampliado (`ImageZoomOverlay`) se renderiza en el slot `aside` del Modal del proyecto — NO es un segundo Modal: vive dentro del backdrop y del focus-trap existente, y sustituye temporalmente la nav flotante. Interacción: zoom con botones +/− (1–4), rueda y pellizco (2 pointers); pan con clamp; swipe horizontal >60px a zoom 1:1 cambia de imagen; ←/→ se consumen en fase captura (cambian de imagen, NO de proyecto — el listener ←/→ del overlay se desactiva mientras el zoom está abierto); jerarquía de Escape: 1ª pulsación cierra SOLO la capa (fase captura, stopPropagation) y devuelve al overlay del proyecto, 2ª cierra el overlay (mismo patrón por capas del modo juego, D17). Cierre adicional: X y clic en el fondo. Foco inicial al botón cerrar (IconButton pasa a `forwardRef`). i18n: `projectOverlay.zoom` + bloque `zoomOverlay` (es/en).
- **Motivo:** petición del propietario (Fase 3): inspeccionar imágenes de proyectos en detalle (screenshots de escritorio, diagramas) sin perder el contexto del overlay ni la posición de la galería; reutiliza el patrón por capas ya aprobado.

## D22 — Menú siempre accesible + grid de tecnologías jerárquico — ✅ Aprobada (2026-11-12)

- **Decisión (7.1):** la TopBar ya NO se oculta al deslizar hacia abajo (antes `topbar--hidden`): pasa a `topbar--compact`, pastilla flotante translúcida (`--color-backdrop` + blur + sombra, padding reducido). `useMenuVisibility` conserva su API (`visible`) pero ahora alterna tamaño normal ↔ compacto; con el menú abierto nunca se compacta. Los targets táctiles no cambian (≥44px).
- **Decisión (7.2):** grid de tecnologías de la intro más grande y jerárquico: `.techGrid` minmax 150px (200px a ≥768px), gap mayor; `.techItem` texto en `--fs-body` y color pleno (ya no muted) e iconos 28px (32px a ≥768px) vía `--tech-icon-size`. Los tres niveles (core/project/tool) conservan sus títulos.
- **Motivo:** petición del propietario (Fase 7): el disparador del menú quedaba inalcanzable en scroll largo (páginas con overlays de scroll propio), y el grid de tecnologías era demasiado discreto para ser el resumen de stack.

## D23 — Fondo animado de puntos (grid con gravedad) — ✅ Aprobada (2026-11-12)

- **Decisión:** capa visual decorativa a pantalla completa (`BackgroundCanvas` + `useParticleGrid` en `src/canvas/`, Canvas 2D nativo sin dependencias; AGENTS.md §9). Grid de puntos (spacing `clamp(36, 5vw, 56)px`, ~600–1.500 según viewport): física de resorte hacia el home (k=90, ζ≈0.63 → retorno con rebote controlado), atracción sutil al cursor (radio 180px, falloff², equilibrio ≈40px de arrastre — SOLO puntero fino; en táctil solo responde al tap), y colapso al pulsar (AMBOS botones idénticos, radio 480px, impulso con falloff², velocidad limitada 1.500px/s, desplazamiento máximo 140px del home). Detalles: malla elástica entre vecinos precomputados (solo bajo compresión → coste cero en reposo), micro-drift sinusoidal (~1px), tamaño/alfa por actividad (4 buckets de fill), eco de anillo único por clic (~450ms), interpolación de color entre temas (~300ms; blanco en oscuro / casi-negro en claro — `particleColors.ts` puro y testeado).
- **Legibilidad:** opacidad global de la capa 0.55 (ateniada a 0.26 con cualquier Modal o menú abierto vía `body:has()` — degradación inocua sin `:has()`), puntos de 1–2px, scrim radial `--color-bg` tras la prosa de la intro (`Introduction::before`, sangrado SOLO vertical para no provocar overflow-x), tarjetas/overlays ya sólidos.
- **Corrección (13-11-2026):** `<canvas>` es elemento REEMPLAZADO: `position:fixed; inset:0` no lo estira (usaba su tamaño intrínseco 300×150 en la esquina superior izquierda → grid recortado). Fix: `width:100%; height:100%` en `.layer`. Visibilidad +30% a petición del propietario (0.42→0.55; atenuada 0.2→0.26). Verificado con Playwright contra el build real (canvas = viewport exacto en 1440×900 y 375×700, screenshots).
- **Ajuste fino (13-11-2026):** TODOS los parámetros de la animación viven en un único bloque comentado al inicio de `src/canvas/useParticleGrid.ts` (grupos: PUNTOS, DENSIDAD, CURSOR, CLIC/ANILLO, MALLA, FÍSICA, RESPIRACIÓN, ACTIVIDAD, COLOR) — el propietario puede experimentar sin tocar nada más; los números restantes en el fichero son ecuaciones, no knobs.

## D24 — Clicker, tooltips y tags sólidos — ✅ Aprobada (2026-11-13)

Tres ajustes de acabado pedidos por el propietario tras ver D23 en producción:

- **Clicker (juguete D23):** botón «Clicker» + contador al extremo derecho del contacto rápido (`Introduction`). Estado local, sin persistencia; cada pulsación dispara el colapso + anillo del fondo (D23 reacciona a CUALQUIER `pointerdown`, no hay acoplamiento nuevo). Contador en mono con `tabular-nums` (sin jitter), formato local del idioma, SIN `aria-live` (clicks rápidos no deben spamear al lector de pantalla; el número es navegable en modo exploración).
- **Tooltips (D24):** todos los botones icónicos (~20 en TopBar, carrusel, galería, zoom, visores, overlays) muestran su `ariaLabel` como tooltip CSS (`::after` de `data-tip` en `IconButton` — un solo texto, cero duplicación). Visible en hover Y focus-visible (nunca solo hover), retardo 380ms al aparecer / instantáneo al ocultarse, `display:none` bajo `hover: none` (táctil). Ancla por defecto al borde derecho del botón (extiende a la izquierda: casi todos viven en esquinas derechas; centrado se recortaba); `tooltipAlign='left'` para las flechas «anterior» del borde izquierdo. Los `Button` con texto visible no llevan tooltip (su etiqueta ya explica su función — criterio minimalista). Refuerzo global: `overflow-x: clip` en `body` (los tooltips ocultos son cajas absolutas que contaban como overflow scrollable; además blinda la regla móvil de cero scroll horizontal).
- **Tags sólidos:** `Tag` (tech/category/accent) con `background: var(--color-surface)` SIEMPRE — el badge de categoría del proyecto se superpone a la imagen y con fondo transparente el texto no se leía. Un cambio en el componente base corrige los 8 usos (ProjectCard, ProjectOverlay, ExperienceOverlay, EducationCard, LanguageCard). Los chips del filtro ya eran sólidos.

- **Verificación:** Playwright contra el build real (contador=5 tras 5 clicks, tooltip visible con contenido correcto, badge `rgb(20,20,22)` oscuro / `#ffffff` claro, overflow-x=0, screenshot del tooltip sin recorte); unitarios 124/124 (nuevo test del clicker); e2e 15/15; validate verde.

## D25 — Presentación profesional de la intro — ✅ Aprobada (2026-11-13)

- **Decisión (ronda 2, F1):** padding superior de la intro reducido a `clamp(56px, 10vh, 112px)` (el nombre sube; verificado y≈90px/1440 e y≈70px/375 con screenshots). Título principal «Desarrollador de software» / «Software developer»; el nivel («Perfil junior» / «Junior profile») pasa a una línea secundaria mono uppercase (`roleNote`, nueva prop en `SiteData`) bajo el título — información complementaria, nunca parte del título ni de la descripción (petición explícita del propietario). La descripción pierde «junior».
- **Motivo:** primera impresión más profesional; el propietario pidió que «junior» aparezca pero sin protagonismo.

## D26 — Email anti-scraping pasivo + contacto rápido rediseñado — ✅ Aprobada (2026-11-13)

- **Decisión (ronda 2, F2):** el email sale del bundle como plaintext: vive codificado en `data/site.ts` (`EMAIL_ENCODED`, XOR 0x5A, `decodeEmail()`) y SOLO se ensambla en memoria al completar el slider de `EmailReveal` (`input[type=range]` 0–100: teclado nativo con flechas, táctil nativo, no depende del ratón). Al revelar: email mono + `IconButton` copiar (`IconCopy` nuevo; tooltip = «Copiar email») con confirmación transient `role=status` («Email copiado», 2s). Sin `mailto:` en el DOM ni el bundle (verificado en `dist` + guard en tests).
- **Límite honesto (documentado por requisito del propietario):** GitHub Pages es estático puro — NO existe validación en servidor (CAPTCHA real imposibles sin backend; no se simula). Es mitigación contra recolección PASIVA (scraper regex sobre HTML/JS/atributos no encuentra la dirección); un scraper que ejecute el JS podría decodificar. Alternativas futuras: formulario externo o endpoint propio.
- **Clicker (D24 evolve):** botón `IconButton` perfectamente circular (`.clickerBtn`) con icono diana (`IconTarget` nuevo), SIN texto visible; tooltip = ariaLabel «Clicker: añade un clic» / «Clicker: add a click». Contador en caja propia con borde (44px, tabular-nums). i18n: clave `clicker` eliminada (no hay texto visible), `clickerAria` actualizado.
- **Contacto:** GitHub/LinkedIn quedan como `Button` ghost junto al EmailReveal (sin botones adicionales).

## D27 — Sección Stack propia, centrada, con dos niveles — ✅ Aprobada (2026-11-13)

- **Decisión (ronda 2, F3):** nueva `TechStackSection` (`id="stack"`) tras Proyectos (orden: intro → projects → stack → experience → education → languages → contact; kickers renumerados 03–06). TODO centrado (petición del propietario): `SectionHeading`, títulos de grupo y grids en flex-wrap `justify-content: center` (evita el estiramiento irregular de auto-fill al centrar).
- **Tiers:** `TechnologyTier` = `'core' | 'explored'` (antes `core | project | tool`). `explored` = «Tecnologías con las que he experimentado» — NO exige aparecer en fichas de proyectos (experimentos cuentan). Sin duplicados (catálogo único). `FILTER_CATEGORY_BY_TECH` intacto (el filtro no usa tiers).
- **Catálogo:** TypeScript ELIMINADO del catálogo completo (nunca usado — decisión del propietario); Kotlin sube a `core`. Core final: JavaScript, React, HTML, CSS, SQL, Git, Java, Python, C#, Kotlin.
- **i18n:** `intro.mainStack/projectStack/tools` eliminados; `sections.stack` + `stack.mainTitle/exploredTitle` nuevos. Tests: `intro-tech.test.tsx` → `tech-stack.test.tsx`; `technologies.test.ts` con tiers nuevos + guard de ausencia de TypeScript; e2e smoke con ancla `stack`.

## D28 — Iconos de marca adaptables por tema — ✅ Aprobada (2026-11-13)

- **Decisión (ronda 2, F4):** dos mecanismos en `TechIcon`, elegidos por medición de contraste del fill más oscuro de cada logo contra `#0b0b0c` (oscuro) y `#f7f7f8` (claro):
  - **`adapt: 'mono'`** (silueta `mask-image` + `background: currentColor`): github (1.09:1), unity PNG (1.07:1), wordpress (2.19:1), mysql (2.88:1) — logotipos monocromos: la silueta hereda el color del texto del tema, forma intacta, un solo asset, sin fondos que desvirtúen la marca.
  - **`adapt: 'dim'`** (multicolor con masa oscura): eclipse (1.37:1), visual-studio (1.82:1), sqlite (1.61:1), csharp (1.96:1) — `filter: brightness(1.55) saturate(0.85)` SOLO en modo oscuro (`html:not([data-theme='light'])`); en claro quedan intactas.
  - El resto pasa (color dominante ≥3:1 o vivo: javascript amarillo, docker, kotlin, android-studio, room, postgresql, vscode…).
- **Modelo:** `Technology.adapt?: 'mono' | 'dim'` (contratos §2); los dos puntos de llamada (`TechStackSection`, `ExperienceCard`) pasan `tech.adapt`.
- **Verificación:** screenshots de la sección Stack en ambos temas (siluetas blancas en oscuro, oscuras en claro; dim intactas en claro). 133 unitarios ✓.

## D29 — Nueva paleta del modo claro — ✅ Aprobada (2026-11-13)

- **Decisión (ronda 2, F5):** paleta clara re-diseñada (aprobada por el propietario tras propuesta con medición): neutros fríos con sesgo azul-pizarra (H≈210, armonía por analogía con el acento) + acento azul eléctrico **#0a66c2** (elegido sobre #0b57d0 y #1a73e8 por mejor balance contraste/viveza). Fondo anti-deslumbramiento `#eef1f4` (adiós al blanco puro), texto pizarra `#1d2733` (no negro puro), muted `#566775`, superficies `#ffffff`/`#e4e8ec`, líneas `#d2d9df`/`#aeb8c0`, backdrop `rgba(228,233,238,0.88)` (adiós al tinte cálido de overlays), sombra `rgba(29,39,51,0.16)`.
- **Contraste (calculado, WCAG 2.2):** texto/fondo 13.3:1 · secundario/fondo 5.2:1 · blanco/acento 5.7:1 · acento/fondo 5.0:1 (UI 3:1 ✓) — todo PASS. Los estados nunca dependen solo de color (fondo + texto cambian juntos).
- **Modo oscuro INTACTO** (requisito del propietario): solo se reescribe el bloque `[data-theme='light']` de `tokens.css`.
- **Puntos del fondo (D23/D29):** partículas en claro → `rgb(63,78,92)` (7.5:1 sobre el nuevo fondo, visible y discreto); test de lerp actualizado (midpoint 159/166.5/173.5).

## D30 — Scrollbar moderna + punto lupa (CursorSpot) — ✅ Aprobada (2026-11-13)

- **Scrollbar:** global (html y TODOS los contenedores, incluidos overlays): fina (10px), pista transparente, thumb redondeado «flotante» (borde transparente + `background-clip: padding-box`) en `--color-line-strong`, hover → acento. Firefox vía `scrollbar-width/color`; WebKit vía `::-webkit-scrollbar*`. Sin dependencias.
- **Punto lupa:** `CursorSpot` (layout/) + `useCursorSpot` — círculo 38px (mayor que el cursor), translúcido con el acento del tema (tokens `--color-spot`, `--color-spot-press`, `--color-spot-glow`), sigue al cursor con inercia (`utils/spot.ts` puro, lerp factor 0.22, rAF; rAF se pausa solo en pestaña oculta). Al pulsar: glow neón (núcleo + doble halo). **DETRÁS del texto** (z-index -1 tras canvas/scrim en el DOM): el texto se lee sobre el halo; sobre superficies opacas (tarjetas, overlays) el punto desaparece sin molestar. Decorativo: `aria-hidden`, `pointer-events:none` (e2e: el click atraviesa al clicker). Oculto en punteros no finos y bajo `prefers-reduced-motion`.
- **Pruebas:** `nextSpot` (3 tests), 136 unitarios ✓, e2e 15/15 ✓, screenshots del punto en reposo/neón en ambos temas.
- **D31 (petición del propietario, 2026-11-13):** los puntos del fondo animado pasan de cuadrados (`fillRect`) a REDONDOS (`moveTo` + `arc` por punto dentro del mismo path), animado y estático; se conserva el batching por cubeta de alfa (un solo `fill` por cubeta). Tests de partículas actualizados (`arc` en lugar de `fillRect`); verificado visualmente.
- **RNF:** pausa con `visibilitychange`; `prefers-reduced-motion` ⇒ grid estático tenue sin interacción (reacciona al cambio en vivo); `devicePixelRatio` + resize con debounce 150ms; densidad reducida (spacing ×1.4) con `navigator.deviceMemory ≤ 2`; sin listeners huérfanos (cleanup verificado en tests); canvas `aria-hidden` + `pointer-events:none` (nunca captura interacciones). Si `getContext` no existe, la capa queda vacía sin crashear.
- **Motivo:** petición del propietario (post plan 2026-11): fondo vivo y vistoso con identidad de tema, sin sacrificar legibilidad ni rendimiento.

## D32 — Fijo: flechas del visor ampliado cerraban la capa — ✅ (2026-11-13, ronda 3 F1)

- **Causa:** el `pointerdown` sobre cualquier hijo (flechas, lupa, X) burbujeaba al contenedor de `ImageZoomOverlay`, que hacía `setPointerCapture`; con la captura activa el `click` posterior se retargetiza al CONTENEDOR, y el cierre por «clic fuera» (`target === currentTarget`) se disparaba. Teclado OK porque los `keydown` van en fase captura con `stopPropagation`.
- **Fix:** `onPointerDown` ignora los eventos nacidos sobre `button`/`a` (`closest('button, a')` ⇒ return): no se captura el puntero, el click llega al botón y navega. Drag/pinch/swipe sobre la imagen intactos; Escape/X/clic-fuera intactos.
- **Lupa (F1.2):** fondo sólido `--color-surface` + borde `--color-line-strong` e icono `--color-text` (antes transparente con opacity .75); hover → `--color-surface-2` + `--color-focus`. Siempre visible (táctil OK).
- **Pruebas:** test de regresión (pointerdown+click sobre flecha navega sin cerrar) — 138 unitarios ✓; verificado con click real Playwright (1↔2 sin cerrar) y screenshots de la lupa en ambos temas.

## D33 — Contacto de la Hero rediseñado (ronda 3 F2) — ✅ Aprobada (2026-11-13)

- **EmailReveal:** caja ÚNICA de tamaño estable (min-width 300px) en ambos estados: bloqueado «Desliza para ver el email», desbloqueado email + copiar DENTRO pegado al borde derecho (flex:1). Slider FUERA, debajo, alineado; al completar se sustituye por indicador verde de finalización (check + «Pareces humano...», `role=status` aria-live). El range nativo se conserva (a11y teclado/táctil sin reimplementar).
- **Token nuevo:** `--color-ok` (verde confirmación): oscuro `#3fb950`, claro `#1a7f37` (AA sobre #eef1f4). Icono `IconCheck` añadido a base/Icons.
- **GitHub/LinkedIn:** dejan `variant="ghost"` (transparente) → piel por defecto de Button (superficie + borde), contenedor SIEMPRE visible; hover/active intactos; enlaces intactos.
- **Post-fix (petición del propietario):** `.quickLinks` `align-items: center` → `flex-start` (los botones quedaban centrados verticalmente respecto al bloque caja+slider; ahora alineados con la FILA de la caja) y cursor del slider `ew-resize` → `grab`/`grabbing` (mano abierta, más moderno y coherente con «deslizar»).
- **Pruebas:** 138 unitarios ✓ (tests D26 intactos: sin plaintext, copiar, transient); screenshots en ambos estados × 2 temas × 375px móvil sin desbordes.

## D34 — Hero como tarjeta translúcida unificada (ronda 3 F3) — ✅ Aprobada (2026-11-13)

- **F3.2:** `.intro` se convierte en UNA tarjeta (token nuevo `--color-hero`: oscuro `rgba(20,20,22,.62)`, claro `rgba(255,255,255,.62)` + borde `--color-line` + `radius-lg`); se elimina el scrim radial irregular de D23 (`::before`) que dejaba zonas cubiertas a mancha. La animación de fondo se percibe sutilmente a través de toda la tarjeta. Ancho `min(--container-max, 100% - 2·pad)` centrado: el borde izquierdo alinea con el contenido del resto de secciones.
- **F3.1:** la descripción pierde el tope `max-width: 62ch` — usa el ancho completo de la tarjeta (petición explícita; líneas largas aceptadas en pantallas anchas).
- **Pruebas:** 138 unitarios ✓; screenshots 1440 claro/oscuro + 375px móvil sin desbordes.

## D35 — Numeración de secciones: Hero = 0 sin número (ronda 3 F4) — ✅ Aprobada (2026-11-13)

- **4.1:** Proyectos 01, Stack 02, Experiencia 03, Formación 04, Idiomas 05 (Contact 06 cuando exista). La Hero no usa `SectionHeading`: no muestra número. Ids técnicos (`#projects`…) y `SECTIONS` intactos.
- **4.2:** el kicker deja de llevar el nombre hardcodeado en inglés (`"02 — Projects"`) que duplicaba el título español de debajo: `SectionHeading` recibe `index: number` y muestra SOLO el número (`String(index).padStart(2, '0')`). El título sigue viniendo de `texts.sections.*` (multiidioma ya preparado).

## D36 — Selector ES/EN en el TopBar (ronda 3 F5) — ✅ Aprobada (2026-11-13)

- **Descubrimiento clave:** la infraestructura i18n YA estaba completa (D12: provider + detección + `localStorage` + `texts.es/en` de UI completos + entidades con `{es,en}`); la F5 se reduce al acceso por UI. NO se ha traducido nada (petición del propietario): el EN de entidades ya existía de fases anteriores y no se ha reescrito.
- **UI:** botón junto al de tema, etiqueta mono del idioma ACTIVO («ES»/«EN», sin banderas); el click alterna vía `setLanguage` (persiste + `<html lang>` + sin recarga). aria-label del idioma activo («Cambiar a inglés» / «Switch to English»). Mismo contenedor 44px que los IconButtons; compact mode OK.
- **Pruebas:** 2 tests nuevos (`language-toggle.test.tsx`: activo visible, alterna, persiste, sin recarga) — 140 unitarios ✓; verificado en Playwright ES↔EN ida y vuelta.

## D37 — RVA Portfolio como proyecto desde el footer (ronda 3 F6) — ✅ Aprobada (2026-11-13)

- **Datos:** `src/data/projects/rva-portfolio.ts` — ficha `Project` INDEPENDIENTE fuera del catálogo `projects` (sin tocar filtros ni carrusel). Categoría `ai-assisted` («Con IA»), tech ids reales (react, css, git, vscode, github), `links: []` (repo remoto pendiente, nada inventado). Media = captura REAL de la home (1440px → `home.webp` 27KB con ffmpeg). Textos ES con EN = fallback ES (D-E).
- **Atribución honesta (petición del propietario):** arquitectura/diseño/decisiones del propietario; código desarrollado con asistencia de IA (OpenCode) bajo su dirección y supervisión — ni IA autónoma ni escritura manual atribuida. Metodología (AGENTS.md, memory.md, docs/, Plan Mode, fases, validación, separación de responsabilidades) en FUNCIONALIDADES.
- **Footer:** la línea de copyright es un `<button>` con piel de footer (subrayado punteado discreto + hover), hint sr-only (`footer.projectHint`), abre el `ProjectOverlay` existente SIN prev/next (ficha única). Escape/X/clic-fuera nativos.
- **Pruebas:** 5 tests nuevos (`rva-portfolio.test.tsx`: datos válidos + media existsSync + apertura/cierre) — 145 unitarios + 15 e2e ✓; verificado visualmente.

## D38 — Contador GLOBAL del Clicker (Abacus) (ronda 3, post-F6) — ✅ Aprobada (2026-11-13)

- **Petición del propietario:** el clicker debe acumular los clicks de TODAS las visitas desde la publicación, sin resetearse entre deploys; tooltip del número «Recuento de clicks».
- **Imposibilidad descartada:** un «JSON integrado» no puede funcionar — GitHub Pages es solo lectura y escribir al repo vía API exigiría embeber un PAT en el bundle (inaceptable). La persistencia global exige un servicio externo; se eligió **Abacus** (https://abacus.jasoncameron.dev, gratuito, sin registro ni clave, CORS `*` verificado, respuesta `{"value": n}` verificada) frente a Cloudflare Worker (propio pero exige cuenta + deploy extra) — descartado por desproporcionado para un contador-juguete.
- **Datos:** contador creado con `/create/rva-portfolio/clicker?initializer=0` (con ADMIN KEY, guardada FUERA del repo — solo el propietario la custodia; permite `/reset` o `/delete`). La clave vive en el servicio ⇒ **sobrevive a cualquier deploy**. Config declarativa en `data/site.ts` (`clickerCounter`). Nota: las claves de Abacus expiran a los 6 meses SIN accesos; el portfolio hace `/get` en cada visita, así que no expira en la práctica.
- **Lógica** (`hooks/useGlobalCounter.ts`): al montar `GET /get` carga el total global (AbortController al desmontar); en cada click suma optimista al instante (la reacción del fondo D23 no espera red) y dispara `GET /hit` fire-and-forget. **Solo sincroniza al cargar** (decisión del propietario): los clicks de otros visitantes no actualizan en caliente. Sin servicio ⇒ degrada a contador de sesión sin romper nada. Privacidad: solo un número agregado, cero datos personales.
- **UI:** el número muestra el total con formato de idioma; tooltip NATIVO (`title`) + hint sr-only («Recuento de clicks» / «Click count») — el tooltip del botón sigue siendo el de D24.
- **Límites honestos:** rate limit 30 req/10s por IP (sobra); el recuento es manipulable por cualquiera que golpeé el endpoint (aceptado: es un juguete).
- **Pruebas:** 4 tests nuevos (`global-counter.test.tsx`, fetch mockeado: lectura al montar, optimista + hits, degradación, tooltip) + guard de red en `src/test/setup.ts` (las suites jamás tocan el contador real) — 149 unitarios ✓. Verificado e2e contra el servicio REAL: carga, click persistido (`value: 1` en el servidor), recarga muestra 1; contador reseteado a 0 tras el diag.

### D38.1 — Fix de la carrera + sincronización EN VIVO (2026-11-16)

- **Bug reportado** («cambio de modo y refresco → parece resetearse, luego se recupera y se acumulan los clicks»): NO era el tema — era una CARRERA entre la lectura inicial y los clicks hechos durante la carga. El GET desfasado SOBRESCRIBÍA los incrementos optimistas (los tapaba); los hits ya estaban en el servidor, así que al refrescar «se recuperaban acumulados». La correlación con el tema era un señuelo: toquetear el tema = clicks rápidos dentro de la ventana de carga (~100ms–1s).
- **Fix triple** en `useGlobalCounter`: (1) reconciliación por MÁXIMO — el servidor jamás baja la cifra local (seguro: ambas solo crecen); (2) `cache: 'no-store'` en la lectura (el total jamás sale de caché HTTP; Abacus no manda cabeceras de caché); (3) `keepalive: true` en el hit (los clicks hechos justo antes de cerrar/recargar sobreviven al unload).
- **Sincronización EN VIVO** (elección del propietario: «más pro», mostrada antes como opcional): stream Server-Sent Events de Abacus (`/stream/rva-portfolio/clicker`, verificado con curl: emite el valor actual al conectar y cada actualización). El primer mensaje = primado (NO cuenta como «de otros»); si una actualización supera la cifra local, el delta son clicks ajenos → pista de ~4s: tooltip del número cambia a «¡Otros visitantes están acumulando clicks!» + pulso CSS (2 latidos, borde `--color-ok`, reduced-motion lo apaga). La respuesta del hit también se reconcilia (detecta a otros entre mi click y la respuesta). Degradación: sin EventSource o stream caído → sync solo al cargar; sin servicio → contador de sesión.
- **Pruebas:** 8 tests (`global-counter.test.tsx`: + «los clicks durante la carga NO se tapan», + stream en vivo con EventSource falso: primado, pista 4s, cleanup, no baja la cifra, propio click sin pista) — 153 unitarios ✓. Verificado e2e contra el servicio REAL: hit desde fuera del navegador → la página abierta sube en vivo (76→77) + pista visible + expira a los 4s. Contador reseteado a 0 (D1) para la publicación.

## D39 — Orientación profesional: Full Stack (ronda 4 F1) — ✅ Aprobada (2026-11-16)

- **Petición:** el perfil NO es frontend — es **Full Stack** (interfaces/UX + lógica y sistemas). La única referencia incorrecta en la UI era `site.description` («Foco en frontend…»); la otra aparición (proyecto Signature Application) describe a ese proyecto y se conserva.
- **Nuevo texto (aprobado por el propietario, es):** «Desarrollador con proyectos reales en web, escritorio y Android. Enfoque Full Stack: diseño y desarrollo de interfaces y experiencia de usuario, además de la lógica y los sistemas que las hacen funcionar.» EN provisional espejo (revisión F7.1 pendiente). Respaldado por el contenido real (proyectos con frontends y backends C#/Python); sin tecnologías o experiencia nuevas.
- **Intacto:** título «Desarrollador de software», roleNote «Perfil junior», estructura visual de la Hero.

## D40 — Ajustes visuales Hero/Stack (ronda 4 F2) — ✅ Aprobada (2026-11-16)

Tres ajustes aprobados por el propietario:

- **2.1 EmailReveal `fit-content` (D-A):** la caja del email deja el `min-width: 300px` + `flex: 1` (el estiramiento del span ERA el hueco entre email y botón) y abraza el contenido: email y copiar quedan próximos y el botón PEGADO al borde derecho (`padding-right: 0` de la caja). Para no romper la estabilidad de tamaño entre estados, el hint bloqueado reserva EXACTAMENTE el ancho del estado revelado vía `min-width: calc(24ch + var(--space-2) + 44px)` (email de 24 caracteres mono —dato de `data/site.ts` D26, si cambia el email hay que actualizar ese `ch`— + gap + IconButton 44×44) + su propio `padding-right` que aporta el aire que antes daba la caja. Slider alineado a la caja (`width: 100%` del block `fit-content`) y `max-width: 100%` anti-desborde. Verificado por e2e diag: borde derecho del botón == borde derecho de la caja (±2px), sin overflow a 1440 y 375, sin salto entre estados.
- **2.2 Título Stack a la izquierda:** fuera el `text-align: center` de `.section` (afectaba al h2 y a los títulos de grupo); los grids conservan `justify-content: center` — alineación del TÍTULO ≠ alineación del CONTENIDO, petición explícita reiterada del propietario.
- **2.3 Stack en tarjeta translúcida (D-B):** la sección entera se convierte en tarjeta con el MISMO lenguaje visual que la Hero, con tokens directos (sin componente `SurfaceCard`): `--color-hero` + borde `--color-line` + `radius-lg`, mismo ancho (`min(var(--container-max), 100% - 2*var(--container-pad))` — el borde izquierdo queda alineado con el contenido del resto de secciones) y `padding-inline: clamp(16px, 3vw, 48px)` como la Hero. La animación de fondo se percibe a través de la transparencia. Iconos y nombres siguen centrados; responsive intacto (1440/375, claro y oscuro verificados por diag).

- **Pruebas:** 153 unitarios ✓ (ninguno asercionaba el centrado), validate completo ✓; diag e2e temporal (borrado tras verificar): sin overflow horizontal en 1440/375 ambos temas.

## D41 — Formación como lista vertical (ronda 4 F3) — ✅ Aprobada (2026-11-16)

- **Petición:** las tarjetas 2×3 desperdiciaban espacio; se sustituyen por una **lista vertical a ancho completo** con el MISMO sistema de fila para las tres categorías (3.4) — las diferencias se expresan con el título de grupo, el emisor y el tamaño tipográfico, no con diseños distintos.
- **`EducationCard` → `EducationRow`** (renombre, `article` + `h3` + meta en línea + acción «Ver acreditación» a la derecha): fuera caja/borde/fondo de tarjeta; separadores inferiores `--color-line` (`:last-child` sin borde). En móvil (<576px) la acción pasa debajo del texto. `EducationSection`: fuera el grid 1/2/3 columnas, lista de 1 columna (`.list` flex).
- **DAM protagonista (3.1, D-D):** el propietario APORTÓ el centro — `issuer: 'ILERNA'` en `data/education.ts` (actualizado el test que blindaba «sin organismo», ahora espera `'ILERNA'` + descripción «Programa oficial de Grado Superior»); fila oficial con título mayor (`.official .title` → `--fs-h3`), sin caja especial. «ILERNA · Programa oficial de Grado Superior, en curso» cubre nombre/identificación/centro/estado en 1-2 líneas.
- **Certificaciones profesionales (3.2):** emisor en mono VERSALITAS (`Cisco`/`Pearson`/`Oracle`) — firma de acreditación, no etiqueta de curso informal. Sin fechas (no hay en la fuente, no se inventan). Java Foundations sigue sin acción (sin acreditación verificable).
- **Cursos (3.3):** mismas filas, emisor `OpenWebinars`, PDFs locales intactos.
- **Pruebas:** 153 unitarios ✓ (16 de education, sin cambios estructurales: las filas conservan `article`/`h3`/botón); diag e2e temporal (borrado): 1440 claro/oscuro + 375 sin overflow. `AGENTS.md`/`contracts.md` actualizados al renombre.

## D42 — Acreditaciones externas en pestaña nueva (ronda 4 F4) — ✅ Aprobada (2026-11-16)

- **Problema:** los badges Credly ×2 y Oracle CertView se abrían en el iframe del visor y los proveedores los bloquean (X-Frame-Options) ⇒ error controlado tras 8s, acreditación invisible.
- **Modelo (D-E):** `DocumentRef.kind: 'pdf' | 'external'` **obligatorio** — la decisión de apertura depende del TIPO DE RECURSO, nunca del nombre ni de la categoría. `kind: 'pdf'` → visor overlay (comportamiento y componente intactos); `kind: 'external'` → URL en PESTAÑA NUEVA vía `Button href` + `external` (`target="_blank"` + `rel="noreferrer noopener"`, ya correctos en el Button base). Prohibido incrustar externos con iframe.
- **Datos:** 3 badges (Credly ×2, CertView) → `external`; 6 PDFs OpenWebinars + 2 certificados de idiomas (valenciano, inglés) → `pdf`.
- **Componentes:** `EducationRow` y `LanguageCard` eligen por `document.kind` (mismo branching en ambos; idiomas hoy son todos pdf, pero la lógica es genérica). `DocumentViewerOverlay` sin cambios.
- **Pruebas:** 155 unitarios ✓ (+2: kind por recurso en datos + badges external no abren overlay con target/rel correctos); `document-viewer.test.tsx` re-focalizado a fixture PDF (React fundamentals) porque el CCST ya no es overlay; `education-section.test.tsx` ahora cuenta 6 botones (overlay) + 3 enlaces con target/rel. Diag e2e real (borrado): clic en el badge Credly abre POPUP con la URL real y el overlay permanece cerrado.

## D43 — Idiomas en fila compacta (ronda 4 F5) — ✅ Aprobada (2026-11-16)

- **Petición:** 5 tarjetas grandes para poca información ⇒ grid `1fr → 2 → 3` sustituido por **`repeat(2, 1fr)` en móvil/tablet y `repeat(5, 1fr)` en escritorio (≥1024px)** — los cinco idiomas en UNA línea con columnas y alturas homogéneas (verificado por diag: alturas idénticas, sin desborde en 1440/768/375).
- **`LanguageCard` compacto:** padding `--space-4` → `--space-3`, título `--fs-h3` → `--fs-body` (600), gap reducido y meta sin margen extra. El acceso al certificado queda anclado abajo (`margin-top: auto`) sin determinar el tamaño: los dos con PDF (valenciano C1, inglés B2) no engordan a los otros.
- **Intacto:** niveles (D04), certificados PDF y su visor (abren por `kind`, D42); en móvil la etiqueta del botón parte en dos líneas dentro de la tarjeta sin desbordes.
- **Pruebas:** 155 unitarios ✓ (languages-section no depende del layout); diag e2e temporal (borrado): 1440 claro/oscuro + 768 + 375, sin overflow.

## D44 — Formación en tarjeta translúcida (ronda 5 F1) — ✅ Aprobada (2026-11-16)

- **Petición:** coherencia visual Hero/Stack/Formación SIN tocar la estructura de Formación (filas, listas, enlaces y comportamientos de la ronda 4 quedan intactos).
- **Solución (D-A):** `EducationSection` adopta el MISMO tratamiento directo con tokens que Hero y Stack (sin wrapper nuevo): fondo `--color-hero` + borde `--color-line` + `radius-lg` + ancho `min(var(--container-max), 100% - 2*var(--container-pad))` + `padding-inline: clamp(16px, 3vw, 48px)` + `padding-block: clamp(24px, 5vh, 48px) var(--space-8)`. Sin blur: Hero y Stack tampoco lo usan — la animación de fondo se percibe por transparencia.
- **Pruebas:** 155 unitarios ✓ (education 18, sin cambios); diag e2e temporal (borrado): 1440 claro/oscuro + 375, sin overflow y estructura intacta.

## D45 — Navegación horizontal permanente (ronda 5 F2) — ✅ Aprobada (2026-11-16)

- **Petición:** secciones SIEMPRE visibles en la barra superior (fuera hamburguesa y menú desplegable); orden 1) nav izquierda, 2) tema, 3) ES/EN derecha; barra accesible al desplazar; enlaces por ancla con scroll suave sin tapar encabezados; responsive sin overflow ni botones cortados.
- **Solución (D-B):** barra `fixed` SIEMPRE visible → se ELIMINAN el estado compacto (`useMenuVisibility`), el menú desplegable (`NavigationMenu.tsx/.module.css`), su apertura/cierre (`useDisclosure`, sin otros consumidores) y las keys i18n `nav.open/close`. `TopBar` nueva firma: `activeId / onNavigate / theme / onToggleTheme` — nav `SECTIONS` a la izquierda (enlaces ancla + `aria-current` + pastilla activa heredada del menú), controles a la derecha (IconButton tema + `.langBtn`).
- **(D-C) móvil:** nav con scroll horizontal interno (swipe, scrollbar oculta); effect auto-alinea el enlace activo vía `scrollLeft` (sin dos filas).
- **(D-D) geometría:** token `--topbar-h: 64px`; `main { padding-top: calc(--topbar-h + space-4) }` y `section[id] { scroll-margin-top: calc(--topbar-h + space-3) }` en `base.css` → los encabezados jamás quedan bajo la barra (verificado por diag: `heading.y >= bar.y + bar.h - 2`).
- **Ajuste en F2:** `'contact'` sale de `SECTIONS` (la sección era stub `null` desde F6.8 y la nav no muestra anclas muertas); su eliminación completa (modelo, sección, i18n) queda para F3.
- **Pruebas:** 153 unitarios ✓ (7 en navigation reescritos, −2 del menú antiguo; jsdom requiere stub de `matchMedia` al pulsar anclas — el antiguo test pasaba porque `#contact` no existía y nunca invocaba `scrollIntoView`); diag e2e temporal (borrado): 1440 top + education sin tapar, 768/375 sin overflow; smoke/overlays e2e adaptados a nav permanente.

## D46 — Fuera la sección Contacto; «Sobre mí» (ronda 5 F3) — ✅ Aprobada (2026-11-16)

- **Petición:** eliminar la sección Contacto independiente (stub `return null` desde F6.8) sin tocar email/GitHub/LinkedIn de la Hero; renombrar la sección 1 a es «Sobre mí» / en «About me» (nav + cualquier visualización); id interno `'intro'` intacto.
- **Solución:** borrado limpio de `ContactSection.tsx` (ni siquiera estaba importado en App) y `models/ContactLink.ts` (sin datos ni consumidores); `'contact'` fuera de `SectionId` (ya había salido de `SECTIONS` en F2/D45); key i18n `sections.contact` borrada es/en; renombrado `sections.intro` («Sobre mí» / «About me») — la Hero la usa como `aria-label` de región y la nav como enlace, todo con una sola key. `SectionId` reformateado a unión multilínea.
- **Docs:** contracts −sección «Contacto» (renumerado 7-9), `ContactLink` fuera; architecture.md −`ContactLink.ts`/`ContactSection`/`contact.ts` (nunca existió en `data/`), layout = TopBar con nav permanente.
- **Pruebas:** 153 unitarios ✓ (navigation: labels «Sobre mí»; i18n test «About me»); diag e2e temporal (borrado): nav sin «Contacto»/`#contact` ausente del DOM, contactos de la Hero visibles, «About me» en EN; validate ✓.

## D47 — Experiencia en carrusel (ronda 6 F1) — ✅ Aprobada (2026-11-17)

- **Petición:** sustituir el grid de tarjetas de Experiencia por un carrusel con el MISMO concepto visual y funcional que Proyectos, reutilizando la arquitectura existente (no dos implementaciones) y sin imágenes.
- **Solución:** nuevo `ExperienceCarousel` que reutiliza SIN CAMBIOS el hook `useCarousel` y **importa** `ProjectCarousel.module.css` (cero CSS duplicado, cero riesgo para Proyectos); `ExperienceCard` gana los mismos anchos por breakpoint que `ProjectCard` (1/2/3 visibles según 576/1024). Contador «N experiencias» + indicador 1/N + flechas `IconButton` + teclado ←/→ + swipe nativo. Sin autoplay.
- **Overlay:** `ExperienceOverlay` añade `onPrev/onNext/hasPrev/hasNext` (patrón del ProjectOverlay): cambia de experiencia SIN cerrar. Diferencia deliberada: las flechas van en el `.navRow` del header SIEMPRE visibles (incl. móvil) porque aquí no existe el swipe de galería que en Proyectos cubre <768px (allí las flotantes se ocultan); ←/→ a nivel documento se mantienen. «Ver proyecto» y Escape intactos.
- **Pruebas:** 157 unitarios ✓ (experience-section 12: carrusel, extremos, prev/next sin cerrar, ←/→, Escape); diag e2e temporal (borrado): 1440 (3 visibles, indicador 2/7 tras next) + 375 (1 visible, sin overflow); validate ✓.

## D48 — Botón CV en la Hero (ronda 6 F2) — ✅ Aprobada (2026-11-17)

- **Petición:** botón pequeño «CV» en la zona de contacto de la Hero (entre email y GitHub), tooltip «Descargar CV» al hover, identificable en táctil, sin competir visualmente; al pulsar NO descarga: abre overlay con CAPTCHA propio.
- **Solución:** reutilización pura — `IconButton` (pill 44px, tooltip D24 con retardo y oculto en táctil) con etiqueta textual mono «CV» dentro (`cvLabel`, misma voz que el selector ES/EN de la TopBar). Keys i18n `intro.cv` / `intro.cvTooltip` («Descargar CV» / «Download CV»). Click placeholder que en F3 abrirá el CAPTCHA.
- **Pruebas:** 160 unitarios ✓ (nuevo tests/cv-button.test.tsx: presencia + aria/data-tip, orden email→CV→GitHub→LinkedIn, es button no enlace); diag e2e temporal (borrado): 1440 tooltip «Descargar CV» visible al hover + 375 sin overflow ni corte; validate ✓.

## D49 — CAPTCHA puzzle del CV (ronda 6 F3) — ✅ Aprobada (2026-11-17)

- **Petición:** CAPTCHA tipo puzzle (estilo Genshin) delante de la descarga del CV, Alternativa A aprobada: barrera disuasoria SIN backend, validación local. Ratón + táctil + teclado, ambos temas, sin recursos externos, posiciones distintas por intento.
- **Solución:** lógica pura en `src/utils/captcha.ts` (PRNG mulberry32 determinista por semilla, `generateChallenge` con hueco en x aleatoria ∈ [15%,85%] del recorrido, `pieceLeftFromSlider`, `isSolved` con tolerancia ±10px, `nextSeed`); `CaptchaPuzzleOverlay` compone sobre `Modal` (focus-trap, Escape, scroll-lock): tablero 320×180 en Canvas 2D con patrón abstracto determinista (mismo rng para fondo y recorte de pieza ⇒ hueco y pieza encajan), pieza con pestaña arriba/muesca abajo, slider `<input type="range">` (ratón+táctil+teclado), éxito ⇒ snap animado + glow + `Button` download `href="/portfolio/docs/cv.pdf"`, fallo ⇒ shake + reintento con semilla nueva. Colores desde tokens del tema activo (MutationObserver en `data-theme`); `prefers-reduced-motion` respetado vía regla global. `Modal` gana prop `className` (panel compacto 420px).
- **Pieza en %:** posición y tamaño en fracción del tablero (`left/top` y `width/height` porcentuales) ⇒ alineación pieza↔hueco a cualquier escala del canvas.
- **LIMITACIÓN explícita (aprobada con la Alternativa A):** la validación es 100% local y el PDF vive en `public/docs/`, servido estáticamente: NO es una protección frente a acceso directo a `/portfolio/docs/cv.pdf`. Es una barrera disuasoria de interacción. Upgrade futuro documentado: Alternativa B (Cloudflare Workers + R2 con URL firmada de un uso).
- **Pruebas:** 174 unitarios ✓ (nuevos: tests/captcha.test.ts 8 — rng determinista, margen del hueco, mapeo slider→px, tolerancia; tests/captcha-overlay.test.tsx 6 — instrucción+slider, éxito⇒enlace download, fallo⇒retry resetea, límite de tolerancia, pieza sigue al slider en %, integración botón→Escape); diag e2e temporal (borrado): fallo/reintento/éxito reales en Chromium con Math.random parcheado + setter nativo del input, tema claro, móvil 375 sin overflow, pieza snap visualmente alineada al hueco; validate ✓.

## D50 — Upwork en la Hero + CV en el visor de documentos (ronda 7) — ✅ Aprobada (2026-11-17)

- **Petición:** (1) botón Upwork junto a LinkedIn con el perfil real; (2) el éxito del CAPTCHA NO descarga: VISUALIZA el CV en el DocumentViewerOverlay (mismo componente que certificaciones/idiomas); al abrirse el visor, el CAPTCHA se cierra.
- **Solución:** (1) `site.upwork` (URL en datos) + `IconUpwork` (glifo oficial simple-icons CC0) + `Button` externo tras LinkedIn/antes del Clicker. (2) `site.cvDocument: DocumentRef` (`kind: 'pdf'`, `src: /portfolio/docs/cv.pdf`) — el componente deja de hardcodear la URL; `CaptchaPuzzleOverlay` gana prop `onOpenCv` y su botón de éxito es un `Button` de click; `Introduction` coordina (patrón EducationSection): `openCvViewer` cierra el CAPTCHA y monta su PROPIA instancia de `DocumentViewerOverlay` (tercera, sin duplicación). Copys: `intro.cvTooltip` y `captcha.openCv` = «Ver CV»/«View CV»; la descarga sigue disponible DENTRO del visor (`documentViewer.download`).
- **Nota de diagnóstico:** headless Chromium no tiene visor PDF embebido (navegar al PDF dispara descarga); el iframe del visor se valida por `src` en e2e y renderiza en navegadores reales (mecanismo idéntico al de certificaciones, ya en producción).

## D51 — Jerarquía descriptiva para Experiencia — ✅ Aprobada (2026-11-19)

- **Petición:** facilitar la identificación del trabajo realizado en las siete experiencias y redactar sus descripciones en tono profesional, manteniendo el carrusel y los overlays.
- **Solución:** `role` es obligatorio y se presenta como título; `organization` identifica empresa, cliente o plataforma como subtítulo. Se actualizan los títulos y las descripciones es/en sin modificar responsabilidades, fechas ni enlaces. En el catálogo de tecnologías se añaden Meta Business Suite (marca Meta) y Google Gemini con SVG locales de Simple Icons, usados solo en las experiencias de redes sociales y del agente IA. El tamaño, distribución y comportamiento de los iconos del carrusel se conservan.
- **Validación:** `npm run validate` — 178 pruebas unitarias, typecheck, lint, formato y build correctos; Playwright 15/15, incluidos los cuatro viewports y los overlays. Se mantiene un warning react-refresh existente en `src/i18n/index.tsx`.

## D52 — Años puntuales y ajuste del Stack — ✅ Aprobada (2026-11-19)

- **Petición:** quitar «Actualidad» de las experiencias, ordenar alfabéticamente cada grupo del Stack, añadir Codex a experimentadas y OpenCoDEX a Stack principal, y restaurar el zoom hover en los iconos que adaptan su color al tema.
- **Solución:** tarjetas y overlays muestran solo `period.start`; las experiencias sin año confirmado siguen sin fecha. Ambos tiers se ordenan por nombre visible. Se añaden las entradas `Codex` y `OpenCoDEX` como elementos distintos, con el mismo icono Codex local del Marketplace oficial. El selector hover usa un atributo compartido en la raíz de cada icono (`img` o máscara `span`), sin alterar tamaño ni layout.
- **Validación:** Vitest, `npm run validate` y Playwright con hover en oscuro/claro y comprobación responsive.
- **Pruebas:** 176 unitarios ✓ (cv-button 4: tooltip «Ver CV», orden email→CV→GitHub→LinkedIn→Upwork, no-enlace, Upwork href/target/rel; captcha-overlay 7: éxito⇒«Ver CV» sin href que llama a onOpenCv + integración App con Math.random stubbed ⇒ captcha cerrado + dialog «CV — Andrei Ronai» abierto); diag e2e temporal (borrado): Upwork en la misma fila tras LinkedIn (1440 y 375 sin overflow), traspaso captcha→visor verificado; validate ✓.

## D54 — Revisión final del catálogo y contenido de proyectos (2026-11-21)

- Se añade `Project.filterCategories` como fuente de los badges de tarjetas y del filtro: Android, Web, C#, Python y Java. Signature Application puede declarar Web y C# simultáneamente. Los tipos de categoría amplios permanecen disponibles para los overlays.
- RVA Portfolio reutiliza su único objeto de datos en la tarjeta final del catálogo y en el acceso del footer. TypeScript se cataloga como `project` para aparecer en fichas sin alterar los dos grids visibles del Stack; OpenCode y Codex reutilizan sus registros existentes.
- Se revisan los contenidos del Centro Médico Sector V, LokiHome, MiniCRM, Snake y RVA Portfolio en español e inglés según información del propietario. La ficha del Centro Médico documenta Google Calendar y el agente Gemini con Eko Knowledge Base, sin WhatsApp.
- Validación: `npm run validate` — typecheck, lint, formato, 185 tests y build correctos. Persiste el warning react-refresh conocido y el stderr de Canvas no implementado por jsdom.

## D55 — Ajustes responsive de overlays y Stack (2026-11-21)

- En móvil (≤767px), los contenidos de proyecto y experiencia limitan el ancho al panel, fuerzan el ajuste de palabras largas y reducen tipografía al 80%; las acciones reducen su ancho con padding compacto y mantienen el objetivo táctil de 44px. La galería limita medios al 100% de su contenedor.
- El visor de documentos sigue embebido. En móvil ocupa hasta 82dvh y deja que el visor PDF nativo del navegador gestione el zoom por gestos; las acciones de abrir/descargar continúan como recuperación ante error de carga.
- Git pasa de `core` a `explored`; Google Gemini pasa a `project` para conservar su referencia en fichas y retirarse de los dos grupos visibles. En móvil y tablet (≤1023px), ambos grids usan cuatro columnas con logo centrado sobre el nombre.
- Contratos actualizados. Validación automatizada pendiente; no se ejecutó en esta ronda.
