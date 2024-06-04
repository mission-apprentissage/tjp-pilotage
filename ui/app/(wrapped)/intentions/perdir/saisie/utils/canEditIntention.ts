import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";

import { usePermission } from "@/utils/security/usePermission";
const IS_SAISIE_DISABLED = false;

export const isSaisieDisabled = () => {
  return IS_SAISIE_DISABLED;
};

export const canEditIntention = (intention: { statut?: DemandeStatutType }) => {
  return (
    !isSaisieDisabled() &&
    usePermission("intentions-perdir/ecriture") &&
    intention &&
    intention.statut !== DemandeStatutEnum["demande validée"] &&
    intention.statut !== DemandeStatutEnum["refusée"]
  );
};
