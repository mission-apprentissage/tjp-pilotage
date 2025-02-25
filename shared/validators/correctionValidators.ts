import { RaisonCorrectionEnum } from "../enum/raisonCorrectionEnum";
import type { Router } from "../routes";
import type { Args, ZodTypeProvider } from "../utils/http-wizard/core";

export type Correction = Args<Router["[POST]/correction/submit"]["schema"], ZodTypeProvider>["body"]["correction"];

export type Demande = Args<Router["[POST]/demande/submit"]["schema"], ZodTypeProvider>["body"]["demande"];

const isRaisonAnnulation = (raison: string): boolean => raison === RaisonCorrectionEnum["annulation"];

const isRaisonReport = (raison: string): boolean => raison === RaisonCorrectionEnum["report"];

const isRaisonModificationCapacite = (raison: string): boolean =>
  raison === RaisonCorrectionEnum["modification_capacite"];

const isPositiveNumber = (value: number | undefined): value is number => {
  if (!Number.isInteger(value)) return false;
  if (value === undefined) return false;
  if (value < 0) return false;
  return true;
};

export const correctionValidators = {
  raison: (correction) => {
    if (!correction.raison?.length) {
      return "Le champ 'raison' est obligatoire";
    }
    return undefined;
  },
  motif: (correction) => {
    if (!correction.motif?.length) {
      return "Le champ 'motif' est obligatoire";
    }
    return undefined;
  },
  autreMotif: (correction) => {
    if (correction.motif?.includes("autre") && !correction.autreMotif) {
      return "Le champ 'autre motif' est obligatoire";
    }
    return undefined;
  },
  /**
   *
   * La future capacité scolaire doit être :
   * - un nombre entier positif
   * - égale à la capacité scolaire actuelle dans le cas d'un report ou d'une annulation
   */
  capaciteScolaire: (correction) => {
    if (!isPositiveNumber(correction.capaciteScolaire)) {
      return "La capacité scolaire doit être un nombre entier positif";
    }
    if (isRaisonAnnulation(correction.raison) || isRaisonReport(correction.raison)) {
      if (correction.capaciteScolaire !== correction.capaciteScolaireActuelle) {
        return "La capacité scolaire doit être égale à la capacité scolaire actuelle dans le cas d'un report ou d'une annulation";
      }
    }
    return undefined;
  },
  /**
   *
   * La capacité scolaire colorée doit être :
   * - un nombre entier positif
   * - à 0 dans le cas d'un report ou d'une annulation
   */
  capaciteScolaireColoree: (correction) => {
    if (!isPositiveNumber(correction.capaciteScolaireColoree)) {
      return "La capacité scolaire colorée doit être un nombre entier positif";
    }
    if (isRaisonAnnulation(correction.raison) || isRaisonReport(correction.raison)) {
      if (correction.capaciteScolaireColoree !== 0) {
        return "La capacité scolaire colorée doit être égale à 0 dans le cas d'un report ou d'une annulation";
      }
    }
    return undefined;
  },
  /**
   *
   * La future capacite en apprentissage doit être :
   *
   * - un nombre entier positif
   * - égale à la capacité en apprentissage actuelle dans le cas d'un report ou d'une annulation
   */
  capaciteApprentissage: (correction) => {
    if (!isPositiveNumber(correction.capaciteApprentissage))
      return "La capacité en apprentissage doit être un nombre entier positif";
    if (isRaisonAnnulation(correction.raison) || isRaisonReport(correction.raison)) {
      if (correction.capaciteApprentissage !== correction.capaciteApprentissageActuelle) {
        return "La capacité en apprentissage doit être égale à la capacité en apprentissage actuelle dans le cas d'un report ou d'une annulation";
      }
    }
    return undefined;
  },
  /**
   *
   * La capacité en apprentissage colorée doit être :
   * - un nombre entier positif
   * - à 0 dans le cas d'un report ou d'une annulation
   */
  capaciteApprentissageColoree: (correction) => {
    if (!isPositiveNumber(correction.capaciteApprentissageColoree))
      return "La capacité en apprentissage colorée doit être un nombre entier positif";
    if (isRaisonAnnulation(correction.raison) || isRaisonReport(correction.raison)) {
      if (correction.capaciteApprentissageColoree !== 0) {
        return "La capacité en apprentissage colorée doit être égale à 0 dans le cas d'un report ou d'une annulation";
      }
    }
    return undefined;
  },
  /**
   *
   * La somme des capacités doit être :
   * - différente de la somme des capacités avant correction dans le cas d'une modification de capacité
   */
  sommeCapacite: (correction, demande) => {
    if (
      isRaisonModificationCapacite(correction.raison) &&
      correction.capaciteScolaire === demande.capaciteScolaire &&
      correction.capaciteApprentissage === demande.capaciteApprentissage &&
      correction.capaciteScolaireColoree === demande.capaciteScolaireColoree &&
      correction.capaciteApprentissageColoree === demande.capaciteApprentissageColoree
    ) {
      return "Les capacités corrigées doivent être différentes des capacités avant correction dans le cas d'une modification de capacité";
    }
    return undefined;
  },
  /**
   * La somme des capacités colorées actuelles doit être :
   * - inférieure ou égale à la somme des capacités actuelles
   */
  sommeCapaciteColoreeActuelle: (correction) => {
    if (
      isPositiveNumber(correction.capaciteApprentissageColoreeActuelle) &&
      isPositiveNumber(correction.capaciteScolaireColoreeActuelle) &&
      isPositiveNumber(correction.capaciteApprentissageActuelle) &&
      isPositiveNumber(correction.capaciteScolaireActuelle) &&
      correction.capaciteApprentissageColoreeActuelle + correction.capaciteScolaireColoreeActuelle >
        correction.capaciteApprentissageActuelle + correction.capaciteScolaireActuelle
    )
      return "La somme des capacités colorées actuelles doit être inférieure ou égale à la somme des capacités actuelles";
    return undefined;
  },
  /**
   * La somme des futures capacités colorées doit être :
   * - inférieure ou égale à la somme des futures capacités
   */
  sommeCapaciteColoree: (correction) => {
    if (
      isPositiveNumber(correction.capaciteApprentissageColoree) &&
      isPositiveNumber(correction.capaciteScolaireColoree) &&
      isPositiveNumber(correction.capaciteApprentissage) &&
      isPositiveNumber(correction.capaciteScolaire) &&
      correction.capaciteApprentissageColoree + correction.capaciteScolaireColoree >
        correction.capaciteApprentissage + correction.capaciteScolaire
    )
      return "La somme des futures capacités colorées doit être inférieure ou égale à la somme des futures capacités";
    return undefined;
  },
} satisfies Record<keyof Correction | string,(correction: Correction, demande: Demande) => string | undefined | void>;
