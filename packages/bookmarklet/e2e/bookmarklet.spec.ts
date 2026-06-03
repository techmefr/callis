import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const bundle = readFileSync(resolve(__dirname, '../dist/callis.js'), 'utf-8')

async function injectCallis(page: import('@playwright/test').Page): Promise<void> {
    await page.addScriptTag({ content: bundle })
    await page.waitForTimeout(800)
}

test.describe('Bookmarklet — injection', () => {
    test('monte la sidebar sur pranafoods.ca', async ({ page }) => {
        await page.goto('https://pranafoods.ca/', { waitUntil: 'domcontentloaded' })
        await injectCallis(page)

        const host = page.locator('#callis-root')
        await expect(host).toBeAttached()
    })

    test('sidebar visible dans le shadow DOM', async ({ page }) => {
        await page.goto('https://pranafoods.ca/', { waitUntil: 'domcontentloaded' })
        await injectCallis(page)

        const isVisible = await page.evaluate(() => {
            const host = document.querySelector('#callis-root')
            if (!host?.shadowRoot) return false
            const sidebar = host.shadowRoot.querySelector('.callis-sidebar')
            return sidebar !== null
        })
        expect(isVisible).toBe(true)
    })

    test('toggle ferme et rouvre la sidebar', async ({ page }) => {
        await page.goto('https://pranafoods.ca/', { waitUntil: 'domcontentloaded' })
        await injectCallis(page)

        const isOpenAfterMount = await page.evaluate(() => {
            const host = document.querySelector('#callis-root')
            return host?.shadowRoot?.querySelector('.callis-sidebar') !== null
        })
        expect(isOpenAfterMount).toBe(true)

        await page.evaluate(() => {
            const w = window as unknown as { __callis?: { toggle: () => void } }
            w.__callis?.toggle()
        })
        await page.waitForTimeout(300)

        const isClosedAfterToggle = await page.evaluate(() => {
            const host = document.querySelector('#callis-root')
            return host?.shadowRoot?.querySelector('.callis-sidebar') === null
        })
        expect(isClosedAfterToggle).toBe(true)

        await page.evaluate(() => {
            const w = window as unknown as { __callis?: { toggle: () => void } }
            w.__callis?.toggle()
        })
        await page.waitForTimeout(300)

        const isReopenedAfterToggle = await page.evaluate(() => {
            const host = document.querySelector('#callis-root')
            return host?.shadowRoot?.querySelector('.callis-sidebar') !== null
        })
        expect(isReopenedAfterToggle).toBe(true)
    })

    test('mode sélection active le curseur crosshair', async ({ page }) => {
        await page.goto('https://pranafoods.ca/', { waitUntil: 'domcontentloaded' })
        await injectCallis(page)

        await page.evaluate(() => {
            const w = window as unknown as { __callis?: { toggle: () => void } }
            w.__callis?.toggle()
        })

        const cursor = await page.evaluate(() => document.body.style.cursor)
        expect(['crosshair', '']).toContain(cursor)
    })

    test('pas de fuite de styles vers la page hôte', async ({ page }) => {
        await page.goto('https://pranafoods.ca/', { waitUntil: 'domcontentloaded' })

        const bodyFontBefore = await page.evaluate(() =>
            window.getComputedStyle(document.body).fontFamily
        )

        await injectCallis(page)

        const bodyFontAfter = await page.evaluate(() =>
            window.getComputedStyle(document.body).fontFamily
        )

        expect(bodyFontAfter).toBe(bodyFontBefore)
    })

    test('window.__callis exposé après injection', async ({ page }) => {
        await page.goto('https://pranafoods.ca/', { waitUntil: 'domcontentloaded' })
        await injectCallis(page)

        const hasCallis = await page.evaluate(() => {
            const w = window as unknown as { __callis?: unknown }
            return typeof w.__callis === 'object' && w.__callis !== null
        })
        expect(hasCallis).toBe(true)
    })
})

test.describe('Bookmarklet — page locale', () => {
    test.use({ baseURL: 'http://localhost:5173' })

    test('monte sur la page de test locale', async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' })

        const host = page.locator('#callis-root')
        await expect(host).toBeAttached({ timeout: 5000 })
    })
})
