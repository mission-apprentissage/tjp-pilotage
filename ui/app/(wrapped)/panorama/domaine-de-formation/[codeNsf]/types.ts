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

export type EtablissementsView = "map" | "list";
export type EtablissementsOrderBy = "departement_commune" | "libelle";
export type Bbox = {
  latMin: number;
  lngMin: number;
  latMax: number;
  lngMax: number;
};
export type Filters = {
  cfd: string;
  codeRegion?: string;
  codeDepartement?: string;
  codeAcademie?: string;
  presence: Presence;
  voie: Voie;
  formationTab: FormationTab;
  etab: {
    includeAll: boolean;
    view: EtablissementsView;
    orderBy: EtablissementsOrderBy;
    bbox?: Bbox;
  };
};

export type Region = DomaineDeFormationFilters["regions"][number];
export type Academie = DomaineDeFormationFilters["academies"][number];
export type Departement = DomaineDeFormationFilters["departements"][number];

export type Formation = (typeof client.infer)["[GET]/formation/:cfd"];
export type FormationIndicateurs = (typeof client.infer)["[GET]/formation/:cfd/indicators"];
export type TauxIJType = keyof (typeof client.infer)["[GET]/formation/:cfd/indicators"]["tauxIJ"];
export type TauxIJValues = (typeof client.infer)["[GET]/formation/:cfd/indicators"]["tauxIJ"]["tauxInsertion"];
export type TauxIJValue = (typeof client.infer)["[GET]/formation/:cfd/indicators"]["tauxIJ"]["tauxInsertion"][number];
export type TauxPressionValue = (typeof client.infer)["[GET]/formation/:cfd/indicators"]["tauxPressions"][number];
export type TauxRemplissageValue = (typeof client.infer)["[GET]/formation/:cfd/indicators"]["tauxRemplissages"][number];

export type TauxAttractiviteType = "tauxPression" | "tauxRemplissage";

export type FormationsCounter = {
  inScope: number;
  outsideScope: number;
  scolaire: number;
  apprentissage: number;
  allVoies: number;
  allScopes: number;
};

export type Etablissement = (typeof client.infer)["[GET]/formation/:cfd/map"]["etablissements"][number];
