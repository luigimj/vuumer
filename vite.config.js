import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'nosotros.html', // Tu archivo 'nosotros.html'
          dest: 'dist' // Lo copias directamente al root de 'dist'
        },
        {
          src: 'contacto.html', // Tu archivo 'contacto.html'
          dest: 'dist' // Lo copias directamente al root de 'dist'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    mimeTypes: {
      'application/javascript': ['js', 'mjs'],
    },
    watch: {
      usePolling: true,
    },
  },
});
