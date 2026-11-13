# requirements.md — RVA Portfolio

Requisitos funcionales y no funcionales, numerados y trazables. Derivan del brief del proyecto y de las decisiones del propietario (ver `decisions.md`). Cualquier cambio de requisito se registra aquí y, si altera una decisión cerrada, también en la ADR correspondiente.

## 1. Contexto

- **Producto:** portfolio profesional SPA de Andrei Ronai, desarrollador junior especializado en desarrollo de software.
- **Hosting:** GitHub Pages, en el repo existente del portfolio anterior (base path `/portfolio/`).
- **Idiomas:** español (por defecto, con detección de navegador en primera visita) e inglés.
- **Estética:** negro/blanco/gris + rojo como acento selectivo. Minimalista y tecnológica, sin plantilla genérica.
- **Público:** responsables técnicos, empresas de desarrollo, equipos de ingeniería y reclutadores junior.

## 2. Requisitos funcionales

### 2.1 Presentación (intro)

- RF-01: La página arranca directamente con nombre, especialización (texto estático único, sencillo y directo), ubicación, descripción profesional, enlaces de contacto, acceso al CV y tecnologías principales, con jerarquía visual clara y aparición progresiva animada. Sin hero clásico, sin imagen de portada, sin loaders de bienvenida.
- RF-02: ~~Foto personal visible~~ — **RETIRADA (2026-11-13, D10 cancelada por el propietario): sin foto en el portfolio; presentación solo tipográfica.** (La numeración se conserva para no romper referencias.)
- RF-03: Las tecnologías se presentan en tres niveles de jerarquía: principales → usadas en proyectos → herramientas/complementarias.

### 2.2 Navegación

- RF-04: Menú desplegable en la zona superior con anclas a secciones, indicador de sección activa. Se abre con interacción del usuario; se cierra al elegir ancla, al pulsar fuera y con Escape. No permanece fijo: se oculta al interactuar con el resto de la página.
- RF-05: Navegación funcional en teclado y táctil con targets ≥44px.

### 2.3 Proyectos (sección protagonista)

- RF-06: Carrusel horizontal de tarjetas de dimensiones idénticas por breakpoint. Cada tarjeta: imagen, nombre, descripción breve, tecnologías como etiquetas e indicadores visuales de categoría.
- RF-07: Índice horizontal de tecnologías con opción `All`: filtra los proyectos que usan cada tecnología, actualiza estado activo, contador de resultados y transición visual fluida. Lógica de filtrado separada de la representación.
- RF-08: Carrusel navegable por scroll/deshlizar táctil, botones prev/next e indicadores de posición. Sin autoplay que impida la interacción.
- RF-09: Datos de proyectos en estructuras tipadas (`Project`), con `id`s estables, media y enlaces declarativos. Se prohíben repos/enlaces inventados.

### 2.4 Overlay de proyecto

- RF-10: Overlay a pantalla completa: escritorio 50/50 (galería izq., info técnica der. con scroll independiente); móvil apilado (galería arriba, info debajo). Punto de ruptura por necesidad de diseño, no simple reducción mecánica del escritorio.
- RF-11: Galería: imagen/vídeo principal, miniaturas, navegación, indicador de posición, reproducción de vídeo, soporte de imágenes, GIF, vídeo local, YouTube embebido bajo demanda y demos externas.
- RF-12: Info técnica: nombre, descripción, objetivo, problema, responsabilidad, tecnologías, arquitectura, funcionalidades, decisiones técnicas, resultados, aprendizajes; enlaces al final (GitHub/demo/web/docs) solo cuando existan.
- RF-13: Navegación entre proyectos sin cerrar el overlay: botones prev/next, deslizar en táctil, teclado. Cambio de proyecto conserva estructura y actualiza datos y galería.
- RF-14: Cierre por botón visible, Escape y clic fuera cuando corresponda. Bloquea el scroll del documento, restaura foco y scroll al cerrar. Accesible (aria-modal, focus-trap).

### 2.5 Experiencia profesional

- RF-15: Sección independiente que distingue experiencia profesional, freelance, proyectos independientes y colaboraciones. Cada ítem: organización/proyecto, periodo, responsabilidades, descripción, tecnologías, resultados si existen. Los proyectos independientes no se presentan como empleos convencionales. Componentes basados en datos.

### 2.6 Formación

- RF-16: Tres categorías con jerarquía: formación oficial (mayor peso), certificaciones, cursos complementarios (compactos).
- RF-17: Cada ítem: nombre, organismo, fecha, duración, descripción, documento acreditativo si existe.
- RF-18: Al seleccionar un ítem con acreditación se abre `DocumentViewerOverlay` (componente genérico reutilizable): visor del PDF embebido, nombre del documento, info de la acreditación, apertura secundaria en nueva pestaña y descarga; cierre por los mecanismos estándar. Si el fichero no está disponible (mientras el propietario lo sube), muestra un estado de error controlado y no crashea.

### 2.7 Idiomas

- RF-19: Sección de idiomas con datos declarativos: idioma, nivel MCER, nivel conversación/escrito, acreditación y documento. Con acreditación, reutiliza `DocumentViewerOverlay`.
- RF-20 (contenido, propietario confirmado): Castellano (nativo), Valenciano (C1, certificado), Rumano (nativo), Inglés (B2, certificado), Alemán (inicial).

### 2.8 Contacto y misceláneos

- RF-21: Contacto exclusivamente por email (`mailto:` directo); sin formulario. Los demás contactos (GitHub/LinkedIn) quedan como enlaces externos; email lleva su propio icono de copiar al portapapeles como utilidad discreta.
- RF-22: Enlace discreto "Older Portfolio" a la versión anterior (que queda servida bajo un subruteo del mismo repo, p. ej. `/portfolio/old/`) con ficheros migrados durante el despliegue.
- RF-23: CV accesible (PDF en `public/docs/`, con descarga).

### 2.9 i18n y Canvas

- RF-24: Español por defecto con detección del navegador en la primera visita; la selección manual persiste en `localStorage`.
- RF-25: Cambio inmediato en toda la app, sin recargas, conservando sección activa y overlays abiertos. Sin condicionales de idioma dispersos: los textos visibles salen de `src/i18n/`.
- RF-26: Canvas 2D: partículas con conexiones próximas, movimiento suave, reacción moderada al cursor, fondo discreto. React/HTML manejan todo el contenido funcional (Canvas es capa decorativa).

## 3. Requisitos no funcionales

| #      | Requisito                                                                                                                                                                                                                            |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RNF-01 | Responsive real (mobile-first): sin scroll horizontal accidental en móvil, textos sin desbordar, tarjetas equilibradas, overlays adaptados, usabilidad con una mano. Seis rangos de pantalla validados (móvil pequeño → escritorio). |
| RNF-02 | Accesibilidad WCAG: semántica, contraste AA, teclado, focus visible, aria, alt-text, respeto a `prefers-reduced-motion`.                                                                                                             |
| RNF-03 | Rendimiento: sin dependencias de runtime; lazy-loading de imágenes/multimedia; vídeos e iframes bajo demanda; Canvas eficiente (rAF, devicePixelRatio, pausa con pestaña oculta, menos partículas en equipos bajos).                 |
| RNF-04 | Scroll principal nunca bloqueado accidentalmente por overlays (solo overlay activo bloquea, restaurando foco/scroll al cerrar).                                                                                                      |
| RNF-05 | Código SSR-free (SPA estática). No requiere backend.                                                                                                                                                                                 |
| RNF-06 | Bundle de producción sobrio; warnings de tamaño visibles en build.                                                                                                                                                                   |
| RNF-07 | YAML CI/CD de GitHub Actions correcto (build → Pages) y todo recurso referenciado resuelto en el despliegue real.                                                                                                                    |
| RNF-08 | Cero datos ficticios en producción; los datos de prueba declarados solo en tests.                                                                                                                                                    |

## 4. Datos cerrados con el propietario (fecha: 2026-11-10)

1. El nuevo portfolio ocupa el repo del viejo (base `/portfolio/`); el viejo queda accesible como versión anterior.
2. Sin formulario de contacto: solo email.
3. PDFs en Google Drive, preferible copia local para visualizarlos embebidos en el overlay sin pestaña nueva.
4. Idiomas listados en RF-20.
5. Inventario validado (`docs/content-inventory.md`).
6. Español por defecto con detección de navegador.
7. ~~Foto personal sí~~ — retirada (D10 cancelada).
8. Especialización como texto estático único.

## 5. Criterios a validar (aceptación por fase)

- Fase 5: tokens visuales revisados en móvil real antes de seguir.
- Fase 6: cada bloque verificado (ver `implementation-plan.md`).
- Fase 7: `audit:content` verde — sin referencias rotas, sin assets ausentes, textos es/en completos, sin URLs inventadas.
- Fase 8: Playwright multi-viewport verde + deploy real a Pages comprobado, sin regresiones.
