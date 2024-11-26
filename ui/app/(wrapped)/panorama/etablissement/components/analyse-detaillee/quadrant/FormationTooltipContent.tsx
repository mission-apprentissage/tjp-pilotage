"use client";
import { Box, Flex, Text } from "@chakra-ui/react";

import type { Formation } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { GraphWrapper } from "@/components/GraphWrapper";

export const FormationTooltipContent = ({
  formation,
}: {
  formation: Formation & {
    effectif?: number;
    tauxPression?: number;
    continuum?: {
      cfd: string;
      libelle: string;
    };
    tauxInsertion?: number;
    tauxPoursuite?: number;
    tauxInsertionRegional?: number;
    tauxPoursuiteRegional?: number;
  };
}) => (
  <Box bg="white" fontSize="12">
    <Text fontSize={12} fontWeight={700} mb={6} textTransform={"uppercase"}>
      {formation.libelleFormation}
    </Text>
    <Text mb={1} fontWeight="medium">
      Taux d'emploi :
    </Text>
    <GraphWrapper mb={1} w="100%" continuum={formation.continuum} value={formation.tauxInsertion} />
    <GraphWrapper mb={1} w="100%" continuum={formation.continuum} value={formation.tauxInsertionRegional} outlined />
    <Text mb={1} mt={4} fontWeight="medium">
      Taux de poursuite d'études :
    </Text>
    <GraphWrapper w="100%" mb={1} continuum={formation.continuum} value={formation.tauxPoursuite} />
    <GraphWrapper w="100%" mb={1} continuum={formation.continuum} value={formation.tauxPoursuiteRegional} outlined />
    <Flex direction="row" justify={"flex-end"} gap={2} mt={6}>
      <Box borderRadius="4px" bgColor={"bluefrance.525"} w={4} h={4} />
      <Text fontSize={12} fontWeight={700} lineHeight={4}>
        Établissement
      </Text>
      <Box
        borderRadius="4px"
        bgColor={"transparent"}
        borderWidth={2}
        borderColor={"bluefrance.525"}
        w={4}
        h={4}
        ms={2}
      />
      <Text fontSize={12} fontWeight={700} lineHeight={4}>
        Région
      </Text>
    </Flex>
  </Box>
);
