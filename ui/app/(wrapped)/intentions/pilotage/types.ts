import { Scope } from "shared";
import { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { client } from "@/api.client";

export type StatsPilotageIntentions =
  (typeof client.infer)["[GET]/pilotage-intentions/stats"];

export type StatsPilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions/stats"]["query"];

export type StatsPilotageIntentionsData = Omit<
  StatsPilotageIntentions,
  "filters"
>;

export type FiltersStatsPilotageIntentions = Pick<
  StatsPilotageIntentionsQuery,
  | "rentreeScolaire"
  | "CPC"
  | "codeNiveauDiplome"
  | "scope"
  | "codeNsf"
  | "campagne"
> & {
  code?: string;
};

export type FiltersEventsStatsPilotageIntentions =
  | keyof FiltersStatsPilotageIntentions
  | "codeRegion"
  | "codeAcademie"
  | "codeDepartement";

export type ScopedFiltersStatsPilotageIntentions = Pick<
  StatsPilotageIntentionsQuery,
  | "rentreeScolaire"
  | "CPC"
  | "codeNsf"
  | "codeNiveauDiplome"
  | "scope"
  | "campagne"
>;

export type StatsPilotageIntentionsByScope = {
  [K in Scope]?: StatsPilotageIntentionsData;
} & {
  filters?: StatsPilotageIntentions["filters"];
};

export type OrderStatsPilotageIntentions = Pick<
  StatsPilotageIntentionsQuery,
  "order" | "orderBy"
>;

export type IndicateurType = "tauxTransformation" | "ratioFermeture";

export type SelectedScope = {
  type: Scope;
  value?: string;
};
export type Status =
  | Extract<DemandeStatutType, "demande validée" | "proposition">
  | "all";
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

export type FormationsPilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions/formations"]["query"];

export type FormationsPilotageIntentions =
  (typeof client.infer)["[GET]/pilotage-intentions/formations"];

export type OrderFormationsPilotageIntentions = Pick<
  FormationsPilotageIntentionsQuery,
  "order" | "orderBy"
>;
