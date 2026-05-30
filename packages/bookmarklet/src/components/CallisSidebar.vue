<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBuilderStore } from '../stores/builder'

const store = useBuilderStore()

const activeTourSteps = computed(() => store.activeTour?.steps ?? [])
const tourUrls = computed(() => store.config.tours.map(t => t.url))

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
    </header>

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
