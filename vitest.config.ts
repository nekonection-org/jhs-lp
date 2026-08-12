import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(
        new URL("./src/tests/server-only-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    clearMocks: true,
    environment: "jsdom",
    include: ["src/tests/**/*.{test,spec}.{ts,tsx}"],
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
    unstubEnvs: true,
  },
});
