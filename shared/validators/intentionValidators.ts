import { Args, ZodTypeProvider } from "@http-wizard/core";
import { Router } from "server";

import { DemandeStatutEnum } from "../enum/demandeStatutEnum";

type Intention = Args<
  Router["[POST]/intention/submit"]["schema"],
  ZodTypeProvider
>["body"]["intention"];

export const isTypeFermeture = (typeDemande: string) =>
  ["fermeture"].includes(typeDemande);

export const isTypeOuverture = (typeDemande: string) =>
  ["ouverture_compensation", "ouverture_nette"].includes(typeDemande);

export const isTypeAugmentation = (typeDemande: string) =>
  ["augmentation_compensation", "augmentation_nette"].includes(typeDemande);

export const isTypeDiminution = (typeDemande: string) =>
  ["diminution"].includes(typeDemande);

export const isTypeCompensation = (typeDemande: string) =>
  ["augmentation_compensation", "ouverture_compensation"].includes(typeDemande);

export const isTypeTransfert = (typeDemande: string) =>
  ["transfert"].includes(typeDemande);

export const isTypeColoration = (typeDemande: string) =>
  ["coloration"].includes(typeDemande);

const isPositiveNumber = (value: number | undefined): value is number => {
  if (!Number.isInteger(value)) return false;
  if (value === undefined) return false;
  if (value < 0) return false;
  return true;
};

export const intentionValidators: Record<
  keyof Intention | string,
  (intention: Intention) => string | undefined
> = {
  motif: (intention) => {
    if (!intention.motif?.length) {
      return "Le champ 'motif' est obligatoire";
    }
  },
  autreMotif: (intention) => {
    if (intention.motif?.includes("autre") && !intention.autreMotif) {
      return "Le champ 'autre motif' est obligatoire";
    }
  },
  libelleColoration: (intention) => {
    if (intention.coloration && !intention.libelleColoration) {
      return "Le champ 'libellé coloration' est obligatoire";
    }
    if (!intention.coloration && intention.libelleColoration) {
      return "Le champ 'libellé coloration' doit être vide";
    }
  },
  /**
   *
   * La capacité scolaire actuelle doit être :
   * - un nombre entier positif
   * - à 0 dans le cas d'une ouverture
   */
  capaciteScolaireActuelle: (intention) => {
    if (!isPositiveNumber(intention.capaciteScolaireActuelle)) {
      return "La capacité scolaire actuelle doit être un nombre entier positif";
    }
    if (
      isTypeOuverture(intention.typeDemande) &&
      intention.capaciteScolaireActuelle !== 0
    ) {
      return "La capacité scolaire actuelle devrait être à 0 dans le cas d'une ouverture";
    }
  },
  /**
   *
   * La future capacité scolaire doit être :
   * - un nombre entier positif
   * - à 0 dans le cas d'une fermeture
   * - supérieure ou égale à la capacité actuelle dans le cas d'une augmentation
   * - inférieure ou égale à la capacité actuelle dans le cas d'une diminution
   * - inférieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage
   */
  capaciteScolaire: (intention) => {
    if (!isPositiveNumber(intention.capaciteScolaire)) {
      return "La capacité scolaire doit être un nombre entier positif";
    }
    if (
      isTypeFermeture(intention.typeDemande) &&
      intention.capaciteScolaire !== 0
    ) {
      return "La capacité scolaire devrait être à 0 dans le cas d'une fermeture";
    }
    if (
      isTypeAugmentation(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteScolaireActuelle) &&
      intention.capaciteScolaire < intention.capaciteScolaireActuelle
    ) {
      return "La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation";
    }
    if (
      isTypeDiminution(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteScolaireActuelle) &&
      intention.capaciteScolaire > intention.capaciteScolaireActuelle
    ) {
      return "La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'une diminution";
    }
    if (
      isTypeTransfert(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteScolaireActuelle) &&
      intention.capaciteScolaire >= intention.capaciteScolaireActuelle
    )
      return "La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage";
  },
  /**
   *
   * La capacité scolaire colorée doit être :
   * - un nombre entier positif
   * - à 0 quand on ne se trouve pas dans une situation de coloration (formation existante ou non)
   * - à 0 dans le cas d'une fermeture
   * - inférieure ou égale à la capacité scolaire totale dans le cas d'une coloration de formation existante
   */
  capaciteScolaireColoree: (intention) => {
    if (!isPositiveNumber(intention.capaciteScolaireColoree)) {
      return "La capacité scolaire colorée doit être un nombre entier positif";
    }
    if (
      !intention.coloration &&
      !isTypeColoration(intention.typeDemande) &&
      intention.capaciteScolaireColoree !== 0
    )
      return "La capacité scolaire colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (
      isTypeFermeture(intention.typeDemande) &&
      intention.capaciteScolaireColoree !== 0
    )
      return "La capacité scolaire colorée doit être à 0 dans le cas d'une fermeture";
    if (
      isTypeColoration(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteScolaireActuelle) &&
      intention.capaciteScolaireColoree > intention.capaciteScolaireActuelle
    )
      return "La capacité scolaire colorée doit être inférieure ou égale à la capacité scolaire actuelle dans le cas d'une coloration de formation existante";
    if (
      isPositiveNumber(intention.capaciteScolaire) &&
      isPositiveNumber(intention.capaciteScolaireColoree) &&
      intention.coloration &&
      intention.capaciteScolaireColoree > intention.capaciteScolaire
    )
      return "La capacité scolaire colorée doit être inférieure ou égale à la future capacité scolaire";
  },
  /**
   *
   * La capacité en apprentissage actuelle doit être :
   * - un nombre entier positif
   * - à 0 dans le cas d'une ouverture
   */
  capaciteApprentissageActuelle: (intention) => {
    if (!isPositiveNumber(intention.capaciteApprentissageActuelle))
      return "La capacité en apprentissage actuelle doit être un nombre entier positif";

    if (
      isTypeOuverture(intention.typeDemande) &&
      intention.capaciteApprentissageActuelle !== 0
    )
      return "La capacité en apprentissage actuelle devrait être à 0 dans le cas d'une ouverture";
  },
  /**
   *
   * La future capacite en apprentissage doit être :
   *
   * - un nombre entier positif
   * - à 0 dans le cas d'une fermeture
   * - supérieure ou égale à la capacité actuelle dans le cas d'une augmentation
   * - inférieure ou égale à la capacité actuelle dans le cas d'une diminution
   * - supérieure à 0 dans le cas d'un transfert vers l'apprentissage
   * - supérieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage
   */
  capaciteApprentissage: (intention) => {
    if (!isPositiveNumber(intention.capaciteApprentissage))
      return "La capacité en apprentissage doit être un nombre entier positif";

    if (
      isTypeFermeture(intention.typeDemande) &&
      intention.capaciteApprentissage !== 0
    )
      return "La capacité en apprentissage devrait être à 0 dans le cas d'une fermeture";

    if (
      isTypeAugmentation(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      intention.capaciteApprentissage < intention.capaciteApprentissageActuelle
    )
      return "La capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation";

    if (
      isTypeDiminution(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      intention.capaciteApprentissage > intention.capaciteApprentissageActuelle
    )
      return "La capacité en apprentissage devrait être inférieure ou égale à la capacité actuelle dans le cas d'une diminution";

    if (isTypeTransfert(intention.typeDemande)) {
      if (intention.capaciteApprentissage === 0)
        return "La capacité en apprentissage devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage";
      if (
        isPositiveNumber(intention.capaciteApprentissageActuelle) &&
        intention.capaciteApprentissage <=
          intention.capaciteApprentissageActuelle
      )
        return "La capacité en apprentissage devrait être supérieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage";
    }
  },
  /**
   *
   * La capacité en apprentissage colorée doit être :
   * - un nombre entier positif
   * - à 0 dans le cas d'une fermeture
   * - à 0 quand on ne se trouve pas dans une situation de coloration (formation existante ou non)
   * - supérieure à 0 dans le cas d'un transfert vers l'apprentissage avec coloration
   */
  capaciteApprentissageColoree: (intention) => {
    if (!isPositiveNumber(intention.capaciteApprentissageColoree))
      return "La capacité en apprentissage colorée doit être un nombre entier positif";
    if (
      isTypeFermeture(intention.typeDemande) &&
      intention.capaciteApprentissageColoree !== 0
    )
      return "La capacité en apprentissage colorée doit être à 0 dans le cas d'une fermeture";
    if (
      !intention.coloration &&
      !isTypeColoration(intention.typeDemande) &&
      intention.capaciteApprentissageColoree !== 0
    )
      return "La capacité en apprentissage colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (
      intention.coloration &&
      isTypeTransfert(intention.typeDemande) &&
      intention.capaciteApprentissageColoree === 0
    )
      return "La capacité en apprentissage colorée doit être supérieure à 0 dans le cas d'un transfert vers l'apprentissage avec coloration";
    if (
      isTypeColoration(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      intention.capaciteApprentissageColoree >
        intention.capaciteApprentissageActuelle
    )
      return "La capacité en apprentissage colorée doit être inférieure ou égale à la capacité apprentissage actuelle dans le cas d'une coloration de formation existante";
    if (
      isPositiveNumber(intention.capaciteApprentissage) &&
      isPositiveNumber(intention.capaciteApprentissageColoree) &&
      intention.coloration &&
      intention.capaciteApprentissageColoree > intention.capaciteApprentissage
    )
      return "La capacité en apprentissage colorée doit être inférieure ou égale à la future capacité en apprentissage";
  },
  /**
   *
   * La somme des capacités actuelles doit être :
   * - supérieure à 0 dans le cas d'autre chose qu'une ouverture
   */
  sommeCapaciteActuelle: (intention) => {
    if (isTypeOuverture(intention.typeDemande)) return;

    if (
      !intention.capaciteScolaireActuelle &&
      !intention.capaciteApprentissageActuelle
    )
      return "La somme des capacités actuelles doit être supérieure à 0";
  },
  /**
   *
   * La somme des futures capacités doit être :
   * - supérieure à 0 dans le cas d'autre chose qu'une fermeture
   * - supérieure à la somme des capacités actuelles dans le cas d'une augmentation
   * - inférieure à la somme des capacités actuelles dans le cas d'une diminution
   */
  sommeCapacite: (intention) => {
    if (
      isTypeFermeture(intention.typeDemande) ||
      isTypeColoration(intention.typeDemande)
    )
      return;

    if (!intention.capaciteApprentissage && !intention.capaciteScolaire) {
      return "La somme des capacités doit être supérieure à 0";
    }
    if (
      isPositiveNumber(intention.capaciteApprentissage) &&
      isPositiveNumber(intention.capaciteScolaire) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      isPositiveNumber(intention.capaciteScolaireActuelle)
    ) {
      if (
        isTypeAugmentation(intention.typeDemande) &&
        intention.capaciteApprentissage + intention.capaciteScolaire <=
          intention.capaciteApprentissageActuelle +
            intention.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'une augmentation";
      if (
        isTypeDiminution(intention.typeDemande) &&
        intention.capaciteApprentissage + intention.capaciteScolaire >=
          intention.capaciteApprentissageActuelle +
            intention.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être inférieure à la somme des capacités actuelles dans le cas d'une diminution";
    }
  },
  /**
   * La somme des capacités colorées doit être :
   * - supérieure à 0 dans le cas d'une coloration qui n'est pas une fermeture
   * - inférieure ou égale à la somme des capacités dans le cas d'une ouverture
   * - inférieure ou égale à la somme des capacités actuelles dans le cas d'une formation existante (non ouverture)
   */
  sommeCapaciteColoree: (intention) => {
    if (
      isTypeFermeture(intention.typeDemande) ||
      (!isTypeColoration(intention.typeDemande) && !intention.coloration)
    )
      return;

    if (
      !intention.capaciteApprentissageColoree &&
      !intention.capaciteScolaireColoree
    )
      return "La somme des capacités colorées doit être supérieure à 0";
    if (
      isTypeOuverture(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteApprentissageColoree) &&
      isPositiveNumber(intention.capaciteScolaireColoree) &&
      isPositiveNumber(intention.capaciteApprentissage) &&
      isPositiveNumber(intention.capaciteScolaire) &&
      intention.capaciteApprentissageColoree +
        intention.capaciteScolaireColoree >
        intention.capaciteApprentissage + intention.capaciteScolaire
    )
      return "La somme des capacités colorées doit être inférieure ou égale à la somme des capacités actuelles";

    if (
      !isTypeOuverture(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteApprentissageColoree) &&
      isPositiveNumber(intention.capaciteScolaireColoree) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      isPositiveNumber(intention.capaciteScolaireActuelle) &&
      intention.capaciteApprentissageColoree +
        intention.capaciteScolaireColoree >
        intention.capaciteApprentissageActuelle +
          intention.capaciteScolaireActuelle
    )
      return "La somme des capacités colorées doit être inférieure ou égale à la somme des capacités actuelles";
  },
  motifRefus: (intention) => {
    if (
      intention.statut === DemandeStatutEnum["refusée"] &&
      !intention.motifRefus?.length
    ) {
      return "Le champ 'motif refus' est obligatoire";
    }
  },
  autreMotifRefus: (intention) => {
    if (intention.motifRefus?.includes("autre") && !intention.autreMotifRefus) {
      return "Le champ 'autre motif refus' est obligatoire";
    }
  },
};
