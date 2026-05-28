import type { CallisConfig } from '@callis/core'

export function generateSnippet(config: CallisConfig): string {
    const configJson = JSON.stringify(config, null, 4)
    return `import { initCallis } from '@callis/adapter-driverjs'
import type { CallisConfig } from '@callis/core'
import 'driver.js/dist/driver.css'

const config: CallisConfig = ${configJson}

initCallis(config, {
    currentPath: window.location.pathname,
    userRole: document.body.dataset['role'] ?? undefined,
    // t: (key) => i18n.t(key),
})
`
}
