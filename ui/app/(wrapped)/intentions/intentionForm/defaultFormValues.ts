export const prefilledIntentionForms: IntentionForms = {
  1: { searchEtab: "0010001W" },
  2: {
    searchDiplome: "50032307",
    type: "ouverture",
    libelleDiplome: "Accessoiriste réalisateur",
    codeDispositif: "240",
    motif: ["1", "10"],
    autreMotif: "AUTRE",
    observation: "observation",
    coloration: "false",
    libelleColoration: "false",
    poursuitePedagogique: "false",
    amiCma: "false",
  },
};

export const defaultIntentionForms: IntentionForms = {
  1: {},
  2: {},
};

export type IntentionForms = {
  1: { searchEtab?: string };
  2: {
    searchDiplome?: string;
    type?: string;
    libelleDiplome?: string;
    codeDispositif?: string;
    motif?: string[];
    autreMotif?: string;
    observation?: string;
    coloration?: string;
    libelleColoration?: string;
    poursuitePedagogique?: string;
    amiCma?: string;
  };
};
