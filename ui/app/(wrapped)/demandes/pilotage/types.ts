import type { ScopeZone } from "shared";

import type { client } from "@/api.client";

export type Pilotage = (typeof client.infer)["[GET]/pilotage"];

export type PilotageQuery =
  (typeof client.inferArgs)["[GET]/pilotage"]["query"];

export type FiltersPilotage = Omit<PilotageQuery, "order" | "orderBy">;

export type OrderPilotage = Pick<PilotageQuery, "order" | "orderBy">;

export type PilotageDomaines =
  (typeof client.infer)["[GET]/pilotage"]["domaines"];

export type PilotageZonesGeographiques =
  (typeof client.infer)["[GET]/pilotage"]["zonesGeographiques"];

export type PilotageNiveauxDiplome =
  (typeof client.infer)["[GET]/pilotage"]["niveauxDiplome"];

export type PilotagePositionQuadrant =
  (typeof client.infer)["[GET]/pilotage"]["positionsQuadrant"];

export type PilotageStatuts =
    (typeof client.infer)["[GET]/pilotage"]["statuts"];

export type PilotageLine =
  | PilotageDomaines[string]
  | PilotageZonesGeographiques[string]
  | PilotageNiveauxDiplome[string]
  | PilotagePositionQuadrant[string]
  | PilotageStatuts[string];

export type Filters = Pilotage["filters"];

export type IndicateurRepartition = keyof PilotageLine;

export type SelectedScope = {
  type: ScopeZone;
  value?: string;
};

export type FormationsPilotageQuery =
  (typeof client.inferArgs)["[GET]/pilotage/formations"]["query"];

export type FiltersFormationsPilotage = Omit<FormationsPilotageQuery, "order" | "orderBy">;

export type FormationsPilotage = (typeof client.infer)["[GET]/pilotage/formations"]["formations"];
export type StatsSortiePilotage = (typeof client.infer)["[GET]/pilotage/formations"]["stats"];

export type OrderFormationsPilotage = Pick<FormationsPilotageQuery, "orderFormations" | "orderByFormations">;

export type FilterTracker = (
  filterName: keyof FiltersPilotage,
  options?: { value?: unknown; context?: string }
) => void;
