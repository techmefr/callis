<script setup lang="ts">
const bookmarkletHref = `javascript:(function(){if(window.__callis)return window.__callis.toggle();var s=document.createElement('script');s.src='https://cdn.callis.io/loader.js?v=latest';document.head.appendChild(s);})();`

const features = [
    { name: 'Visual builder', desc: 'Cliquez un élément sur la page pour le capturer. Pas de sélecteurs à écrire à la main.' },
    { name: 'Export JSON neutre', desc: 'callis.json fonctionne avec driver.js, Shepherd.js, Intro.js sans configuration.' },
    { name: 'i18n natif', desc: 'Toggle par champ pour générer des clés de traduction. Compatible Tolgee, vue-i18n, i18next.' },
    { name: 'Tooltips permanentes', desc: 'Aides contextuelles ancrées qui restent visibles tant qu\'une condition est vraie.' },
    { name: 'Zéro infrastructure', desc: 'Tout s\'exécute dans le navigateur. Pas de serveur, pas de SaaS, pas d\'abonnement.' },
    { name: 'Ticket dev généré', desc: 'CALLIS_TASKS.md liste les sélecteurs fragiles à stabiliser et les clés i18n à créer.' },
]

const comparisons = [
    { feature: 'Ownership du code', callis: true, appcues: false, driverjs: true, usetiful: true },
    { feature: 'Builder visuel', callis: true, appcues: true, driverjs: false, usetiful: true },
    { feature: 'CDP autonome', callis: true, appcues: true, driverjs: false, usetiful: false },
    { feature: 'i18n natif', callis: true, appcues: false, driverjs: false, usetiful: false },
    { feature: 'Tooltips permanentes', callis: true, appcues: true, driverjs: false, usetiful: false },
    { feature: 'Zéro infra requise', callis: true, appcues: false, driverjs: true, usetiful: false },
    { feature: 'JSON versionnable', callis: true, appcues: false, driverjs: false, usetiful: false },
    { feature: 'Prix', callis: 'Gratuit', appcues: '200–1000€/mois', driverjs: 'Gratuit', usetiful: 'Gratuit' },
]
</script>

<template>
<div>
    <section class="hero">
        <div class="site-container">
            <div class="hero__content">
                <span class="hero__eyebrow">Bookmarklet universel</span>
                <h1 class="hero__title">Créez vos tours guidés<br>en cliquant</h1>
                <p class="hero__subtitle">
                    Callis permet au Chef de Projet ou à l'UX de créer visuellement
                    des tours guidés et tooltips contextuelles sur n'importe quel site,
                    sans toucher au code.
                </p>
                <div class="hero__actions">
                    <NuxtLink to="/install" class="btn btn--primary">
                        Installer Callis
                    </NuxtLink>
                    <NuxtLink to="/docs" class="btn btn--ghost">
                        Documentation
                    </NuxtLink>
                </div>
            </div>
            <div class="hero__visual">
                <div class="hero__demo-browser">
                    <div class="hero__demo-bar">
                        <div class="hero__demo-dots">
                            <span /><span /><span />
                        </div>
                        <div class="hero__demo-url">callis.io/dashboard</div>
                    </div>
                    <div class="hero__demo-body">
                        <div class="hero__demo-sidebar">
                            <div class="hero__demo-sidebar-header">Callis</div>
                            <div class="hero__demo-step">
                                <span class="hero__demo-step-num">1</span>
                                <span class="hero__demo-step-label">Navigation principale</span>
                                <span class="hero__demo-step-ok">✓</span>
                            </div>
                            <div class="hero__demo-step">
                                <span class="hero__demo-step-num">2</span>
                                <span class="hero__demo-step-label">Bouton créer projet</span>
                                <span class="hero__demo-step-ok">✓</span>
                            </div>
                            <div class="hero__demo-step hero__demo-step--active">
                                <span class="hero__demo-step-num">3</span>
                                <span class="hero__demo-step-label">Section hero</span>
                                <span class="hero__demo-step-warn">⚠</span>
                            </div>
                        </div>
                        <div class="hero__demo-page">
                            <div class="hero__demo-highlight"></div>
                            <div class="hero__demo-tooltip">
                                <strong>Section hero</strong>
                                <p>Retrouvez ici la vue d'ensemble.</p>
                                <div class="hero__demo-tooltip-footer">
                                    <span class="hero__demo-badge">data-callis manquant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="features">
        <div class="site-container">
            <p class="features__label">Ce que fait Callis</p>
            <div class="features__list">
                <div v-for="(f, i) in features" :key="f.name" class="feature-row">
                    <span class="feature-row__num">{{ String(i + 1).padStart(2, '0') }}</span>
                    <strong class="feature-row__name">{{ f.name }}</strong>
                    <p class="feature-row__desc">{{ f.desc }}</p>
                </div>
            </div>
        </div>
    </section>

    <section class="comparison">
        <div class="site-container">
            <h2 class="section-title">Pourquoi Callis</h2>
            <div class="comparison__table-wrap">
                <table class="comparison__table">
                    <thead>
                        <tr>
                            <th></th>
                            <th class="comparison__th--callis">Callis</th>
                            <th>Appcues / Pendo</th>
                            <th>driver.js seul</th>
                            <th>Usetiful</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in comparisons" :key="row.feature">
                            <td class="comparison__feature">{{ row.feature }}</td>
                            <td class="comparison__td--callis">
                                <span v-if="row.callis === true" class="comparison__yes">✓</span>
                                <span v-else-if="row.callis === false" class="comparison__no">✗</span>
                                <span v-else>{{ row.callis }}</span>
                            </td>
                            <td>
                                <span v-if="row.appcues === true" class="comparison__yes">✓</span>
                                <span v-else-if="row.appcues === false" class="comparison__no">✗</span>
                                <span v-else>{{ row.appcues }}</span>
                            </td>
                            <td>
                                <span v-if="row.driverjs === true" class="comparison__yes">✓</span>
                                <span v-else-if="row.driverjs === false" class="comparison__no">✗</span>
                                <span v-else>{{ row.driverjs }}</span>
                            </td>
                            <td>
                                <span v-if="row.usetiful === true" class="comparison__yes">✓</span>
                                <span v-else-if="row.usetiful === false" class="comparison__no">✗</span>
                                <span v-else>{{ row.usetiful }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>

    <section class="cta-section">
        <div class="site-container">
            <div class="cta-inner">
                <div class="cta-body">
                    <p class="cta-eyebrow">Installation en 3 secondes</p>
                    <h2 class="cta-title">Faites glisser ce bouton dans votre barre de favoris.</h2>
                    <p class="cta-sub">Pas de compte. Pas de serveur. MIT License.</p>
                </div>
                <div class="cta-widget">
                    <a :href="bookmarkletHref" class="bookmarklet-pill" @click.prevent>
                        Callis
                    </a>
                    <p class="cta-hint">Ne cliquez pas — faites glisser.</p>
                </div>
            </div>
        </div>
    </section>
</div>
</template>

<style scoped>
.hero {
    padding: 88px 0 72px;
    background: linear-gradient(170deg, var(--callis-surface) 0%, var(--callis-bg) 60%);
    overflow: hidden;
}

.hero .site-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
}

.hero__eyebrow {
    display: inline-block;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--callis-green-dark);
    background: oklch(95% 0.04 162);
    padding: 4px 12px;
    border-radius: 99px;
    margin-bottom: 24px;
}

.hero__title {
    font-size: clamp(2.75rem, 5.5vw, 4.25rem);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -0.035em;
    color: var(--callis-dark);
    margin-bottom: 24px;
}

.hero__subtitle {
    font-size: 17px;
    color: var(--callis-muted);
    line-height: 1.7;
    margin-bottom: 36px;
    max-width: 460px;
}

.hero__actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.btn {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: transform 80ms, box-shadow 80ms;
}

.btn--primary {
    background: var(--callis-dark);
    color: oklch(99% 0.003 200);
    box-shadow: 0 2px 8px color-mix(in oklch, var(--callis-dark) 25%, transparent);
}

.btn--primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px color-mix(in oklch, var(--callis-dark) 30%, transparent);
}

.btn--ghost {
    background: transparent;
    color: var(--callis-dark);
    border: 1.5px solid var(--callis-border);
}

.btn--ghost:hover {
    border-color: var(--callis-dark);
    background: color-mix(in oklch, var(--callis-dark) 5%, transparent);
}

.hero__visual {
    display: flex;
    justify-content: center;
}

.hero__demo-browser {
    width: 100%;
    max-width: 440px;
    border-radius: 14px;
    overflow: hidden;
    box-shadow:
        0 2px 4px color-mix(in oklch, var(--callis-dark) 8%, transparent),
        0 12px 40px color-mix(in oklch, var(--callis-dark) 18%, transparent);
    border: 1px solid var(--callis-border);
}

.hero__demo-bar {
    background: var(--callis-surface);
    border-bottom: 1px solid var(--callis-border);
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.hero__demo-dots {
    display: flex;
    gap: 5px;
    flex-shrink: 0;
}

.hero__demo-dots span {
    width: 9px;
    height: 9px;
    border-radius: 99px;
    background: var(--callis-border);
}

.hero__demo-url {
    font-size: 11px;
    color: var(--callis-muted);
    background: var(--callis-bg);
    border: 1px solid var(--callis-border);
    border-radius: 6px;
    padding: 3px 10px;
    flex: 1;
    text-align: center;
}

.hero__demo-body {
    display: flex;
    min-height: 260px;
    background: var(--callis-bg);
}

.hero__demo-sidebar {
    width: 152px;
    background: var(--callis-dark);
    padding: 10px 0;
    flex-shrink: 0;
}

.hero__demo-sidebar-header {
    padding: 6px 14px 10px;
    font-size: 12px;
    font-weight: 800;
    color: oklch(99% 0.003 200);
    letter-spacing: -0.01em;
}

.hero__demo-step {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    font-size: 11px;
    color: oklch(75% 0.01 200);
}

.hero__demo-step--active {
    background: oklch(100% 0 0 / 0.08);
    color: oklch(99% 0.003 200);
}

.hero__demo-step-num {
    width: 14px;
    text-align: right;
    font-size: 10px;
    opacity: 0.5;
}

.hero__demo-step-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.hero__demo-step-ok { color: var(--callis-green); font-size: 10px; }
.hero__demo-step-warn { color: oklch(78% 0.13 70); font-size: 10px; }

.hero__demo-page {
    flex: 1;
    position: relative;
    padding: 20px;
}

.hero__demo-highlight {
    position: absolute;
    top: 24px;
    left: 16px;
    right: 16px;
    height: 72px;
    border: 2px solid var(--callis-green);
    border-radius: 6px;
    background: oklch(95% 0.04 162 / 0.15);
}

.hero__demo-tooltip {
    position: absolute;
    top: 108px;
    left: 16px;
    right: 16px;
    background: var(--callis-dark);
    color: oklch(99% 0.003 200);
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 11px;
}

.hero__demo-tooltip strong {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: 700;
}

.hero__demo-tooltip p {
    opacity: 0.65;
    line-height: 1.45;
    margin-bottom: 10px;
}

.hero__demo-tooltip-footer {
    display: flex;
}

.hero__demo-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 2px 8px;
    background: oklch(78% 0.13 70 / 0.25);
    color: oklch(78% 0.13 70);
    border-radius: 99px;
}

.features {
    padding: 96px 0;
}

.features__label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--callis-muted);
    margin-bottom: 32px;
}

.features__list {
    border-top: 1px solid var(--callis-border);
}

.feature-row {
    display: grid;
    grid-template-columns: 52px 220px 1fr;
    gap: 0 48px;
    align-items: baseline;
    padding: 28px 0;
    border-bottom: 1px solid var(--callis-border);
}

.feature-row__num {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--callis-muted);
    padding-top: 4px;
}

.feature-row__name {
    font-size: 17px;
    font-weight: 700;
    color: var(--callis-dark);
    letter-spacing: -0.01em;
}

.feature-row__desc {
    font-size: 14px;
    color: var(--callis-muted);
    line-height: 1.65;
}

.comparison {
    padding: 96px 0;
    background: var(--callis-surface);
    border-top: 1px solid var(--callis-border);
    border-bottom: 1px solid var(--callis-border);
}

.section-title {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--callis-dark);
    margin-bottom: 40px;
}

.comparison__table-wrap {
    overflow-x: auto;
}

.comparison__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    background: var(--callis-bg);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px color-mix(in oklch, var(--callis-dark) 8%, transparent);
}

.comparison__table th {
    padding: 14px 20px;
    text-align: left;
    font-size: 12px;
    font-weight: 700;
    color: var(--callis-muted);
    background: var(--callis-surface);
    border-bottom: 1px solid var(--callis-border);
}

.comparison__th--callis {
    color: var(--callis-dark);
    background: oklch(95% 0.04 162 / 0.3);
}

.comparison__table td {
    padding: 13px 20px;
    border-bottom: 1px solid var(--callis-border);
    color: var(--callis-muted);
}

.comparison__table tr:last-child td {
    border-bottom: none;
}

.comparison__td--callis {
    background: oklch(95% 0.04 162 / 0.12);
    font-weight: 600;
    color: var(--callis-dark);
}

.comparison__feature {
    color: var(--callis-text);
    font-weight: 500;
}

.comparison__yes { color: oklch(52% 0.14 145); font-weight: 700; }
.comparison__no { color: var(--callis-border); }

.cta-section {
    padding: 100px 0;
}

.cta-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 60px;
}

.cta-eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--callis-green-dark);
    margin-bottom: 16px;
}

.cta-title {
    font-size: clamp(1.75rem, 3.5vw, 2.75rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--callis-dark);
    line-height: 1.15;
    max-width: 480px;
    margin-bottom: 14px;
}

.cta-sub {
    font-size: 15px;
    color: var(--callis-muted);
}

.cta-widget {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.bookmarklet-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 16px 36px;
    background: var(--callis-dark);
    color: oklch(99% 0.003 200);
    border-radius: 12px;
    font-size: 18px;
    font-weight: 800;
    text-decoration: none;
    cursor: grab;
    letter-spacing: -0.02em;
    box-shadow:
        0 2px 4px color-mix(in oklch, var(--callis-dark) 15%, transparent),
        0 8px 24px color-mix(in oklch, var(--callis-dark) 25%, transparent);
    transition: transform 100ms, box-shadow 100ms;
}

.bookmarklet-pill:hover {
    transform: translateY(-2px);
    box-shadow:
        0 4px 8px color-mix(in oklch, var(--callis-dark) 15%, transparent),
        0 16px 32px color-mix(in oklch, var(--callis-dark) 28%, transparent);
}

.cta-hint {
    font-size: 12px;
    color: var(--callis-muted);
    text-align: center;
}

@media (max-width: 768px) {
    .hero .site-container {
        grid-template-columns: 1fr;
    }

    .hero__visual {
        display: none;
    }

    .hero__title {
        font-size: 2.5rem;
    }

    .feature-row {
        grid-template-columns: 36px 1fr;
        grid-template-rows: auto auto;
        gap: 4px 16px;
    }

    .feature-row__num {
        grid-row: 1;
    }

    .feature-row__name {
        grid-row: 1;
    }

    .feature-row__desc {
        grid-column: 2;
        grid-row: 2;
    }

    .cta-inner {
        flex-direction: column;
        align-items: flex-start;
        gap: 40px;
    }
}
</style>
