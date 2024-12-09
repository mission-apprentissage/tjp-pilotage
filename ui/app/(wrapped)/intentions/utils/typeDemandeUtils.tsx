import { ListItem, OrderedList, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

export type TypeDemande = keyof typeof TYPES_DEMANDES_OPTIONS;

export const shouldDisplayColoration = (typeDemande: TypeDemande, libelleFCIL?: string) => {
  if (!isTypeColoration(typeDemande)) return true;
  return !libelleFCIL;
};

export const shouldDisplayTypeDemande = (typeDemande: TypeDemande, anneeCampagne: string, rentreeScolaire?: number) => {
  if (rentreeScolaire && parseInt(anneeCampagne) === rentreeScolaire) return isTypeAjustement(typeDemande);
  return TYPES_DEMANDES_OPTIONS[typeDemande].campagnes.includes(anneeCampagne) && !isTypeAjustement(typeDemande);
};

export const isTypeFermeture = (typeDemande: TypeDemande) => typeDemande === "fermeture";

export const isTypeOuverture = (typeDemande: TypeDemande) =>
  typeDemande === "ouverture_compensation" || typeDemande === "ouverture_nette";

export const isTypeAugmentation = (typeDemande: TypeDemande) =>
  typeDemande === "augmentation_compensation" || typeDemande === "augmentation_nette";

export const isTypeDiminution = (typeDemande: TypeDemande) => typeDemande === "diminution";

export const isTypeCompensation = (typeDemande: TypeDemande) =>
  typeDemande === "augmentation_compensation" || typeDemande === "ouverture_compensation";

export const isTypeTransfert = (typeDemande: TypeDemande) => typeDemande === "transfert";

export const isTypeColoration = (typeDemande: TypeDemande) => typeDemande === "coloration";

export const isTypeAjustement = (typeDemande: TypeDemande) => typeDemande === "ajustement";

export const getTypeDemandeLabelFiltre = (typeDemande?: TypeDemande): string =>
  typeDemande ? (TYPES_DEMANDES_OPTIONS[typeDemande].labelFiltre ?? TYPES_DEMANDES_OPTIONS[typeDemande].label) : "";

export const getTypeDemandeLabel = (typeDemande?: TypeDemande): string =>
  typeDemande ? TYPES_DEMANDES_OPTIONS[typeDemande].label : "";

export const getTypeDemandeExemple = (typeDemande?: TypeDemande): ReactNode =>
  typeDemande ? TYPES_DEMANDES_OPTIONS[typeDemande].exemple : "";

export const TYPES_DEMANDES_OPTIONS: Record<
  string,
  {
    value: string;
    labelFiltre?: string;
    label: string;
    campagnes: Array<string>;
    desc: string;
    exemple: ReactNode;
  }
> = {
  ouverture_nette: {
    value: "ouverture_nette",
    label: "Ouverture",
    campagnes: ["2023", "2024", "2025"],
    desc: "Utiliser ce formulaire pour tout cas de création d'une formation en voie scolaire ou apprentissage.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une ouverture :
        </Text>
        <Text>
          J’ouvre un BAC PRO Boucher Charcutier Traiteur dans un établissement qui ne dispense pas cette formation.
        </Text>
        <Text>Je saisis les capacités pour la première année de la spécialité (pas la seconde commune).</Text>
      </>
    ),
  },
  augmentation_nette: {
    value: "augmentation_nette",
    label: "Augmentation",
    campagnes: ["2023", "2024", "2025"],
    desc: "Utiliser ce formulaire pour toute augmentation de capacité d'accueil sur une formation existante. Ne pas utiliser pour des places déjà ouvertes sur l'établissement.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une augmentation :
        </Text>
        <Text>J’ouvre des places sur un BAC Pro Aéronautique.</Text>
        <Text>J'indique le motif ; je peux préciser qu'il s'agit d'une coloration.</Text>
      </>
    ),
  },
  fermeture: {
    value: "fermeture",
    label: "Fermeture",
    campagnes: ["2023", "2024", "2025"],
    desc: "Utiliser ce formulaire pour renseigner les places fermées en compensation d'une ouverture ou pour les fermetures nettes.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une fermeture :
        </Text>
        <Text mb="3">Je ferme un CAP Petite enfance dans un établissement.</Text>
        <Text>J'indique le motif de fermeture ; je peux ajouter des précisions en commentaire.</Text>
      </>
    ),
  },
  ouverture_compensation: {
    value: "ouverture_compensation",
    label: "Ouverture avec compensation",
    campagnes: ["2023"],
    desc: "Utiliser ce formulaire pour tout cas de transfert de capacité d'une formation vers une autre (voir exemple ci-contre).",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une ouverture avec compensation :
        </Text>
        <Text mb="3">J’ouvre des places sur Bac Pro Logistique et je ferme un CAP Agent Propreté et Hygiène.</Text>
        <OrderedList>
          <ListItem mb="2">
            Dans la demande d’ouverture avec compensation j’indique la formation et l’établissement sur lequel la
            fermeture va intervenir.
          </ListItem>
          <ListItem>
            Une fois cette saisie terminée, je saisis la fermeture en lien sur le CAP Agent Propreté et Hygiène.
          </ListItem>
        </OrderedList>
      </>
    ),
  },
  augmentation_compensation: {
    value: "augmentation_compensation",
    label: "Augmentation avec compensation",
    campagnes: ["2023"],
    desc: "Utiliser ce formulaire pour tout cas d'augmentation de capacité sur une formation déjà ouverte et en lien avec une fermeture ou diminution de capacité.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une augmentation avec compensation :
        </Text>
        <Text mb="3">J’ouvre des places sur le Bac Pro Cuisine et je ferme des places en CAP Cuisine.</Text>
        <OrderedList>
          <ListItem mb="2">
            Dans la demande d’augmentation avec compensation, j’indique la formation et l’établissement sur lequel je
            vais augmenter la capacité.
          </ListItem>
          <ListItem>Une fois cette saisie terminée, je saisis la diminution en lien sur le CAP Cuisine.</ListItem>
        </OrderedList>
      </>
    ),
  },
  diminution: {
    value: "diminution",
    label: "Diminution",
    campagnes: ["2023", "2024", "2025"],
    desc: "Utiliser ce formulaire pour renseigner les places fermées en compensation d'une ouverture, ou pour les diminutions nettes.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une diminution :
        </Text>
        <Text mb="3">Je diminue les places sur un CAP Menuisier Fabricant.</Text>
        <Text>J'indique le motif de diminution ; je peux ajouter des précisions en commentaire.</Text>
      </>
    ),
  },
  transfert: {
    value: "transfert",
    label: "Transfert",
    campagnes: ["2024", "2025"],
    desc: "Utiliser ce formulaire pour les transferts de place entre la voie scolaire et l'apprentissage.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour un transfert :
        </Text>
        <Text mb="1">
          Je transfère une partie des places en voie scolaire d'un BAC PRO Menuisier Fabricant vers l'apprentissage.
        </Text>
        <Text>Pour ouvrir une section entière en apprentissage j'utilise le type demande "Ouverture nette".</Text>
      </>
    ),
  },
  coloration: {
    value: "coloration",
    labelFiltre: "Coloration / formations existantes",
    label: "Coloration",
    campagnes: ["2024", "2025"],
    desc: "Utiliser ce formulaire pour colorer une formation existante.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une coloration :
        </Text>
        <Text mb="1">
          Je colore pour la prochaine rentrée un nombre de places d’une formation déjà ouverte dans l’établissement.
        </Text>
        <Text>
          Si la formation n’est pas ouverte sur l’établissement actuellement, j’utilise le type de demande “Ouverture
          nette” et je coche Coloration dans la section “Précisions sur votre demande”.
        </Text>
      </>
    ),
  },
  ajustement: {
    value: "ajustement",
    label: "Ajustement de rentrée",
    campagnes: ["2024", "2025"],
    desc: "Ce formulaire doit être utilisé uniquement pour des ouvertures ou augmentations de places afin de répondre à l’afflux d’élèves sans affectation.",
    exemple: (
      <>
        <Text>
          Toute augmentation de capacité concernant des élèves non affectés doit être saisie dans ce formulaire, y
          compris si la formation concernée avait déjà fait l’objet d’une saisie d’ouverture ou d'augmentation durant la
          campagne 2023.
        </Text>
      </>
    ),
  },
};
