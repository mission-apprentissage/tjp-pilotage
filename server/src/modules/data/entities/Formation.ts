export type Formation = {
  id: string;
  officielle: boolean;
  codeFormationDiplome: string;
  rncp: number;
  libelleDiplome: string;
  codeNiveauDiplome: string;
  dateOuverture: Date;
  dateFermeture?: Date;
};

export type AncienneFormation = Formation & { nouveauCFD: string };
