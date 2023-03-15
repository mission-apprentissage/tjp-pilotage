export type Etablissement = {
  id: string;
  UAI: string;
  siret?: string;
  codeAcademie?: string;
  codeDepartement?: string;
  codeRegion?: string;
  natureUAI?: string;
  libelleEtablissement?: string;
  adresseEtablissement?: string;
  commune?: string;
  codePostal?: string;
  secteur?: string;
  dateOuverture?: Date;
  dateFermeture?: Date | undefined;
  codeMinistereTutuelle?: string;
};
