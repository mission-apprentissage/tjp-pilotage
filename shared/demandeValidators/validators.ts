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
  mixte: (demande) => {
    if (isTypeTransfert(demande.typeDemande) && !demande.mixte) {
      return "Dans le cas d'un transfert vers l'apprentissage, la demande doit être mixte";
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
    if (
      !isTypeOuverture(demande.typeDemande) &&
      demande.capaciteScolaireActuelle === 0
    ) {
      return "La capacité scolaire actuelle devrait être supérieure à 0 dans le cas d'une formation existante";
    }
    if (
      isTypeTransfert(demande.typeDemande) &&
      demande.capaciteScolaireActuelle === 0
    ) {
      return "La capacité scolaire actuelle ne peut être à 0 dans le cas d'un transfert vers l'apprentissage";
    }
  },
  capaciteScolaire: (demande) => {
    if (!isPositiveNumber(demande.capaciteScolaire)) {
      return "La capacité scolaire doit être un nombre entier positif";
    }

    // if (
    //   isTypeOuverture(demande.typeDemande) &&
    //   demande.capaciteScolaire === 0
    // ) {
    //   return "La capacité scolaire devrait être supérieure à 0 dans le cas d'une ouverture";
    // }

    if (
      isTypeFermeture(demande.typeDemande) &&
      demande.capaciteScolaire !== 0
    ) {
      return "La capacité scolaire devrait être à 0 dans le cas d'une fermeture";
    }

    if (isTypeAugmentation(demande.typeDemande)) {
      if (demande.capaciteScolaire === 0)
        return "La capacité scolaire devrait être supérieure à 0 dans le cas d'une augmentation";

      if (
        isPositiveNumber(demande.capaciteScolaireActuelle) &&
        demande.capaciteScolaire <= demande.capaciteScolaireActuelle
      ) {
        return "La capacité scolaire devrait être supérieure à la capacité actuelle dans le cas d'une augmentation";
      }
    }

    if (isTypeDiminution(demande.typeDemande)) {
      if (demande.capaciteScolaire === 0)
        return "La capacité scolaire devrait être supérieure à 0 dans le cas d'une diminution";

      if (
        isPositiveNumber(demande.capaciteScolaireActuelle) &&
        demande.capaciteScolaire >= demande.capaciteScolaireActuelle
      ) {
        return "La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'une diminution";
      }
    }
    if (isTypeTransfert(demande.typeDemande)) {
      if (demande.capaciteScolaire === 0)
        return "La capacité scolaire devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage";

      if (
        isPositiveNumber(demande.capaciteScolaireActuelle) &&
        demande.capaciteScolaire >= demande.capaciteScolaireActuelle
      ) {
        return "La capacité scolaire devrait être inférieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage";
      }
    }
    if (
      isTypeColoration(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteScolaire) &&
      isPositiveNumber(demande.capaciteScolaireActuelle) &&
      demande.capaciteScolaireActuelle > demande.capaciteScolaire
    ) {
      return "La capacité scolaire devrait être supérieure ou égale à la capacité actuelle dans le cas d'une coloration.";
    }
  },
  capaciteApprentissageActuelle: (demande) => {
    if (!isPositiveNumber(demande.capaciteApprentissageActuelle)) {
      return "La capacité en apprentissage actuelle doit être un nombre entier positif";
    }
    if (!demande.mixte) {
      if (demande.capaciteApprentissageActuelle === 0) return;
      return "Le champ capacité en apprentissage actuelle doit être à 0";
    }
    if (
      isTypeDiminution(demande.typeDemande) ||
      isTypeFermeture(demande.typeDemande) ||
      isTypeTransfert(demande.typeDemande)
    )
      return;

    if (
      isTypeOuverture(demande.typeDemande) &&
      demande.capaciteApprentissageActuelle !== 0
    ) {
      return "La capacité en apprentissage actuelle devrait être à 0 dans le cas d'une ouverture";
    }
    if (
      !isTypeOuverture(demande.typeDemande) &&
      demande.capaciteApprentissageActuelle === 0
    ) {
      return "La capacité en apprentissage actuelle devrait être supérieure à 0 dans le cas d'une formation existante";
    }
  },
  capaciteApprentissage: (demande) => {
    if (!isPositiveNumber(demande.capaciteApprentissage)) {
      return "La capacité en apprentissage doit être un nombre entier positif";
    }
    if (!demande.mixte) {
      return;
    }
    if (
      isTypeOuverture(demande.typeDemande) &&
      demande.capaciteApprentissage === 0
    ) {
      return "La capacité en apprentissage devrait être supérieure à 0 dans le cas d'une ouverture mixte";
    }
    if (
      isTypeFermeture(demande.typeDemande) &&
      demande.capaciteApprentissage !== 0
    ) {
      return "La capacité en apprentissage devrait être à 0 dans le cas d'une fermeture mixte";
    }

    if (isTypeAugmentation(demande.typeDemande)) {
      if (demande.capaciteApprentissage === 0)
        return "La capacité en apprentissage devrait être supérieure à 0 dans le cas d'une augmentation mixte";

      if (
        isPositiveNumber(demande.capaciteApprentissageActuelle) &&
        demande.capaciteApprentissage <= demande.capaciteApprentissageActuelle
      ) {
        return "La capacité en apprentissage devrait être supérieure à la capacité actuelle dans le cas d'une augmentation mixte";
      }
    }
    if (isTypeDiminution(demande.typeDemande)) {
      if (demande.capaciteApprentissage === 0)
        return "La capacité en apprentissage devrait être supérieure à 0 dans le cas d'une diminution mixte";

      if (
        isPositiveNumber(demande.capaciteApprentissageActuelle) &&
        demande.capaciteApprentissage > demande.capaciteApprentissageActuelle
      ) {
        return "La capacité en apprentissage devrait être inférieure à la capacité actuelle dans le cas d'une diminution mixte";
      }
    }
    if (isTypeTransfert(demande.typeDemande)) {
      if (demande.capaciteApprentissage === 0)
        return "La capacité en apprentissage devrait être supérieure à 0 dans le cas d'un transfert vers l'apprentissage";

      if (
        isPositiveNumber(demande.capaciteApprentissageActuelle) &&
        demande.capaciteApprentissageActuelle >= demande.capaciteApprentissage
      ) {
        return "La capacité en apprentissage devrait être supérieure à la capacité actuelle dans le cas d'un transfert vers l'apprentissage";
      }
    }
    if (
      isTypeColoration(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteApprentissageActuelle) &&
      isPositiveNumber(demande.capaciteApprentissage) &&
      demande.capaciteApprentissageActuelle > demande.capaciteApprentissage
    ) {
      return "La capacité en apprentissage devrait être supérieure ou égale à la capacité actuelle dans le cas d'une coloration.";
    }
  },
  capaciteApprentissageColoree: (demande) => {
    if (
      (isTypeColoration(demande.typeDemande) || demande.coloration) &&
      demande.mixte &&
      !isPositiveNumber(demande.capaciteScolaireColoree)
    ) {
      return "La capacité en apprentssage colorée doit être supérieure à 0.";
    }

    if (!isPositiveNumber(demande.capaciteApprentissageColoree)) {
      return "La capacité en apprentissage colorée doit être un nombre entier positif";
    }

    if (!demande.mixte || !demande.coloration) {
      if (demande.capaciteApprentissageColoree === 0) return;
      return "Le champ capacité en apprentissage colorée doit être vide";
    }

    if (
      isTypeFermeture(demande.typeDemande) &&
      demande.capaciteApprentissageColoree > 0
    ) {
      return "La capacité en apprentissage colorée doit être à 0 dans le cas d'une fermeture";
    }

    if (
      !isTypeFermeture(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteApprentissage) &&
      demande.capaciteApprentissageColoree > demande.capaciteApprentissage
    ) {
      return "La capacité en apprentissage colorée ne peut pas être supérieure à la capacité";
    }
  },
  capaciteScolaireColoree: (demande) => {
    if (
      (isTypeColoration(demande.typeDemande) || demande.coloration) &&
      !isPositiveNumber(demande.capaciteScolaireColoree)
    ) {
      return "La capacité scolaire colorée doit être supérieure à 0.";
    }

    if (!isPositiveNumber(demande.capaciteScolaireColoree)) {
      return "La capacité scolaire colorée doit être un nombre entier positif";
    }

    if (!demande.coloration) {
      if (demande.capaciteScolaireColoree === 0) return;
      return "Le champ scolaire colorée doit être à 0";
    }

    if (
      isTypeFermeture(demande.typeDemande) &&
      demande.capaciteScolaireColoree !== 0
    ) {
      return "La capacité scolaire colorée doit être à 0 dans le cas d'une fermeture";
    }

    if (
      !isTypeFermeture(demande.typeDemande) &&
      !demande.mixte &&
      demande.capaciteScolaireColoree === 0
    ) {
      return "La capacité scolaire colorée doit être supérieure à 0";
    }

    if (
      !isTypeFermeture(demande.typeDemande) &&
      isPositiveNumber(demande.capaciteScolaire) &&
      demande.capaciteScolaireColoree > demande.capaciteScolaire
    ) {
      return "La capacité scolaire colorée ne peut pas être supérieure à la capacité";
    }
  },
  sommeCapacite: (demande) => {
    if (
      isTypeFermeture(demande.typeDemande) ||
      !isTypeColoration(demande.typeDemande)
    )
      return;

    if (!demande.capaciteApprentissage && !demande.capaciteScolaire) {
      return "La somme des capacités doit être supérieure à 0";
    }
  },
  sommeCapaciteColoree: (demande) => {
    if (
      isTypeFermeture(demande.typeDemande) ||
      !isTypeColoration(demande.typeDemande) ||
      !demande.coloration ||
      !demande.mixte
    )
      return;

    if (
      !demande.capaciteApprentissageColoree &&
      !demande.capaciteScolaireColoree
    ) {
      return "La somme des capacités colorées doit être supérieure à 0";
    }
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
