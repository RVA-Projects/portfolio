# Sistema visual Studio

Dirección editorial para el portfolio: cuaderno de trabajo técnico construido con papel frío, tinta, reglas finas y acentos naranja de señalización. La identidad usa tipografía y composición, no logotipos ficticios ni superficies decorativas.

## Paleta y temas

- Oscuro predeterminado: fondo tinta `#171916`, superficie `#20231f`, texto marfil `#efeee7` y acento salmón `#ed8054`.
- Claro: papel `#eeece5`, superficie `#f7f6f1`, tinta `#20221f` y acento óxido `#a83c18`.
- Los separadores usan grises con contraste suficiente; el acento se reserva para navegación activa, foco, metadatos y acciones importantes.
- No se usan gradientes decorativos ni sombras en tarjetas. El fondo de puntos es una retícula técnica; el Canvas conserva su reacción interactiva.

## Tipografía

- **DM Serif Display** para el nombre y titulares de sección, con fallback Georgia.
- **DM Sans** para lectura y controles.
- **DM Mono** para metadatos, tecnología y navegación.
- Google Fonts usa `display=swap`, `latin` y `latin-ext`; hay fallback de sistema para carga sin red.

## Composición y componentes

- Contenedor máximo de 1280px, gutters fluidos `clamp(20px, 6vw, 88px)` y ritmo espacial de 4px.
- Hero tipográfica sin fotografía, separador inferior y texto de presentación limitado a una medida legible.
- Secciones como bandas editoriales con kicker `INDEX / NN`, título display y regla superior; no como paneles repetidos.
- Colecciones conservan estructura, filtros, carruseles, controles y overlays. Las tarjetas usan esquinas casi rectas, imagen como evidencia del proyecto y textos alineados a una retícula común.
- Controles conservan un objetivo táctil mínimo de 44px y foco visible.
- Clicker, galerías, filtros, selector de tema/idioma, selector de vistas y overlays conservan su lógica.

## Movimiento y accesibilidad

- Se conservan Canvas, respuesta a clic, microinteracciones y suscripciones existentes. El rediseño no introduce ciclos ni dependencias de runtime.
- `prefers-reduced-motion` sigue reduciendo transiciones y animaciones.
- Tema claro/oscuro se mantiene y comparte la misma jerarquía y composición.
