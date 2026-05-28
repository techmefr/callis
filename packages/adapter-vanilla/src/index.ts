import type { CallisConfig, CallisTheme, CallisTour, CallisStep, StepPosition } from '@callis/core'
import { resolveSelector, getText, shouldRun, hasSeen, markSeen } from '@callis/core'
import type { CallisContext, CallisInstance } from './types'

export type { CallisContext, CallisInstance }

const Z_BASE = 2_147_483_600
const HIGHLIGHT_PAD = 4
const POPOVER_GAP = 12

function makeEl(tag: string, styles: Partial<CSSStyleDeclaration>): HTMLElement {
    const el = document.createElement(tag)
    Object.assign(el.style, styles)
    return el
}

function positionEl(el: HTMLElement, target: Element, position: StepPosition): void {
    const rect = target.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const w = el.offsetWidth || 320
    const h = el.offsetHeight || 100

    const coords: Record<StepPosition, { top: number; left: number }> = {
        bottom: { top: rect.bottom + POPOVER_GAP, left: rect.left + rect.width / 2 - w / 2 },
        top: { top: rect.top - h - POPOVER_GAP, left: rect.left + rect.width / 2 - w / 2 },
        left: { top: rect.top + rect.height / 2 - h / 2, left: rect.left - w - POPOVER_GAP },
        right: { top: rect.top + rect.height / 2 - h / 2, left: rect.right + POPOVER_GAP },
    }

    const { top, left } = coords[position]
    el.style.top = `${Math.max(8, Math.min(top, vh - h - 8))}px`
    el.style.left = `${Math.max(8, Math.min(left, vw - w - 8))}px`
}

function checkConditions(tour: CallisTour): boolean {
    const { conditions } = tour
    if (!conditions) return true

    if (conditions.domEmpty !== undefined) {
        const el = document.querySelector(conditions.domEmpty)
        if (!el || el.children.length !== 0 || (el.textContent ?? '').trim() !== '') return false
    }

    if (conditions.dataAttr !== undefined) {
        const { key, value } = conditions.dataAttr
        if (document.body.getAttribute(key) !== value) return false
    }

    return true
}

type Curtains = [HTMLElement, HTMLElement, HTMLElement, HTMLElement]

function buildCurtains(): Curtains {
    const base: Partial<CSSStyleDeclaration> = {
        position: 'fixed',
        zIndex: String(Z_BASE),
        pointerEvents: 'all',
        transition: 'all 0.2s ease',
    }
    return [makeEl('div', base), makeEl('div', base), makeEl('div', base), makeEl('div', base)]
}

function updateCurtains(curtains: Curtains, target: Element, alpha: number): void {
    const r = target.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const bg = `rgba(0,0,0,${alpha})`
    const p = HIGHLIGHT_PAD
    const [topEl, botEl, leftEl, rightEl] = curtains

    Object.assign(topEl.style, { background: bg, top: '0', left: '0', width: `${vw}px`, height: `${Math.max(0, r.top - p)}px` })
    Object.assign(botEl.style, { background: bg, top: `${r.bottom + p}px`, left: '0', width: `${vw}px`, height: `${Math.max(0, vh - r.bottom - p)}px` })
    Object.assign(leftEl.style, { background: bg, top: `${r.top - p}px`, left: '0', width: `${Math.max(0, r.left - p)}px`, height: `${r.height + p * 2}px` })
    Object.assign(rightEl.style, { background: bg, top: `${r.top - p}px`, left: `${r.right + p}px`, width: `${Math.max(0, vw - r.right - p)}px`, height: `${r.height + p * 2}px` })
}

function buildPopover(theme: CallisTheme): HTMLElement {
    return makeEl('div', {
        position: 'fixed',
        zIndex: String(Z_BASE + 2),
        background: theme.primaryColor,
        color: theme.textColor,
        borderRadius: `${theme.borderRadius}px`,
        padding: '16px',
        maxWidth: '320px',
        minWidth: '240px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
        boxSizing: 'border-box',
    })
}

function renderStepContent(
    popover: HTMLElement,
    step: CallisStep,
    index: number,
    total: number,
    theme: CallisTheme,
    t: ((key: string) => string) | undefined,
    onPrev: (() => void) | null,
    onNext: () => void
): void {
    popover.innerHTML = ''

    const titleEl = makeEl('div', { fontWeight: '600', fontSize: '15px', marginBottom: '8px' })
    titleEl.textContent = getText(step, 'title', t)

    const descEl = makeEl('div', { opacity: '0.85', marginBottom: '16px' })
    descEl.textContent = getText(step, 'description', t)

    const footer = makeEl('div', {
        display: 'flex',
        alignItems: 'center',
        justifyContent: theme.showProgress ? 'space-between' : 'flex-end',
        gap: '8px',
    })

    if (theme.showProgress) {
        const progress = makeEl('span', { fontSize: '12px', opacity: '0.6' })
        progress.textContent = `${index + 1} / ${total}`
        footer.appendChild(progress)
    }

    const btnGroup = makeEl('div', { display: 'flex', gap: '8px' })

    if (onPrev !== null) {
        const prevBtn = document.createElement('button')
        prevBtn.textContent = theme.prevLabel ?? 'Back'
        Object.assign(prevBtn.style, {
            padding: '6px 14px',
            borderRadius: `${theme.borderRadius}px`,
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontFamily: 'inherit',
            background: 'rgba(255,255,255,0.15)',
            color: theme.textColor,
        })
        prevBtn.addEventListener('click', onPrev)
        btnGroup.appendChild(prevBtn)
    }

    const isLast = index === total - 1
    const nextBtn = document.createElement('button')
    nextBtn.textContent = isLast ? (theme.doneLabel ?? 'Done') : (theme.nextLabel ?? 'Next')
    Object.assign(nextBtn.style, {
        padding: '6px 14px',
        borderRadius: `${theme.borderRadius}px`,
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'inherit',
        fontWeight: '600',
        background: theme.textColor,
        color: theme.primaryColor,
    })
    nextBtn.addEventListener('click', onNext)
    btnGroup.appendChild(nextBtn)

    footer.appendChild(btnGroup)
    popover.appendChild(titleEl)
    popover.appendChild(descEl)
    popover.appendChild(footer)
}

function runTour(tour: CallisTour, theme: CallisTheme, t?: (key: string) => string): () => void {
    const curtains = buildCurtains()
    const highlight = makeEl('div', {
        position: 'fixed',
        zIndex: String(Z_BASE + 1),
        border: `2px solid ${theme.primaryColor}`,
        borderRadius: `${theme.borderRadius}px`,
        pointerEvents: 'none',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box',
    })
    const popover = buildPopover(theme)

    for (const c of curtains) document.body.appendChild(c)
    document.body.appendChild(highlight)
    document.body.appendChild(popover)

    let currentIndex = 0

    const cleanup = (): void => {
        for (const c of curtains) c.remove()
        highlight.remove()
        popover.remove()
        window.removeEventListener('resize', onViewChange)
        window.removeEventListener('scroll', onViewChange, true)
    }

    const show = (index: number): void => {
        currentIndex = index
        const step = tour.steps[index]

        if (!step) {
            cleanup()
            markSeen(tour.id)
            return
        }

        const target = resolveSelector(step)

        if (!target) {
            if (index < tour.steps.length - 1) {
                show(index + 1)
            } else {
                cleanup()
                markSeen(tour.id)
            }
            return
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'center' })

        updateCurtains(curtains, target, theme.overlayOpacity)

        const r = target.getBoundingClientRect()
        const p = HIGHLIGHT_PAD
        Object.assign(highlight.style, {
            top: `${r.top - p}px`,
            left: `${r.left - p}px`,
            width: `${r.width + p * 2}px`,
            height: `${r.height + p * 2}px`,
        })

        renderStepContent(
            popover,
            step,
            index,
            tour.steps.length,
            theme,
            t,
            index > 0 ? () => show(index - 1) : null,
            () => {
                if (index === tour.steps.length - 1) {
                    cleanup()
                    markSeen(tour.id)
                } else {
                    show(index + 1)
                }
            }
        )

        requestAnimationFrame(() => positionEl(popover, target, step.position))
    }

    const onViewChange = (): void => {
        const step = tour.steps[currentIndex]
        if (!step) return
        const target = resolveSelector(step)
        if (!target) return

        updateCurtains(curtains, target, theme.overlayOpacity)

        const r = target.getBoundingClientRect()
        const p = HIGHLIGHT_PAD
        Object.assign(highlight.style, {
            top: `${r.top - p}px`,
            left: `${r.left - p}px`,
            width: `${r.width + p * 2}px`,
            height: `${r.height + p * 2}px`,
        })

        positionEl(popover, target, step.position)
    }

    window.addEventListener('resize', onViewChange)
    window.addEventListener('scroll', onViewChange, true)

    show(0)

    return cleanup
}

function runTooltip(tour: CallisTour, theme: CallisTheme, t?: (key: string) => string): () => void {
    const elements: HTMLElement[] = []
    const repositioners: Array<() => void> = []

    for (const step of tour.steps) {
        const target = resolveSelector(step)
        if (!target) continue

        const tooltip = makeEl('div', {
            position: 'fixed',
            zIndex: String(Z_BASE + 2),
            background: theme.primaryColor,
            color: theme.textColor,
            borderRadius: `${theme.borderRadius}px`,
            padding: '10px 14px',
            maxWidth: '280px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px',
            lineHeight: '1.4',
            pointerEvents: 'none',
            boxSizing: 'border-box',
        })

        const titleEl = makeEl('div', { fontWeight: '600', marginBottom: '4px' })
        titleEl.textContent = getText(step, 'title', t)

        const descEl = makeEl('div', { opacity: '0.85' })
        descEl.textContent = getText(step, 'description', t)

        tooltip.appendChild(titleEl)
        tooltip.appendChild(descEl)
        document.body.appendChild(tooltip)
        elements.push(tooltip)

        const reposition = (): void => positionEl(tooltip, target, step.position)
        requestAnimationFrame(reposition)
        window.addEventListener('resize', reposition)
        window.addEventListener('scroll', reposition, true)
        repositioners.push(reposition)
    }

    return (): void => {
        for (const el of elements) el.remove()
        for (const fn of repositioners) {
            window.removeEventListener('resize', fn)
            window.removeEventListener('scroll', fn, true)
        }
    }
}

export function initCallis(config: CallisConfig, context: CallisContext): CallisInstance {
    const activeCleanups = new Map<string, () => void>()
    const userRole: string | undefined =
        context.userRole ?? document.body.getAttribute('data-role') ?? undefined

    const checkTours = (path: string): void => {
        for (const cleanup of activeCleanups.values()) cleanup()
        activeCleanups.clear()

        for (const tour of config.tours) {
            if (!shouldRun(tour, { role: userRole, path })) continue
            if (!checkConditions(tour)) continue
            if (tour.trigger === 'manual') continue
            if (tour.trigger === 'first-visit' && hasSeen(tour.id)) continue

            const run = tour.trigger === 'permanent' ? runTooltip : runTour
            activeCleanups.set(tour.id, run(tour, config.theme, context.t))
        }
    }

    const titleEl = document.querySelector('title')
    const observer = new MutationObserver(() => checkTours(location.pathname))
    if (titleEl) observer.observe(titleEl, { childList: true })
    window.addEventListener('popstate', () => checkTours(location.pathname))

    const instance: CallisInstance = {
        start: (tourId: string): void => {
            const tour = config.tours.find(tour => tour.id === tourId)
            if (!tour) return
            activeCleanups.get(tourId)?.()
            activeCleanups.set(tourId, runTour(tour, config.theme, context.t))
        },
        destroy: (): void => {
            for (const cleanup of activeCleanups.values()) cleanup()
            activeCleanups.clear()
            observer.disconnect()
        },
    }

    window.callis = instance
    checkTours(context.currentPath)

    return instance
}
