import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

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
    default:
      return 0;
  }
};

export const isStatutStepWorkflowEnabled = (
  statut?: DemandeStatutType
): boolean => {
  return isStepWorkflowEnabled(getStepWorkflow(statut));
};

export const isStepWorkflowEnabled = (step: number): boolean => {
  switch (step) {
    case 0:
    case 1:
    case 2:
      return true;
    case 3:
    case 4:
    default:
      return false;
  }
};
