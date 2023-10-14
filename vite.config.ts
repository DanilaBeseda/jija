import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /* server: {
    proxy: {
      "/atms": "http://26.202.5.14:7273",
    },
  }, */
});
