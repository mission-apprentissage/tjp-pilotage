import { ApiType } from "shared";

import { api } from "../../../../api.client";

export type PilotageTransformationStatsQuery = Parameters<
  typeof api.getTransformationStats
>[0]["query"];

export type PilotageTransformationStats = ApiType<
  typeof api.getTransformationStats
>;
export type Filters = Pick<
  PilotageTransformationStatsQuery,
  "rentreeScolaire" | "filiere" | "codeNiveauDiplome"
>;

export type Order = Pick<PilotageTransformationStatsQuery, "order" | "orderBy">;

export type IndicateurType = "tauxTransformation" | "ratioFermeture";

export type Scope = "regions" | "academies" | "departements" | undefined;

export type TerritoiresFilters = {
  regions?: string;
  academies?: string;
  departements?: string;
};

export type FormationsTransformationStatsQuery = Parameters<
  typeof api.getFormationsTransformationStats
>[0]["query"];

export type FormationsTransformationStats = ApiType<
  typeof api.getFormationsTransformationStats
>;

export type OrderFormationsTransformationStats = Pick<
  FormationsTransformationStatsQuery,
  "order" | "orderBy"
>;
