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

/**
 * D38 — hermeticidad de red: el hook useGlobalCounter hace fetch al montar
 * la App. Por defecto, cualquier petición al servicio de contadores se
 * RECHAZA en unit tests (las suites jamás tocan la red ni contaminan el
 * contador real). Los tests del propio contador lo sustituyen con
 * vi.stubGlobal('fetch', mock).
 */
const realFetch = globalThis.fetch.bind(globalThis)
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  if (url.includes('abacus.jasoncameron.dev')) {
    return Promise.reject(new Error('red bloqueada en unit tests (src/test/setup.ts)'))
  }
  return realFetch(input, init)
}) as typeof fetch
