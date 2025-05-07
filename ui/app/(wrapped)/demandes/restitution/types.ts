import type { client } from "@/api.client";

export type DemandesRestitution = (typeof client.infer)["[GET]/restitution/demandes"];

export type FiltersDemandesRestitution =
  (typeof client.inferArgs)["[GET]/restitution/demandes"]["query"];

export type OrderDemandesRestitution = Pick<FiltersDemandesRestitution, "order" | "orderBy">;

export type IndicateurType = "insertion" | "poursuite";

export type StatsRestitution = (typeof client.infer)["[GET]/restitution/stats"];

export type StatsRestitutionQuery = (typeof client.inferArgs)["[GET]/restitution/stats"]["query"];
