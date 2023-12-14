export const defaultIntentionForms: PartialIntentionForms = {};

export type PartialIntentionForms = Partial<IntentionForms>;

export type IntentionForms = {
  uai: string;
  cfd: string;
  dispositifId: string;
  libelleFCIL?: string;
  typeDemande: string;
  motif: string[];
  autreMotif?: string;
  commentaire?: string;
  coloration: boolean;
  libelleColoration?: string;
  mixte: boolean;
  poursuitePedagogique: boolean;
  amiCma: boolean;
  rentreeScolaire: number;
  capaciteScolaireActuelle?: number;
  capaciteScolaire?: number;
  capaciteScolaireColoree?: number;
  capaciteApprentissageActuelle?: number;
  capaciteApprentissage?: number;
  capaciteApprentissageColoree?: number;
  compensationUai?: string;
  compensationCfd?: string;
  compensationDispositifId?: string;
  compensationRentreeScolaire?: number;
  status: "draft" | "submitted" | "refused";
  motifRefus?: string[];
  autreMotifRefus?: string;
};
