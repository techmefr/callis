<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { resolveSelector } from '@callis/core'
import type { CallisStep, StepPosition, TourTrigger, StepType } from '@callis/core'
import { useBuilderStore } from '../stores/builder'

const store = useBuilderStore()

const step = computed(() => store.activeStep)
const steps = computed(() => store.activeTour?.steps ?? [])
const stepIndex = computed(() => steps.value.findIndex(s => s.id === step.value?.id))

const posTop = ref(100)
const posLeft = ref(100)
const isDragging = ref(false)
let dragOffsetX = 0
let dragOffsetY = 0

const isFragileSelector = computed(() => {
    const primary = step.value?.selectors.primary ?? ''
    return !primary.startsWith('[data-callis=')
})

const targetFound = computed(() => {
    if (!step.value) return true
    return resolveSelector(step.value as CallisStep) !== null
})

function generateI18nKey(primary: string, field: 'title' | 'desc'): string {
    const match = primary.match(/\[data-callis="([^"]+)"\]/)
    const base = match
        ? match[1]
        : primary.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30)
    return `tour.${base}.${field}`
}

function update(field: keyof CallisStep, value: unknown): void {
    if (!step.value) return
    store.updateStep(step.value.id, { [field]: value } as Partial<CallisStep>)
}

function setI18n(field: 'title' | 'description', enabled: boolean): void {
    if (!step.value) return
    const keyField = field === 'title' ? 'titleKey' : 'descriptionKey'
    if (enabled && !step.value[keyField]) {
        store.updateStep(step.value.id, {
            [keyField]: generateI18nKey(step.value.selectors.primary, field === 'title' ? 'title' : 'desc'),
            i18n: true,
        } as Partial<CallisStep>)
    } else if (!enabled) {
        store.updateStep(step.value.id, { i18n: false } as Partial<CallisStep>)
    } else {
        store.updateStep(step.value.id, { i18n: true } as Partial<CallisStep>)
    }
}

function navigatePrev(): void {
    const idx = stepIndex.value
    if (idx > 0) store.setActiveStep(steps.value[idx - 1].id)
}

function navigateNext(): void {
    const idx = stepIndex.value
    if (idx < steps.value.length - 1) store.setActiveStep(steps.value[idx + 1].id)
}

function validate(): void {
    store.setActiveStep(null)
}

function ignore(): void {
    if (!step.value) return
    if (!step.value.title && !step.value.description) {
        store.removeStep(step.value.id)
    } else {
        store.setActiveStep(null)
    }
}

function deleteStep(): void {
    if (!step.value) return
    store.removeStep(step.value.id)
}

function onDragBarMousedown(e: MouseEvent): void {
    isDragging.value = true
    dragOffsetX = e.clientX - posLeft.value
    dragOffsetY = e.clientY - posTop.value
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent): void {
    if (!isDragging.value) return
    posLeft.value = Math.max(0, Math.min(e.clientX - dragOffsetX, window.innerWidth - 320))
    posTop.value = Math.max(0, Math.min(e.clientY - dragOffsetY, window.innerHeight - 100))
}

function onMouseUp(): void {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
}

function positionNearTarget(): void {
    if (!step.value) return
    const el = resolveSelector(step.value as CallisStep)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const EDITOR_WIDTH = 310
    const EDITOR_HEIGHT = 440
    const OFFSET = 14

    const pos = step.value.position
    let top = rect.top
    let left = rect.left

    if (pos === 'bottom') {
        top = rect.bottom + OFFSET
        left = rect.left
    } else if (pos === 'top') {
        top = rect.top - EDITOR_HEIGHT - OFFSET
        left = rect.left
    } else if (pos === 'right') {
        top = rect.top
        left = rect.right + OFFSET
    } else {
        top = rect.top
        left = rect.left - EDITOR_WIDTH - OFFSET
    }

    posTop.value = Math.max(10, Math.min(top, window.innerHeight - EDITOR_HEIGHT - 10))
    posLeft.value = Math.max(10, Math.min(left, window.innerWidth - EDITOR_WIDTH - 10))
}

watch(
    () => step.value?.id,
    () => positionNearTarget(),
    { immediate: true },
)

onMounted(() => positionNearTarget())

onBeforeUnmount(() => {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
})

const POSITIONS: { value: StepPosition; label: string }[] = [
    { value: 'top', label: '↑' },
    { value: 'bottom', label: '↓' },
    { value: 'left', label: '←' },
    { value: 'right', label: '→' },
]

const TRIGGERS: { value: TourTrigger; label: string }[] = [
    { value: 'first-visit', label: '1ère visite' },
    { value: 'always', label: 'Toujours' },
    { value: 'manual', label: 'Manuel' },
    { value: 'permanent', label: 'Aide' },
]

const TYPES: { value: StepType; label: string }[] = [
    { value: 'step', label: 'Tour' },
    { value: 'tooltip', label: 'Aide fixe' },
]
</script>

<template>
<div
    v-if="step"
    class="callis-editor"
    :style="{ top: `${posTop}px`, left: `${posLeft}px` }"
>
    <div class="callis-editor__dragbar" @mousedown.prevent="onDragBarMousedown">
        <span class="callis-editor__nav">
            <button :disabled="stepIndex === 0" class="callis-editor__nav-btn" @click="navigatePrev">◀</button>
            <span class="callis-editor__nav-pos">{{ stepIndex + 1 }} / {{ steps.length }}</span>
            <button :disabled="stepIndex === steps.length - 1" class="callis-editor__nav-btn" @click="navigateNext">▶</button>
        </span>
        <button class="callis-editor__close" @click="validate">✕</button>
    </div>

    <div v-if="isFragileSelector" class="callis-editor__warning">
        <span>⚠ Sélecteur fragile</span>
        <code>{{ step.selectors.primary }}</code>
        <span class="callis-editor__warning-hint">Demander au dev d'ajouter <code>data-callis</code></span>
    </div>

    <div class="callis-editor__body">
        <div class="callis-editor__field">
            <div class="callis-editor__field-header">
                <label class="callis-editor__label">Titre</label>
                <button
                    :class="['callis-editor__i18n-toggle', { 'is-on': step.i18n }]"
                    @click="setI18n('title', !step.i18n)"
                >i18n</button>
            </div>
            <input
                class="callis-editor__input"
                :value="step.title"
                placeholder="Titre de l'étape"
                @input="update('title', ($event.target as HTMLInputElement).value)"
            />
            <input
                v-if="step.i18n"
                class="callis-editor__input callis-editor__input--key"
                :value="step.titleKey"
                placeholder="clé i18n"
                @input="update('titleKey', ($event.target as HTMLInputElement).value)"
            />
        </div>

        <div class="callis-editor__field">
            <div class="callis-editor__field-header">
                <label class="callis-editor__label">Description</label>
                <button
                    :class="['callis-editor__i18n-toggle', { 'is-on': step.i18n }]"
                    @click="setI18n('description', !step.i18n)"
                >i18n</button>
            </div>
            <textarea
                class="callis-editor__textarea"
                :value="step.description"
                placeholder="Description de l'étape"
                rows="3"
                @input="update('description', ($event.target as HTMLTextAreaElement).value)"
            />
            <input
                v-if="step.i18n"
                class="callis-editor__input callis-editor__input--key"
                :value="step.descriptionKey"
                placeholder="clé i18n"
                @input="update('descriptionKey', ($event.target as HTMLInputElement).value)"
            />
        </div>

        <div class="callis-editor__field">
            <label class="callis-editor__label">Sélecteur</label>
            <input
                :class="['callis-editor__input', { 'callis-editor__input--error': !targetFound }]"
                :value="step.selectors.primary"
                placeholder="Sélecteur CSS"
                @input="update('selectors', { primary: ($event.target as HTMLInputElement).value, fallbacks: step.selectors.fallbacks })"
            />
        </div>

        <div class="callis-editor__field">
            <label class="callis-editor__label">Position</label>
            <div class="callis-editor__seg">
                <button
                    v-for="p in POSITIONS"
                    :key="p.value"
                    :class="['callis-editor__seg-btn', { 'is-active': step.position === p.value }]"
                    @click="update('position', p.value)"
                >{{ p.label }}</button>
            </div>
        </div>

        <div class="callis-editor__field">
            <label class="callis-editor__label">Type</label>
            <div class="callis-editor__seg">
                <button
                    v-for="t in TYPES"
                    :key="t.value"
                    :class="['callis-editor__seg-btn', { 'is-active': step.type === t.value }]"
                    @click="update('type', t.value)"
                >{{ t.label }}</button>
            </div>
        </div>

        <div class="callis-editor__field">
            <label class="callis-editor__label">Déclenchement</label>
            <div class="callis-editor__seg callis-editor__seg--wrap">
                <button
                    v-for="tr in TRIGGERS"
                    :key="tr.value"
                    :class="['callis-editor__seg-btn', { 'is-active': store.activeTour?.trigger === tr.value }]"
                    @click="store.activeTour && store.updateStep(step.id, {})"
                >{{ tr.label }}</button>
            </div>
        </div>
    </div>

    <footer class="callis-editor__footer">
        <button class="callis-editor__footer-btn callis-editor__footer-btn--ghost" @click="ignore">
            Ignorer
        </button>
        <button class="callis-editor__footer-btn callis-editor__footer-btn--danger" @click="deleteStep">
            Supprimer
        </button>
        <button class="callis-editor__footer-btn callis-editor__footer-btn--primary" @click="validate">
            Valider
        </button>
    </footer>
</div>
</template>
