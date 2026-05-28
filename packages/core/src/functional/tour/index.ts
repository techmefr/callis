import type { CallisTour, CallisStep } from '../../types'

export const shouldRun = (
    tour: CallisTour,
    context: { role?: string; path: string }
): boolean => {
    if (tour.url !== context.path) return false

    const roles = tour.conditions?.roles
    if (roles && roles.length > 0) {
        if (!context.role) return false
        if (!roles.includes(context.role)) return false
    }

    return true
}

export const getText = (
    step: CallisStep,
    field: 'title' | 'description',
    t?: (key: string) => string
): string => {
    if (!step.i18n || !t) return step[field]

    const key = field === 'title' ? step.titleKey : step.descriptionKey
    if (!key) return step[field]

    return t(key)
}
