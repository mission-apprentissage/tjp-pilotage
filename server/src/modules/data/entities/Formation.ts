export type Formation = {
  id: string;
  codeFormationDiplome: string;
  rncp?: number;
  libelleDiplome: string;
  codeNiveauDiplome: string;
  dateOuverture: Date;
  dateFermeture?: Date;
  CPC?: string;
  CPCSecteur?: string;
  CPCSousSecteur?: string;
  libelleFiliere?: string;
};

export type AncienneFormation = Formation & { nouveauCFD: string };
