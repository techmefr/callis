import { describe, it, expect } from 'vitest'
import { generateSnippet } from '../snippet'
import type { CallisConfig } from '@callis/core'

vi.mock('@callis/core', () => ({}))

const mockConfig: CallisConfig = {
    version: '1.0',
    theme: {
        primaryColor: '#1a1a2e',
        textColor: '#ffffff',
        overlayOpacity: 0.4,
        borderRadius: 8,
    },
    tours: [],
}

describe('generateSnippet', () => {
    it('returns string containing initCallis call', () => {
        const snippet = generateSnippet(mockConfig)
        expect(snippet).toContain('initCallis(config')
    })

    it('embeds the config as JSON', () => {
        const snippet = generateSnippet(mockConfig)
        expect(snippet).toContain('"version": "1.0"')
        expect(snippet).toContain('"primaryColor": "#1a1a2e"')
    })

    it('includes driver.js css import', () => {
        const snippet = generateSnippet(mockConfig)
        expect(snippet).toContain("driver.js/dist/driver.css")
    })

    it('includes @callis/adapter-driverjs import', () => {
        const snippet = generateSnippet(mockConfig)
        expect(snippet).toContain("from '@callis/adapter-driverjs'")
    })
})
