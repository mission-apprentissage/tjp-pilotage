import type { client } from "@/api.client";

import type { STATS_DEMANDES_COLUMNS } from "./STATS_DEMANDES_COLUMN";

export type DemandesRestitution = (typeof client.infer)["[GET]/restitution/demandes"];

export type FiltersDemandesRestitution =
  (typeof client.inferArgs)["[GET]/restitution/demandes"]["query"];

export type OrderDemandesRestitution = Pick<FiltersDemandesRestitution, "order" | "orderBy">;

export type IndicateurType = "insertion" | "poursuite";

export type StatsRestitution = (typeof client.infer)["[GET]/restitution/stats"];

export type StatsRestitutionQuery = (typeof client.inferArgs)["[GET]/restitution/stats"]["query"];

export type DEMANDES_COLUMNS_KEYS = keyof typeof STATS_DEMANDES_COLUMNS;
