import { Flex, IconButton, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import {isCampagneEnCours} from 'shared/utils/campagneUtils';

import type { client } from "@/api.client";
import {canEditDemandeIntention} from '@/app/(wrapped)/intentions/utils/permissionsIntentionUtils';
import { getRoutingSaisieRecueilDemande } from "@/utils/getRoutingRecueilDemande";
import { useAuth } from "@/utils/security/useAuth";

import { SyntheseSection } from "./synthese/SyntheseSection";

export const MainSection = ({
  demande,
}: {
  demande: (typeof client.infer)["[GET]/demande/:numero"];
}) => {
  const { user } = useAuth();

  return (
    <Flex bg="white" borderRadius={6} p={8} direction="column">
      {isCampagneEnCours(demande.campagne) && (
        <Flex direction={"row"} justify={"space-between"}>
          <Flex direction={"row"} gap={2}>
            {canEditDemandeIntention({ demandeIntention: demande, user }) && (
              <Tooltip label="Modifier la demande">
                <IconButton
                  as={NextLink}
                  href={getRoutingSaisieRecueilDemande({ campagne: demande.campagne, user, suffix: demande?.numero })}
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
