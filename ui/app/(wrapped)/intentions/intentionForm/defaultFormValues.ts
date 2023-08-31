export const prefilledIntentionForms: IntentionForms = {
  1: { uai: "0010001W" },
  2: {
    cfd: "50032307",
    typeDemande: "ouverture",
    libelleDiplome: "Accessoiriste réalisateur",
    dispositifId: "240",
    motif: ["1", "10"],
    autreMotif: "AUTRE",
    commentaire: "observation",
    coloration: "false",
    poursuitePedagogique: "false",
    amiCma: "false",
    rentreeScolaire: 2023,
  },
};

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
    rentreeScolaire: number;
  };
};
