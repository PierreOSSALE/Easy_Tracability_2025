// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permet à Docker d'exposer le serveur
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true, // forcer le polling
      interval: 100, // intervalle de 100 ms
    },
    hmr: {
      protocol: "ws",
      host: "localhost", // ← à adapter si tu accèdes via IP locale ou nom de domaine
      port: 3000,
    },
  },
});
