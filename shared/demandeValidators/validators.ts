import { Args, ZodTypeProvider } from "@http-wizard/core";
import { Router } from "server";

type Demande = Args<
  Router["[POST]/demande/submit"]["schema"],
  ZodTypeProvider
>["body"]["demande"];

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

export const demandeValidators: Record<
  keyof Demande | string,
  (demande: Demande) => string | undefined
> = {
  motif: (demande) => {
    if (!demande.motif?.length) {
      return "Le champ 'motif' est obligatoire";
    }
  },
  autreMotif: (demande) => {
    if (demande.motif?.includes("autre") && !demande.autreMotif) {
      return "Le champ 'autre motif' est obligatoire";
    }
  },
  autreBesoinRH: (demande) => {
    if (demande.besoinRH?.includes("autre") && !demande.autreBesoinRH) {
      return "Le champ 'autre besoin rh' est obligatoire";
    }
  },
  poursuitePedagogique: (demande) => {
    if (isTypeFermeture(demande.typeDemande) && demande.poursuitePedagogique) {
      return "Le champ 'poursuite pédagogique' devrait être à non";
    }
  },
  libelleColoration: (demande) => {
    if (demande.coloration && !demande.libelleColoration) {
      return "Le champ 'libellé coloration' est obligatoire";
    }
    if (!demande.coloration && demande.libelleColoration) {
      return "Le champ 'libellé coloration' doit être vide";
    }
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
    if (
      isTypeOuverture(demande.typeDemande) &&
      demande.capaciteScolaireActuelle !== 0
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
  capaciteScolaire: (demande) => {
    if (!isPositiveNumber(demande.capaciteScolaire)) {
      return "La capacité scolaire doit être un nombre entier positif";
    }
    if (
      isTypeFermeture(demande.typeDemande) &&
      demande.capaciteScolaire !== 0
    ) {
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
      if (demande.capaciteScolaire === 0)
        return "La capacité scolaire devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage";

      if (
        isPositiveNumber(demande.capaciteScolaireActuelle) &&
        demande.capaciteScolaire >= demande.capaciteScolaireActuelle
      )
        return "La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage";
    }
  },
  /**
   *
   * La capacité scolaire colorée doit être :
   * - un nombre entier positif
   * - à 0 quand on ne se trouve pas dans une situation de coloration (formation existante ou non)
   * - à 0 dans le cas d'une fermeture
   * - inférieure ou égale à la capacité scolaire totale dans le cas d'une coloration de formation existante
   */
  capaciteScolaireColoree: (demande) => {
    if (!isPositiveNumber(demande.capaciteScolaireColoree)) {
      return "La capacité scolaire colorée doit être un nombre entier positif";
    }
    if (
      !demande.coloration &&
      !isTypeColoration(demande.typeDemande) &&
      demande.capaciteScolaireColoree !== 0
    )
      return "La capacité scolaire colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (
      isTypeFermeture(demande.typeDemande) &&
      demande.capaciteScolaireColoree !== 0
    )
      return "La capacité scolaire colorée doit être à 0 dans le cas d'une fermeture";
    if (
      isTypeColoration(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteScolaireActuelle) &&
      demande.capaciteScolaireColoree > demande.capaciteScolaireActuelle
    )
      return "La capacité scolaire colorée doit être inférieure ou égale à la capacité scolaire actuelle dans le cas d'une coloration de formation existante";
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

    if (
      isTypeOuverture(demande.typeDemande) &&
      demande.capaciteApprentissageActuelle !== 0
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
  capaciteApprentissage: (demande) => {
    if (!isPositiveNumber(demande.capaciteApprentissage))
      return "La capacité en apprentissage doit être un nombre entier positif";

    if (
      isTypeFermeture(demande.typeDemande) &&
      demande.capaciteApprentissage !== 0
    )
      return "La capacité en apprentissage devrait être à 0 dans le cas d'une fermeture";

    if (
      isTypeAugmentation(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      demande.capaciteApprentissage < demande.capaciteApprentissageActuelle
    )
      return "La capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'une augmentation";

    if (
      isTypeDiminution(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      demande.capaciteApprentissage > demande.capaciteApprentissageActuelle
    )
      return "La capacité en apprentissage devrait être inférieure ou égale à la capacité actuelle dans le cas d'une diminution";

    if (isTypeTransfert(demande.typeDemande)) {
      if (demande.capaciteApprentissage === 0)
        return "La capacité en apprentissage devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage";
      if (
        isPositiveNumber(demande.capaciteApprentissageActuelle) &&
        demande.capaciteApprentissage <= demande.capaciteApprentissageActuelle
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
  capaciteApprentissageColoree: (demande) => {
    if (!isPositiveNumber(demande.capaciteScolaireColoree))
      return "La capacité en apprentissage colorée doit être un nombre entier positif";
    if (
      isTypeFermeture(demande.typeDemande) &&
      demande.capaciteScolaireColoree !== 0
    )
      return "La capacité en apprentissage colorée doit être à 0 dans le cas d'une fermeture";
    if (
      !demande.coloration &&
      !isTypeColoration(demande.typeDemande) &&
      demande.capaciteApprentissageColoree !== 0
    )
      return "La capacité en apprentissage colorée doit être à 0 quand on ne se trouve pas dans une situation de coloration";
    if (
      demande.coloration &&
      isTypeTransfert(demande.typeDemande) &&
      demande.capaciteApprentissageColoree === 0
    )
      return "La capacité en apprentissage colorée doit être supérieure à 0 dans le cas d'un transfert vers l'apprentissage avec coloration";
  },
  /**
   *
   * La somme des capacités actuelles doit être :
   * - supérieure à 0 dans le cas d'autre chose qu'une ouverture
   */
  sommeCapaciteActuelle: (demande) => {
    if (isTypeOuverture(demande.typeDemande)) return;

    if (
      !demande.capaciteScolaireActuelle &&
      !demande.capaciteApprentissageActuelle
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
  sommeCapacite: (demande) => {
    if (isTypeFermeture(demande.typeDemande)) return;

    if (!demande.capaciteApprentissage && !demande.capaciteScolaire) {
      return "La somme des capacités doit être supérieure à 0";
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
          demande.capaciteApprentissageActuelle +
            demande.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être supérieure à la somme des capacités actuelles dans le cas d'une augmentation";
      if (
        isTypeDiminution(demande.typeDemande) &&
        demande.capaciteApprentissage + demande.capaciteScolaire >=
          demande.capaciteApprentissageActuelle +
            demande.capaciteScolaireActuelle
      )
        return "La somme des capacités doit être inférieure à la somme des capacités actuelles dans le cas d'une diminution";
    }
  },
  /**
   * La somme des capacités colorées doit être :
   * - supérieure à 0 dans le cas d'une coloration qui n'est pas une fermeture
   */
  sommeCapaciteColoree: (demande) => {
    if (
      isTypeFermeture(demande.typeDemande) ||
      !isTypeColoration(demande.typeDemande) ||
      !demande.coloration
    )
      return;

    if (
      !demande.capaciteApprentissageColoree &&
      !demande.capaciteScolaireColoree
    )
      return "La somme des capacités colorées doit être supérieure à 0";
  },
  compensation: (demande) => {
    if (!isTypeCompensation(demande.typeDemande)) return;
    if (!demande.compensationCfd)
      return "Le diplôme de compensation est obligatoire";
    if (!demande.compensationCodeDispositif)
      return "Le dispositif de compensation est obligatoire";
    if (!demande.compensationUai)
      return "L'établissement de compensation est obligatoire";
    if (!demande.compensationRentreeScolaire)
      return "La rentrée scolaire de compensation est obligatoire";
  },
  motifRefus: (demande) => {
    if (demande.statut === "refused" && !demande.motifRefus?.length) {
      return "Le champ 'motif refus' est obligatoire";
    }
  },
  autreMotifRefus: (demande) => {
    if (demande.motifRefus?.includes("autre") && !demande.autreMotifRefus) {
      return "Le champ 'autre motif refus' est obligatoire";
    }
  },
};
