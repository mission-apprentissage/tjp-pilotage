import { Kysely } from "kysely";

import * as migration_1693472638401 from "./migration_1693472638401";
import * as migration_1693472638402 from "./migration_1693472638402";
import * as migration_1693472638403 from "./migration_1693472638403";
import * as migration_1693472638404 from "./migration_1693472638404";
import * as migration_1693472638405 from "./migration_1693472638405";
import * as migration_1693472638434 from "./migration_1693472638434";
import * as migration_1694088919833 from "./migration_1694088919833";
import * as migration_1694696983654 from "./migration_1694696983654";
import * as migration_1695129025327 from "./migration_1695129025327";
import * as migration_1695713687238 from "./migration_1695713687238";

type Migration = {
  up: (db: Kysely<unknown>) => Promise<void>;
  down: (db: Kysely<unknown>) => Promise<void>;
};

type Migrations = Record<string, Migration>;

export const migrations: Migrations = {
  migration_1693472638401,
  migration_1693472638402,
  migration_1693472638403,
  migration_1693472638404,
  migration_1693472638405,
  migration_1693472638434,
  migration_1694088919833,
  migration_1694696983654,
  migration_1695129025327,
  migration_1695713687238,
};
