import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // The app is served from https://damienstpierre.com/glider/app/
  base: '/glider/app/',

  build: {
    // Build straight into the Jekyll site folder.
    outDir: '../glider/app',
    emptyOutDir: true,

    // public/ exists only so `npm run dev` can serve a copy of the CSV.
    // The real one is committed at /glider/data/, so don't duplicate it.
    copyPublicDir: false,

    rollupOptions: {
      output: {
        // Fixed filenames. Vite hashes names by default, which would break
        // the <script> tag in glider/index.md on every build.
        entryFileNames: 'glider.js',
        chunkFileNames: 'glider-[name].js',
        assetFileNames: 'glider.[ext]',
      },
    },
  },
});
