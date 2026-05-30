import { describe, it, expect } from 'vitest'
import { generateTasksMd } from './generateTasksMd'
import type { CallisConfig } from '@callis/core'

const makeConfig = (overrides: Partial<CallisConfig> = {}): CallisConfig => ({
    version: '1.0',
    theme: { primaryColor: '#1a1a2e', textColor: '#fff', overlayOpacity: 0.4, borderRadius: 8 },
    tours: [],
    ...overrides,
})

describe('generateTasksMd', () => {
    it('contains header', () => {
        const md = generateTasksMd(makeConfig())
        expect(md).toContain('# Callis — Tasks')
    })

    it('notes no fragile selectors when all stable', () => {
        const md = generateTasksMd(
            makeConfig({
                tours: [
                    {
                        id: 't1',
                        url: '/dashboard',
                        trigger: 'first-visit',
                        steps: [
                            {
                                id: 's1',
                                type: 'step',
                                selectors: { primary: '[data-callis="btn-save"]' },
                                title: 'Sauvegarder',
                                description: '',
                                position: 'bottom',
                            },
                        ],
                    },
                ],
            }),
        )
        expect(md).toContain('Aucun sélecteur fragile')
    })

    it('lists fragile selectors with suggestions', () => {
        const md = generateTasksMd(
            makeConfig({
                tours: [
                    {
                        id: 't1',
                        url: '/dashboard',
                        trigger: 'first-visit',
                        steps: [
                            {
                                id: 's1',
                                type: 'step',
                                selectors: { primary: '.header-actions > button:last-child' },
                                title: 'Bouton créer',
                                description: '',
                                position: 'bottom',
                            },
                        ],
                    },
                ],
            }),
        )
        expect(md).toContain('fragile')
        expect(md).toContain('.header-actions > button:last-child')
        expect(md).toContain('data-callis=')
    })

    it('lists i18n keys when i18n enabled', () => {
        const md = generateTasksMd(
            makeConfig({
                tours: [
                    {
                        id: 't1',
                        url: '/dashboard',
                        trigger: 'first-visit',
                        steps: [
                            {
                                id: 's1',
                                type: 'step',
                                selectors: { primary: '[data-callis="main-nav"]' },
                                title: 'Navigation principale',
                                titleKey: 'tour.main-nav.title',
                                description: 'Retrouvez tous vos modules.',
                                descriptionKey: 'tour.main-nav.desc',
                                i18n: true,
                                position: 'bottom',
                            },
                        ],
                    },
                ],
            }),
        )
        expect(md).toContain('## Clés i18n à créer')
        expect(md).toContain('tour.main-nav.title')
        expect(md).toContain('tour.main-nav.desc')
    })

    it('skips i18n section when no i18n steps', () => {
        const md = generateTasksMd(makeConfig())
        expect(md).not.toContain('## Clés i18n')
    })
})
