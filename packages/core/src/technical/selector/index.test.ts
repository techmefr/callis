import { describe, it, expect, beforeEach } from 'vitest'
import { resolveSelector } from './index'
import type { CallisStep } from '../../types'

describe('resolveSelector', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
    })

    it('returns element matching primary selector', () => {
        document.body.innerHTML = '<button data-callis="btn-test">Click</button>'
        const step: CallisStep = {
            id: 'step-1',
            type: 'step',
            selectors: { primary: '[data-callis="btn-test"]' },
            title: 'Test',
            description: 'Test desc',
            position: 'bottom',
        }
        expect(resolveSelector(step)).not.toBeNull()
    })

    it('falls back to first matching fallback when primary not found', () => {
        document.body.innerHTML = '<button id="btn-fallback">Click</button>'
        const step: CallisStep = {
            id: 'step-1',
            type: 'step',
            selectors: {
                primary: '[data-callis="btn-missing"]',
                fallbacks: ['#btn-fallback'],
            },
            title: 'Test',
            description: 'Test desc',
            position: 'bottom',
        }
        expect(resolveSelector(step)).not.toBeNull()
    })

    it('returns null when no selector matches', () => {
        const step: CallisStep = {
            id: 'step-1',
            type: 'step',
            selectors: {
                primary: '[data-callis="missing"]',
                fallbacks: ['#also-missing'],
            },
            title: 'Test',
            description: 'Test desc',
            position: 'bottom',
        }
        expect(resolveSelector(step)).toBeNull()
    })

    it('returns null when element not in DOM', () => {
        const step: CallisStep = {
            id: 'step-1',
            type: 'step',
            selectors: { primary: '[data-callis="not-here"]' },
            title: 'Test',
            description: 'Test desc',
            position: 'bottom',
        }
        expect(resolveSelector(step)).toBeNull()
    })
})
