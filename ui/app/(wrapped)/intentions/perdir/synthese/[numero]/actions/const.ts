interface IEdito {
  message?: string,
  titre?: string,
  lien?: string,
  en_ligne?: boolean,
  date_creation?: Date,
  order?: number,
  region?: string,
}

export const EDITO: IEdito[] = [
  {
    "titre": "Webinaires à venir",
    "en_ligne": false,
    message: "Pour accompagner votre découverte d’Orion, des webinaires sont organisés le mercredi à 12h15 .",
    lien: "https://webinaire.numerique.gouv.fr//meeting/signin/31852/creator/16468/hash/6d52a428a84100623dbff7e34ff7843f4a0c9f0f",
    date_creation: new Date("2024-06-11"),
    region: "",
    order: 1
  },
  {
    "titre": "Webinaires à venir",
    "en_ligne": true,
    message: "Pour accompagner votre saisie en AURA et Occitanie, des webinaires sont organisés le mercredi à 15 heures.",
    lien: "https://webinaire.numerique.gouv.fr//meeting/signin/31852/creator/16468/hash/6d52a428a84100623dbff7e34ff7843f4a0c9f0f",
    date_creation: new Date("2024-06-11"),
    region: "76",
    order: 1
  },
  {
    "titre": "Webinaires à venir",
    "en_ligne": true,
    message: "Pour accompagner votre saisie en AURA et Occitanie, des webinaires sont organisés le mercredi à 15 heures.",
    lien: "https://webinaire.numerique.gouv.fr//meeting/signin/31852/creator/16468/hash/6d52a428a84100623dbff7e34ff7843f4a0c9f0f",
    date_creation: new Date("2024-07-05"),
    region: "84",
    order: 1
  },
  {
    "titre": "Communauté M@gistere",
    "en_ligne": false,
    message: "Afin de vous permettre d’échanger, de vous renseigner….",
    lien: "",
    date_creation: new Date("2024-06-11"),
    region: "",
    order: 2
  }
];
