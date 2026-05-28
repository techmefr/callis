import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/main.ts',
            name: '__callisBundle',
            formats: ['iife'],
            fileName: () => 'callis.js',
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
        },
        target: 'es2018',
        cssCodeSplit: false,
    },
    define: {
        'process.env.NODE_ENV': '"production"',
    },
})
