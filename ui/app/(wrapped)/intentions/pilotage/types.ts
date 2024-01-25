import { Scope } from "shared";

import { client } from "@/api.client";

export type ScopedTransformationStats =
  (typeof client.infer)["[GET]/pilotage-transformation/get-scoped-transformations-stats"];

export type ScopedTransformationStatsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-transformation/get-scoped-transformations-stats"]["query"];

export type ScopedTransformationStatsData = Omit<
  ScopedTransformationStats,
  "filters"
>;

export type Filters = Pick<
  ScopedTransformationStatsQuery,
  "rentreeScolaire" | "CPC" | "filiere" | "codeNiveauDiplome" | "scope"
> & {
  code?: string;
};

export type FiltersEvents =
  | keyof Filters
  | "codeRegion"
  | "codeAcademie"
  | "codeDepartement";

export type ScopedFilters = Pick<
  ScopedTransformationStatsQuery,
  "rentreeScolaire" | "CPC" | "filiere" | "codeNiveauDiplome" | "scope"
>;

export type ScopedPilotageTransformationStatsByScope = {
  [K in Scope]?: ScopedTransformationStatsData;
} & {
  filters?: ScopedTransformationStats["filters"];
};

export type Order = Pick<ScopedTransformationStatsQuery, "order" | "orderBy">;

export type IndicateurType = "tauxTransformation" | "ratioFermeture";

export type SelectedScope = {
  type: Scope;
  value?: string;
};
export type Status = "submitted" | "draft" | "all";
export type Indicateur =
  | "tauxTransformation"
  | "countDemande"
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
