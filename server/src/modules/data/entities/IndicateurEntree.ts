export type IndicateurEntree = {
  formationEtablissementId: string;
  rentreeScolaire: string;
  anneeDebut: number;
  capacite?: number;
  effectifEntree?: number;
  nbPremiersVoeux?: number;
  effectifs: (number | null)[];
  capacites: (number | null)[];
};
