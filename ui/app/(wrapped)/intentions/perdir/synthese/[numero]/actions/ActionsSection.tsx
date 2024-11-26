import { Flex } from "@chakra-ui/react";
import { hasRole } from "shared";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";

import type { client } from "@/api.client";
import { STICKY_OFFSET } from "@/app/(wrapped)/intentions/perdir/SCROLL_OFFSETS";
import { getTypeAvis, isChangementStatutAvisDisabled } from "@/app/(wrapped)/intentions/utils/statutUtils";
import { useAuth } from "@/utils/security/useAuth";
import { usePermission } from "@/utils/security/usePermission";

import { AvisForm } from "./AvisForm";
import { ChangementStatutForm } from "./ChangementStatutForm";

export const ActionsSection = ({ intention }: { intention: (typeof client.infer)["[GET]/intention/:numero"] }) => {
  const { auth } = useAuth();
  const hasPermissionModificationStatut = usePermission("intentions-perdir-statut/ecriture");

  const hasPermissionEmissionAvis = usePermission("intentions-perdir-avis/ecriture");

  /**
   * Les user région ne peuvent pas donner d'avis consultatif
   * Les experts régionaux ne peuvent donner que des avis consultatif
   * Une fois la demande validée ou refusée, on ne peut plus donner d'avis
   * @returns {boolean}
   */
  const canSubmitAvis = () => {
    if (
      (hasRole({ user: auth?.user, role: "expert_region" }) &&
        getTypeAvis(intention.statut) != AvisTypeEnum["consultatif"]) ||
      (hasRole({ user: auth?.user, role: "region" }) &&
        getTypeAvis(intention.statut) === AvisTypeEnum["consultatif"]) ||
      isChangementStatutAvisDisabled(intention.statut)
    )
      return false;
    return true;
  };

  return (
    <Flex direction={"column"} gap={6} top={STICKY_OFFSET} position={"sticky"}>
      {hasPermissionEmissionAvis && canSubmitAvis() && <AvisForm intention={intention} />}
      {hasPermissionModificationStatut && <ChangementStatutForm intention={intention} />}
    </Flex>
  );
};
