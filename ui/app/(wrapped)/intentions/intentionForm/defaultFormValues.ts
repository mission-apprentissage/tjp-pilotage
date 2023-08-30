export const prefilledIntentionForms: IntentionForms = {
  1: { uai: "0010001W" },
  2: {
    cfd: "50032307",
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
  1: { uai?: string };
  2: {
    cfd?: string;
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
