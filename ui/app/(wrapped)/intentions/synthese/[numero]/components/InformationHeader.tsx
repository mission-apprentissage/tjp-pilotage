import { Box, CloseButton, Collapse, Stack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { hasRole } from "shared";
import type { DemandeStatutType } from "shared/enum/demandeStatutEnum";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { useAuth } from "@/utils/security/useAuth";

export const InformationHeader = ({ statut }: { statut?: DemandeStatutType }) => {
  const { auth } = useAuth();
  const isPerdir = hasRole({ user: auth?.user, role: "perdir" });

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

  const getInformationHeaderStatus = (statut?: DemandeStatutType) => {
    switch (statut) {
      case DemandeStatutEnum["dossier incomplet"]:
        return "warning";
      case DemandeStatutEnum["projet de demande"]:
        return "success";
      case DemandeStatutEnum["prêt pour le vote"]:
        return "success";
      default:
        return "info";
    }
  };
  const getInformationHeaderMessage = (statut?: DemandeStatutType) => {
    switch (statut) {
      case DemandeStatutEnum["dossier incomplet"]:
        return "Dossier incomplet, merci de vous référer aux consignes du gestionnaire";
      case DemandeStatutEnum["projet de demande"]:
        return "La proposition a passé l'étape 1 avec succès !";
      case DemandeStatutEnum["prêt pour le vote"]:
        return "La proposition a passé l'étape 2 avec succès !";
      default:
        return null;
    }
  };

  if (!isPerdir) {
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
            />
          </Stack>
        </Box>
      </VStack>
    </Collapse>
  );
};
