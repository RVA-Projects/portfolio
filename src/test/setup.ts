import '@testing-library/jest-dom/vitest'

/**
 * jsdom no implemente Element.scrollTo/scrollBy (APIs de scroll-snap que el
 * hook useCarousel usa en producción). Stub no-op: suficiente para que las
 * pruebas verifiquen lógica de estado, no el desplazamiento visual real.
 */
if (typeof Element.prototype.scrollTo !== 'function') {
  Element.prototype.scrollTo = (() => {}) as Element['scrollTo']
}
if (typeof Element.prototype.scrollBy !== 'function') {
  Element.prototype.scrollBy = (() => {}) as Element['scrollBy']
}
