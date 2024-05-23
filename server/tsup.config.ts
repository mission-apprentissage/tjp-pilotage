import { defineConfig } from "tsup";

const isDev = process.env.TSUP_DEV === "true";

export default defineConfig({
  target: "es2020",
  platform: "node",
  format: ["cjs"],
  splitting: false,
  shims: false,
  minify: false,
  sourcemap: true,
  noExternal: ["shared"],
  clean: true,
  publicDir: false,
  watch: isDev ? ["src", "../shared"] : false,
  ignoreWatch: ["public/**/*"],
  entryPoints: ["src/index.ts"],
  onSuccess: isDev
    ? "yarn run copyPublic && yarn run start --debug"
    : undefined,
});
