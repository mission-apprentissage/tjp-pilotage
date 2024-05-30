import { Flex } from "@chakra-ui/react";
import { hasRole } from "shared";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";

import { client } from "@/api.client";
import { getTypeAvis } from "@/app/(wrapped)/intentions/utils/statutUtils";
import { useAuth } from "@/utils/security/useAuth";
import { usePermission } from "@/utils/security/usePermission";

import { STICKY_OFFSET } from "../../../SCROLL_OFFSETS";
import { AvisForm } from "./AvisForm";
import { ChangementStatutForm } from "./ChangementStatutForm";
import { EditoSection } from "./EditoSection";

export const ActionsSection = ({
  intention,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
}) => {
  const { auth } = useAuth();
  const isPerdir = hasRole({ user: auth?.user, role: "perdir" });
  const hasPermissionModificationStatut = usePermission(
    "intentions-perdir-statut/ecriture"
  );

  const hasPermissionEmissionAvis = usePermission(
    "intentions-perdir-avis/ecriture"
  );

  /**
   * Les user région ne peuvent pas donner d'avis consultatif
   * Les experts régionaux ne peuvent donner que des avis consultatif
   * @returns {boolean}
   */
  const canSubmitAvis = () => {
    if (
      (hasRole({ user: auth?.user, role: "expert_region" }) &&
        getTypeAvis(intention.statut) != AvisTypeEnum["consultatif"]) ||
      (hasRole({ user: auth?.user, role: "region" }) &&
        getTypeAvis(intention.statut) === AvisTypeEnum["consultatif"])
    )
      return false;
    return true;
  };

  return (
    <Flex direction={"column"} gap={6} top={STICKY_OFFSET} position={"sticky"}>
      {hasPermissionEmissionAvis && canSubmitAvis() && (
        <AvisForm intention={intention} />
      )}
      {hasPermissionModificationStatut && (
        <ChangementStatutForm intention={intention} />
      )}
      {isPerdir && <EditoSection />}
    </Flex>
  );
};
