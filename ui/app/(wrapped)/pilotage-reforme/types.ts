import { ApiType } from "shared";

import { api } from "../../../api.client";

export type PilotageReformeStatsQuery = Parameters<
  typeof api.getPilotageReformeStats
>[0]["query"];

export type PilotageReformeStatsRegionsQuery = Parameters<
  typeof api.getPilotageReformeStatsRegions
>[0]["query"];

export type Filters = Pick<
  PilotageReformeStatsQuery,
  "codeNiveauDiplome" | "codeRegion"
>;

export type FiltersRegions = Pick<
  PilotageReformeStatsRegionsQuery,
  "codeNiveauDiplome"
>;

export type Order = Pick<PilotageReformeStatsRegionsQuery, "order" | "orderBy">;

export type PilotageReformeStats = ApiType<typeof api.getPilotageReformeStats>;

export type PilotageReformeStatsRegion = ApiType<
  typeof api.getPilotageReformeStatsRegions
>;
