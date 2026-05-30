import JSZip from 'jszip'
import type { CallisConfig } from '@callis/core'
import { generateTasksMd } from './generateTasksMd'
import { generateAdapterDriverjs } from './generateAdapter'

function dateTag(): string {
    const d = new Date()
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

export function downloadTasksMd(config: CallisConfig): void {
    const content = generateTasksMd(config)
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'CALLIS_TASKS.md'
    a.click()
    URL.revokeObjectURL(url)
}

export async function exportZip(config: CallisConfig): Promise<void> {
    const zip = new JSZip()

    zip.file('callis.json', JSON.stringify(config, null, 2))
    zip.file('CALLIS_TASKS.md', generateTasksMd(config))
    zip.file('adapter-driverjs.ts', generateAdapterDriverjs())

    const blob = await zip.generateAsync({ type: 'blob' })

    const hostname = location.hostname || 'localhost'
    const filename = `callis-export-${hostname}-${dateTag()}.zip`

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}
