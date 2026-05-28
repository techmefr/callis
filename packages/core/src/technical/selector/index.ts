import type { CallisStep } from '../../types'

export const resolveSelector = (step: CallisStep): Element | null =>
    [step.selectors.primary, ...(step.selectors.fallbacks ?? [])]
        .map(sel => document.querySelector(sel))
        .find(Boolean) ?? null
