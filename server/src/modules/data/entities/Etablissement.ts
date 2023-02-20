export type Etablissement = {
  id: string;
  UAI: string;
  siret: string;
  codeAcademie: string;
  natureUAI: string;
  libelleEtablissement: string;
  adresseEtablissement: string;
  codePostal: string;
  secteur: string;
  dateOuverture: Date;
  dateFermeture: Date | undefined;
  codeMinistereTutuelle: string;
};
