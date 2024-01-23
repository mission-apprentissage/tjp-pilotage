import { GlossaireEntryWithKey } from "./types";

export const GLOSSAIRE_ENTRIES_KEYS = {
  "taux-de-remplissage": "taux-de-remplissage",
  "valeur-ajoutee": "valeur-ajoutee",
  capacite: "capacite",
  effectifs: "effectifs",
  "taux-de-devenir-favorable": "taux-de-devenir-favorable",
  "taux-poursuite-etudes": "taux-poursuite-etudes",
  "taux-de-pression": "taux-de-pression",
  "taux-emploi-12-mois": "taux-emploi-12-mois",
  "taux-emploi-6-mois": "taux-emploi-6-mois",
  quadrant: "quadrant",
};

export type GlossaireEntryKey = keyof typeof GLOSSAIRE_ENTRIES_KEYS;

export const GLOSSAIRE_ENTRIES: GlossaireEntryWithKey[] = [
  {
    key: GLOSSAIRE_ENTRIES_KEYS["taux-de-remplissage"],
    id: "36f68946-cd00-47b8-8541-4c05548ab99e",
    title: "Taux de remplissage",
    indicator: {
      name: "Effectifs",
      color: "blue",
    },
    icon: "ri:home-2-line",
  },
  {
    key: GLOSSAIRE_ENTRIES_KEYS["valeur-ajoutee"],
    id: "6fa45afa-65a5-4c3f-83a4-54956b0040f9",
    title: "Valeur ajoutée",
    indicator: {
      name: "InserJeunes",
      color: "yellow",
    },
    icon: "ri:medal-fill",
  },
  {
    key: GLOSSAIRE_ENTRIES_KEYS.capacite,
    id: "51fcf4e0-218b-4ebe-b320-fcaee9263249",
    title: "Capacité",
    indicator: {
      name: "Effectifs",
      color: "blue",
    },
    icon: "ri:home-8-line",
  },
  {
    key: GLOSSAIRE_ENTRIES_KEYS.effectifs,
    id: "24a35cbf-d90a-4c40-97e2-bfee28bc24d8",
    title: "Effectifs",
    indicator: {
      name: "Effectifs",
      color: "blue",
    },
    icon: "ri:team-line",
  },
  {
    key: GLOSSAIRE_ENTRIES_KEYS["taux-de-devenir-favorable"],
    id: "e0a0732f-0989-4b51-8180-8d8a12fc9efb",
    title: "Taux de devenir favorable",
    indicator: {
      name: "InserJeunes",
      color: "yellow",
    },
    icon: "ri:thumb-up-line",
  },
  {
    key: GLOSSAIRE_ENTRIES_KEYS["taux-poursuite-etudes"],
    id: "fe215545-9be6-438c-a766-f437f381bfc5",
    title: "Taux de poursuite d'études",
    indicator: {
      name: "InserJeunes",
      color: "yellow",
    },
    icon: "ri:book-open-line",
  },
  {
    id: "e5ac1bc8-3e99-46b3-a0ff-aba391248909",
    key: GLOSSAIRE_ENTRIES_KEYS["taux-de-pression"],
    title: "Taux de pression",
    indicator: {
      name: "Effectifs",
      color: "blue",
    },
    icon: "ri:temp-cold-line",
  },
  {
    key: GLOSSAIRE_ENTRIES_KEYS["taux-emploi-12-mois"],
    id: "52100656-0a8b-4f4c-bb11-5f32922562e4",
    title: "Taux d'emploi à 12 mois",
    indicator: {
      name: "InserJeunes",
      color: "yellow",
    },
    icon: "ri:briefcase-line",
  },
  {
    key: GLOSSAIRE_ENTRIES_KEYS["taux-emploi-6-mois"],
    id: "8e0aac8c-11a5-4c66-a895-0e95a1da3479",
    title: "Taux d'emploi à 6 mois",
    indicator: {
      name: "InserJeunes",
      color: "yellow",
    },
    icon: "ri:briefcase-line",
  },
  {
    key: GLOSSAIRE_ENTRIES_KEYS.quadrant,
    id: "5c8afb44-2397-4b6c-bd2f-b32830ac3bfa",
    title: "Quadrant (Q1 à Q4)",
    indicator: {
      name: "InserJeunes",
      color: "yellow",
    },
    icon: "ri:microsoft-line",
  },
];
