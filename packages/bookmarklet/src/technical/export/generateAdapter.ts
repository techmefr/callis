export function generateAdapterDriverjs(): string {
    return `import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { initCallis } from '@callis/adapter-driverjs'
import callisConfig from './callis.json'

initCallis(callisConfig, {
  currentPath: window.location.pathname,
  userRole: document.body.dataset.role,
})
`
}
