/* eslint-disable @typescript-eslint/no-explicit-any */

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
import * as migration_1701874016850 from "./migration_1701874016850";
import * as migration_1701966702154 from "./migration_1701966702154";
import * as migration_1702071768856 from "./migration_1702071768856";
import * as migration_1702568086990 from "./migration_1702568086990";
import * as migration_1702633323221 from "./migration_1702633323221";
import * as migration_1703005794872 from "./migration_1703005794872";
import * as migration_1703164478576 from "./migration_1703164478576";
import * as migration_1704965024290 from "./migration_1704965024290";
import * as migration_1705490277250 from "./migration_1705490277250";
import * as migration_1705916396650 from "./migration_1705916396650";
import * as migration_1705941490069 from "./migration_1705941490069";
import * as migration_1706023583142 from "./migration_1706023583142";
import * as migration_1706194216308 from "./migration_1706194216308";
import * as migration_1707148829899 from "./migration_1707148829899";
import * as migration_1707151090753 from "./migration_1707151090753";
import * as migration_1707151766621 from "./migration_1707151766621";
import * as migration_1707218907718 from "./migration_1707218907718";
import * as migration_1707730282233 from "./migration_1707730282233";
import * as migration_1708591965808 from "./migration_1708591965808";
import * as migration_1708612696454 from "./migration_1708612696454";
import * as migration_1708938729323 from "./migration_1708938729323";
import * as migration_1709041920511 from "./migration_1709041920511";
import * as migration_1709112153631 from "./migration_1709112153631";
import * as migration_1709130910845 from "./migration_1709130910845";
import * as migration_1709134782543 from "./migration_1709134782543";
import * as migration_1709632374350 from "./migration_1709632374350";
import * as migration_1710171044026 from "./migration_1710171044026";
import * as migration_1712675278364 from "./migration_1712675278364";
import * as migration_1712676622486 from "./migration_1712676622486";

type Migration = {
  up: (db: Kysely<any>) => Promise<void>;
  down: (db: Kysely<any>) => Promise<void>;
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
  migration_1701874016850,
  migration_1701966702154,
  migration_1702071768856,
  migration_1702568086990,
  migration_1702633323221,
  migration_1703005794872,
  migration_1703164478576,
  migration_1704965024290,
  migration_1705490277250,
  migration_1705916396650,
  migration_1705941490069,
  migration_1706023583142,
  migration_1706194216308,
  migration_1707730282233,
  migration_1707148829899,
  migration_1707151090753,
  migration_1707151766621,
  migration_1707218907718,
  migration_1708591965808,
  migration_1708612696454,
  migration_1708938729323,
  migration_1709041920511,
  migration_1709112153631,
  migration_1709130910845,
  migration_1709134782543,
  migration_1709632374350,
  migration_1710171044026,
  migration_1712675278364,
  migration_1712676622486,
};
