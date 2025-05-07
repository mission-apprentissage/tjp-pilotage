/* eslint-disable max-len */
import { DemandeStatutEnum } from "../enum/demandeStatutEnum";
import type { Router } from '../routes';
import type { Args, ZodTypeProvider } from "../utils/http-wizard/core";
import { isTypeAjustement, isTypeAugmentation, isTypeColoration, isTypeDiminution, isTypeFermeture, isTypeOuverture, isTypeTransfert } from "../utils/typeDemandeUtils";
import { isPositiveNumber } from "./utils";

type Demande = Args<Router["[POST]/demande/submit"]["schema"], ZodTypeProvider>["body"]["demande"];

export const demandeValidators = {
  motif: (demande) => {
    if (!isTypeAjustement(demande.typeDemande) && !demande.motif?.length) {
      return "Le champ 'motif' est obligatoire";
    }
    return undefined;
  },
  autreMotif: (demande) => {
    if (demande.motif?.includes("autre") && !demande.autreMotif) {
      return "Le champ 'autre motif' est obligatoire";
    }
    return undefined;
  },
  libelleColoration: (demande) => {
    if (demande.coloration && !demande.libelleColoration) {
      return "Le champ 'libellé coloration' est obligatoire";
    }
    if (!demande.coloration && demande.libelleColoration) {
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
  capaciteScolaireActuelle: (demande) => {
    if (!isPositiveNumber(demande.capaciteScolaireActuelle)) {
      return "La capacité scolaire actuelle doit être un nombre entier positif";
    }
    if (isTypeOuverture(demande.typeDemande) && demande.capaciteScolaireActuelle !== 0) {
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
  capaciteScolaire: (demande) => {
    if (!isPositiveNumber(demande.capaciteScolaire)) {
      return "La capacité scolaire doit être un nombre entier positif";
    }
    if (isTypeFermeture(demande.typeDemande) && demande.capaciteScolaire !== 0) {
      return "La capacité scolaire devrait être à 0 dans le cas d'une fermeture";
    }
    if (
      isTypeAugmentation(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteScolaireActuelle) &&
      demande.capaciteScolaire < demande.capaciteScolaireActuelle
    ) {
      return "La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation";
    }
    if (
      isTypeDiminution(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteScolaireActuelle) &&
      demande.capaciteScolaire > demande.capaciteScolaireActuelle
    ) {
      return "La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'une diminution";
    }
    if (isTypeTransfert(demande.typeDemande)) {
      if (
        !isPositiveNumber(demande.capaciteScolaireActuelle) ||
        !isPositiveNumber(demande.capaciteApprentissageActuelle) ||
        !isPositiveNumber(demande.capaciteScolaire) ||
        !isPositiveNumber(demande.capaciteApprentissage)
      ) {
        return "Un transfert inclue toujours un passage de scolaire vers apprentissage ou d'apprentissage vers scolaire";
      }
      if (
        (demande.capaciteScolaire >= demande.capaciteScolaireActuelle &&
          demande.capaciteApprentissage >= demande.capaciteApprentissageActuelle) ||
        (demande.capaciteScolaire <= demande.capaciteScolaireActuelle &&
          demande.capaciteApprentissage <= demande.capaciteApprentissageActuelle)
      ) {
        return "Si un transfert est effectué, la capacité scolaire ou l'apprentissage doivent être modifiée. Dans le cas d'un transfert vers l'apprentissage, la capacité en apprentissage devrait être supérieure à la capacité actuelle. Dans le cas d'un transfert vers le scolaire, la capacité scolaire devrait être supérieur à la capacité actuelle.";
      }
    }
    if (
      isTypeAjustement(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteScolaireActuelle) &&
      demande.capaciteScolaire < demande.capaciteScolaireActuelle
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
  capaciteScolaireColoreeActuelle: (demande) => {
    if (!isPositiveNumber(demande.capaciteScolaireColoreeActuelle)) {
      return "La capacité scolaire colorée actuelle doit être un nombre entier positif";
    }
    if (
      !demande.coloration &&
      !isTypeColoration(demande.typeDemande) &&
      demande.capaciteScolaireColoreeActuelle !== 0
    )
      return "La capacité scolaire colorée actuelle doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (isTypeOuverture(demande.typeDemande) && demande.capaciteScolaireColoreeActuelle !== 0)
      return "La capacité scolaire colorée actuelle doit être à 0 dans le cas d'une ouverture";
    if (
      isPositiveNumber(demande.capaciteScolaireActuelle) &&
      demande.capaciteScolaireColoreeActuelle > demande.capaciteScolaireActuelle
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
  capaciteScolaireColoree: (demande) => {
    if (!isPositiveNumber(demande.capaciteScolaireColoree)) {
      return "La capacité scolaire colorée doit être un nombre entier positif";
    }
    if (!demande.coloration && !isTypeColoration(demande.typeDemande) && demande.capaciteScolaireColoree !== 0)
      return "La future capacité scolaire colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (isTypeFermeture(demande.typeDemande) && demande.capaciteScolaireColoree !== 0)
      return "La future capacité scolaire colorée doit être à 0 dans le cas d'une fermeture";
    if (
      isPositiveNumber(demande.capaciteScolaire) &&
      isPositiveNumber(demande.capaciteScolaireColoree) &&
      demande.capaciteScolaireColoree > demande.capaciteScolaire
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
  capaciteApprentissageActuelle: (demande) => {
    if (!isPositiveNumber(demande.capaciteApprentissageActuelle))
      return "La capacité en apprentissage actuelle doit être un nombre entier positif";

    if (isTypeOuverture(demande.typeDemande) && demande.capaciteApprentissageActuelle !== 0)
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
  capaciteApprentissage: (demande) => {
    if (!isPositiveNumber(demande.capaciteApprentissage))
      return "La future capacité en apprentissage doit être un nombre entier positif";

    if (isTypeFermeture(demande.typeDemande) && demande.capaciteApprentissage !== 0)
      return "La future capacité en apprentissage devrait être à 0 dans le cas d'une fermeture";

    if (
      isTypeAugmentation(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      demande.capaciteApprentissage < demande.capaciteApprentissageActuelle
    )
      return "La future capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation";

    if (
      isTypeAjustement(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      demande.capaciteApprentissage < demande.capaciteApprentissageActuelle
    )
      return "La future capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'un ajustement de rentrée";

    if (
      isTypeDiminution(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      demande.capaciteApprentissage > demande.capaciteApprentissageActuelle
    )
      return "La future capacité en apprentissage devrait être inférieure ou égale à la capacité actuelle dans le cas d'une diminution";

    if (isTypeTransfert(demande.typeDemande)) {
      if (demande.capaciteApprentissage === 0)
        return "La future capacité en apprentissage devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage";
      if (
        isPositiveNumber(demande.capaciteApprentissageActuelle) &&
        demande.capaciteApprentissage <= demande.capaciteApprentissageActuelle
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
  capaciteApprentissageColoreeActuelle: (demande) => {
    if (!isPositiveNumber(demande.capaciteApprentissageColoreeActuelle)) {
      return "La capacité en apprentissage colorée actuelle doit être un nombre entier positif";
    }
    if (
      !demande.coloration &&
      !isTypeColoration(demande.typeDemande) &&
      demande.capaciteApprentissageColoreeActuelle !== 0
    )
      return "La capacité en apprentissage colorée actuelle doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (isTypeOuverture(demande.typeDemande) && demande.capaciteApprentissageColoreeActuelle !== 0)
      return "La capacité en apprentissage colorée actuelle doit être à 0 dans le cas d'une ouverture";
    if (
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      demande.capaciteApprentissageColoreeActuelle > demande.capaciteApprentissageActuelle
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
  capaciteApprentissageColoree: (demande) => {
    if (!isPositiveNumber(demande.capaciteApprentissageColoree))
      return "La future capacité en apprentissage colorée doit être un nombre entier positif";
    if (isTypeFermeture(demande.typeDemande) && demande.capaciteApprentissageColoree !== 0)
      return "La future capacité en apprentissage colorée doit être à 0 dans le cas d'une fermeture";
    if (
      !demande.coloration &&
      !isTypeColoration(demande.typeDemande) &&
      demande.capaciteApprentissageColoree !== 0
    )
      return "La future capacité en apprentissage colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (
      isPositiveNumber(demande.capaciteApprentissage) &&
      isPositiveNumber(demande.capaciteApprentissageColoree) &&
      demande.capaciteApprentissageColoree > demande.capaciteApprentissage
    )
      return "La future capacité en apprentissage colorée doit être inférieure ou égale à la future capacité en apprentissage";
    return undefined;
  },
  /**
   *
   * La somme des capacités actuelles doit être :
   * - supérieure à 0 dans le cas d'autre chose qu'une ouverture ou d'un ajustement
   */
  sommeCapaciteActuelle: (demande) => {
    if (isTypeOuverture(demande.typeDemande) || isTypeAjustement(demande.typeDemande)) return undefined;

    if (typeof demande.capaciteScolaireActuelle != 'number'
        || typeof demande.capaciteApprentissageActuelle != 'number'
        || demande.capaciteApprentissageActuelle + demande.capaciteScolaireActuelle === 0)
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
  sommeCapacite: (demande) => {
    if (isTypeFermeture(demande.typeDemande) || isTypeColoration(demande.typeDemande)) return undefined;

    if (!demande.capaciteApprentissage && !demande.capaciteScolaire) {
      return "La somme des futures capacités doit être supérieure à 0";
    }
    if (
      isPositiveNumber(demande.capaciteApprentissage) &&
      isPositiveNumber(demande.capaciteScolaire) &&
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      isPositiveNumber(demande.capaciteScolaireActuelle)
    ) {
      if (
        isTypeAugmentation(demande.typeDemande) &&
        demande.capaciteApprentissage + demande.capaciteScolaire <=
          demande.capaciteApprentissageActuelle + demande.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'une augmentation";
      if (
        isTypeAjustement(demande.typeDemande) &&
        demande.capaciteApprentissage + demande.capaciteScolaire <=
          demande.capaciteApprentissageActuelle + demande.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'un ajustement de rentrée";
      if (
        isTypeDiminution(demande.typeDemande) &&
        demande.capaciteApprentissage + demande.capaciteScolaire >=
          demande.capaciteApprentissageActuelle + demande.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être inférieure à la somme des capacités actuelles dans le cas d'une diminution";
    }
    return undefined;
  },
  /**
   * La somme des capacités colorées actuelles doit être :
   * - inférieure ou égale à la somme des capacités actuelles
   */
  sommeCapaciteColoreeActuelle: (demande) => {
    if (
      isPositiveNumber(demande.capaciteApprentissageColoreeActuelle) &&
      isPositiveNumber(demande.capaciteScolaireColoreeActuelle) &&
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      isPositiveNumber(demande.capaciteScolaireActuelle) &&
      demande.capaciteApprentissageColoreeActuelle + demande.capaciteScolaireColoreeActuelle >
        demande.capaciteApprentissageActuelle + demande.capaciteScolaireActuelle
    )
      return "La somme des capacités colorées actuelles doit être inférieure ou égale à la somme des capacités actuelles";
    return undefined;
  },
  /**
   * La somme des futures capacités colorées doit être :
   * - inférieure ou égale à la somme des futures capacités
   * - supérieure ou égale à 0 dans le cas d'une coloration
   */
  sommeCapaciteColoree: (demande) => {
    if (
      isPositiveNumber(demande.capaciteApprentissageColoree) &&
      isPositiveNumber(demande.capaciteScolaireColoree) &&
      isPositiveNumber(demande.capaciteApprentissage) &&
      isPositiveNumber(demande.capaciteScolaire) &&
      demande.capaciteApprentissageColoree + demande.capaciteScolaireColoree >
        demande.capaciteApprentissage + demande.capaciteScolaire
    )
      return "La somme des futures capacités colorées doit être inférieure ou égale à la somme des futures capacités";
    if (
      (isTypeColoration(demande.typeDemande) || demande.coloration) &&
      isPositiveNumber(demande.capaciteApprentissageColoree) &&
      isPositiveNumber(demande.capaciteScolaireColoree) &&
      demande.capaciteApprentissageColoree + demande.capaciteScolaireColoree === 0
    )
      return "La somme des futures capacités colorées doit être supérieure ou égale à 0 dans le cas d'une coloration";
    return undefined;
  },
  motifRefus: (demande) => {
    if (demande.statut === DemandeStatutEnum["refusée"] && !demande.motifRefus?.length) {
      return "Le champ 'motif refus' est obligatoire";
    }
    return undefined;
  },
  autreMotifRefus: (demande) => {
    if (demande.motifRefus?.includes("autre") && !demande.autreMotifRefus) {
      return "Le champ 'autre motif refus' est obligatoire";
    }
    return undefined;
  },
} satisfies Record<keyof Demande | string, (demande: Demande) => string | undefined>;
