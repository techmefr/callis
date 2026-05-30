<script setup lang="ts">
import { watch } from 'vue'
import { useBuilderStore } from './stores/builder'
import { useSelectionMode } from './composables/useSelectionMode'
import { useDraftSave } from './composables/useDraftSave'
import { exportZip, downloadTasksMd } from './technical/export'
import CallisSidebar from './components/CallisSidebar.vue'
import CallisTooltipEditor from './components/CallisTooltipEditor.vue'
import CallisPreview from './components/CallisPreview.vue'
import type { CallisConfig } from '@callis/core'

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

async function onExportZip(): Promise<void> {
    try {
        await exportZip(store.config as CallisConfig)
    } catch (_e) {
        console.error('Export failed')
    }
}

function onGenerateTasks(): void {
    downloadTasksMd(store.config as CallisConfig)
}
</script>

<template>
<div v-if="store.isOpen" id="callis-shell">
    <CallisSidebar @export-zip="onExportZip" @generate-tasks="onGenerateTasks" />
    <CallisTooltipEditor v-if="store.activeStepId" />
    <CallisPreview v-if="store.activeStepId" />
</div>
</template>
