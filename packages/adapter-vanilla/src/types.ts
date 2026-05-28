export interface CallisContext {
    currentPath: string
    userRole?: string
    t?: (key: string) => string
}

export interface CallisInstance {
    start: (tourId: string) => void
    destroy: () => void
}

declare global {
    interface Window {
        callis?: CallisInstance
    }
}
