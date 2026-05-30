import { describe, it, expect, beforeEach } from 'vitest'
import { generateSelector } from './index'

function makeEl(tag: string, attrs: Record<string, string> = {}): Element {
    const el = document.createElement(tag)
    for (const [k, v] of Object.entries(attrs)) {
        el.setAttribute(k, v)
    }
    document.body.appendChild(el)
    return el
}

describe('generateSelector', () => {
    beforeEach(() => {
        document.body.innerHTML = ''
    })

    it('uses data-callis as primary — not fragile', () => {
        const el = makeEl('button', { 'data-callis': 'btn-create' })
        const { primary, isFragile } = generateSelector(el)
        expect(primary).toBe('[data-callis="btn-create"]')
        expect(isFragile).toBe(false)
    })

    it('uses unique #id as primary — fragile', () => {
        const el = makeEl('div', { id: 'main-nav' })
        const { primary, isFragile } = generateSelector(el)
        expect(primary).toBe('#main-nav')
        expect(isFragile).toBe(true)
    })

    it('uses data-testid when no data-callis or id', () => {
        const el = makeEl('button', { 'data-testid': 'submit-btn' })
        const { primary, isFragile } = generateSelector(el)
        expect(primary).toBe('[data-testid="submit-btn"]')
        expect(isFragile).toBe(true)
    })

    it('falls back to CSS path when no stable selector', () => {
        const el = makeEl('span')
        const { primary, isFragile } = generateSelector(el)
        expect(primary).toContain('span')
        expect(isFragile).toBe(true)
    })

    it('data-callis has id and css path as fallbacks', () => {
        const el = makeEl('button', { 'data-callis': 'btn-save', id: 'save-btn' })
        const { fallbacks } = generateSelector(el)
        expect(fallbacks).toContain('#save-btn')
    })

    it('prefers data-callis over id when both present', () => {
        const el = makeEl('button', { 'data-callis': 'btn-x', id: 'btn-x-id' })
        const { primary } = generateSelector(el)
        expect(primary).toBe('[data-callis="btn-x"]')
    })
})
