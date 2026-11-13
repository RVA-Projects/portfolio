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
  /** D28 — adaptación de marca (mono: silueta del tema · dim: aclara en oscuro). */
  adapt?: 'mono' | 'dim'
}

const svgUrls: Record<string, string> = import.meta.glob('./icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
})

export function TechIcon({ technologyId, icon, adapt }: TechIconProps) {
  const src =
    icon !== undefined
      ? `/portfolio/assets/img/icons/${icon}.png`
      : svgUrls[`./icons/${technologyId}.svg`]

  if (src === undefined) return null

  /* D28 — marca monocroma: silueta con currentColor (el logo se adapta al
     tema sin fondos que desvirtúen su forma; el asset es la máscara). */
  if (adapt === 'mono') {
    return (
      <span
        className={styles.mono}
        style={{
          maskImage: `url("${src}")`,
          WebkitMaskImage: `url("${src}")`,
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <img
      className={
        adapt === 'dim' ? `${styles.techIcon} ${styles['techIcon--dim']}` : styles.techIcon
      }
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      draggable={false}
    />
  )
}
