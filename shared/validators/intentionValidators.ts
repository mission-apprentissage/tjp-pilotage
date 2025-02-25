/* eslint-disable max-len */
import { DemandeStatutEnum } from "../enum/demandeStatutEnum";
import type { DemandeType } from "../enum/demandeTypeEnum";
import type { Router } from "../routes";
import type { Args, ZodTypeProvider } from "../utils/http-wizzard/core";

type Intention = Args<Router["[POST]/intention/submit"]["schema"], ZodTypeProvider>["body"]["intention"];

export const isTypeFermeture = (typeDemande: DemandeType) => ["fermeture"].includes(typeDemande);

export const isTypeOuverture = (typeDemande: DemandeType) =>
  ["ouverture_compensation", "ouverture_nette"].includes(typeDemande);

export const isTypeAugmentation = (typeDemande: DemandeType) =>
  ["augmentation_compensation", "augmentation_nette"].includes(typeDemande);

export const isTypeDiminution = (typeDemande: DemandeType) => ["diminution"].includes(typeDemande);

export const isTypeCompensation = (typeDemande: DemandeType) =>
  ["augmentation_compensation", "ouverture_compensation"].includes(typeDemande);

export const isTypeTransfert = (typeDemande: DemandeType) => ["transfert"].includes(typeDemande);

export const isTypeColoration = (typeDemande: DemandeType) => ["coloration"].includes(typeDemande);

export const isTypeAjustement = (typeDemande: DemandeType) => ["ajustement"].includes(typeDemande);

const isPositiveNumber = (value: number | undefined): value is number => {
  if (!Number.isInteger(value)) return false;
  if (value === undefined) return false;
  if (value < 0) return false;
  return true;
};

export const intentionValidators = {
  motif: (intention) => {
    if (!isTypeAjustement(intention.typeDemande) && !intention.motif?.length) {
      return "Le champ 'motif' est obligatoire";
    }
    return undefined;
  },
  autreMotif: (intention) => {
    if (intention.motif?.includes("autre") && !intention.autreMotif) {
      return "Le champ 'autre motif' est obligatoire";
    }
    return undefined;
  },
  libelleColoration: (intention) => {
    if (intention.coloration && !intention.libelleColoration) {
      return "Le champ 'libellé coloration' est obligatoire";
    }
    if (!intention.coloration && intention.libelleColoration) {
      return "Le champ 'libellé coloration' doit être vide";
    }
    return undefined;
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
    if (isTypeOuverture(intention.typeDemande) && intention.capaciteScolaireActuelle !== 0) {
      return "La capacité scolaire actuelle devrait être à 0 dans le cas d'une ouverture";
    }
    return undefined;
  },
  /**
   *
   * La future capacité scolaire doit être :
   * - un nombre entier positif
   * - à 0 dans le cas d'une fermeture
   * - supérieure ou égale à la capacité actuelle dans le cas d'une augmentation
   * - supérieure ou égale à la capacité actuelle dans le cas d'un ajustement
   * - inférieure ou égale à la capacité actuelle dans le cas d'une diminution
   * - inférieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage
   */
  capaciteScolaire: (intention) => {
    if (!isPositiveNumber(intention.capaciteScolaire)) {
      return "La capacité scolaire doit être un nombre entier positif";
    }
    if (isTypeFermeture(intention.typeDemande) && intention.capaciteScolaire !== 0) {
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
    if (isTypeTransfert(intention.typeDemande)) {
      if (
        !isPositiveNumber(intention.capaciteScolaireActuelle) ||
        !isPositiveNumber(intention.capaciteApprentissageActuelle) ||
        !isPositiveNumber(intention.capaciteScolaire) ||
        !isPositiveNumber(intention.capaciteApprentissage)
      ) {
        return "Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire";
      }
      if (
        (intention.capaciteScolaire >= intention.capaciteScolaireActuelle &&
          intention.capaciteApprentissage >= intention.capaciteApprentissageActuelle) ||
        (intention.capaciteScolaire <= intention.capaciteScolaireActuelle &&
          intention.capaciteApprentissage <= intention.capaciteApprentissageActuelle)
      ) {
        return "Si un transfert est effectué, la capacité scolaire ou l'apprentissage doivent être modifiée. Dans le cas d'un transfert vers l'apprentissage, la capacité en apprentissage devrait être supérieure à la capacité actuelle. Dans le cas d'un transfert vers le scolaire, la capacité scolaire devrait être supérieur à la capacité actuelle.";
      }
    }
    if (
      isTypeAjustement(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteScolaireActuelle) &&
      intention.capaciteScolaire < intention.capaciteScolaireActuelle
    )
      return "La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'un ajustement de rentrée";
    return undefined;
  },
  /**
   *
   * La capacité scolaire colorée actuelle doit être :
   * - un nombre entier positif
   * - à 0 quand on ne se trouve pas dans une situation de coloration (formation existante ou non)
   * - à 0 dans le cas d'une ouverture
   * - inférieure ou égale à la capacité scolaire actuelle
   */
  capaciteScolaireColoreeActuelle: (intention) => {
    if (!isPositiveNumber(intention.capaciteScolaireColoreeActuelle)) {
      return "La capacité scolaire colorée actuelle doit être un nombre entier positif";
    }
    if (
      !intention.coloration &&
      !isTypeColoration(intention.typeDemande) &&
      intention.capaciteScolaireColoreeActuelle !== 0
    )
      return "La capacité scolaire colorée actuelle doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (isTypeOuverture(intention.typeDemande) && intention.capaciteScolaireColoreeActuelle !== 0)
      return "La capacité scolaire colorée actuelle doit être à 0 dans le cas d'une ouverture";
    if (
      isPositiveNumber(intention.capaciteScolaireActuelle) &&
      intention.capaciteScolaireColoreeActuelle > intention.capaciteScolaireActuelle
    )
      return "La capacité scolaire colorée actuelle doit être inférieure ou égale à la capacité scolaire actuelle";
    return undefined;
  },
  /**
   *
   * La future capacité scolaire colorée doit être :
   * - un nombre entier positif
   * - à 0 quand on ne se trouve pas dans une situation de coloration (formation existante ou non)
   * - à 0 dans le cas d'une fermeture
   * - inférieure ou égale à la future capacité scolaire
   */
  capaciteScolaireColoree: (intention) => {
    if (!isPositiveNumber(intention.capaciteScolaireColoree)) {
      return "La capacité scolaire colorée doit être un nombre entier positif";
    }
    if (!intention.coloration && !isTypeColoration(intention.typeDemande) && intention.capaciteScolaireColoree !== 0)
      return "La future capacité scolaire colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (isTypeFermeture(intention.typeDemande) && intention.capaciteScolaireColoree !== 0)
      return "La future capacité scolaire colorée doit être à 0 dans le cas d'une fermeture";
    if (
      isPositiveNumber(intention.capaciteScolaire) &&
      isPositiveNumber(intention.capaciteScolaireColoree) &&
      intention.capaciteScolaireColoree > intention.capaciteScolaire
    )
      return "La future capacité scolaire colorée doit être inférieure ou égale à la future capacité scolaire";
    return undefined;
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

    if (isTypeOuverture(intention.typeDemande) && intention.capaciteApprentissageActuelle !== 0)
      return "La capacité en apprentissage actuelle devrait être à 0 dans le cas d'une ouverture";
    return undefined;
  },
  /**
   *
   * La future capacite en apprentissage doit être :
   *
   * - un nombre entier positif
   * - à 0 dans le cas d'une fermeture
   * - supérieure ou égale à la capacité actuelle dans le cas d'une augmentation
   * - supérieure ou égale à la capacité actuelle dans le cas d'un ajustement de rentrée
   * - inférieure ou égale à la capacité actuelle dans le cas d'une diminution
   * - supérieure à 0 dans le cas d'un transfert vers l'apprentissage
   * - supérieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage
   */
  capaciteApprentissage: (intention) => {
    if (!isPositiveNumber(intention.capaciteApprentissage))
      return "La future capacité en apprentissage doit être un nombre entier positif";

    if (isTypeFermeture(intention.typeDemande) && intention.capaciteApprentissage !== 0)
      return "La future capacité en apprentissage devrait être à 0 dans le cas d'une fermeture";

    if (
      isTypeAugmentation(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      intention.capaciteApprentissage < intention.capaciteApprentissageActuelle
    )
      return "La future capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation";

    if (
      isTypeAjustement(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      intention.capaciteApprentissage < intention.capaciteApprentissageActuelle
    )
      return "La future capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'un ajustement de rentrée";

    if (
      isTypeDiminution(intention.typeDemande) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      intention.capaciteApprentissage > intention.capaciteApprentissageActuelle
    )
      return "La future capacité en apprentissage devrait être inférieure ou égale à la capacité actuelle dans le cas d'une diminution";

    if (isTypeTransfert(intention.typeDemande)) {
      if (intention.capaciteApprentissage === 0)
        return "La future capacité en apprentissage devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage";
      if (
        isPositiveNumber(intention.capaciteApprentissageActuelle) &&
        intention.capaciteApprentissage <= intention.capaciteApprentissageActuelle
      )
        return "La future capacité en apprentissage devrait être supérieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage";
    }
    return undefined;
  },
  /**
   *
   * La capacité en apprentissage colorée actuelle doit être :
   * - un nombre entier positif
   * - à 0 quand on ne se trouve pas dans une situation de coloration (formation existante ou non)
   * - à 0 dans le cas d'une ouverture
   * - inférieure ou égale à la capacité en apprentissage actuelle
   */
  capaciteApprentissageColoreeActuelle: (intention) => {
    if (!isPositiveNumber(intention.capaciteApprentissageColoreeActuelle)) {
      return "La capacité en apprentissage colorée actuelle doit être un nombre entier positif";
    }
    if (
      !intention.coloration &&
      !isTypeColoration(intention.typeDemande) &&
      intention.capaciteApprentissageColoreeActuelle !== 0
    )
      return "La capacité en apprentissage colorée actuelle doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (isTypeOuverture(intention.typeDemande) && intention.capaciteApprentissageColoreeActuelle !== 0)
      return "La capacité en apprentissage colorée actuelle doit être à 0 dans le cas d'une ouverture";
    if (
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      intention.capaciteApprentissageColoreeActuelle > intention.capaciteApprentissageActuelle
    )
      return "La capacité en apprentissage colorée actuelle doit être inférieure ou égale à la capacité en apprentissage actuelle";
    return undefined;
  },
  /**
   *
   * La future capacité en apprentissage colorée doit être :
   * - un nombre entier positif
   * - à 0 dans le cas d'une fermeture
   * - à 0 quand on ne se trouve pas dans une situation de coloration (formation existante ou non)
   * - inférieure ou égale à la future capacité en apprentissage
   */
  capaciteApprentissageColoree: (intention) => {
    if (!isPositiveNumber(intention.capaciteApprentissageColoree))
      return "La future capacité en apprentissage colorée doit être un nombre entier positif";
    if (isTypeFermeture(intention.typeDemande) && intention.capaciteApprentissageColoree !== 0)
      return "La future capacité en apprentissage colorée doit être à 0 dans le cas d'une fermeture";
    if (
      !intention.coloration &&
      !isTypeColoration(intention.typeDemande) &&
      intention.capaciteApprentissageColoree !== 0
    )
      return "La future capacité en apprentissage colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (
      isPositiveNumber(intention.capaciteApprentissage) &&
      isPositiveNumber(intention.capaciteApprentissageColoree) &&
      intention.capaciteApprentissageColoree > intention.capaciteApprentissage
    )
      return "La future capacité en apprentissage colorée doit être inférieure ou égale à la future capacité en apprentissage";
    return undefined;
  },
  /**
   *
   * La somme des capacités actuelles doit être :
   * - supérieure à 0 dans le cas d'autre chose qu'une ouverture ou d'un ajustement
   */
  sommeCapaciteActuelle: (intention) => {
    if (isTypeOuverture(intention.typeDemande) || isTypeAjustement(intention.typeDemande)) return undefined;

    if (typeof intention.capaciteScolaireActuelle != 'number'
        || typeof intention.capaciteApprentissageActuelle != 'number'
        || intention.capaciteApprentissageActuelle + intention.capaciteScolaireActuelle === 0)
      return "La somme des capacités actuelles doit être supérieure à 0";
    return undefined;
  },
  /**
   *
   * La somme des futures capacités doit être :
   * - supérieure à 0 dans le cas d'autre chose qu'une fermeture
   * - supérieure à la somme des capacités actuelles dans le cas d'une augmentation
   * - supérieure à la somme des capacités actuelles dans le cas d'un ajustement de rentrée
   * - inférieure à la somme des capacités actuelles dans le cas d'une diminution
   */
  sommeCapacite: (intention) => {
    if (isTypeFermeture(intention.typeDemande) || isTypeColoration(intention.typeDemande)) return undefined;

    if (!intention.capaciteApprentissage && !intention.capaciteScolaire) {
      return "La somme des futures capacités doit être supérieure à 0";
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
          intention.capaciteApprentissageActuelle + intention.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'une augmentation";
      if (
        isTypeAjustement(intention.typeDemande) &&
        intention.capaciteApprentissage + intention.capaciteScolaire <=
          intention.capaciteApprentissageActuelle + intention.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'un ajustement de rentrée";
      if (
        isTypeDiminution(intention.typeDemande) &&
        intention.capaciteApprentissage + intention.capaciteScolaire >=
          intention.capaciteApprentissageActuelle + intention.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être inférieure à la somme des capacités actuelles dans le cas d'une diminution";
    }
    return undefined;
  },
  /**
   * La somme des capacités colorées actuelles doit être :
   * - inférieure ou égale à la somme des capacités actuelles
   */
  sommeCapaciteColoreeActuelle: (intention) => {
    if (
      isPositiveNumber(intention.capaciteApprentissageColoreeActuelle) &&
      isPositiveNumber(intention.capaciteScolaireColoreeActuelle) &&
      isPositiveNumber(intention.capaciteApprentissageActuelle) &&
      isPositiveNumber(intention.capaciteScolaireActuelle) &&
      intention.capaciteApprentissageColoreeActuelle + intention.capaciteScolaireColoreeActuelle >
        intention.capaciteApprentissageActuelle + intention.capaciteScolaireActuelle
    )
      return "La somme des capacités colorées actuelles doit être inférieure ou égale à la somme des capacités actuelles";
    return undefined;
  },
  /**
   * La somme des futures capacités colorées doit être :
   * - inférieure ou égale à la somme des futures capacités
   * - supérieure ou égale à 0 dans le cas d'une coloration
   */
  sommeCapaciteColoree: (intention) => {
    if (
      isPositiveNumber(intention.capaciteApprentissageColoree) &&
      isPositiveNumber(intention.capaciteScolaireColoree) &&
      isPositiveNumber(intention.capaciteApprentissage) &&
      isPositiveNumber(intention.capaciteScolaire) &&
      intention.capaciteApprentissageColoree + intention.capaciteScolaireColoree >
        intention.capaciteApprentissage + intention.capaciteScolaire
    )
      return "La somme des futures capacités colorées doit être inférieure ou égale à la somme des futures capacités";
    if (
      (isTypeColoration(intention.typeDemande) || intention.coloration) &&
      isPositiveNumber(intention.capaciteApprentissageColoree) &&
      isPositiveNumber(intention.capaciteScolaireColoree) &&
      intention.capaciteApprentissageColoree + intention.capaciteScolaireColoree === 0
    )
      return "La somme des futures capacités colorées doit être supérieure ou égale à 0 dans le cas d'une coloration";
    return undefined;
  },
  motifRefus: (intention) => {
    if (intention.statut === DemandeStatutEnum["refusée"] && !intention.motifRefus?.length) {
      return "Le champ 'motif refus' est obligatoire";
    }
    return undefined;
  },
  autreMotifRefus: (intention) => {
    if (intention.motifRefus?.includes("autre") && !intention.autreMotifRefus) {
      return "Le champ 'autre motif refus' est obligatoire";
    }
    return undefined;
  },
} satisfies Record<keyof Intention | string, (intention: Intention) => string | void>;
