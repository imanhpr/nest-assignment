import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    coverage: {
      provider: "istanbul",
      reporter: "html",
    },
  },
  plugins: [
    swc.vite({
      module: { type: "nodenext" },
    }),
  ],
});
