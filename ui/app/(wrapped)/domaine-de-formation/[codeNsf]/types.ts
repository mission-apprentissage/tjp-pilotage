import { client } from "@/api.client";

export type DomaineDeFormationFilters =
  (typeof client.infer)["[GET]/domaine-de-formation/:codeNsf"]["filters"];
export type DomaineDeFormationResult =
  (typeof client.infer)["[GET]/domaine-de-formation/:codeNsf"];
export type Formation =
  (typeof client.infer)["[GET]/domaine-de-formation/:codeNsf"]["formations"][number];

export type NsfOptions = (typeof client.infer)["[GET]/domaine-de-formation"];
export type NsfOption = NsfOptions[number];

export type Presence = "" | "dispensees" | "absentes";
export type Voie = "" | "scolaire" | "apprentissage";
export type FormationTab =
  | "etablissements"
  | "tableauComparatif"
  | "indicateurs";
export type QueryFilters =
  (typeof client.inferArgs)["[GET]/domaine-de-formation/:codeNsf"]["query"];
export type Filters = {
  cfd?: string;
  codeRegion?: string;
  codeDepartement?: string;
  codeAcademie?: string;
  presence?: Presence;
  voie?: Voie;
  formationTab: FormationTab;
};
