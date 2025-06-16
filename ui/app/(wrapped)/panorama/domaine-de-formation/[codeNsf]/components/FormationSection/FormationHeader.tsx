import { Flex, Heading, HStack } from "@chakra-ui/react";

import type { Formation } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { BadgeFormationRenovee } from "@/components/BadgeFormationRenovee";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";

export const FormationHeader = ({ data, exportButton }: { data: Formation; exportButton?: React.ReactNode }) => {
  return (
    <Flex direction={"column"} gap={4}>
      <HStack justify={"space-between"} align={"center"} spacing={4}>
        <Heading as="h3" fontSize={"20px"} fontWeight={"bold"}>
          {data.libelle}
        </Heading>
        {exportButton}
      </HStack>
      <HStack gap={2}>
        <BadgeTypeFamille typeFamille={data.typeFamille} labelSize="long" size="md" />
        <BadgeFormationRenovee isFormationRenovee={data.isFormationRenovee} size="md" />
      </HStack>
    </Flex>
  );
};
