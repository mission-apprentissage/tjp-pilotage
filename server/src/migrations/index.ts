import { Kysely } from "kysely";

import * as migration1 from "./1";
import * as migration2 from "./2";
import * as migration3 from "./3";
import * as migration4 from "./4";

type Migration = {
  up: (db: Kysely<unknown>) => Promise<void>;
  down: (db: Kysely<unknown>) => Promise<void>;
};

type Migrations = Record<string, Migration>;

export const migrations: Migrations = {
  migration1,
  migration2,
  migration3,
  migration4,
};
