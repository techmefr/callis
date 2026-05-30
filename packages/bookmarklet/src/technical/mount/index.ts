import { createApp, type App } from 'vue'
import { createPinia, type Pinia } from 'pinia'
import AppComponent from '../../App.vue'
import styles from '../../assets/styles.css?inline'
import { useBuilderStore } from '../../stores/builder'

let app: App | null = null
let pinia: Pinia | null = null
let host: HTMLElement | null = null

export function mountCallis(): void {
    if (host) return

    host = document.createElement('div')
    host.id = 'callis-root'
    document.body.appendChild(host)

    const shadow = host.attachShadow({ mode: 'open' })

    const styleEl = document.createElement('style')
    styleEl.textContent = styles
    shadow.appendChild(styleEl)

    const mountPoint = document.createElement('div')
    shadow.appendChild(mountPoint)

    pinia = createPinia()
    app = createApp(AppComponent)
    app.use(pinia)
    app.mount(mountPoint)
}

export function toggleCallis(): void {
    if (!pinia) return
    useBuilderStore(pinia).toggle()
}
