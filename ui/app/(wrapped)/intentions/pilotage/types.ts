import { client } from "@/api.client";

export type PilotageTransformationStatsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-transformation/stats"]["query"];

export type PilotageTransformationStats =
  (typeof client.infer)["[GET]/pilotage-transformation/stats"];
export type Filters = Pick<
  PilotageTransformationStatsQuery,
  "rentreeScolaire" | "CPC" | "filiere" | "codeNiveauDiplome"
>;

export type Order = Pick<PilotageTransformationStatsQuery, "order" | "orderBy">;

export type IndicateurType = "tauxTransformation" | "ratioFermeture";

export type Scope = "regions" | "academies" | "departements" | undefined;

export type TerritoiresFilters = {
  regions?: string;
  academies?: string;
  departements?: string;
};

export type FormationsTransformationStatsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-transformation/formations"]["query"];

export type FormationsTransformationStats =
  (typeof client.infer)["[GET]/pilotage-transformation/formations"];

export type OrderFormationsTransformationStats = Pick<
  FormationsTransformationStatsQuery,
  "order" | "orderBy"
>;
