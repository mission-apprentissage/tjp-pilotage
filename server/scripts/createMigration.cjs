/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const { writeFileSync } = require("fs");
const path = require("path");

writeFileSync(
  // eslint-disable-next-line no-undef
  `${path.join(__dirname, "../src/migrations", `/migration_${new Date().getTime()}.ts`)}`,
  `import type { Kysely } from "kysely";

export const up = async (db: Kysely<unknown>) => {};

export const down = async (db: Kysely<unknown>) => {};
`
);
