import type { ICallis } from '../../types'

export const initCallis = (): void => {
    if (window.__callis) {
        window.__callis.toggle()
        return
    }

    const callis: ICallis = {
        version: '0.1.0',
        toggle: () => {
            // TASK-006: mount/unmount Vue sidebar in Shadow DOM
        },
        start: (_tourId: string) => {
            // TASK-006: programmatic tour start
        },
    }

    window.__callis = callis
}
