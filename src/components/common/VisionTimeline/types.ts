// ============================================================================
// Timeline Types
// ============================================================================

export type TimelineStatus = 'past' | 'active' | 'future'
export type IconType = 'assisted' | 'autonomous' | 'standard'

export interface TimelineEra {
  /** Unique identifier */
  id: string
  /** Year range (e.g., "2020-2023") */
  year: string
  /** Era label */
  label: string
  /** Brief description */
  description: string
  /** Icon identifier */
  icon: IconType
  /** Current status of this era */
  status: TimelineStatus
  /** Optional rich tooltip content */
  tooltip?: string
  /** Optional media (image, video) */
  media?: string
}
