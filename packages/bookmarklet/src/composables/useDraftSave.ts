import { watch } from 'vue'
import { saveDraft, loadDraft } from '@callis/core'
import type { CallisConfig } from '@callis/core'
import { useBuilderStore } from '../stores/builder'

export function useDraftSave(): void {
    const store = useBuilderStore()

    const draft = loadDraft(location.hostname)
    if (draft) {
        store.loadConfig(draft)
    }

    watch(
        () => store.config,
        config => saveDraft(location.hostname, config as CallisConfig),
        { deep: true },
    )
}
