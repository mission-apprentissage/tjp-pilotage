import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";

import type { ChiffresEntreeOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";

import { NombreElevesParAnnee } from "./NombreElevesParAnnee";

export const EffectifSection = ({ chiffresEntreeOffre }: { chiffresEntreeOffre?: ChiffresEntreeOffre }) => (
  <Box>
    <Flex direction={"row"} justifyContent={"flex-start"} gap={"8px"} alignItems={"center"} mb={4}>
      <Text fontSize={14} fontWeight={700} textTransform={"uppercase"} lineHeight={"24px"}>
        Nombre d'élèves par année
      </Text>
      <Badge variant="info" maxH={5}>
        Rentrée {CURRENT_RENTREE}
      </Badge>
    </Flex>
    <NombreElevesParAnnee chiffresEntreeOffre={chiffresEntreeOffre} />
  </Box>
);
