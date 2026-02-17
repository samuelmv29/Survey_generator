import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* Serve js/ files as raw static assets, bypassing esbuild transform */
function rawServeJsPlugin() {
  return {
    name: 'raw-serve-js',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith('/js/') && req.url.endsWith('.js')) {
          const filePath = path.resolve(__dirname, req.url.slice(1));
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.end(fs.readFileSync(filePath, 'utf-8'));
            return;
          }
        }
        next();
      });
    }
  };
}

/* Copy js/ files to dist/ after build */
function copyJsPlugin() {
  return {
    name: 'copy-js-scripts',
    closeBundle() {
      const srcDir = path.resolve(__dirname, 'js');
      const destDir = path.resolve(__dirname, 'dist', 'js');
      fs.mkdirSync(destDir, { recursive: true });
      fs.readdirSync(srcDir).forEach(file => {
        if (file.endsWith('.js')) {
          fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
        }
      });
    }
  };
}

export default defineConfig({
  root: '.',
  base: './',
  plugins: [rawServeJsPlugin(), copyJsPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  },
  server: {
    open: true,
    port: 3000
  }
});
