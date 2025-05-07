import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import type { RefObject } from "react";

import { SCROLL_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";

import { AugmentationCapaciteAccueilHebergementField } from "./AugmentationCapaciteAccueilHebergementField";
import { AugmentationCapaciteAccueilHebergementPlacesField } from "./AugmentationCapaciteAccueilHebergementPlacesField";
import { AugmentationCapaciteAccueilHebergementPrecisionsField } from "./AugmentationCapaciteAccueilHebergementPrecisionsField";
import { AugmentationCapaciteAccueilRestaurationField } from "./AugmentationCapaciteAccueilRestaurationField";
import { AugmentationCapaciteAccueilRestaurationPlacesField } from "./AugmentationCapaciteAccueilRestaurationPlacesField";
import { AugmentationCapaciteAccueilRestaurationPrecisionsField } from "./AugmentationCapaciteAccueilRestaurationPrecisionsField";

export const InternatEtRestaurationSection = ({
  disabled,
  internatEtRestaurationRef,
}: {
  disabled?: boolean;
  internatEtRestaurationRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <Flex ref={internatEtRestaurationRef} scrollMarginTop={SCROLL_OFFSET} direction={"column"}>
      <Heading as="h2" fontSize="xl" display={"flex"}>
        <Flex direction={"row"} gap={3}>
          <Icon icon="ri:restaurant-line" color="black" style={{ marginTop: "auto" }} />
          Internat et restauration
        </Flex>
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex gap="6" mb="6" direction={"column"}>
        <AugmentationCapaciteAccueilHebergementField disabled={disabled} />
        <AugmentationCapaciteAccueilHebergementPlacesField disabled={disabled} />
        <AugmentationCapaciteAccueilHebergementPrecisionsField disabled={disabled} />
        <AugmentationCapaciteAccueilRestaurationField disabled={disabled} />
        <AugmentationCapaciteAccueilRestaurationPlacesField disabled={disabled} />
        <AugmentationCapaciteAccueilRestaurationPrecisionsField disabled={disabled} />
      </Flex>
    </Flex>
  );
};
