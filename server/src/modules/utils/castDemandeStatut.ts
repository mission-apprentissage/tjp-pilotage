import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";

export const castDemandeStatutWithoutSupprimee = (statut?: string | null): Exclude<DemandeStatutType, "supprimée"> => {
  return statut as Exclude<DemandeStatutType, "supprimée">;
};

export const castDemandeStatut = (statut?: string | null): DemandeStatutType => {
  return statut as DemandeStatutType;
};
