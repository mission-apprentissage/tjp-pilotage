import { Badge, Flex, Heading, HStack } from "@chakra-ui/react";

import type { Formation } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";
import type { TypeFamilleKeys } from "@/components/BadgeTypeFamille";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";

export const FormationHeader = ({ data }: { data: Formation }) => {
  return (
    <Flex direction={"column"} gap={4}>
      <Heading as="h3" fontSize={"20px"} fontWeight={"bold"}>
        {data.libelle}
      </Heading>
      <HStack gap={2}>
        <BadgeTypeFamille typeFamille={data.typeFamille as TypeFamilleKeys} labelSize="long" size="md" />
        {data.isTransitionEcologique && (
          <Badge size="md" variant={"success"}>
            Transition écologique
          </Badge>
        )}
        {data.isTransitionDemographique && (
          <Badge size="md" variant={"success"}>
            Transition démographique
          </Badge>
        )}
        {data.isTransitionNumerique && (
          <Badge size="md" variant={"success"}>
            Transition numérique
          </Badge>
        )}
      </HStack>
    </Flex>
  );
};
