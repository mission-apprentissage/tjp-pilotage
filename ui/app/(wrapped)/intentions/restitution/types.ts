import type { client } from "@/api.client";

export type DemandesRestitutionIntentions = (typeof client.infer)["[GET]/restitution-intentions/demandes"];

export type FiltersDemandesRestitutionIntentions =
  (typeof client.inferArgs)["[GET]/restitution-intentions/demandes"]["query"];

export type OrderDemandesRestitutionIntentions = Pick<FiltersDemandesRestitutionIntentions, "order" | "orderBy">;

export type IndicateurType = "insertion" | "poursuite";

export type StatsRestitutionIntentions = (typeof client.infer)["[GET]/restitution-intentions/stats"];

export type StatsRestitutionIntentionsQuery = (typeof client.inferArgs)["[GET]/restitution-intentions/stats"]["query"];
