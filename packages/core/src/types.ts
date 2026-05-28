export type TourTrigger = 'first-visit' | 'always' | 'manual' | 'permanent'
export type StepType = 'step' | 'tooltip'
export type StepPosition = 'top' | 'bottom' | 'left' | 'right'

export interface CallisStep {
    id: string
    type: StepType
    selectors: {
        primary: string
        fallbacks?: string[]
    }
    title: string
    titleKey?: string
    description: string
    descriptionKey?: string
    i18n?: boolean
    position: StepPosition
    blockNavigation?: boolean
}

export interface CallisTour {
    id: string
    url: string
    trigger: TourTrigger
    conditions?: {
        roles?: string[]
        domEmpty?: string
        dataAttr?: { key: string; value: string }
    }
    steps: CallisStep[]
}

export interface CallisTheme {
    primaryColor: string
    textColor: string
    overlayOpacity: number
    borderRadius: number
    nextLabel?: string
    prevLabel?: string
    doneLabel?: string
    showProgress?: boolean
}

export interface CallisConfig {
    version: string
    theme: CallisTheme
    tours: CallisTour[]
}
