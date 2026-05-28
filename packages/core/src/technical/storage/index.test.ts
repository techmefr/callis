import { describe, it, expect, beforeEach } from 'vitest'
import { markSeen, hasSeen, saveDraft, loadDraft } from './index'
import type { CallisConfig } from '../../types'

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

describe('markSeen / hasSeen', () => {
    beforeEach(() => localStorage.clear())

    it('returns false when tour not seen', () => {
        expect(hasSeen('tour-1')).toBe(false)
    })

    it('returns true after marking seen', () => {
        markSeen('tour-1')
        expect(hasSeen('tour-1')).toBe(true)
    })

    it('does not affect other tours', () => {
        markSeen('tour-1')
        expect(hasSeen('tour-2')).toBe(false)
    })
})

describe('saveDraft / loadDraft', () => {
    beforeEach(() => localStorage.clear())

    it('returns null when no draft saved', () => {
        expect(loadDraft('example.com')).toBeNull()
    })

    it('returns saved config', () => {
        saveDraft('example.com', mockConfig)
        expect(loadDraft('example.com')).toEqual(mockConfig)
    })

    it('overwrites previous draft', () => {
        saveDraft('example.com', mockConfig)
        const updated = { ...mockConfig, version: '1.1' }
        saveDraft('example.com', updated)
        expect(loadDraft('example.com')?.version).toBe('1.1')
    })

    it('isolates drafts by hostname', () => {
        saveDraft('example.com', mockConfig)
        expect(loadDraft('other.com')).toBeNull()
    })
})
