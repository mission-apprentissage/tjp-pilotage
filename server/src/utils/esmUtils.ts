import path from "path";
import { fileURLToPath } from "url";

export const __dirname = (filePath?: string) => {
  const __filename = fileURLToPath(filePath ?? import.meta.url);
  return path.dirname(__filename);
};
