import type { client } from "@/api.client";

export type DomaineDeFormationFilters = (typeof client.infer)["[GET]/domaine-de-formation/:codeNsf"]["filters"];
export type DomaineDeFormationResult = (typeof client.infer)["[GET]/domaine-de-formation/:codeNsf"];
export type FormationListItem = (typeof client.infer)["[GET]/domaine-de-formation/:codeNsf"]["formations"][number];

export type NsfOptions = (typeof client.infer)["[GET]/domaine-de-formation"];
export type NsfOption = NsfOptions[number];

export type Presence = "" | "dispensees" | "absentes";
export type Voie = "" | "scolaire" | "apprentissage";
export type FormationTab = "etablissements" | "tableauComparatif" | "indicateurs";
export type QueryFilters = (typeof client.inferArgs)["[GET]/domaine-de-formation/:codeNsf"]["query"];
export type Filters = {
  cfd: string;
  codeRegion?: string;
  codeDepartement?: string;
  codeAcademie?: string;
  presence: Presence;
  voie: Voie;
  formationTab: FormationTab;
};

export type TauxIJValues = (typeof client.infer)["[GET]/formation/:cfd/indicateurs"]["tauxIJ"]["tauxInsertion"];
export type TauxIJValue = (typeof client.infer)["[GET]/formation/:cfd/indicateurs"]["tauxIJ"]["tauxInsertion"][number];
export type TauxIJType = keyof (typeof client.infer)["[GET]/formation/:cfd/indicateurs"]["tauxIJ"];

export type TauxAttractiviteType = "tauxPression" | "tauxRemplissage";

export type TauxPressionValue = (typeof client.infer)["[GET]/formation/:cfd/indicateurs"]["tauxPressions"][number];

export type TauxRemplissageValue =
  (typeof client.infer)["[GET]/formation/:cfd/indicateurs"]["tauxRemplissages"][number];

export type FormationIndicateurs = (typeof client.infer)["[GET]/formation/:cfd/indicateurs"];

export type Formation = (typeof client.infer)["[GET]/formation/:cfd"];

export type FiltersNumberOfFormations = {
  formationsInScope: number;
  formationsOutsideScope: number;
  formationsScolaire: number;
  formationsApprentissage: number;
  formationsAllVoies: number;
  formationsAllScopes: number;
};

export type Etablissement = (typeof client.infer)["[GET]/formation/:cfd/map"]["etablissements"][number];
