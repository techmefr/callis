<script setup lang="ts">
useHead({ title: 'Documentation — Callis' })

const jsonExample = `{
  "version": "1.0",
  "theme": {
    "primaryColor": "#1a1a2e",
    "textColor": "#ffffff",
    "overlayOpacity": 0.4,
    "borderRadius": 8
  },
  "tours": [
    {
      "id": "onboarding-dashboard",
      "url": "/dashboard",
      "trigger": "first-visit",
      "conditions": { "roles": ["user", "admin"] },
      "steps": [
        {
          "id": "step-1",
          "type": "step",
          "selectors": {
            "primary": "[data-callis=\\"main-nav\\"]",
            "fallbacks": ["#main-nav", "nav:first-child"]
          },
          "title": "La navigation principale",
          "titleKey": "tour.dashboard.step1.title",
          "i18n": true,
          "description": "Retrouvez ici tous vos modules.",
          "position": "bottom"
        }
      ]
    }
  ]
}`

const selectorCode = `<!-- Priorité 1 : data-callis (stable) -->
<button data-callis="btn-create-project">Créer</button>

<!-- Priorité 2 : id unique -->
<nav id="main-nav">...</nav>

<!-- Priorité 3 : data-testid / aria-label -->
<button data-testid="submit-btn">Envoyer</button>

<!-- Priorité 4 : sélecteur CSS généré automatiquement -->
<!-- (fragile — CALLIS_TASKS.md vous indique quoi ajouter) -->`

const i18nCode = `// Sans i18n
{ "title": "Démarrez maintenant" }

// Avec i18n
{
  "title": "Démarrez maintenant",
  "titleKey": "tour.home.step1.title",
  "i18n": true
}

// L'adapter utilise titleKey si i18n: true, sinon title directement
// Compatible Tolgee, vue-i18n, i18next, react-intl`
</script>

<template>
<div class="docs-page">
    <div class="site-container docs-layout">
        <nav class="docs-nav">
            <ul>
                <li><a href="#format">Format callis.json</a></li>
                <li><a href="#selectors">Convention data-callis</a></li>
                <li><a href="#i18n">Intégration i18n</a></li>
                <li><a href="#triggers">Déclenchement</a></li>
                <li><a href="#spa">SPA / Navigation</a></li>
                <li><a href="#adapters">Adapters</a></li>
            </ul>
        </nav>

        <article class="docs-content">
            <h1>Documentation</h1>

            <section id="format">
                <h2>Format callis.json</h2>
                <p>
                    Callis exporte un fichier JSON neutre consommable par n'importe quelle
                    librairie d'onboarding JS. Le fichier contient le theme global et tous les tours.
                </p>
                <pre class="code-block">{{ jsonExample }}</pre>
            </section>

            <section id="selectors">
                <h2>Convention data-callis</h2>
                <p>
                    Callis génère automatiquement des sélecteurs CSS. Pour des sélecteurs stables
                    dans le temps, ajoutez un attribut <code>data-callis</code> sur vos composants.
                </p>
                <p>
                    Ordre de priorité lors de la capture :
                </p>
                <pre class="code-block">{{ selectorCode }}</pre>
                <p>
                    Le fichier <code>CALLIS_TASKS.md</code> liste exactement quels attributs
                    <code>data-callis</code> ajouter, avec la valeur suggérée et le composant concerné.
                </p>
            </section>

            <section id="i18n">
                <h2>Intégration i18n</h2>
                <p>
                    Chaque champ <code>title</code> et <code>description</code> peut être en mode
                    texte brut ou en mode i18n. Le toggle s'active directement dans l'éditeur Callis.
                </p>
                <pre class="code-block">{{ i18nCode }}</pre>
            </section>

            <section id="triggers">
                <h2>Déclenchement des tours</h2>
                <div class="docs-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Valeur</th>
                                <th>Comportement</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><code>first-visit</code></td>
                                <td>Check localStorage <code>callis:seen:{id}</code> — une seule fois</td>
                            </tr>
                            <tr>
                                <td><code>always</code></td>
                                <td>Déclenché à chaque chargement de page</td>
                            </tr>
                            <tr>
                                <td><code>manual</code></td>
                                <td>Le dev appelle <code>callis.start('id')</code></td>
                            </tr>
                            <tr>
                                <td><code>permanent</code></td>
                                <td>Tooltip ancrée, visible tant que la condition est vraie</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section id="spa">
                <h2>SPA / Navigation</h2>
                <p>
                    Le bookmarklet détecte automatiquement les changements de route SPA en
                    écoutant les mutations du <code>&lt;title&gt;</code> et l'événement
                    <code>popstate</code>.
                </p>
                <p>
                    La segmentation par rôle utilise des attributs <code>data-*</code> sur
                    <code>&lt;body&gt;</code> :
                </p>
                <pre class="code-block">&lt;!-- Posez cet attribut une seule fois au login --&gt;
&lt;body data-role="admin" data-plan="pro"&gt;</pre>
            </section>

            <section id="adapters">
                <h2>Adapters</h2>
                <p>
                    Callis exporte un snippet adapter prêt à brancher. Les adapters disponibles :
                </p>
                <ul class="docs-list">
                    <li><NuxtLink to="/adapters">adapter-driverjs</NuxtLink> — driver.js (recommandé)</li>
                    <li><NuxtLink to="/adapters">adapter-vanilla</NuxtLink> — Pure JS, sans dépendance</li>
                    <li>adapter-shepherd — Shepherd.js (v2)</li>
                    <li>adapter-introjs — Intro.js (v2)</li>
                </ul>
            </section>
        </article>
    </div>
</div>
</template>

<style scoped>
.docs-page {
    padding: 60px 0;
}

.docs-layout {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 60px;
    align-items: start;
}

.docs-nav {
    position: sticky;
    top: 80px;
}

.docs-nav ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.docs-nav a {
    display: block;
    padding: 7px 12px;
    font-size: 14px;
    color: var(--callis-muted);
    text-decoration: none;
    border-radius: 6px;
}

.docs-nav a:hover {
    color: var(--callis-dark);
    background: rgba(26, 26, 46, 0.06);
}

.docs-content h1 {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--callis-dark);
    margin-bottom: 40px;
}

.docs-content section {
    margin-bottom: 52px;
}

.docs-content h2 {
    font-size: 22px;
    font-weight: 700;
    color: var(--callis-dark);
    margin-bottom: 14px;
    padding-top: 8px;
}

.docs-content p {
    font-size: 15px;
    color: var(--callis-muted);
    line-height: 1.7;
    margin-bottom: 14px;
}

.docs-content code {
    font-size: 13px;
    background: rgba(26, 26, 46, 0.07);
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

.docs-table table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.docs-table th {
    padding: 10px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: var(--callis-muted);
    background: #f8f9ff;
    border-bottom: 1px solid var(--callis-border);
}

.docs-table td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--callis-border);
    color: var(--callis-text);
}

.docs-table tr:last-child td { border-bottom: none; }

.docs-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.docs-list li {
    font-size: 15px;
    color: var(--callis-muted);
}

.docs-list a {
    color: var(--callis-dark);
    font-weight: 600;
    text-decoration: none;
}

@media (max-width: 768px) {
    .docs-layout { grid-template-columns: 1fr; }
    .docs-nav { display: none; }
}
</style>
