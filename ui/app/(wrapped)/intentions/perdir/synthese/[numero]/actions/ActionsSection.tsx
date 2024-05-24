import { Flex } from "@chakra-ui/react";

import { client } from "@/api.client";
import { usePermission } from "@/utils/security/usePermission";

import { STICKY_OFFSET } from "../../../SCROLL_OFFSETS";
import { ChangementStatutForm } from "./ChangementStatutForm";
import { EditoSection } from "./EditoSection";

export const ActionsSection = ({
  intention,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
}) => {
  const hasPermissionModificationStatut = usePermission(
    "intentions-perdir-statut/ecriture"
  );

  return (
    <Flex direction={"column"} gap={6} top={STICKY_OFFSET} position={"sticky"}>
      {hasPermissionModificationStatut ? (
        <ChangementStatutForm intention={intention} />
      ) : (
        <EditoSection />
      )}
    </Flex>
  );
};
