import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

const IS_SAISIE_DISABLED = false;

export const isSaisieDisabled = () => {
  return IS_SAISIE_DISABLED;
};

export const canEditDemande = ({
  demande,
  hasEditDemandePermission,
}: {
  demande: { statut?: DemandeStatutType };
  hasEditDemandePermission: boolean;
}) => {
  return (
    !isSaisieDisabled() &&
    hasEditDemandePermission &&
    demande &&
    demande.statut !== DemandeStatutEnum["demande validée"] &&
    demande.statut !== DemandeStatutEnum["refusée"]
  );
};
