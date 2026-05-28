import { describe, it, expect } from 'vitest'
import { shouldRun, getText } from './index'
import type { CallisTour, CallisStep } from '../../types'

const mockTour: CallisTour = {
    id: 'tour-1',
    url: '/dashboard',
    trigger: 'always',
    steps: [],
}

describe('shouldRun', () => {
    it('returns true when path matches and no conditions', () => {
        expect(shouldRun(mockTour, { path: '/dashboard' })).toBe(true)
    })

    it('returns false when path does not match', () => {
        expect(shouldRun(mockTour, { path: '/settings' })).toBe(false)
    })

    it('returns true when user role matches condition', () => {
        const tour: CallisTour = { ...mockTour, conditions: { roles: ['admin'] } }
        expect(shouldRun(tour, { path: '/dashboard', role: 'admin' })).toBe(true)
    })

    it('returns false when user role does not match', () => {
        const tour: CallisTour = { ...mockTour, conditions: { roles: ['admin'] } }
        expect(shouldRun(tour, { path: '/dashboard', role: 'user' })).toBe(false)
    })

    it('returns false when role required but not provided', () => {
        const tour: CallisTour = { ...mockTour, conditions: { roles: ['admin'] } }
        expect(shouldRun(tour, { path: '/dashboard' })).toBe(false)
    })
})

describe('getText', () => {
    const step: CallisStep = {
        id: 'step-1',
        type: 'step',
        selectors: { primary: '[data-callis="test"]' },
        title: 'Raw title',
        titleKey: 'tour.step1.title',
        description: 'Raw description',
        descriptionKey: 'tour.step1.desc',
        i18n: false,
        position: 'bottom',
    }

    it('returns raw text when i18n disabled', () => {
        expect(getText(step, 'title')).toBe('Raw title')
        expect(getText(step, 'description')).toBe('Raw description')
    })

    it('returns translated text when i18n enabled and t provided', () => {
        const i18nStep = { ...step, i18n: true }
        const t = (key: string) => `translated:${key}`
        expect(getText(i18nStep, 'title', t)).toBe('translated:tour.step1.title')
        expect(getText(i18nStep, 'description', t)).toBe('translated:tour.step1.desc')
    })

    it('falls back to raw text when i18n enabled but key missing', () => {
        const i18nStep = { ...step, i18n: true, titleKey: undefined }
        const t = (key: string) => `translated:${key}`
        expect(getText(i18nStep, 'title', t)).toBe('Raw title')
    })

    it('falls back to raw text when i18n enabled but t not provided', () => {
        const i18nStep = { ...step, i18n: true }
        expect(getText(i18nStep, 'title')).toBe('Raw title')
    })
})
