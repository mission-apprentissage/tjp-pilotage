import { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import { client } from "../../../../api.client";

export type RepartitionPilotageIntentions =
  (typeof client.infer)["[GET]/pilotage-intentions/repartition"];

export type RepartitionPilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions/repartition"]["query"];

export type RepartitionPilotageIntentionsDomaines =
  (typeof client.infer)["[GET]/pilotage-intentions/repartition"]["domaines"];

export type RepartitionPilotageIntentionsZonesGeographiques =
  (typeof client.infer)["[GET]/pilotage-intentions/repartition"]["zonesGeographiques"];

export type RepartitionPilotageIntentionsNiveauxDiplome =
  (typeof client.infer)["[GET]/pilotage-intentions/repartition"]["niveauxDiplome"];

export type StatsPilotageIntentions =
  (typeof client.infer)["[GET]/pilotage-intentions/stats"];

export type StatsPilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions/stats"]["query"];

export type FiltersStatsPilotageIntentions = Omit<
  StatsPilotageIntentionsQuery,
  "order" | "orderBy"
>;

export type Statut =
  | Extract<DemandeStatutType, "demande validée" | "projet de demande">
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
