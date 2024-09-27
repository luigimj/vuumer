import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: "index.html",
        nosotros: "nosotros.html",
        contacto: "contacto.html",
        "condiciones-de-servicio": "condiciones-de-servicio.html",
        "politica-de-reembolso": "politica-de-reembolso.html",
        "politicas-de-privacidad": "politicas-de-privacidad.html",
      },
    },
  },
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
