export const defaultCorrectionForms: PartialCorrectionForms = {};

export type PartialCorrectionForms = Partial<CorrectionForms>;

export type CorrectionForms = {
  // Capacité
  capaciteScolaireActuelle: number;
  capaciteScolaire: number;
  capaciteScolaireColoreeActuelle: number;
  capaciteScolaireColoree: number;
  capaciteApprentissageActuelle: number;
  capaciteApprentissage: number;
  capaciteApprentissageColoreeActuelle: number;
  capaciteApprentissageColoree: number;
  // Précisions
  raison: string;
  motif: string;
  autreMotif?: string;
  commentaire?: string;
};
