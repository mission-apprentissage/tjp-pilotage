import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

const IS_SAISIE_DISABLED = false;

export const isSaisieDisabled = () => {
  return IS_SAISIE_DISABLED;
};

const isSaisieAllowedForPerdir = (isPerdir: boolean, statut?: DemandeStatutType) => {
  if (!isPerdir) return true;

  return (
    isPerdir &&
    (statut === DemandeStatutEnum["brouillon"] ||
      statut === DemandeStatutEnum["proposition"] ||
      statut === DemandeStatutEnum["dossier incomplet"])
  );
};

export const canEditIntention = ({
  intention,
  hasEditIntentionPermission,
  isPerdir,
}: {
  intention: { statut?: DemandeStatutType; canEdit: boolean };
  hasEditIntentionPermission: boolean;
  isPerdir: boolean;
}) => {
  return (
    !isSaisieDisabled() &&
    hasEditIntentionPermission &&
    intention &&
    intention.statut !== DemandeStatutEnum["demande validée"] &&
    intention.statut !== DemandeStatutEnum["refusée"] &&
    intention.canEdit &&
    isSaisieAllowedForPerdir(isPerdir, intention.statut)
  );
};
