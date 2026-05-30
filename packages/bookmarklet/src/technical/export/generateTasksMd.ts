import type { CallisConfig, CallisStep } from '@callis/core'

function isFragile(primary: string): boolean {
    return !primary.startsWith('[data-callis=')
}

function suggestDataCallis(primary: string): string {
    const idMatch = primary.match(/^#(.+)$/)
    if (idMatch) return idMatch[1].replace(/[^a-z0-9]/gi, '-').toLowerCase()

    const attrMatch = primary.match(/\[(?:data-testid|data-cy|aria-label)="([^"]+)"\]/)
    if (attrMatch) return attrMatch[1].replace(/[^a-z0-9]/gi, '-').toLowerCase()

    return primary
        .replace(/[^a-z0-9\s]/gi, ' ')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase()
        .slice(0, 40)
}

function collectI18nKeys(steps: CallisStep[]): Array<{ key: string; text: string }> {
    const keys: Array<{ key: string; text: string }> = []
    for (const step of steps) {
        if (!step.i18n) continue
        if (step.titleKey) keys.push({ key: step.titleKey, text: step.title })
        if (step.descriptionKey) keys.push({ key: step.descriptionKey, text: step.description })
    }
    return keys
}

export function generateTasksMd(config: CallisConfig): string {
    const lines: string[] = [
        '# Callis — Tasks',
        '',
        'Ce fichier est un ticket prêt à exécuter par un dev ou un agent IA.',
        "Objectif : stabiliser les sélecteurs fragiles en ajoutant des attributs `data-callis` sur les composants concernés.",
        '',
    ]

    const allI18nKeys: Array<{ key: string; text: string }> = []
    let hasFragile = false

    for (const tour of config.tours) {
        const fragileSteps = tour.steps.filter(s => isFragile(s.selectors.primary))
        if (fragileSteps.length > 0) {
            if (!hasFragile) {
                lines.push('## Sélecteurs fragiles à stabiliser', '')
                hasFragile = true
            }
            lines.push(`### ${tour.url}`, '')
            for (const step of fragileSteps) {
                const suggested = suggestDataCallis(step.selectors.primary)
                lines.push(
                    `#### Step — "${step.title || step.selectors.primary}"`,
                    `- Sélecteur actuel (fragile) : \`${step.selectors.primary}\``,
                    `- Valeur suggérée : \`data-callis="${suggested}"\``,
                    "- Action : ajouter l'attribut sur le composant qui rend cet élément",
                    '',
                )
            }
        }
        allI18nKeys.push(...collectI18nKeys(tour.steps))
    }

    if (!hasFragile) {
        lines.push('## Sélecteurs fragiles à stabiliser', '', '_Aucun sélecteur fragile détecté._', '')
    }

    if (allI18nKeys.length > 0) {
        lines.push(
            '## Clés i18n à créer',
            '',
            '| Clé | Texte de référence |',
            '|-----|--------------------|',
        )
        for (const { key, text } of allI18nKeys) {
            lines.push(`| \`${key}\` | "${text}" |`)
        }
        lines.push('')
    }

    return lines.join('\n')
}
