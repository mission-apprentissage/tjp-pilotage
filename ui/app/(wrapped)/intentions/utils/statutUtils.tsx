import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

export const formatStatut = (statut: DemandeStatutType) => {
  switch (statut) {
    case DemandeStatutEnum["brouillon"]:
      return "Brouillon";
    case DemandeStatutEnum["proposition"]:
      return "Proposition";
    case DemandeStatutEnum["demande validée"]:
      return "Demande validée";
    case DemandeStatutEnum["refusée"]:
      return "Refusée";
    case DemandeStatutEnum["supprimée"]:
      return "Supprimée";
    default:
      return "";
  }
};

export const getStepWorkflow = (statut?: DemandeStatutType) => {
  switch (statut) {
    case DemandeStatutEnum["brouillon"]:
      return 0;
    case DemandeStatutEnum["proposition"]:
      return 1;
    case DemandeStatutEnum["dossier incomplet"]:
      return 1;
    case DemandeStatutEnum["dossier complet"]:
      return 1;
    case DemandeStatutEnum["projet de demande"]:
      return 2;
    case DemandeStatutEnum["prêt pour le vote"]:
      return 3;
    case DemandeStatutEnum["demande validée"]:
      return 3;
    default:
      return 0;
  }
};
