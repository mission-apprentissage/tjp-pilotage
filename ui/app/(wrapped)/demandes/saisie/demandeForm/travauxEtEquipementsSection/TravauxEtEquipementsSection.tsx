import { Divider, Flex, Heading, Img } from "@chakra-ui/react";
import type { RefObject } from "react";

import { SCROLL_OFFSET } from "@/app/(wrapped)/demandes/SCROLL_OFFSETS";

import { AchatEquipementCoutField } from "./AchatEquipementCoutField";
import { AchatEquipementDescriptionField } from "./AchatEquipementDescriptionField";
import { AchatEquipementField } from "./AchatEquipementField";
import { TravauxAmenagementCoutField } from "./TravauxAmenagementCoutField";
import { TravauxAmenagementDescriptionField } from "./TravauxAmenagementDescriptionField";
import { TravauxAmenagementField } from "./TravauxAmenagementField";

export const TravauxEtEquipementsSection = ({
  disabled,
  travauxEtEquipementsRef,
}: {
  disabled: boolean;
  travauxEtEquipementsRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <Flex ref={travauxEtEquipementsRef} scrollMarginTop={SCROLL_OFFSET} direction={"column"}>
      <Heading as="h2" fontSize="xl" display={"flex"}>
        <Flex direction={"row"} gap={3}>
          <Img src={"/icons/travauxEtEquipements.svg"} alt="" />
          Travaux et équipements
        </Flex>
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex gap="6" mb="6" direction={"column"}>
        <TravauxAmenagementField disabled={disabled} />
        <TravauxAmenagementCoutField disabled={disabled} />
        <TravauxAmenagementDescriptionField disabled={disabled} />
        <AchatEquipementField disabled={disabled} />
        <AchatEquipementCoutField disabled={disabled} />
        <AchatEquipementDescriptionField disabled={disabled} />
      </Flex>
    </Flex>
  );
};
