import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

const IS_SAISIE_DISABLED = false;

export const isSaisieDisabled = () => {
  return IS_SAISIE_DISABLED;
};

export const canEditDemande = ({
  demande,
  hasEditDemandePermission,
}: {
  demande: { statut?: DemandeStatutType; canEdit: boolean };
  hasEditDemandePermission: boolean;
}) => {
  return (
    !isSaisieDisabled() &&
    hasEditDemandePermission &&
    demande &&
    demande.statut !== DemandeStatutEnum["demande validée"] &&
    demande.statut !== DemandeStatutEnum["refusée"] &&
    demande.canEdit
  );
};
