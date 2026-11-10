import { useCallback, useState } from 'react'

/** Estado abierto/cerrado genérico para el menú y overlays. */
export function useDisclosure(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])
  const onToggle = useCallback(() => setOpen((prev) => !prev), [])
  return { open, onOpen, onClose, onToggle, setOpen }
}
