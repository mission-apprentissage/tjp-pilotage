import {Box, CloseButton, Collapse, Stack, Text, VisuallyHidden,VStack} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import { useState } from "react";
import {hasRole, RoleEnum} from 'shared';
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { useAuth } from "@/utils/security/useAuth";

const getInformationHeaderStatus = (statut: DemandeStatutType) => {
  switch (statut) {
  case DemandeStatutEnum["dossier incomplet"]:
    return "warning";
  case DemandeStatutEnum["projet de demande"]:
    return "success";
  case DemandeStatutEnum["prêt pour le vote"]:
    return "success";
  case DemandeStatutEnum["brouillon"]:
  case DemandeStatutEnum["proposition"]:
  case DemandeStatutEnum["dossier complet"]:
  case DemandeStatutEnum["demande validée"]:
  case DemandeStatutEnum["refusée"]:
  case DemandeStatutEnum["supprimée"]:
  default:
    return "info";
  }
};
const getInformationHeaderMessage = (statut: DemandeStatutType) => {
  switch (statut) {
  case DemandeStatutEnum["dossier incomplet"]:
    return "Dossier incomplet, merci de vous référer aux consignes du gestionnaire";
  case DemandeStatutEnum["projet de demande"]:
    return "La proposition a passé l'étape 1 avec succès !";
  case DemandeStatutEnum["prêt pour le vote"]:
    return "La proposition a passé l'étape 2 avec succès !";
  case DemandeStatutEnum["brouillon"]:
  case DemandeStatutEnum["proposition"]:
  case DemandeStatutEnum["dossier complet"]:
  case DemandeStatutEnum["refusée"]:
  case DemandeStatutEnum["supprimée"]:
  case DemandeStatutEnum["demande validée"]:
  default:
    return null;
  }
};

export const InformationHeader = ({ statut }: { statut: DemandeStatutType }) => {
  const { user } = useAuth();
  const isPerdir = hasRole({ user, role: RoleEnum["perdir"] });

  const bgColors = {
    success: "success.950",
    warning: "orangeTerreBattue.850",
    info: "info.950",
  };

  const colors = {
    success: "info.text",
    warning: "warning.425",
    info: "info.text",
  };

  const [shouldDisplay, setShouldDisplay] = useState(true);

  if (!isPerdir || !getInformationHeaderMessage(statut)) {
    return <></>;
  }

  return (
    <Collapse in={shouldDisplay}>
      <VStack>
        <Box
          backgroundColor={bgColors[getInformationHeaderStatus(statut)]}
          color={colors[getInformationHeaderStatus(statut)]}
          width="100%"
          paddingY={4}
          px={24}
        >
          <Stack
            maxW={"container.xl"}
            margin="auto"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            flexWrap="nowrap"
            spacing={4}
            padding="4px 8px"
          >
            <Icon icon="ri:information-fill" fontSize="24px" />
            <Text
              flexGrow={1}
              fontSize={16}
              fontWeight={700}
              display={{
                base: "none",
                md: "block",
              }}
            >
              {getInformationHeaderMessage(statut)}
            </Text>
            <CloseButton
              onClick={() => {
                setShouldDisplay(false);
              }}
              mb={"auto"}
            >
              <VisuallyHidden>Fermer</VisuallyHidden>
              <Icon icon="ri:close-fill" fontSize="24px" />
            </CloseButton>
          </Stack>
        </Box>
      </VStack>
    </Collapse>
  );
};
