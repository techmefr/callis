<script setup lang="ts">
const navLinks = [
    { label: 'Installation', to: '/install' },
    { label: 'Documentation', to: '/docs' },
    { label: 'Adapters', to: '/adapters' },
]
</script>

<template>
<div class="site-layout">
    <header class="site-header">
        <div class="site-container site-header__inner">
            <NuxtLink to="/" class="site-logo">Callis</NuxtLink>
            <nav class="site-nav">
                <NuxtLink
                    v-for="link in navLinks"
                    :key="link.to"
                    :to="link.to"
                    class="site-nav__link"
                >{{ link.label }}</NuxtLink>
            </nav>
            <NuxtLink to="/install" class="site-header__cta">
                Installer le bookmarklet
            </NuxtLink>
        </div>
    </header>

    <main class="site-main">
        <slot />
    </main>

    <footer class="site-footer">
        <div class="site-container">
            <p>Callis — MIT License — <a href="https://github.com/callis-app/callis" target="_blank">GitHub</a></p>
        </div>
    </footer>
</div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800;900&display=swap');

:root {
    --callis-dark: oklch(15% 0.028 268);
    --callis-green: oklch(74% 0.10 162);
    --callis-green-dark: oklch(67% 0.10 162);
    --callis-text: oklch(26% 0.022 270);
    --callis-muted: oklch(52% 0.012 265);
    --callis-border: oklch(87% 0.008 200);
    --callis-bg: oklch(98.5% 0.004 200);
    --callis-surface: oklch(96.5% 0.007 215);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Figtree', system-ui, sans-serif;
    color: var(--callis-text);
    background: var(--callis-bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
}

.site-container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
}

.site-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.site-header {
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--callis-border);
    z-index: 100;
}

.site-header__inner {
    display: flex;
    align-items: center;
    gap: 32px;
    height: 60px;
}

.site-logo {
    font-size: 18px;
    font-weight: 700;
    color: var(--callis-dark);
    text-decoration: none;
    letter-spacing: -0.02em;
}

.site-nav {
    display: flex;
    gap: 4px;
    flex: 1;
}

.site-nav__link {
    font-size: 14px;
    color: var(--callis-muted);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 6px;
}

.site-nav__link:hover,
.site-nav__link.router-link-active {
    color: var(--callis-dark);
    background: rgba(26, 26, 46, 0.06);
}

.site-header__cta {
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    background: var(--callis-dark);
    color: #fff;
    border-radius: 8px;
    text-decoration: none;
    white-space: nowrap;
}

.site-header__cta:hover {
    background: #2d2d50;
}

.site-main {
    flex: 1;
}

.site-footer {
    padding: 32px 0;
    border-top: 1px solid var(--callis-border);
    font-size: 13px;
    color: var(--callis-muted);
}

.site-footer a {
    color: var(--callis-muted);
}

@media (max-width: 640px) {
    .site-nav { display: none; }
    .site-header__cta { display: none; }
}
</style>
