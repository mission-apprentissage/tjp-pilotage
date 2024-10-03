import { glob } from "glob";
import path from "path";

import { verifyFileEncoding } from "./modules/import/utils/verifyFileEncoding";

describe("cli", () => {
  describe("importFiles", () => {
    it(
      "Should only allow utf8 public files",
      async () => {
        const publicFiles = await glob(
          path.join(__dirname, "../public/**/*.csv")
        );

        for (const file of publicFiles) {
          const res = await verifyFileEncoding(file);
          expect(res).toBe(true);
          console.log(`${file} OK`);
        }
      },
      // Allow tests to run for 120 seconds
      120 * 1000
    );
  });
});
