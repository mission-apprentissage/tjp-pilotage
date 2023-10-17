import { ListItem, OrderedList, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

export type TypeDemande = keyof typeof TYPES_DEMANDES_OPTIONS;

export const isTypeFermeture = (typeDemande: TypeDemande) =>
  typeDemande === "fermeture";

export const isTypeOuverture = (typeDemande: TypeDemande) =>
  typeDemande === "ouverture_compensation" || typeDemande === "ouverture_nette";

export const isTypeAugmentation = (typeDemande: TypeDemande) =>
  typeDemande === "augmentation_compensation" ||
  typeDemande === "augmentation_nette";

export const isTypeDiminution = (typeDemande: TypeDemande) =>
  typeDemande === "diminution";

export const isTypeCompensation = (typeDemande: TypeDemande) =>
  typeDemande === "augmentation_compensation" ||
  typeDemande === "ouverture_compensation";

export const getTypeDemandeLabel = (typeDemande?: TypeDemande): string =>
  typeDemande ? TYPES_DEMANDES_OPTIONS[typeDemande].label : "";

export const getTypeDemandeExemple = (typeDemande?: TypeDemande): ReactNode =>
  typeDemande ? TYPES_DEMANDES_OPTIONS[typeDemande].exemple : "";

export const TYPES_DEMANDES_OPTIONS: Record<
  string,
  { value: string; label: string; desc: string; exemple: ReactNode }
> = {
  ouverture_nette: {
    value: "ouverture_nette",
    label: "Ouverture nette",
    desc: "Utiliser ce formulaire pour tout cas de création d'une formation sans fermeture ou diminution de capacité.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une ouverture nette :
        </Text>
        <Text mb="3">
          J’ouvre un CAP Cuisine dans un établissement qui ne dispense pas cette
          formation.
        </Text>
        <OrderedList>
          <ListItem mb="2">
            Je saisis les capacités pour l'année 1 de la formation.
          </ListItem>
          <ListItem>
            Je ne peux pas lier une fermeture ou une diminution de capacité sur
            une autre formation.
          </ListItem>
        </OrderedList>
      </>
    ),
  },
  augmentation_nette: {
    value: "augmentation_nette",
    label: "Augmentation nette",
    desc: "Utiliser ce formulaire pour toute augmentation de capacité d'accueil sur une formation existant. Ne pas utiliser pour des places déjà ouvertes sur l'établissement.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une augmentation nette :
        </Text>
        <Text mb="3">J’ouvre des places sur un BAC Pro Aéronautique.</Text>
        <OrderedList>
          <ListItem mb="2">
            J’indique le motif ; je peux préciser qu’il s’agit d’une coloration.
          </ListItem>
          <ListItem>
            Je ne peux pas lier une fermeture ou une diminution de capacité sur
            une autre formation.
          </ListItem>
        </OrderedList>
      </>
    ),
  },
  fermeture: {
    value: "fermeture",
    label: "Fermeture",
    desc: "Utiliser ce formulaire pour renseigner les places fermées en compensation d'une ouverture ou pour les fermetures nettes.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une fermeture :
        </Text>
        <Text mb="3">
          Je ferme un CAP Petite enfance dans un établissement.
        </Text>
        <OrderedList>
          <ListItem mb="2">
            J’indique le motif de fermeture ; je peux ajouter des précisions en
            commentaire.
          </ListItem>
          <ListItem>
            Si je ne saisis pas d’ouverture en compensation en lien ; cette
            fermeture sera considérée comme une fermeture nette.
          </ListItem>
        </OrderedList>
      </>
    ),
  },
  ouverture_compensation: {
    value: "ouverture_compensation",
    label: "Ouverture avec compensation",
    desc: "Utiliser ce formulaire pour tout cas de transfert de capacité d'une formation vers une autre (voir exemple ci-contre).",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une ouverture avec compensation :
        </Text>
        <Text mb="3">
          J’ouvre des places sur Bac Pro Logistique et je ferme un CAP Agent
          Propreté et Hygiène.
        </Text>
        <OrderedList>
          <ListItem mb="2">
            Dans la demande d’ouverture avec compensation j’indique la formation
            et l’établissement sur lequel la fermeture va intervenir.
          </ListItem>
          <ListItem>
            Une fois cette saisie terminée, je saisis la fermeture en lien sur
            le CAP Agent Propreté et Hygiène.
          </ListItem>
        </OrderedList>
      </>
    ),
  },
  augmentation_compensation: {
    value: "augmentation_compensation",
    label: "Augmentation avec compensation",
    desc: "Utiliser ce formulaire pour tout cas d'augmentation de capacité sur une formation déjà ouverte et en lien avec une fermeture ou diminution de capacité.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une augmentation avec compensation :
        </Text>
        <Text mb="3">
          J’ouvre des places sur le Bac Pro Cuisine et je ferme des places en
          CAP Cuisine.
        </Text>
        <OrderedList>
          <ListItem mb="2">
            Dans la demande d’augmentation avec compensation, j’indique la
            formation et l’établissement sur lequel je vais augmenter la
            capacité.
          </ListItem>
          <ListItem>
            Une fois cette saisie terminée, je saisis la diminution en lien sur
            le CAP Cuisine.
          </ListItem>
        </OrderedList>
      </>
    ),
  },
  diminution: {
    value: "diminution",
    label: "Diminution",
    desc: "Utiliser ce formulaire pour renseigner les places fermées en compensation d'une ouverture, ou pour les diminutions netttes.",
    exemple: (
      <>
        <Text mb="3" fontWeight="bold">
          Exemple pour une diminution :
        </Text>
        <Text mb="3">
          Je diminue les places sur un CAP Menuisier Fabricant.
        </Text>
        <OrderedList>
          <ListItem mb="2">
            J’indique le motif de diminution ; je peux ajouter des précisions en
            commentaire.
          </ListItem>
          <ListItem>
            Si je ne saisis pas d’ouverture en compensation en lien ; cette
            diminution sera considérée comme une diminution nette.
          </ListItem>
        </OrderedList>
      </>
    ),
  },
};
