<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBuilderStore } from '../stores/builder'

const store = useBuilderStore()

const activeTourSteps = computed(() => store.activeTour?.steps ?? [])
const tourUrls = computed(() => store.config.tours.map(t => t.url))
const showTheme = ref(false)

const dragFromIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function stepLabel(index: number): string {
    const step = activeTourSteps.value[index]
    if (step.title) return step.title
    return step.selectors.primary
}

function isStableSelector(primary: string): boolean {
    return primary.startsWith('[data-callis=')
}

function onDragStart(index: number): void {
    dragFromIndex.value = index
}

function onDragOver(e: DragEvent, index: number): void {
    e.preventDefault()
    dragOverIndex.value = index
}

function onDrop(index: number): void {
    const from = dragFromIndex.value
    if (from === null || !store.activeTour) return
    store.reorderSteps(store.activeTour.id, from, index)
    dragFromIndex.value = null
    dragOverIndex.value = null
}

function onDragEnd(): void {
    dragFromIndex.value = null
    dragOverIndex.value = null
}

const emit = defineEmits<{
    (e: 'export-zip'): void
    (e: 'generate-tasks'): void
}>()
</script>

<template>
<aside class="callis-sidebar">
    <header class="callis-sidebar__header">
        <span class="callis-sidebar__title">Callis</span>
        <span v-if="store.isSelecting" class="callis-sidebar__badge callis-sidebar__badge--record">
            Enregistrement
        </span>
        <span v-else class="callis-sidebar__badge">Aperçu</span>
        <button
            :class="['callis-sidebar__settings-btn', { 'is-active': showTheme }]"
            title="Personnaliser le thème"
            @click="showTheme = !showTheme"
        >⚙</button>
    </header>

    <template v-if="showTheme">
        <div class="callis-sidebar__theme">
            <p class="callis-sidebar__theme-title">Thème</p>

            <div class="callis-sidebar__theme-field">
                <label class="callis-sidebar__theme-label">Couleur principale</label>
                <input
                    type="color"
                    class="callis-sidebar__color"
                    :value="store.config.theme.primaryColor"
                    @input="store.updateTheme({ primaryColor: ($event.target as HTMLInputElement).value })"
                />
            </div>

            <div class="callis-sidebar__theme-field">
                <label class="callis-sidebar__theme-label">Couleur texte</label>
                <input
                    type="color"
                    class="callis-sidebar__color"
                    :value="store.config.theme.textColor"
                    @input="store.updateTheme({ textColor: ($event.target as HTMLInputElement).value })"
                />
            </div>

            <div class="callis-sidebar__theme-field">
                <label class="callis-sidebar__theme-label">
                    Opacité overlay
                    <span class="callis-sidebar__theme-value">{{ Math.round(store.config.theme.overlayOpacity * 100) }}%</span>
                </label>
                <input
                    type="range"
                    class="callis-sidebar__range"
                    min="0"
                    max="1"
                    step="0.05"
                    :value="store.config.theme.overlayOpacity"
                    @input="store.updateTheme({ overlayOpacity: Number(($event.target as HTMLInputElement).value) })"
                />
            </div>

            <div class="callis-sidebar__theme-field">
                <label class="callis-sidebar__theme-label">
                    Rayon coins
                    <span class="callis-sidebar__theme-value">{{ store.config.theme.borderRadius }}px</span>
                </label>
                <input
                    type="range"
                    class="callis-sidebar__range"
                    min="0"
                    max="20"
                    step="1"
                    :value="store.config.theme.borderRadius"
                    @input="store.updateTheme({ borderRadius: Number(($event.target as HTMLInputElement).value) })"
                />
            </div>
        </div>
    </template>

    <template v-else>
        <div v-if="tourUrls.length > 1" class="callis-sidebar__pages">
            <button
                v-for="url in tourUrls"
                :key="url"
                :class="['callis-sidebar__page-btn', { 'is-active': url === store.activeTourUrl }]"
                @click="store.setActiveTour(url)"
            >
                {{ url }}
            </button>
        </div>

        <div class="callis-sidebar__steps-header">
            <span class="callis-sidebar__steps-url">{{ store.activeTourUrl }}</span>
        </div>

        <ul class="callis-sidebar__steps">
            <li
                v-for="(step, index) in activeTourSteps"
                :key="step.id"
                :class="[
                    'callis-sidebar__step',
                    {
                        'is-active': step.id === store.activeStepId,
                        'is-drag-over': dragOverIndex === index,
                    },
                ]"
                draggable="true"
                @dragstart="onDragStart(index)"
                @dragover="onDragOver($event, index)"
                @drop="onDrop(index)"
                @dragend="onDragEnd"
                @click="store.setActiveStep(step.id)"
            >
                <span class="callis-sidebar__step-num">{{ index + 1 }}</span>
                <span class="callis-sidebar__step-label">{{ stepLabel(index) }}</span>
                <span
                    v-if="isStableSelector(step.selectors.primary)"
                    class="callis-sidebar__step-status callis-sidebar__step-status--ok"
                    title="Sélecteur stable"
                >✓</span>
                <span
                    v-else
                    class="callis-sidebar__step-status callis-sidebar__step-status--warn"
                    title="Sélecteur fragile — ajouter data-callis"
                >⚠</span>
            </li>
        </ul>

        <div v-if="activeTourSteps.length === 0" class="callis-sidebar__empty">
            Cliquez un élément pour commencer
        </div>

        <button class="callis-sidebar__add-btn" @click="store.startSelection()">
            + Cliquer un élément
        </button>
    </template>

    <footer class="callis-sidebar__footer">
        <button class="callis-sidebar__footer-btn" @click="emit('export-zip')">
            Exporter ZIP
        </button>
        <button class="callis-sidebar__footer-btn" @click="emit('generate-tasks')">
            CALLIS_TASKS.md
        </button>
    </footer>
</aside>
</template>
