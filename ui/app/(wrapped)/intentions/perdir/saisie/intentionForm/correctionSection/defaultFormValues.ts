import type { RaisonCorrectionType } from "shared/enum/raisonCorrectionEnum";

export type PartialCorrectionForms = Partial<CorrectionForms>;

export type CorrectionForms = {
  intentionNumero: string;
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
  raison: RaisonCorrectionType;
  motif: string;
  autreMotif?: string;
  commentaire?: string;
};
