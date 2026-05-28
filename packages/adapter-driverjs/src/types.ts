export interface CallisContext {
    currentPath: string
    userRole?: string
    t?: (key: string) => string
}

export interface CallisBridge {
    start: (tourId: string) => void
    destroy: () => void
}
