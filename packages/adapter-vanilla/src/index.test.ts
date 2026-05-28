import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { initCallis } from './index'
import type { CallisConfig } from '@callis/core'

const mockConfig: CallisConfig = {
    version: '1.0',
    theme: {
        primaryColor: '#1a1a2e',
        textColor: '#ffffff',
        overlayOpacity: 0.4,
        borderRadius: 8,
    },
    tours: [
        {
            id: 'always-tour',
            url: '/test',
            trigger: 'always',
            steps: [
                {
                    id: 'step-1',
                    type: 'step',
                    selectors: { primary: '[data-callis="test-el"]' },
                    title: 'Test Title',
                    description: 'Test description',
                    position: 'bottom',
                },
            ],
        },
        {
            id: 'manual-tour',
            url: '/test',
            trigger: 'manual',
            steps: [
                {
                    id: 'step-1',
                    type: 'step',
                    selectors: { primary: '[data-callis="test-el"]' },
                    title: 'Manual',
                    description: 'Manual tour',
                    position: 'bottom',
                },
            ],
        },
        {
            id: 'first-visit-tour',
            url: '/test',
            trigger: 'first-visit',
            steps: [
                {
                    id: 'step-1',
                    type: 'step',
                    selectors: { primary: '[data-callis="test-el"]' },
                    title: 'First visit',
                    description: 'First visit tour',
                    position: 'bottom',
                },
            ],
        },
    ],
}

describe('initCallis', () => {
    let targetEl: HTMLElement

    beforeEach(() => {
        targetEl = document.createElement('div')
        targetEl.setAttribute('data-callis', 'test-el')
        document.body.appendChild(targetEl)
        localStorage.clear()
        Element.prototype.scrollIntoView = vi.fn()
    })

    afterEach(() => {
        document.body.innerHTML = ''
        localStorage.clear()
        window.callis = undefined
    })

    it('returns instance with start and destroy', () => {
        const instance = initCallis(mockConfig, { currentPath: '/other' })
        expect(typeof instance.start).toBe('function')
        expect(typeof instance.destroy).toBe('function')
        instance.destroy()
    })

    it('sets window.callis', () => {
        const instance = initCallis(mockConfig, { currentPath: '/other' })
        expect(window.callis).toBe(instance)
        instance.destroy()
    })

    it('runs tour matching current path', () => {
        const instance = initCallis(mockConfig, { currentPath: '/test' })
        expect(document.body.children.length).toBeGreaterThan(1)
        instance.destroy()
    })

    it('does not run any tour on non-matching path', () => {
        const instance = initCallis(mockConfig, { currentPath: '/other' })
        expect(document.body.children.length).toBe(1)
        instance.destroy()
    })

    it('does not auto-run manual trigger tour', () => {
        const manualOnlyConfig: CallisConfig = {
            ...mockConfig,
            tours: [mockConfig.tours[1]!],
        }
        const instance = initCallis(manualOnlyConfig, { currentPath: '/test' })
        expect(document.body.children.length).toBe(1)
        instance.destroy()
    })

    it('destroy removes all injected elements', () => {
        const instance = initCallis(mockConfig, { currentPath: '/test' })
        expect(document.body.children.length).toBeGreaterThan(1)
        instance.destroy()
        expect(document.body.children.length).toBe(1)
    })

    it('start triggers a tour regardless of current path', () => {
        const instance = initCallis(mockConfig, { currentPath: '/other' })
        expect(document.body.children.length).toBe(1)
        instance.start('manual-tour')
        expect(document.body.children.length).toBeGreaterThan(1)
        instance.destroy()
    })

    it('does not run first-visit tour when already seen', () => {
        localStorage.setItem('callis:seen:first-visit-tour', '1')
        const firstVisitOnly: CallisConfig = {
            ...mockConfig,
            tours: [mockConfig.tours[2]!],
        }
        const instance = initCallis(firstVisitOnly, { currentPath: '/test' })
        expect(document.body.children.length).toBe(1)
        instance.destroy()
    })

    it('uses t() for i18n steps', () => {
        const i18nConfig: CallisConfig = {
            ...mockConfig,
            tours: [
                {
                    id: 'i18n-tour',
                    url: '/test',
                    trigger: 'always',
                    steps: [
                        {
                            id: 'step-1',
                            type: 'step',
                            selectors: { primary: '[data-callis="test-el"]' },
                            title: 'Fallback title',
                            description: 'Fallback desc',
                            position: 'bottom',
                            i18n: true,
                            titleKey: 'tour.step1.title',
                            descriptionKey: 'tour.step1.desc',
                        },
                    ],
                },
            ],
        }
        const t = (key: string): string => `[${key}]`
        const instance = initCallis(i18nConfig, { currentPath: '/test', t })
        expect(document.body.textContent).toContain('[tour.step1.title]')
        instance.destroy()
    })
})
