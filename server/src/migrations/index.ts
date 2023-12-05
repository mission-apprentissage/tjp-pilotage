import { Kysely } from "kysely";

import * as migration_1693472638401 from "./migration_1693472638401";
import * as migration_1693472638402 from "./migration_1693472638402";
import * as migration_1693472638403 from "./migration_1693472638403";
import * as migration_1693472638404 from "./migration_1693472638404";
import * as migration_1693472638405 from "./migration_1693472638405";
import * as migration_1693472638434 from "./migration_1693472638434";
import * as migration_1694088919833 from "./migration_1694088919833";
import * as migration_1694696983654 from "./migration_1694696983654";
import * as migration_1695115777044 from "./migration_1695115777044";
import * as migration_1695129025327 from "./migration_1695129025327";
import * as migration_1695713687238 from "./migration_1695713687238";
import * as migration_1695902173541 from "./migration_1695902173541";
import * as migration_1697132526570 from "./migration_1697132526570";
import * as migration_1697133441570 from "./migration_1697133441570";
import * as migration_1697297659457 from "./migration_1697297659457";
import * as migration_1701161600667 from "./migration_1701161600667";
import * as migration_1701782820146 from "./migration_1701782820146";

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
  migration_1695115777044,
  migration_1695129025327,
  migration_1695713687238,
  migration_1695902173541,
  migration_1697132526570,
  migration_1697133441570,
  migration_1697297659457,
  migration_1701161600667,
  migration_1701782820146,
};
