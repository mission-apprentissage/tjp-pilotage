export const defaultCorrectionForms: PartialCorrectionForms = {};

export type PartialCorrectionForms = Partial<CorrectionForms>;

export type CorrectionForms = {
  // Formation et établissement
  uai: string;
  cfd: string;
  codeDispositif: string;
  libelleFCIL?: string;
  // Rentrée scolaire
  rentreeScolaire: number;
  // Capacité
  capaciteScolaireActuelle: number;
  capaciteScolaire: number;
  capaciteScolaireColoree: number;
  capaciteApprentissageActuelle: number;
  capaciteApprentissage: number;
  capaciteApprentissageColoree: number;
  // Précisions
  coloration: boolean;
  libelleColoration?: string;
  raison: string;
  motif: string;
  autreMotif?: string;
  commentaire?: string;
  // Hidden
  campagneId: string;
};
