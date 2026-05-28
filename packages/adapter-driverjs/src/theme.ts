import type { CallisTheme } from '@callis/core'

export function injectTheme(theme: CallisTheme): void {
    const existing = document.getElementById('callis-driverjs-theme')
    if (existing) existing.remove()

    const style = document.createElement('style')
    style.id = 'callis-driverjs-theme'
    style.textContent = [
        ':root {',
        `    --driver-popover-background-color: ${theme.primaryColor};`,
        `    --driver-popover-title-color: ${theme.textColor};`,
        `    --driver-popover-description-color: ${theme.textColor};`,
        `    --driver-popover-border-radius: ${theme.borderRadius}px;`,
        `    --driver-overlay-color: rgba(0, 0, 0, ${theme.overlayOpacity});`,
        '}',
    ].join('\n')
    document.head.appendChild(style)
}
