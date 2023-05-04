export type IndicateurEntree = {
  formationEtablissementId: string;
  rentreeScolaire: string;
  anneeDebut: number;
  premiersVoeux?: (number | null)[];
  effectifs: (number | null)[];
  capacites: (number | null)[];
};
