import { client } from "@/api.client";

export type PilotageTransformationStatsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-transformation/stats"]["query"];

export type PilotageTransformationStats =
  (typeof client.infer)["[GET]/pilotage-transformation/stats"];

export type PilotageTauxTransformationStats =
  (typeof client.infer)["[GET]/pilotage-transformation/get-scoped-taux-transformations"];

export type PilotageTransformationsStatsDatas = Omit<
  PilotageTransformationStats,
  "filters"
>;

export type Filters = Pick<
  PilotageTransformationStatsQuery,
  "rentreeScolaire" | "CPC" | "filiere" | "codeNiveauDiplome"
>;

export type PilotageTransformationStatsByScope = {
  [K in Scope]?: PilotageTransformationsStatsDatas;
} & {
  filters?: PilotageTransformationStats["filters"];
};

export type Order = Pick<PilotageTransformationStatsQuery, "order" | "orderBy">;

export type IndicateurType = "tauxTransformation" | "ratioFermeture";

export type Scope = "regions" | "academies" | "departements" | "national";
export type SelectedScope = {
  type: Scope;
  value: string;
};
export type Status = "submitted" | "draft" | "all";
export type Indicateur =
  | "tauxTransformation"
  | "countDemande"
  | "differenceCapaciteScolaire"
  | "differenceCapaciteApprentissage"
  | "placesOuvertesScolaire"
  | "placesFermeesScolaire"
  | "placesOuvertesApprentissage"
  | "placesFermeesApprentissage"
  | "placesOuvertes"
  | "placesFermees"
  | "ratioFermeture"
  | "ratioOuverture";

export type TerritoiresFilters = {
  [K in Scope]?: string;
};

export type FormationsTransformationStatsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-transformation/formations"]["query"];

export type FormationsTransformationStats =
  (typeof client.infer)["[GET]/pilotage-transformation/formations"];

export type OrderFormationsTransformationStats = Pick<
  FormationsTransformationStatsQuery,
  "order" | "orderBy"
>;
