import type { client } from "@/api.client";

export type PilotageReformeStatsQuery = (typeof client.inferArgs)["[GET]/suivi-impact/stats"]["query"];

export type PilotageReformeStatsRegionsQuery =
  (typeof client.inferArgs)["[GET]/suivi-impact/stats/regions"]["query"];

export type Filters = Pick<PilotageReformeStatsQuery, "codeNiveauDiplome" | "codeRegion">;

export type FiltersRegions = Pick<PilotageReformeStatsRegionsQuery, "codeNiveauDiplome">;

export type Order = Pick<PilotageReformeStatsRegionsQuery, "order" | "orderBy">;

export type PilotageReformeStats = (typeof client.infer)["[GET]/suivi-impact/stats"];

export type PilotageReformeStatsRegion = (typeof client.infer)["[GET]/suivi-impact/stats/regions"];

export type PilotageReformeStatsRegionData = (typeof client.infer)["[GET]/suivi-impact/stats/regions"]["statsRegions"][number];

export type TauxTransformation = (typeof client.infer)["[GET]/suivi-impact/stats"]["scoped"]["tauxTransformationCumule"]

export type IndicateurType = keyof Pick<
  (typeof client.infer)["[GET]/suivi-impact/stats/regions"]["statsRegions"][number],
  "tauxInsertion" | "tauxPoursuite" | "tauxTransformationCumule" | "tauxChomage" | "tauxTransformationCumulePrevisionnel"
>;

export type IndicateurOption = {
  label: string;
  value: IndicateurType;
  isDefault: boolean;
};
