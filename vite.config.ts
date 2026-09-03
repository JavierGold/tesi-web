import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3000,
    strictPort: true,
    allowedHosts: ["blitz-marshland-unpiloted.ngrok-free.dev"],
  },
  preview: {
    host: "localhost",
    port: 3000,
    strictPort: true,
  },
});
