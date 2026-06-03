export default defineNuxtConfig({
    devServer: { port: 4040 },
    modules: ['@nuxt/ui'],
    compatibilityDate: '2025-01-01',
    future: {
        compatibilityVersion: 4,
    },
    app: {
        head: {
            title: 'Callis — Builder de tours guidés sans code',
            meta: [
                {
                    name: 'description',
                    content:
                        "Créez visuellement des tours guidés et tooltips contextuelles sur n'importe quel site, sans toucher au code.",
                },
            ],
        },
    },
})
