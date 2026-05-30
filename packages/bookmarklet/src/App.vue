<script setup lang="ts">
import { watch } from 'vue'
import { useBuilderStore } from './stores/builder'
import { useSelectionMode } from './composables/useSelectionMode'
import { useDraftSave } from './composables/useDraftSave'
import CallisSidebar from './components/CallisSidebar.vue'
import CallisTooltipEditor from './components/CallisTooltipEditor.vue'

const store = useBuilderStore()
const { start: startSelection, stop: stopSelection } = useSelectionMode()

useDraftSave()

watch(
    () => store.isSelecting,
    isSelecting => {
        if (isSelecting) startSelection()
        else stopSelection()
    },
)
</script>

<template>
<div v-if="store.isOpen" id="callis-shell">
    <CallisSidebar />
    <CallisTooltipEditor v-if="store.activeStepId" />
</div>
</template>
