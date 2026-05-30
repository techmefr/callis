export interface ISelector {
    primary: string
    fallbacks: string[]
    isFragile: boolean
}

function cssEscape(value: string): string {
    if (typeof CSS !== 'undefined' && cssEscape) return cssEscape(value)
    return value.replace(/([^\w-])/g, '\\$1')
}

function getDataCallis(el: Element): string | null {
    const val = el.getAttribute('data-callis')
    return val ? `[data-callis="${val}"]` : null
}

function getIdSelector(el: Element): string | null {
    const { id } = el
    if (!id) return null
    try {
        if (document.querySelectorAll(`#${cssEscape(id)}`).length !== 1) return null
        return `#${cssEscape(id)}`
    } catch {
        return null
    }
}

function getDataAttrSelector(el: Element): string | null {
    for (const attr of ['data-testid', 'data-cy', 'data-qa', 'aria-label']) {
        const val = el.getAttribute(attr)
        if (val) return `[${attr}="${val}"]`
    }
    return null
}

function getCssPath(el: Element): string {
    const parts: string[] = []
    let current: Element | null = el

    while (current && current !== document.body) {
        let selector = current.tagName.toLowerCase()

        if (current.id) {
            selector = `#${cssEscape(current.id)}`
            parts.unshift(selector)
            break
        }

        const classes = Array.from(current.classList)
            .filter(c => c.length > 0 && !c.startsWith('__'))
            .slice(0, 2)
        if (classes.length > 0) {
            selector += '.' + classes.map(c => cssEscape(c)).join('.')
        }

        const parent = current.parentElement
        if (parent) {
            const siblings = Array.from(parent.children).filter(
                s => s.tagName === current!.tagName,
            )
            if (siblings.length > 1) {
                const idx = siblings.indexOf(current as HTMLElement) + 1
                selector += `:nth-of-type(${idx})`
            }
        }

        parts.unshift(selector)
        current = current.parentElement
    }

    return parts.join(' > ')
}

export function generateSelector(el: Element): ISelector {
    const dataCallis = getDataCallis(el)
    if (dataCallis) {
        const fallbacks = [getIdSelector(el), getDataAttrSelector(el), getCssPath(el)].filter(
            (s): s is string => s !== null,
        )
        return { primary: dataCallis, fallbacks, isFragile: false }
    }

    const id = getIdSelector(el)
    if (id) {
        const fallbacks = [getDataAttrSelector(el), getCssPath(el)].filter(
            (s): s is string => s !== null,
        )
        return { primary: id, fallbacks, isFragile: true }
    }

    const dataAttr = getDataAttrSelector(el)
    if (dataAttr) {
        return { primary: dataAttr, fallbacks: [getCssPath(el)], isFragile: true }
    }

    return { primary: getCssPath(el), fallbacks: [], isFragile: true }
}
