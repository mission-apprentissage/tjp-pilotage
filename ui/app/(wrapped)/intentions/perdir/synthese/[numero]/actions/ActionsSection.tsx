import { Flex } from "@chakra-ui/react";

import { client } from "@/api.client";
import { usePermission } from "@/utils/security/usePermission";

import { ChangementStatutForm } from "./ChangementStatutForm";

export const ActionsSection = ({
  intention,
}: {
  intention: (typeof client.infer)["[GET]/intention/:numero"];
}) => {
  const hasPermissionModificationStatut = usePermission(
    "intentions-perdir-statut/ecriture"
  );

  return (
    <Flex direction={"column"} gap={6}>
      {hasPermissionModificationStatut && (
        <ChangementStatutForm intention={intention} />
      )}
    </Flex>
  );
};
