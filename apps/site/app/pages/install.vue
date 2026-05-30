<script setup lang="ts">
useHead({ title: 'Installer Callis' })

const bookmarkletHref = `javascript:(function(){if(window.__callis)return window.__callis.toggle();var s=document.createElement('script');s.src='https://cdn.callis.io/loader.js?v=latest';document.head.appendChild(s);})();`

const steps = [
    {
        num: 1,
        title: 'Faites glisser le bouton ci-dessus dans votre barre de favoris',
        desc: "Cliquez sur le bouton « Callis » et faites-le glisser vers la barre de favoris de votre navigateur. Sur Chrome, activez d'abord la barre de favoris avec Ctrl+Shift+B.",
    },
    {
        num: 2,
        title: 'Naviguez vers le site que vous voulez annoter',
        desc: "Rendez-vous sur votre application web — staging, production, ou tout autre site accessible depuis votre navigateur.",
    },
    {
        num: 3,
        title: 'Cliquez sur le favori Callis',
        desc: "La sidebar Callis apparaît sur la droite. Cliquez « + Cliquer un élément » et sélectionnez n'importe quel élément pour créer un step.",
    },
    {
        num: 4,
        title: 'Exportez le ZIP',
        desc: 'Quand votre tour est prêt, cliquez "Exporter ZIP". Vous obtenez callis.json, CALLIS_TASKS.md et un adapter prêt à brancher.',
    },
]

const codeSnippet = `<!-- Ajoutez cet attribut sur les éléments clés -->
<button data-callis="btn-create-project">Créer un projet</button>
<nav data-callis="main-nav">...</nav>
<section data-callis="hero-section">...</section>`
</script>

<template>
<div class="install-page">
    <div class="site-container">
        <div class="page-header">
            <h1>Installer Callis</h1>
            <p>Trois secondes d'installation. Aucun code à écrire.</p>
        </div>

        <div class="bookmarklet-box">
            <p class="bookmarklet-box__label">Faites glisser ce bouton dans votre barre de favoris :</p>
            <a :href="bookmarkletHref" class="bookmarklet-btn" @click.prevent>Callis</a>
            <p class="bookmarklet-box__hint">
                Ne cliquez pas — faites glisser vers la barre de favoris.
            </p>
        </div>

        <div class="install-steps">
            <div v-for="step in steps" :key="step.num" class="install-step">
                <div class="install-step__num">{{ step.num }}</div>
                <div class="install-step__body">
                    <h3>{{ step.title }}</h3>
                    <p>{{ step.desc }}</p>
                </div>
            </div>
        </div>

        <div class="data-callis-section">
            <h2>Optionnel : ajouter des attributs <code>data-callis</code></h2>
            <p>
                Sans cet attribut, Callis génère un sélecteur CSS de fallback automatiquement.
                Mais pour des sélecteurs stables dans le temps, demandez à votre équipe dev
                d'ajouter <code>data-callis</code> sur les composants importants.
            </p>
            <pre class="code-block">{{ codeSnippet }}</pre>
            <p class="data-callis-hint">
                Le fichier <code>CALLIS_TASKS.md</code> exporté liste exactement quels attributs
                ajouter et sur quels composants.
            </p>
        </div>
    </div>
</div>
</template>

<style scoped>
.install-page {
    padding: 60px 0;
}

.page-header {
    margin-bottom: 48px;
}

.page-header h1 {
    font-size: 40px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--callis-dark);
    margin-bottom: 10px;
}

.page-header p {
    font-size: 18px;
    color: var(--callis-muted);
}

.bookmarklet-box {
    background: #f8f9ff;
    border: 2px dashed var(--callis-border);
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    margin-bottom: 60px;
}

.bookmarklet-box__label {
    font-size: 16px;
    color: var(--callis-text);
    margin-bottom: 20px;
}

.bookmarklet-btn {
    display: inline-block;
    padding: 12px 28px;
    background: var(--callis-dark);
    color: #fff;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    cursor: grab;
    box-shadow: 0 4px 12px rgba(26, 26, 46, 0.25);
}

.bookmarklet-box__hint {
    margin-top: 16px;
    font-size: 13px;
    color: var(--callis-muted);
}

.install-steps {
    display: flex;
    flex-direction: column;
    gap: 32px;
    margin-bottom: 60px;
}

.install-step {
    display: flex;
    gap: 24px;
    align-items: flex-start;
}

.install-step__num {
    width: 40px;
    height: 40px;
    border-radius: 99px;
    background: var(--callis-dark);
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.install-step__body h3 {
    font-size: 17px;
    font-weight: 700;
    color: var(--callis-dark);
    margin-bottom: 6px;
}

.install-step__body p {
    font-size: 15px;
    color: var(--callis-muted);
    line-height: 1.6;
}

.data-callis-section {
    background: #f8f9ff;
    border-radius: 16px;
    padding: 40px;
}

.data-callis-section h2 {
    font-size: 22px;
    font-weight: 700;
    color: var(--callis-dark);
    margin-bottom: 14px;
}

.data-callis-section p {
    font-size: 15px;
    color: var(--callis-muted);
    line-height: 1.65;
    margin-bottom: 20px;
}

.data-callis-section code {
    font-size: 13px;
    background: rgba(26, 26, 46, 0.08);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
}

.code-block {
    background: var(--callis-dark);
    color: #a8f5da;
    border-radius: 10px;
    padding: 20px 24px;
    font-family: monospace;
    font-size: 13px;
    line-height: 1.7;
    overflow-x: auto;
    margin-bottom: 16px;
    white-space: pre;
}

.data-callis-hint {
    font-size: 14px;
    color: var(--callis-muted);
    margin-bottom: 0;
}
</style>
