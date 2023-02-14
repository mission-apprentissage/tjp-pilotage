import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2015",
  platform: "node",
  format: ["cjs"],
  splitting: false,
  shims: false,
  minify: false,
  sourcemap: true,
  noExternal: ["shared"],
  clean: true,
});
