export const defaultCorrectionForms: PartialCorrectionForms = {};

export type PartialCorrectionForms = Partial<CorrectionForms>;

export type CorrectionForms = {
  // Capacité
  capaciteScolaireActuelle: number;
  capaciteScolaire: number;
  capaciteScolaireColoree: number;
  capaciteApprentissageActuelle: number;
  capaciteApprentissage: number;
  capaciteApprentissageColoree: number;
  // Précisions
  raison: string;
  motif: string;
  autreMotif?: string;
  commentaire?: string;
};
