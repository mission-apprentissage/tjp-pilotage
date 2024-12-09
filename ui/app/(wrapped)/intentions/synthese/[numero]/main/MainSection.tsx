import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";

import type { client } from "@/api.client";
import { canEditDemande } from "@/app/(wrapped)/intentions/saisie/utils/canEditDemande";
import { usePermission } from "@/utils/security/usePermission";

import { SyntheseSection } from "./synthese/SyntheseSection";

export const MainSection = ({
  demande,
  isCampagneEnCours,
}: {
  demande: (typeof client.infer)["[GET]/demande/:numero"];
  isCampagneEnCours?: boolean;
}) => {
  const hasEditDemandePermission = usePermission("intentions/ecriture");

  return (
    <Flex bg="white" borderRadius={6} p={8} direction="column">
      {isCampagneEnCours && (
        <Flex direction={"row"} justify={"space-between"}>
          <Flex direction={"row"} gap={2}>
            {canEditDemande({ demande, hasEditDemandePermission }) && (
              <Tooltip label="Modifier la demande">
                <IconButton
                  as={NextLink}
                  href={`/intentions/saisie/${demande?.numero ?? ""}`}
                  aria-label="Modifier la demande"
                  color={"bluefrance.113"}
                  bgColor={"transparent"}
                  icon={<Icon width="24px" icon="ri:pencil-line" />}
                />
              </Tooltip>
            )}
          </Flex>
        </Flex>
      )}
      <Flex mt={8}>
        <SyntheseSection demande={demande} />
      </Flex>
    </Flex>
  );
};
