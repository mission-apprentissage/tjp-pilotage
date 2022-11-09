import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);

export const packageJson = require("../../package.json");

// add import.meta.url to filePath
export const __dirname = (filePath) => {
  const __filename = fileURLToPath(filePath);
  return path.dirname(__filename);
};
