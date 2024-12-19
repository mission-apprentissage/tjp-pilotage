import { resolve } from "node:path";

import tsconfigPaths from "vite-tsconfig-paths";
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  // Tests unitaires du serveur
  {
    plugins: [tsconfigPaths()],
    test: {
      name: "server-unit",
      root: "./server",
      include: ["./src/**/*.test.ts"],
      exclude: ["**/*.spec.ts"],
      setupFiles: ["./tests/setup.ts"],
      globalSetup: ["./tests/globalSetup.ts"],
      clearMocks: true,
      sequence: {
        hooks: "stack",
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./server/src"),
      },
    },
  },
  // Tests d'intégration du serveur
  {
    plugins: [tsconfigPaths()],
    test: {
      name: "server-integration",
      root: "./server",
      include: ["./src/**/*.spec.ts"],
      setupFiles: ["./tests/setup.ts"],
      globalSetup: ["./tests/globalSetup.ts"],
      clearMocks: true,
      sequence: {
        hooks: "stack",
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./server/src"),
      },
    },
  },
  // Tests unitaires shared
  {
    plugins: [tsconfigPaths()],
    test: {
      name: "shared",
      root: "./shared",
      include: ["./**/*.test.ts"],
      clearMocks: true,
    },
    resolve: {
      alias: {
        "@shared": resolve(__dirname, "./shared/src"),
      },
    },
  },
]);
