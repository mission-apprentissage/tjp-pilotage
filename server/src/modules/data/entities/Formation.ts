export type Formation = {
  id: string;
  codeFormationDiplome: string;
  rncp: number;
  libelleDiplome: string;
  codeNiveauDiplome: string;
  dateOuverture: Date;
  dateFermeture?: Date;
};

export type AncienneFormation = Formation & { nouveauCFD: string };
