import type { AvisTypeType } from "shared/enum/avisTypeEnum";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

export const formatStatut = (statut?: DemandeStatutType): string => {
  switch (statut) {
  case DemandeStatutEnum["brouillon"]:
    return "Brouillon";
  case DemandeStatutEnum["proposition"]:
    return "Proposition";
  case DemandeStatutEnum["refusée"]:
    return "Refusée";
  case DemandeStatutEnum["supprimée"]:
    return "Supprimée";
  case DemandeStatutEnum["dossier incomplet"]:
    return "Dossier incomplet";
  case DemandeStatutEnum["dossier complet"]:
    return "Dossier complet";
  case DemandeStatutEnum["projet de demande"]:
    return "Projet de demande";
  case DemandeStatutEnum["prêt pour le vote"]:
    return "Prêt pour le vote";
  case DemandeStatutEnum["demande validée"]:
    return "Demande validée";
  default:
    return "";
  }
};

export const getOrderStatut = (statut?: DemandeStatutType): number => {
  switch (statut) {
  case DemandeStatutEnum["brouillon"]:
    return 0;
  case DemandeStatutEnum["proposition"]:
    return 1;
  case DemandeStatutEnum["dossier incomplet"]:
  case DemandeStatutEnum["dossier complet"]:
    return 2;
  case DemandeStatutEnum["projet de demande"]:
    return 3;
  case DemandeStatutEnum["prêt pour le vote"]:
    return 4;
  case DemandeStatutEnum["demande validée"]:
    return 5;
  case DemandeStatutEnum["refusée"]:
  case DemandeStatutEnum["supprimée"]:
    return 1000;
  default:
    return 0;
  }
};

export const getStepWorkflow = (statut?: DemandeStatutType): number => {
  switch (statut) {
  case DemandeStatutEnum["proposition"]:
  case DemandeStatutEnum["dossier incomplet"]:
  case DemandeStatutEnum["dossier complet"]:
    return 1;
  case DemandeStatutEnum["projet de demande"]:
    return 2;
  case DemandeStatutEnum["prêt pour le vote"]:
    return 3;
  case DemandeStatutEnum["demande validée"]:
    return 4;
  case DemandeStatutEnum["brouillon"]:
  case DemandeStatutEnum["refusée"]:
  case DemandeStatutEnum["supprimée"]:
  default:
    return 0;
  }
};

export const isChangementStatutAvisDisabled = (statut?: DemandeStatutType): boolean => {
  switch (statut) {
  case DemandeStatutEnum["demande validée"]:
  case DemandeStatutEnum["refusée"]:
  case DemandeStatutEnum["supprimée"]:
    return true;
  case DemandeStatutEnum["brouillon"]:
  case DemandeStatutEnum["proposition"]:
  case DemandeStatutEnum["dossier complet"]:
  case DemandeStatutEnum["dossier incomplet"]:
  case DemandeStatutEnum["projet de demande"]:
  case DemandeStatutEnum["prêt pour le vote"]:
  default:
    return false;
  }
};

export const isStatutStepWorkflowEnabled = (statut?: DemandeStatutType): boolean => {
  return isStepWorkflowEnabled(getStepWorkflow(statut));
};

export const isStepWorkflowEnabled = (step: number): boolean => {
  switch (step) {
  case 0:
  case 1:
  case 2:
  case 3:
  case 4:
    return true;
  default:
    return false;
  }
};

export const getStepWorkflowAvis = (typeAvis: AvisTypeType): number => {
  switch (typeAvis) {
  case AvisTypeEnum["préalable"]:
    return 1;
  case AvisTypeEnum["consultatif"]:
    return 2;
  case AvisTypeEnum["final"]:
    return 3;
  default:
    return 0;
  }
};

export const getTypeAvis = (statut?: DemandeStatutType): AvisTypeType => {
  switch (getStepWorkflow(statut)) {
  case 2:
    return AvisTypeEnum["consultatif"];
  case 3:
  case 4:
    return AvisTypeEnum["final"];
  case 0:
  case 1:
  default:
    return AvisTypeEnum["préalable"];
  }
};

export const getPossibleNextStatuts = (statut?: DemandeStatutType): Array<DemandeStatutType> =>
  Object.keys(DemandeStatutEnum).filter((possibleStatut) => {
    const seuilActuel = getStepWorkflow(statut);
    const seuilMax = seuilActuel + 1;
    const seuilCible = getStepWorkflow(possibleStatut as DemandeStatutType);

    return statut !== possibleStatut &&
      getOrderStatut(statut) <= getOrderStatut(possibleStatut as DemandeStatutType) &&
      seuilCible >= seuilActuel &&
      seuilCible <= seuilMax;
  }) as Array<DemandeStatutType>;
