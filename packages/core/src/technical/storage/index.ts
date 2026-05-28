import type { CallisConfig } from '../../types'

const SEEN_PREFIX = 'callis:seen:'
const DRAFT_PREFIX = 'callis:draft:'

export const markSeen = (tourId: string): void => {
    localStorage.setItem(`${SEEN_PREFIX}${tourId}`, '1')
}

export const hasSeen = (tourId: string): boolean =>
    localStorage.getItem(`${SEEN_PREFIX}${tourId}`) === '1'

export const saveDraft = (hostname: string, config: CallisConfig): void => {
    localStorage.setItem(`${DRAFT_PREFIX}${hostname}`, JSON.stringify(config))
}

export const loadDraft = (hostname: string): CallisConfig | null => {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${hostname}`)
    if (raw === null) return null
    try {
        return JSON.parse(raw) as CallisConfig
    } catch {
        return null
    }
}
