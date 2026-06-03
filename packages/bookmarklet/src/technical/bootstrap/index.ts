import type { ICallis } from '../../types'
import { mountCallis, toggleCallis } from '../mount'

export const initCallis = (): void => {
    if (window.__callis) {
        window.__callis.toggle()
        return
    }

    mountCallis()
    toggleCallis()

    const callis: ICallis = {
        version: '0.1.0',
        toggle: toggleCallis,
        start: (_tourId: string) => {},
    }

    window.__callis = callis
}
