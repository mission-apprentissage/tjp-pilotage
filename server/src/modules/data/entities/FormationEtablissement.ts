export type FormationEtablissement = {
  id: string;
  UAI: string;
  cfd: string;
  dispositifId: string;
  voie: string;
};

export type IndicateurEntree = {
  formationEtablissementId: string;
  millesimeEntree: string;
  capacite?: number;
  effectifEntree?: number;
  nbPremiersVoeux?: number;
};

export type IndicateurSortie = {
  formationEtablissementId: string;
  millesimeSortie: string;
  reussite?: number;
  effectifSortie?: number;
  nbSortants?: number;
  nbPoursuiteEtudes?: number;
  nbInsertion6mois?: number;
};
