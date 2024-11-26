import type { ScopeZone } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import type { client } from "@/api.client";

export type RepartitionPilotageIntentions = (typeof client.infer)["[GET]/pilotage-intentions/repartition"];

export type RepartitionPilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions/repartition"]["query"];

export type FiltersRepartitionPilotageIntentions = Omit<RepartitionPilotageIntentionsQuery, "order" | "orderBy">;

export type OrderRepartitionPilotageIntentions = Pick<RepartitionPilotageIntentionsQuery, "order" | "orderBy">;

export type RepartitionPilotageIntentionsDomaines =
  (typeof client.infer)["[GET]/pilotage-intentions/repartition"]["domaines"];

export type RepartitionPilotageIntentionsZonesGeographiques =
  (typeof client.infer)["[GET]/pilotage-intentions/repartition"]["zonesGeographiques"];

export type RepartitionPilotageIntentionsNiveauxDiplome =
  (typeof client.infer)["[GET]/pilotage-intentions/repartition"]["niveauxDiplome"];

export type RepartitionPilotageIntentionsPositionQuadrant =
  (typeof client.infer)["[GET]/pilotage-intentions/repartition"]["positionsQuadrant"];

export type RepartitionPilotageIntentionsLine =
  | RepartitionPilotageIntentionsDomaines[string]
  | RepartitionPilotageIntentionsZonesGeographiques[string]
  | RepartitionPilotageIntentionsNiveauxDiplome[string]
  | RepartitionPilotageIntentionsPositionQuadrant[string];

export type StatsPilotageIntentions = (typeof client.infer)["[GET]/pilotage-intentions/stats"];

export type StatsPilotageIntentionsQuery = (typeof client.inferArgs)["[GET]/pilotage-intentions/stats"]["query"];

export type FiltersStatsPilotageIntentions = Omit<StatsPilotageIntentionsQuery, "order" | "orderBy">;

export type Statut = Extract<DemandeStatutType, "demande validée" | "projet de demande"> | "all";

export type Indicateur = keyof StatsPilotageIntentions["all"][string];

export type SelectedScope = {
  type: ScopeZone;
  value?: string;
};

export type FormationsPilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions/formations"]["query"];

export type FiltersFormationsPilotageIntentionsQuery = Omit<FormationsPilotageIntentionsQuery, "order" | "orderBy">;

export type FormationsPilotageIntentions = (typeof client.infer)["[GET]/pilotage-intentions/formations"];

export type OrderFormationsPilotageIntentions = Pick<FormationsPilotageIntentionsQuery, "order" | "orderBy">;

export type FilterTracker = (
  filterName: keyof FiltersStatsPilotageIntentions,
  options?: { value?: unknown; context?: string }
) => void;
