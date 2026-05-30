import { ref, readonly, computed } from 'vue'
import { defineStore } from 'pinia'
import type { CallisConfig, CallisStep, CallisTour } from '@callis/core'

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function getOrCreateTour(config: CallisConfig, url: string): CallisTour {
    const existing = config.tours.find(t => t.url === url)
    if (existing) return existing

    const tour: CallisTour = {
        id: `tour-${generateId()}`,
        url,
        trigger: 'first-visit',
        steps: [],
    }
    config.tours.push(tour)
    return tour
}

export const useBuilderStore = defineStore('builder', () => {
    const isOpen = ref(false)
    const isSelecting = ref(false)
    const activeStepId = ref<string | null>(null)
    const activeTourUrl = ref(location.pathname)
    const config = ref<CallisConfig>({
        version: '1.0',
        theme: {
            primaryColor: '#1a1a2e',
            textColor: '#ffffff',
            overlayOpacity: 0.4,
            borderRadius: 8,
        },
        tours: [],
    })

    const activeTour = computed(() =>
        config.value.tours.find(t => t.url === activeTourUrl.value) ?? null,
    )

    const activeStep = computed(
        () => activeTour.value?.steps.find(s => s.id === activeStepId.value) ?? null,
    )

    function toggle(): void {
        isOpen.value = !isOpen.value
    }

    function open(): void {
        isOpen.value = true
    }

    function close(): void {
        isOpen.value = false
    }

    function startSelection(): void {
        isSelecting.value = true
    }

    function stopSelection(): void {
        isSelecting.value = false
    }

    function setActiveTour(url: string): void {
        activeTourUrl.value = url
    }

    function setActiveStep(id: string | null): void {
        activeStepId.value = id
    }

    function addStep(selectors: { primary: string; fallbacks: string[] }): string {
        const tour = getOrCreateTour(config.value, location.pathname)
        const step: CallisStep = {
            id: `step-${generateId()}`,
            type: 'step',
            selectors,
            title: '',
            description: '',
            position: 'bottom',
        }
        tour.steps.push(step)
        activeTourUrl.value = location.pathname
        activeStepId.value = step.id
        return step.id
    }

    function updateStep(stepId: string, updates: Partial<CallisStep>): void {
        for (const tour of config.value.tours) {
            const step = tour.steps.find(s => s.id === stepId)
            if (step) {
                Object.assign(step, updates)
                break
            }
        }
    }

    function removeStep(stepId: string): void {
        for (const tour of config.value.tours) {
            const idx = tour.steps.findIndex(s => s.id === stepId)
            if (idx !== -1) {
                tour.steps.splice(idx, 1)
                if (activeStepId.value === stepId) activeStepId.value = null
                break
            }
        }
    }

    function reorderSteps(tourId: string, fromIndex: number, toIndex: number): void {
        const tour = config.value.tours.find(t => t.id === tourId)
        if (!tour) return
        const [step] = tour.steps.splice(fromIndex, 1)
        tour.steps.splice(toIndex, 0, step)
    }

    function updateTheme(updates: Partial<CallisConfig['theme']>): void {
        Object.assign(config.value.theme, updates)
    }

    function loadConfig(loaded: CallisConfig): void {
        config.value = loaded
    }

    return {
        isOpen: readonly(isOpen),
        isSelecting: readonly(isSelecting),
        activeStepId: readonly(activeStepId),
        activeTourUrl: readonly(activeTourUrl),
        activeTour,
        activeStep,
        config: readonly(config),
        toggle,
        open,
        close,
        startSelection,
        stopSelection,
        setActiveTour,
        setActiveStep,
        addStep,
        updateStep,
        removeStep,
        reorderSteps,
        updateTheme,
        loadConfig,
    }
})
