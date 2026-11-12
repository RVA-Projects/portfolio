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
