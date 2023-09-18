export const defaultIntentionForms: {
  1: Partial<IntentionForms[1]>;
  2: Partial<IntentionForms[2]>;
} = {
  1: {},
  2: {},
};

export type PartialIntentionForms = {
  1: Partial<IntentionForms[1]>;
  2: Partial<IntentionForms[2]>;
};

export type IntentionForms = {
  1: {
    uai: string;
    cfd: string;
    libelleDiplome: string;
    dispositifId: string;
  };
  2: {
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
    capaciteScolaire: number;
    capaciteScolaireColoree?: number;
    capaciteApprentissageActuelle?: number;
    capaciteApprentissage?: number;
    capaciteApprentissageColoree?: number;
  };
};
