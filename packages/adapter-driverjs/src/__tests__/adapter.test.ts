import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockDriverInstance = vi.hoisted(() => ({
    drive: vi.fn(),
    highlight: vi.fn(),
    destroy: vi.fn(),
    isActive: vi.fn(() => false),
}))

vi.mock('driver.js', () => ({
    driver: vi.fn(() => mockDriverInstance),
}))

vi.mock('../theme', () => ({
    injectTheme: vi.fn(),
}))

const mockShouldRun = vi.hoisted(() => vi.fn(() => true))
const mockGetText = vi.hoisted(() => vi.fn((step: { title: string; description: string }, field: 'title' | 'description') => step[field]))
const mockResolveSelector = vi.hoisted(() => vi.fn(() => document.createElement('div')))
const mockHasSeen = vi.hoisted(() => vi.fn(() => false))
const mockMarkSeen = vi.hoisted(() => vi.fn())

vi.mock('@callis/core', () => ({
    shouldRun: mockShouldRun,
    getText: mockGetText,
    resolveSelector: mockResolveSelector,
    hasSeen: mockHasSeen,
    markSeen: mockMarkSeen,
}))

import { initCallis } from '../adapter'
import { driver } from 'driver.js'
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
            id: 'tour-1',
            url: '/dashboard',
            trigger: 'always',
            steps: [
                {
                    id: 'step-1',
                    type: 'step',
                    selectors: { primary: '[data-callis="nav"]' },
                    title: 'Navigation',
                    description: 'Main nav',
                    position: 'bottom',
                },
            ],
        },
    ],
}

describe('initCallis', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        vi.mocked(driver).mockReturnValue(mockDriverInstance)
        mockShouldRun.mockReturnValue(true)
        mockResolveSelector.mockReturnValue(document.createElement('div'))
        mockHasSeen.mockReturnValue(false)
        mockGetText.mockImplementation(
            (step: { title: string; description: string }, field: 'title' | 'description') =>
                step[field],
        )
        document.head.innerHTML = ''
        document.body.innerHTML = '<title>Test</title>'
    })

    it('calls shouldRun for each tour on init', () => {
        initCallis(mockConfig, { currentPath: '/dashboard' })
        expect(mockShouldRun).toHaveBeenCalledWith(mockConfig.tours[0], {
            path: location.pathname,
            role: undefined,
        })
    })

    it('drives sequential tour when shouldRun returns true', () => {
        mockShouldRun.mockReturnValue(true)
        initCallis(mockConfig, { currentPath: '/dashboard' })
        expect(vi.mocked(driver)).toHaveBeenCalled()
        expect(mockDriverInstance.drive).toHaveBeenCalled()
    })

    it('skips tour when shouldRun returns false', () => {
        mockShouldRun.mockReturnValue(false)
        initCallis(mockConfig, { currentPath: '/settings' })
        expect(mockDriverInstance.drive).not.toHaveBeenCalled()
    })

    it('skips first-visit tour when already seen', () => {
        const config: CallisConfig = {
            ...mockConfig,
            tours: [{ ...mockConfig.tours[0], trigger: 'first-visit' }],
        }
        mockHasSeen.mockReturnValue(true)
        initCallis(config, { currentPath: '/dashboard' })
        expect(mockDriverInstance.drive).not.toHaveBeenCalled()
    })

    it('runs first-visit tour when not yet seen', () => {
        const config: CallisConfig = {
            ...mockConfig,
            tours: [{ ...mockConfig.tours[0], trigger: 'first-visit' }],
        }
        mockHasSeen.mockReturnValue(false)
        initCallis(config, { currentPath: '/dashboard' })
        expect(mockDriverInstance.drive).toHaveBeenCalled()
    })

    it('does not auto-start manual tour', () => {
        const config: CallisConfig = {
            ...mockConfig,
            tours: [{ ...mockConfig.tours[0], trigger: 'manual' }],
        }
        initCallis(config, { currentPath: '/dashboard' })
        expect(mockDriverInstance.drive).not.toHaveBeenCalled()
    })

    it('start() triggers tour by id', () => {
        const bridge = initCallis(mockConfig, { currentPath: '/dashboard' })
        vi.clearAllMocks()
        bridge.start('tour-1')
        expect(mockDriverInstance.drive).toHaveBeenCalled()
    })

    it('highlights permanent tooltip steps', () => {
        const config: CallisConfig = {
            ...mockConfig,
            tours: [
                {
                    ...mockConfig.tours[0],
                    trigger: 'permanent',
                    steps: [
                        {
                            ...mockConfig.tours[0].steps[0],
                            type: 'tooltip',
                        },
                    ],
                },
            ],
        }
        initCallis(config, { currentPath: '/dashboard' })
        expect(mockDriverInstance.highlight).toHaveBeenCalled()
        expect(mockDriverInstance.drive).not.toHaveBeenCalled()
    })

    it('destroy() cleans up drivers and listeners', () => {
        const bridge = initCallis(mockConfig, { currentPath: '/dashboard' })
        bridge.destroy()
        expect(mockDriverInstance.destroy).toHaveBeenCalled()
    })

    it('passes userRole to shouldRun', () => {
        initCallis(mockConfig, { currentPath: '/dashboard', userRole: 'admin' })
        expect(mockShouldRun).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ role: 'admin' }),
        )
    })

    it('skips step when resolveSelector returns null', () => {
        mockResolveSelector.mockReturnValue(null)
        initCallis(mockConfig, { currentPath: '/dashboard' })
        expect(mockDriverInstance.drive).not.toHaveBeenCalled()
    })
})
