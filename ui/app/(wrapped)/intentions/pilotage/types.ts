import { ApiType } from "shared";

import { api } from "../../../../api.client";

export type PilotageTransformationStatsQuery = Parameters<
  typeof api.getTransformationStats
>[0]["query"];

export type PilotageTransformationStats = ApiType<
  typeof api.getTransformationStats
>;

export type IndicateurType = "tauxTransformation";

export type Scope = "regions" | "academies" | "departements" | undefined;

export type TerritoiresFilters = {
  regions?: string;
  academies?: string;
  departements?: string;
};
