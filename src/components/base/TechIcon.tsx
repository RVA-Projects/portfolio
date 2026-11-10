import styles from './TechIcon.module.css'

/**
 * Icono de tecnología del catálogo (`Technology.id`). SIEMPRE decorativo:
 * se muestra junto al nombre visible de la tecnología, por lo que se
 * oculta a tecnologías de asistencia (alt vacío + aria-hidden).
 *
 * Resolución:
 * - `icon` definido ⇒ PNG propio en `/assets/img/icons/<icon>.png`
 *   (logotipos sin SVG fiable: python, unity, xampp).
 * - Resto ⇒ SVG original (devicon) en `./icons/<id>.svg`, empaquetado por
 *   Vite como data-URL/asset local. Sin CDN ni dependencias de runtime.
 * - Sin asset ⇒ `null` (defensivo; tests garantizan cobertura completa).
 */

interface TechIconProps {
  technologyId: string
  icon?: 'python' | 'unity' | 'xampp' | 'odoo'
}

const svgUrls: Record<string, string> = import.meta.glob('./icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

export function TechIcon({ technologyId, icon }: TechIconProps) {
  const src =
    icon !== undefined
      ? `/portfolio/assets/img/icons/${icon}.png`
      : svgUrls[`./icons/${technologyId}.svg`]

  if (src === undefined) return null

  return (
    <img
      className={styles.techIcon}
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      draggable={false}
    />
  )
}
