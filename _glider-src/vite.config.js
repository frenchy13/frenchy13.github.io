import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, '..', 'glider', 'data');

/**
 * In production the site root is damienstpierre.com, so the app fetches
 * /glider/data/gliders.csv directly. The dev server serves everything under
 * `base`, so that path would 404. This middleware maps it back to the one real
 * CSV in the site folder, keeping a single source of truth: no second copy to
 * forget to update.
 */
function serveSiteData() {
  return {
    name: 'serve-site-data',
    configureServer(server) {
      server.middlewares.use('/glider/data', (req, res, next) => {
        const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '');
        const file = path.join(dataDir, rel);
        if (!file.startsWith(dataDir)) return next();
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return next();

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), serveSiteData()],

  // The app is served from https://damienstpierre.com/glider/app/
  base: '/glider/app/',

  // No public/ folder. The CSV lives at /glider/data/ and is served by the
  // middleware above in dev, and by GitHub Pages in production.
  publicDir: false,

  build: {
    // Build straight into the Jekyll site folder.
    outDir: '../glider/app',
    emptyOutDir: true,

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
