<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { resolveSelector } from '@callis/core'
import type { CallisStep } from '@callis/core'
import { useBuilderStore } from '../stores/builder'

const store = useBuilderStore()

const step = computed(() => store.activeStep)
const theme = computed(() => store.config.theme)

const posTop = ref(200)
const posLeft = ref(200)
const isDragging = ref(false)
let dragOffsetX = 0
let dragOffsetY = 0
let resizeObserver: ResizeObserver | null = null

function positionNearTarget(): void {
    if (!step.value) return
    const el = resolveSelector(step.value as CallisStep)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const PREVIEW_WIDTH = 280
    const PREVIEW_HEIGHT = 120
    const OFFSET = 14

    const pos = step.value.position
    let top: number
    let left: number

    if (pos === 'bottom') {
        top = rect.bottom + OFFSET
        left = rect.left + rect.width / 2 - PREVIEW_WIDTH / 2
    } else if (pos === 'top') {
        top = rect.top - PREVIEW_HEIGHT - OFFSET
        left = rect.left + rect.width / 2 - PREVIEW_WIDTH / 2
    } else if (pos === 'right') {
        top = rect.top + rect.height / 2 - PREVIEW_HEIGHT / 2
        left = rect.right + OFFSET
    } else {
        top = rect.top + rect.height / 2 - PREVIEW_HEIGHT / 2
        left = rect.left - PREVIEW_WIDTH - OFFSET
    }

    posTop.value = Math.max(10, Math.min(top, window.innerHeight - PREVIEW_HEIGHT - 10))
    posLeft.value = Math.max(10, Math.min(left, window.innerWidth - PREVIEW_WIDTH - 10))
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
    posLeft.value = Math.max(0, Math.min(e.clientX - dragOffsetX, window.innerWidth - 290))
    posTop.value = Math.max(0, Math.min(e.clientY - dragOffsetY, window.innerHeight - 60))
}

function onMouseUp(): void {
    isDragging.value = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
}

watch(
    () => step.value?.id,
    () => positionNearTarget(),
    { immediate: true },
)

onMounted(() => {
    positionNearTarget()
    resizeObserver = new ResizeObserver(() => positionNearTarget())
    resizeObserver.observe(document.body)
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
<div
    v-if="step"
    class="callis-preview"
    :style="{
        top: `${posTop}px`,
        left: `${posLeft}px`,
        '--preview-bg': theme.primaryColor,
        '--preview-color': theme.textColor,
        '--preview-radius': `${theme.borderRadius}px`,
    }"
>
    <div
        class="callis-preview__dragbar"
        @mousedown.prevent="onDragBarMousedown"
    >
        <span class="callis-preview__label">Aperçu</span>
    </div>

    <div class="callis-preview__body">
        <p v-if="step.title || step.titleKey" class="callis-preview__title">
            {{ step.title || step.titleKey }}
            <span v-if="step.i18n && step.titleKey" class="callis-preview__i18n-badge">
                {{ step.titleKey }}
            </span>
        </p>
        <p v-if="step.description || step.descriptionKey" class="callis-preview__desc">
            {{ step.description || step.descriptionKey }}
            <span v-if="step.i18n && step.descriptionKey" class="callis-preview__i18n-badge">
                {{ step.descriptionKey }}
            </span>
        </p>
        <p v-if="!step.title && !step.description" class="callis-preview__empty">
            Saisissez un titre ou une description…
        </p>
    </div>
</div>
</template>
