import { describe, it, expect, beforeEach, vi } from 'vitest'
import { initCallis } from './index'

vi.mock('../mount', () => ({
    mountCallis: vi.fn(),
    toggleCallis: vi.fn(),
}))

describe('initCallis', () => {
    beforeEach(() => {
        delete (window as Window & { __callis?: unknown }).__callis
        vi.clearAllMocks()
    })

    it('registers __callis on window', () => {
        initCallis()
        expect(window.__callis).toBeDefined()
    })

    it('exposes toggle function', () => {
        initCallis()
        expect(typeof window.__callis?.toggle).toBe('function')
    })

    it('exposes start function', () => {
        initCallis()
        expect(typeof window.__callis?.start).toBe('function')
    })

    it('exposes version string', () => {
        initCallis()
        expect(typeof window.__callis?.version).toBe('string')
    })

    it('calls toggle if already initialized', () => {
        const mockToggle = vi.fn()
        window.__callis = { toggle: mockToggle, start: vi.fn(), version: '0.1.0' }
        initCallis()
        expect(mockToggle).toHaveBeenCalledOnce()
    })

    it('does not overwrite existing instance', () => {
        const existing = { toggle: vi.fn(), start: vi.fn(), version: '0.1.0' }
        window.__callis = existing
        initCallis()
        expect(window.__callis).toBe(existing)
    })
})
