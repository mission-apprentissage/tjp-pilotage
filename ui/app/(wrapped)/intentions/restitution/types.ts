import { ApiType } from "shared";

import { api } from "../../../../api.client";

export type StatsDemandesQuery = Parameters<
  typeof api.getRestitutionIntentionsStats
>[0]["query"];

export type Filters = Pick<
  StatsDemandesQuery,
  | "codeRegion"
  | "codeAcademie"
  | "codeDepartement"
  | "commune"
  | "uai"
  | "rentreeScolaire"
  | "typeDemande"
  | "motif"
  | "status"
  | "cfd"
  | "filiere"
  | "coloration"
  | "amiCMA"
  | "codeNiveauDiplome"
  | "dispositif"
  | "secteur"
  | "cfdFamille"
  | "compensation"
>;

export type Order = Pick<StatsDemandesQuery, "order" | "orderBy">;

export type StatsDemandes = ApiType<typeof api.getRestitutionIntentionsStats>;

export type IndicateurType = "insertion" | "poursuite";

export type CountStatsDemandesQuery = Parameters<
  typeof api.countRestitutionIntentionsStats
>[0]["query"];

export type CountStatsDemandes = ApiType<
  typeof api.countRestitutionIntentionsStats
>;
