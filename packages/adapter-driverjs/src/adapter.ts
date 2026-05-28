import { driver } from 'driver.js'
import type { Driver, DriveStep } from 'driver.js'
import { shouldRun, getText, resolveSelector, hasSeen, markSeen } from '@callis/core'
import type { CallisConfig, CallisTour, CallisStep } from '@callis/core'
import { injectTheme } from './theme'
import type { CallisContext, CallisBridge } from './types'

function toDriverStep(
    step: CallisStep,
    translate: ((key: string) => string) | undefined,
): DriveStep {
    return {
        element: resolveSelector(step) ?? undefined,
        disableActiveInteraction: step.blockNavigation,
        popover: {
            title: getText(step, 'title', translate),
            description: getText(step, 'description', translate),
            side: step.position,
            showButtons: step.blockNavigation ? ['next', 'previous'] : ['next', 'previous', 'close'],
        },
    }
}

function isDomEmpty(selector: string): boolean {
    const el = document.querySelector(selector)
    return el !== null && el.children.length === 0 && (el.textContent?.trim() ?? '') === ''
}

function checkDomCondition(tour: CallisTour): boolean {
    const { domEmpty } = tour.conditions ?? {}
    if (!domEmpty) return true
    return isDomEmpty(domEmpty)
}

export function initCallis(config: CallisConfig, context: CallisContext): CallisBridge {
    const { userRole, t: translate } = context
    injectTheme(config.theme)

    const activeDrivers: Driver[] = []
    const domObservers: MutationObserver[] = []

    function runSequentialTour(tour: CallisTour): void {
        const steps = tour.steps
            .filter(s => s.type === 'step')
            .map(s => toDriverStep(s, translate))
            .filter((s): s is DriveStep & { element: Element } => s.element !== undefined)

        if (steps.length === 0) return

        const driverObj = driver({
            animate: true,
            overlayOpacity: config.theme.overlayOpacity,
            doneBtnText: config.theme.doneLabel ?? 'Done',
            nextBtnText: config.theme.nextLabel ?? 'Next →',
            prevBtnText: config.theme.prevLabel ?? '← Prev',
            showProgress: config.theme.showProgress ?? false,
            steps,
            onDestroyed: () => {
                if (tour.trigger === 'first-visit') markSeen(tour.id)
                const idx = activeDrivers.indexOf(driverObj)
                if (idx !== -1) activeDrivers.splice(idx, 1)
            },
        })

        activeDrivers.push(driverObj)
        driverObj.drive()
    }

    function runPermanentStep(step: CallisStep): void {
        const element = resolveSelector(step)
        if (!element) return

        const driverObj = driver()
        activeDrivers.push(driverObj)

        driverObj.highlight({
            element,
            popover: {
                title: getText(step, 'title', translate),
                description: getText(step, 'description', translate),
                side: step.position,
                showButtons: [],
            },
        })
    }

    function watchPermanentTooltips(tour: CallisTour): void {
        const tooltipSteps = tour.steps.filter(s => s.type === 'tooltip')
        if (tooltipSteps.length === 0) return

        function showIfConditionMet(): void {
            if (checkDomCondition(tour)) {
                tooltipSteps.forEach(runPermanentStep)
            }
        }

        showIfConditionMet()

        if (tour.conditions?.domEmpty) {
            const observer = new MutationObserver(showIfConditionMet)
            observer.observe(document.body, { childList: true, subtree: true })
            domObservers.push(observer)
        }
    }

    function runTour(tour: CallisTour): void {
        if (!shouldRun(tour, { path: location.pathname, role: userRole })) return

        if (tour.trigger === 'permanent') {
            watchPermanentTooltips(tour)
            return
        }

        if (tour.trigger === 'manual') return

        if (tour.trigger === 'first-visit' && hasSeen(tour.id)) return

        runSequentialTour(tour)
    }

    function checkTours(): void {
        config.tours.forEach(runTour)
    }

    const titleEl = document.querySelector('title')
    let spaObserver: MutationObserver | null = null

    if (titleEl) {
        spaObserver = new MutationObserver(checkTours)
        spaObserver.observe(titleEl, { childList: true })
    }

    window.addEventListener('popstate', checkTours)

    checkTours()

    return {
        start(tourId: string): void {
            const tour = config.tours.find(tour => tour.id === tourId)
            if (tour) runSequentialTour(tour)
        },
        destroy(): void {
            spaObserver?.disconnect()
            window.removeEventListener('popstate', checkTours)
            domObservers.forEach(o => o.disconnect())
            activeDrivers.forEach(d => d.destroy())
            activeDrivers.length = 0
            domObservers.length = 0
            document.getElementById('callis-driverjs-theme')?.remove()
        },
    }
}
