import { Flex } from "@chakra-ui/react";
import { AvisTypeEnum } from "shared/enum/avisTypeEnum";

import { client } from "@/api.client";
import { getTypeAvis } from "@/app/(wrapped)/intentions/utils/statutUtils";
import { usePermission } from "@/utils/security/usePermission";

import { useRole } from "../../../../../../../utils/security/useRole";
import { STICKY_OFFSET } from "../../../SCROLL_OFFSETS";
import { AvisForm } from "./AvisForm";
import { ChangementStatutForm } from "./ChangementStatutForm";
import { EditoSection } from "./EditoSection";

export const ActionsSection = ({
  intention,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
}) => {
  const isPerdir = useRole("perdir");
  const hasPermissionModificationStatut = usePermission(
    "intentions-perdir-statut/ecriture"
  );

  const hasPermissionEmissionAvis = usePermission(
    "intentions-perdir-avis/ecriture"
  );

  /**
   * Les pilotes régionaux ne peuvent pas donner d'avis préalable
   * Les experts régionaux ne peuvent donner que des avis consultatif
   * @returns {boolean}
   */
  const canSubmitAvis = () => {
    if (
      (useRole("expert_region") &&
        getTypeAvis(intention.statut) != AvisTypeEnum["consultatif"]) ||
      (useRole("region") &&
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
