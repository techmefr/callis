import { useBuilderStore } from '../stores/builder'
import { generateSelector } from '../technical/selector'

const HIGHLIGHT_OUTLINE = '2px solid #5DCAA5'
const HIGHLIGHT_OFFSET = '2px'

export function useSelectionMode(): { start: () => void; stop: () => void } {
    const store = useBuilderStore()
    let highlightedEl: HTMLElement | null = null
    let savedOutline = ''
    let savedOutlineOffset = ''

    function getCallisHost(): Element | null {
        return document.getElementById('callis-root')
    }

    function isCallisEl(el: Element): boolean {
        const host = getCallisHost()
        return host !== null && (el === host || host.contains(el))
    }

    function applyHighlight(el: HTMLElement): void {
        savedOutline = el.style.outline
        savedOutlineOffset = el.style.outlineOffset
        el.style.outline = HIGHLIGHT_OUTLINE
        el.style.outlineOffset = HIGHLIGHT_OFFSET
        highlightedEl = el
    }

    function removeHighlight(): void {
        if (!highlightedEl) return
        highlightedEl.style.outline = savedOutline
        highlightedEl.style.outlineOffset = savedOutlineOffset
        highlightedEl = null
        savedOutline = ''
        savedOutlineOffset = ''
    }

    function onMouseOver(e: MouseEvent): void {
        const el = e.target as Element
        if (!(el instanceof HTMLElement) || isCallisEl(el)) return
        if (highlightedEl !== el) {
            removeHighlight()
            applyHighlight(el)
        }
    }

    function onMouseOut(e: MouseEvent): void {
        const el = e.target as Element
        if (el === highlightedEl) removeHighlight()
    }

    function onClick(e: MouseEvent): void {
        e.preventDefault()
        e.stopPropagation()
        const el = e.target as Element
        if (isCallisEl(el)) return
        const { primary, fallbacks } = generateSelector(el)
        store.addStep({ primary, fallbacks })
        stop()
    }

    function onKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape') stop()
    }

    function start(): void {
        document.body.style.cursor = 'crosshair'
        document.addEventListener('mouseover', onMouseOver, true)
        document.addEventListener('mouseout', onMouseOut, true)
        document.addEventListener('click', onClick, true)
        document.addEventListener('keydown', onKeyDown)
    }

    function stop(): void {
        document.body.style.cursor = ''
        document.removeEventListener('mouseover', onMouseOver, true)
        document.removeEventListener('mouseout', onMouseOut, true)
        document.removeEventListener('click', onClick, true)
        document.removeEventListener('keydown', onKeyDown)
        removeHighlight()
        store.stopSelection()
    }

    return { start, stop }
}
