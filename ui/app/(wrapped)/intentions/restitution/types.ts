import { client } from "../../../../api.client";

export type StatsIntentionsQuery =
  (typeof client.inferArgs)["[GET]/intentions/stats"]["query"];

export type Filters = Pick<
  StatsIntentionsQuery,
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
  | "CPC"
  | "coloration"
  | "amiCMA"
  | "codeNiveauDiplome"
  | "dispositif"
  | "secteur"
  | "cfdFamille"
  | "compensation"
  | "voie"
>;

export type Order = Pick<StatsIntentionsQuery, "order" | "orderBy">;

export type StatsIntentions = (typeof client.infer)["[GET]/intentions/stats"];

export type IndicateurType = "insertion" | "poursuite";

export type CountStatsIntentionsQuery =
  (typeof client.inferArgs)["[GET]/intentions/stats/count"]["query"];

export type CountStatsIntentions =
  (typeof client.infer)["[GET]/intentions/stats/count"];
