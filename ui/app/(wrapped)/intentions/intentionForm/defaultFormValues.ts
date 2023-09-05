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
  1: { uai: string };
  2: {
    cfd: string;
    typeDemande: string;
    libelleDiplome: string;
    dispositifId: string;
    motif: string[];
    autreMotif?: string;
    commentaire?: string;
    coloration: string;
    libelleColoration?: string;
    poursuitePedagogique: string;
    amiCma: string;
    rentreeScolaire: string;
  };
};
