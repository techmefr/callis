export interface ICallis {
    toggle: () => void
    start: (tourId: string) => void
    version: string
}

declare global {
    interface Window {
        __callis?: ICallis
    }
}
