import { Flex } from "@chakra-ui/react";
import { hasPermission, hasRole } from "shared";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";
import {PermissionEnum} from 'shared/enum/permissionEnum';
import {RoleEnum} from 'shared/enum/roleEnum';

import type { client } from "@/api.client";
import { STICKY_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";
import { getTypeAvis, isChangementStatutAvisDisabled } from "@/app/(wrapped)/demandes/utils/statutUtils";
import { useAuth } from "@/utils/security/useAuth";

import { AvisForm } from "./AvisForm";
import { ChangementStatutForm } from "./ChangementStatutForm";

export const ActionsSection = ({ demande }: { demande: (typeof client.infer)["[GET]/demande/:numero"] }) => {
  const { user } = useAuth();
  const hasPermissionModificationStatut = hasPermission(user?.role, PermissionEnum["demande-statut/ecriture"]);
  const hasPermissionEmissionAvis = hasPermission(user?.role, PermissionEnum["demande-avis/ecriture"]);

  /**
   * Les user région ne peuvent pas donner d'avis consultatif
   * Les experts régionaux ne peuvent donner que des avis consultatif
   * Une fois la demande validée ou refusée, on ne peut plus donner d'avis
   * @returns {boolean}
   */
  const canSubmitAvis = () => {
    if (
      (hasRole({ user, role: RoleEnum["expert_region"] }) &&
        getTypeAvis(demande.statut) != AvisTypeEnum["consultatif"]) ||
      (hasRole({ user, role: RoleEnum["region"] }) &&
        getTypeAvis(demande.statut) === AvisTypeEnum["consultatif"]) ||
      isChangementStatutAvisDisabled({demande, user})
    )
      return false;
    return true;
  };

  return (
    <Flex direction={"column"} gap={6} top={STICKY_OFFSET} position={"sticky"}>
      {hasPermissionEmissionAvis && canSubmitAvis() && <AvisForm demande={demande} />}
      {hasPermissionModificationStatut && <ChangementStatutForm demande={demande} />}
    </Flex>
  );
};
