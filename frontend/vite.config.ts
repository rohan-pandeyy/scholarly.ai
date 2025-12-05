import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import manifest from './src/manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), crx({ manifest })],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        host: '127.0.0.1',
        cors: { origin: '*' },
        hmr: {
            clientPort: 5173,
            host: '127.0.0.1',
        },
    },
});
