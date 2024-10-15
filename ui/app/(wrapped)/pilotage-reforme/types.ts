import { client } from "@/api.client";

export type PilotageReformeStatsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-reforme/stats"]["query"];

export type PilotageReformeStatsRegionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-reforme/stats/regions"]["query"];

export type Filters = Pick<
  PilotageReformeStatsQuery,
  "codeNiveauDiplome" | "codeRegion"
>;

export type FiltersRegions = Pick<
  PilotageReformeStatsRegionsQuery,
  "codeNiveauDiplome"
>;

export type Order = Pick<PilotageReformeStatsRegionsQuery, "order" | "orderBy">;

export type PilotageReformeStats =
  (typeof client.infer)["[GET]/pilotage-reforme/stats"];

export type PilotageReformeStatsRegion =
  (typeof client.infer)["[GET]/pilotage-reforme/stats/regions"];

export type IndicateurType = keyof Pick<
  (typeof client.infer)["[GET]/pilotage-reforme/stats/regions"]["statsRegions"][number],
  "tauxInsertion" | "tauxPoursuite" | "tauxTransformation"
>;

export type IndicateurOption = {
  label: string;
  value: IndicateurType;
  isDefault: boolean;
};
