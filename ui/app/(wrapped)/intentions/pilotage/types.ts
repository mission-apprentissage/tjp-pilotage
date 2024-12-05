import type { ScopeZone } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";

import type { client } from "@/api.client";

export type PilotageIntentions = (typeof client.infer)["[GET]/pilotage-intentions"];
export type RepartitionPilotageIntentions = PilotageIntentions["repartition"];

export type RepartitionPilotageIntentionsDomaines = RepartitionPilotageIntentions["domaines"];

export type RepartitionPilotageIntentionsZonesGeographiques = RepartitionPilotageIntentions["zonesGeographiques"];

export type RepartitionPilotageIntentionsNiveauxDiplome = RepartitionPilotageIntentions["niveauxDiplome"];

export type RepartitionPilotageIntentionsPositionsQuadrant = RepartitionPilotageIntentions["positionsQuadrant"];

// export type RepartitionPilotageIntentionsStatuts = RepartitionPilotageIntentions["statuts"];

export type FormationsPilotageIntentions = PilotageIntentions["formations"];

export type StatsSortiePilotageIntentions = PilotageIntentions["statsSortie"];

export type FiltersOptionsPilotageIntentions = PilotageIntentions["filtersOptions"];

export type PilotageIntentionsQuery = (typeof client.inferArgs)["[GET]/pilotage-intentions"]["query"];

export type FiltersPilotageIntentions = Omit<
  PilotageIntentionsQuery,
  "order" | "orderBy" | "orderQuadrant" | "orderByQuadrant"
>;

export type OrderPilotageIntentions = Pick<PilotageIntentionsQuery, "order" | "orderBy">;

export type OrderQuadrantPilotageIntentions = Pick<PilotageIntentionsQuery, "orderQuadrant" | "orderByQuadrant">;

export type RepartitionPilotageIntentionsLine =
  | RepartitionPilotageIntentionsDomaines[string]
  | RepartitionPilotageIntentionsZonesGeographiques[string]
  | RepartitionPilotageIntentionsNiveauxDiplome[string]
  | RepartitionPilotageIntentionsPositionsQuadrant[string];

export type Statut = Extract<DemandeStatutType, "demande validée" | "projet de demande"> | "all";

export type Indicateur = keyof RepartitionPilotageIntentionsZonesGeographiques[string];

export type SelectedScope = {
  type: ScopeZone;
  value?: string;
};

export type FilterTracker = (
  filterName: keyof FiltersPilotageIntentions,
  options?: { value?: unknown; context?: string }
) => void;
