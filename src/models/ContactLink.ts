import type { BaseEntity, LocalizedText } from './common'

export interface ContactLink extends BaseEntity {
  id: 'github' | 'linkedin' | 'email' | 'cv'
  /** email ⇒ mailto:… */
  url: string
  ariaLabel: LocalizedText
}
