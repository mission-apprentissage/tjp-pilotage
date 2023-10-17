import { ApiType } from "shared";

import { api } from "../../../../api.client";

export type StatsDemandesQuery = Parameters<
  typeof api.getStatsDemandes
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

export type StatsDemandes = ApiType<typeof api.getStatsDemandes>;

export type IndicateurType = "insertion" | "poursuite";

export type CountStatsDemandesQuery = Parameters<
  typeof api.countStatsDemandes
>[0]["query"];

export type CountStatsDemandes = ApiType<typeof api.countStatsDemandes>;
