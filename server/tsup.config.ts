import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2015",
  platform: "node",
  format: ["esm", "cjs"],
  splitting: false,
  shims: false,
  minify: false,
  sourcemap: true,
  noExternal: ["shared"],
});
