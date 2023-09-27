export const isTypeFermeture = (typeDemande: string) =>
  typeDemande === "fermeture";

export const isTypeOuverture = (typeDemande: string) =>
  typeDemande === "ouverture_compensation" || typeDemande === "ouverture_nette";

export const isTypeAugmentation = (typeDemande: string) =>
  typeDemande === "augmentation_compensation" ||
  typeDemande === "augmentation_nette";

export const isTypeDiminution = (typeDemande: string) =>
  typeDemande === "diminution";

export const isTypeCompensation = (typeDemande: string) =>
  typeDemande === "augmentation_compensation" ||
  typeDemande === "ouverture_compensation";

export const typeDemandesOptions: Record<
  string,
  { value: string; label: string; desc: string }
> = {
  ouverture_nette: {
    value: "ouverture_nette",
    label: "Ouverture nette",
    desc: "Utiliser ce formulaire pour tout cas de création d'une formation sans fermeture ou diminution de capacité.",
  },
  fermeture: {
    value: "fermeture",
    label: "Fermeture",
    desc: "Utiliser ce formulaire pour renseigner les places fermées en compensation d'une ouverture ou pour les fermetures nettes.",
  },
  augmentation_nette: {
    value: "augmentation_nette",
    label: "Augmentation nette",
    desc: "Utiliser ce formulaire pour toute augmentation de capacité d'accueil sur une formation existant. Ne pas utiliser pour des places déjà ouvertes sur l'établissement",
  },
  ouverture_compensation: {
    value: "ouverture_compensation",
    label: "Ouverture avec compensation",
    desc: "Utiliser ce formulaire pour tout cas de transfert de capacité d'une formation vers une autres(voir exemple ci - contre).",
  },
  augmentation_compensation: {
    value: "augmentation_compensation",
    label: "Augmentation par compensation",
    desc: "Utiliser ce formulaire pour tout cas d'augmentation de capacité sur une formation déjà ouverte et en lien avec une fermeture ou diminution de capacité.",
  },
  diminution: {
    value: "diminution",
    label: "Diminution",
    desc: "Utiliser ce formulaire pour renseigner les places fermées en compensation d'une ouverture, ou pour les diminutions netttes.",
  },
};
