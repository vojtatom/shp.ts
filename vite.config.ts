import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'shpts/shpts.ts'),
            name: 'shpts',
            // the proper extensions will be added
            fileName: 'shpts',
        },
    },
    resolve: {
        alias: {
            '@shpts': resolve(__dirname, './shpts'),
        },
    },
    plugins: [dts()],
});
