// utils.js — Helpers compartidos DOM-free (R36). Aquí vive únicamente el
// código genérico reutilizable, sin acoplarse a las reglas del juego.

// Formatea una fecha ISO 8601 para la UI (ranking). Ante datos raros
// devuelve el texto original: el formato es cosmético, nunca rompe.
export function formatDate(iso, lang = 'es') {
  const locale = lang === 'en' ? 'en-GB' : 'es-ES';
  try {
    return new Date(iso).toLocaleString(locale, { dateStyle: 'short', timeStyle: 'short' });
  } catch (err) {
    return iso;
  }
}
