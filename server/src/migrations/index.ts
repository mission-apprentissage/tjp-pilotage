import { Kysely } from "kysely";

import * as migration1 from "./1";

type Migration = {
  up: (db: Kysely<unknown>) => Promise<void>;
  down: (db: Kysely<unknown>) => Promise<void>;
};

type Migrations = Record<string, Migration>;

export const migrations: Migrations = {
  migration1,
};
