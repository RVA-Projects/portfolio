import type { LanguageId, LocalizedText } from '../models/common'

const collators: Record<LanguageId, Intl.Collator> = {
  es: new Intl.Collator('es', { sensitivity: 'base', numeric: true }),
  en: new Intl.Collator('en', { sensitivity: 'base', numeric: true }),
}

/** Orden ascendente por el nombre visible, ignorando caja y ordenando números naturalmente. */
export function sortByLocalizedName<T extends { name: LocalizedText }>(
  items: readonly T[],
  language: LanguageId,
): T[] {
  return [...items].sort((a, b) => collators[language].compare(a.name[language], b.name[language]))
}

export function naturalCompare(a: string, b: string, language: LanguageId): number {
  return collators[language].compare(a, b)
}
