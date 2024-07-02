import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

const IS_SAISIE_DISABLED = false;

export const isSaisieDisabled = () => {
  return IS_SAISIE_DISABLED;
};

export const canEditIntention = ({
  intention,
  hasEditIntentionPermission,
}: {
  intention: { statut?: DemandeStatutType; canEdit: boolean };
  hasEditIntentionPermission: boolean;
}) => {
  return (
    !isSaisieDisabled() &&
    hasEditIntentionPermission &&
    intention &&
    intention.statut !== DemandeStatutEnum["demande validée"] &&
    intention.statut !== DemandeStatutEnum["refusée"] &&
    intention.canEdit
  );
};
