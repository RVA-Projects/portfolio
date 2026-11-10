export type TechnologyFilterValue = string | null

interface TechnologyFilterProps {
  /** Catálogo de tecnologías a indexar (derivado de los proyectos, no del global). */
  labels: { id: string; name: string }[]
  /** null ⇒ All. */
  activeId: TechnologyFilterValue
  onChange: (id: TechnologyFilterValue) => void
}

/**
 * TODO(F6.2): índice horizontal de tecnologías (RF-07). Cambia el estado
 * activo, dispara el filtrado y el contador de resultados. Para "All" se usa
 * el valor null (NUNCA una tecnología con id específico).
 *
 * TODO(F6.2): labels localizados en la sección; el componente solo recibe strings.
 */
export function TechnologyFilter(_props: TechnologyFilterProps) {
  return null
}
