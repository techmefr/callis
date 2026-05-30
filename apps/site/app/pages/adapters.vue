<script setup lang="ts">
useHead({ title: 'Adapters — Callis' })

const driverSnippet = `import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { initCallis } from '@callis/adapter-driverjs'
import callisConfig from './callis.json'

initCallis(callisConfig, {
  currentPath: window.location.pathname,
  userRole: document.body.dataset.role,
})`

const vanillaSnippet = `import { initCallis } from '@callis/adapter-vanilla'
import callisConfig from './callis.json'

initCallis(callisConfig, {
  currentPath: window.location.pathname,
})`
</script>

<template>
<div class="adapters-page">
    <div class="site-container">
        <div class="page-header">
            <h1>Adapters</h1>
            <p>Callis exporte un JSON neutre. Les adapters font le pont avec votre librairie d'onboarding.</p>
        </div>

        <div class="adapter-card">
            <div class="adapter-card__header">
                <h2>adapter-driverjs</h2>
                <span class="adapter-card__badge adapter-card__badge--recommended">Recommandé</span>
            </div>
            <p>Pilote <a href="https://driverjs.com" target="_blank">driver.js</a> depuis votre <code>callis.json</code>. Gère les steps de tour, les tooltips permanentes, la détection SPA, et le thème.</p>
            <pre class="code-block">{{ driverSnippet }}</pre>
            <div class="adapter-card__install">
                <code>pnpm add @callis/adapter-driverjs driver.js</code>
            </div>
        </div>

        <div class="adapter-card">
            <div class="adapter-card__header">
                <h2>adapter-vanilla</h2>
                <span class="adapter-card__badge">Zéro dépendance</span>
            </div>
            <p>Implémentation pure JS sans dépendance externe. Overlay, popover, styles inline. Idéal si vous ne voulez pas ajouter driver.js.</p>
            <pre class="code-block">{{ vanillaSnippet }}</pre>
            <div class="adapter-card__install">
                <code>pnpm add @callis/adapter-vanilla</code>
            </div>
        </div>

        <div class="adapter-card adapter-card--coming-soon">
            <div class="adapter-card__header">
                <h2>adapter-shepherd</h2>
                <span class="adapter-card__badge adapter-card__badge--soon">v2</span>
            </div>
            <p>Adapter pour <a href="https://shepherdjs.dev" target="_blank">Shepherd.js</a>. Prévu pour la v2 de Callis.</p>
        </div>
    </div>
</div>
</template>

<style scoped>
.adapters-page {
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
    font-size: 17px;
    color: var(--callis-muted);
}

.adapter-card {
    border: 1px solid var(--callis-border);
    border-radius: 16px;
    padding: 36px;
    margin-bottom: 24px;
}

.adapter-card--coming-soon {
    opacity: 0.6;
}

.adapter-card__header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
}

.adapter-card__header h2 {
    font-size: 20px;
    font-weight: 700;
    color: var(--callis-dark);
    font-family: monospace;
}

.adapter-card__badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 99px;
    background: rgba(26, 26, 46, 0.07);
    color: var(--callis-muted);
}

.adapter-card__badge--recommended {
    background: rgba(93, 202, 165, 0.15);
    color: var(--callis-green-dark);
}

.adapter-card__badge--soon {
    background: #fef3c7;
    color: #92400e;
}

.adapter-card > p {
    font-size: 15px;
    color: var(--callis-muted);
    line-height: 1.65;
    margin-bottom: 20px;
}

.adapter-card a {
    color: var(--callis-dark);
    font-weight: 600;
}

.adapter-card code {
    font-family: monospace;
    font-size: 13px;
    background: rgba(26, 26, 46, 0.07);
    padding: 2px 6px;
    border-radius: 4px;
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

.adapter-card__install {
    background: #f8f9ff;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 13px;
}
</style>
