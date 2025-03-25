import type { ScopeZone } from "shared";

import type { client } from "@/api.client";

export type PilotageIntentions = (typeof client.infer)["[GET]/pilotage-intentions"];

export type PilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions"]["query"];

export type FiltersPilotageIntentions = Omit<PilotageIntentionsQuery, "order" | "orderBy">;

export type OrderPilotageIntentions = Pick<PilotageIntentionsQuery, "order" | "orderBy">;

export type PilotageIntentionsDomaines =
  (typeof client.infer)["[GET]/pilotage-intentions"]["domaines"];

export type PilotageIntentionsZonesGeographiques =
  (typeof client.infer)["[GET]/pilotage-intentions"]["zonesGeographiques"];

export type PilotageIntentionsNiveauxDiplome =
  (typeof client.infer)["[GET]/pilotage-intentions"]["niveauxDiplome"];

export type PilotageIntentionsPositionQuadrant =
  (typeof client.infer)["[GET]/pilotage-intentions"]["positionsQuadrant"];

export type PilotageIntentionsStatuts =
    (typeof client.infer)["[GET]/pilotage-intentions"]["statuts"];

export type PilotageIntentionsLine =
  | PilotageIntentionsDomaines[string]
  | PilotageIntentionsZonesGeographiques[string]
  | PilotageIntentionsNiveauxDiplome[string]
  | PilotageIntentionsPositionQuadrant[string]
  | PilotageIntentionsStatuts[string];

export type Filters = PilotageIntentions["filters"];

export type IndicateurRepartition = keyof PilotageIntentionsLine;

export type SelectedScope = {
  type: ScopeZone;
  value?: string;
};

export type FormationsPilotageIntentionsQuery =
  (typeof client.inferArgs)["[GET]/pilotage-intentions/formations"]["query"];

export type FiltersFormationsPilotageIntentions = Omit<FormationsPilotageIntentionsQuery, "order" | "orderBy">;

export type FormationsPilotageIntentions = (typeof client.infer)["[GET]/pilotage-intentions/formations"]["formations"];
export type StatsSortiePilotageIntentions = (typeof client.infer)["[GET]/pilotage-intentions/formations"]["stats"];

export type OrderFormationsPilotageIntentions = Pick<FormationsPilotageIntentionsQuery, "orderFormations" | "orderByFormations">;

export type FilterTracker = (
  filterName: keyof FiltersPilotageIntentions,
  options?: { value?: unknown; context?: string }
) => void;
