<script setup lang="ts">
const bookmarkletCode = `javascript:(function(){if(window.__callis)return window.__callis.toggle();var s=document.createElement('script');s.src='https://cdn.callis.io/loader.js?v=latest';document.head.appendChild(s);})();`

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
                <div class="hero__demo-placeholder">
                    <div class="hero__demo-browser">
                        <div class="hero__demo-dots">
                            <span /><span /><span />
                        </div>
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
                            <div class="hero__demo-highlight" />
                            <div class="hero__demo-tooltip">
                                <strong>Section hero</strong>
                                <p>Retrouvez ici la vue d'ensemble.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="features">
        <div class="site-container">
            <div class="features__grid">
                <div class="feature-card">
                    <span class="feature-card__icon">🖱</span>
                    <h3>Visual builder</h3>
                    <p>Cliquez un élément sur la page pour le capturer. Pas de sélecteurs à écrire à la main.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-card__icon">📦</span>
                    <h3>Export JSON neutre</h3>
                    <p>Le résultat est un fichier <code>callis.json</code> compatible driver.js, Shepherd.js, Intro.js.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-card__icon">🌍</span>
                    <h3>i18n natif</h3>
                    <p>Toggle par champ pour générer des clés de traduction. Compatible Tolgee, vue-i18n, i18next.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-card__icon">🎯</span>
                    <h3>Tooltips permanentes</h3>
                    <p>Affichez des aides contextuelles qui restent visibles tant qu'une condition est vraie.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-card__icon">🔒</span>
                    <h3>Zéro infra</h3>
                    <p>Tout s'exécute dans le navigateur. Pas de serveur, pas de SaaS, pas d'abonnement.</p>
                </div>
                <div class="feature-card">
                    <span class="feature-card__icon">📋</span>
                    <h3>Ticket dev généré</h3>
                    <p><code>CALLIS_TASKS.md</code> liste les sélecteurs fragiles à stabiliser pour le dev.</p>
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
            <div class="cta-card">
                <h2>Prêt à rendre vos utilisateurs autonomes ?</h2>
                <p>Installez le bookmarklet et créez votre premier tour en moins de 5 minutes.</p>
                <NuxtLink to="/install" class="btn btn--primary btn--large">
                    Installer Callis gratuitement
                </NuxtLink>
            </div>
        </div>
    </section>
</div>
</template>

<style scoped>
.hero {
    padding: 80px 0 60px;
    background: linear-gradient(180deg, #f8f9ff 0%, #fff 100%);
    overflow: hidden;
}

.hero .site-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
}

.hero__eyebrow {
    display: inline-block;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--callis-green-dark);
    background: rgba(93, 202, 165, 0.12);
    padding: 4px 10px;
    border-radius: 99px;
    margin-bottom: 20px;
}

.hero__title {
    font-size: 48px;
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--callis-dark);
    margin-bottom: 20px;
}

.hero__subtitle {
    font-size: 17px;
    color: var(--callis-muted);
    line-height: 1.65;
    margin-bottom: 32px;
    max-width: 480px;
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
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: all 100ms;
}

.btn--primary {
    background: var(--callis-dark);
    color: #fff;
}

.btn--primary:hover {
    background: #2d2d50;
    transform: translateY(-1px);
}

.btn--ghost {
    background: transparent;
    color: var(--callis-dark);
    border: 1.5px solid var(--callis-border);
}

.btn--ghost:hover {
    border-color: var(--callis-dark);
    background: rgba(26, 26, 46, 0.04);
}

.btn--large {
    padding: 14px 28px;
    font-size: 16px;
}

.hero__visual {
    display: flex;
    justify-content: center;
}

.hero__demo-placeholder {
    width: 100%;
    max-width: 440px;
}

.hero__demo-browser {
    background: #f3f4f6;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(26, 26, 46, 0.15);
    display: flex;
    min-height: 280px;
}

.hero__demo-dots {
    position: absolute;
    top: 14px;
    left: 14px;
    display: flex;
    gap: 6px;
}

.hero__demo-dots span {
    width: 10px;
    height: 10px;
    border-radius: 99px;
    background: rgba(26, 26, 46, 0.2);
}

.hero__demo-sidebar {
    width: 160px;
    background: var(--callis-dark);
    padding: 12px 0;
    flex-shrink: 0;
}

.hero__demo-sidebar-header {
    padding: 6px 14px 12px;
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
}

.hero__demo-step {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
}

.hero__demo-step--active {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
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

.hero__demo-step-ok { color: #5dcaa5; font-size: 10px; }
.hero__demo-step-warn { color: #f5a623; font-size: 10px; }

.hero__demo-page {
    flex: 1;
    position: relative;
    padding: 24px;
}

.hero__demo-highlight {
    position: absolute;
    top: 30px;
    left: 20px;
    right: 20px;
    height: 80px;
    border: 2px solid #5dcaa5;
    border-radius: 6px;
    background: rgba(93, 202, 165, 0.06);
}

.hero__demo-tooltip {
    position: absolute;
    top: 120px;
    left: 20px;
    right: 20px;
    background: var(--callis-dark);
    color: #fff;
    border-radius: 8px;
    padding: 12px 14px;
    font-size: 12px;
}

.hero__demo-tooltip strong {
    display: block;
    margin-bottom: 4px;
    font-size: 13px;
}

.hero__demo-tooltip p {
    opacity: 0.7;
    line-height: 1.4;
}

.features {
    padding: 80px 0;
}

.features__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.feature-card {
    padding: 28px;
    border: 1px solid var(--callis-border);
    border-radius: 12px;
}

.feature-card__icon {
    font-size: 28px;
    display: block;
    margin-bottom: 14px;
}

.feature-card h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
    color: var(--callis-dark);
}

.feature-card p {
    font-size: 14px;
    color: var(--callis-muted);
    line-height: 1.6;
}

.feature-card code {
    font-size: 12px;
    background: rgba(26, 26, 46, 0.06);
    padding: 2px 5px;
    border-radius: 4px;
}

.comparison {
    padding: 80px 0;
    background: #f8f9ff;
}

.section-title {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--callis-dark);
    margin-bottom: 36px;
    text-align: center;
}

.comparison__table-wrap {
    overflow-x: auto;
}

.comparison__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.comparison__table th {
    padding: 14px 20px;
    text-align: left;
    font-size: 13px;
    font-weight: 600;
    color: var(--callis-muted);
    background: #f8f9ff;
    border-bottom: 1px solid var(--callis-border);
}

.comparison__th--callis {
    color: var(--callis-dark);
    background: rgba(93, 202, 165, 0.08);
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
    background: rgba(93, 202, 165, 0.04);
    font-weight: 600;
    color: var(--callis-dark);
}

.comparison__feature {
    color: var(--callis-text);
    font-weight: 500;
}

.comparison__yes { color: #16a34a; font-weight: 700; }
.comparison__no { color: #d1d5db; }

.cta-section {
    padding: 80px 0;
}

.cta-card {
    background: var(--callis-dark);
    color: #fff;
    border-radius: 16px;
    padding: 60px;
    text-align: center;
}

.cta-card h2 {
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
}

.cta-card p {
    font-size: 16px;
    opacity: 0.7;
    margin-bottom: 28px;
}

.cta-card .btn--primary {
    background: var(--callis-green);
    color: var(--callis-dark);
}

.cta-card .btn--primary:hover {
    background: var(--callis-green-dark);
}

@media (max-width: 768px) {
    .hero .site-container { grid-template-columns: 1fr; }
    .hero__visual { display: none; }
    .hero__title { font-size: 36px; }
    .features__grid { grid-template-columns: 1fr; }
    .cta-card { padding: 40px 24px; }
}
</style>
