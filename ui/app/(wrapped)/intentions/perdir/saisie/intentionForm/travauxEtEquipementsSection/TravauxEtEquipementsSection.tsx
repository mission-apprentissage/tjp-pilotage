import { Divider, Flex, Heading, Img } from "@chakra-ui/react";
import { RefObject } from "react";

import { SCROLL_OFFSET } from "../../SCROLL_OFFSETS";
import { AchatEquipementDescriptionField } from "./AchatEquipementDescriptionField";
import { AchatEquipementField } from "./AchatEquipementField";
import { CoutEquipementField } from "./CoutEquipementField";
import { TravauxAmenagementDescriptionField } from "./TravauxAmenagementDescriptionField";
import { TravauxAmenagementField } from "./TravauxAmenagementField";
import { TravauxAmenagementParEtablissementField } from "./TravauxAmenagementParEtablissementField";
import { TravauxAmenagementReseauxDescriptionField } from "./TravauxAmenagementReseauxDescriptionField";
import { TravauxAmenagementReseauxField } from "./TravauxAmenagementReseauxField";

export const TravauxEtEquipementsSection = ({
  disabled,
  travauxEtEquipementsRef,
}: {
  disabled: boolean;
  travauxEtEquipementsRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <Flex
      ref={travauxEtEquipementsRef}
      scrollMarginTop={SCROLL_OFFSET}
      direction={"column"}
    >
      <Heading as="h2" fontSize="xl" display={"flex"}>
        <Flex direction={"row"} gap={3}>
          <Img src={"/icons/travauxEtEquipements.svg"} alt="" />
          Travaux et équipements
        </Flex>
      </Heading>
      <Divider pt="4" mb="4" />
      <Flex gap="6" mb="6" direction={"column"}>
        <TravauxAmenagementField disabled={disabled} />
        <TravauxAmenagementDescriptionField disabled={disabled} />
        <TravauxAmenagementParEtablissementField disabled={disabled} />
        <TravauxAmenagementReseauxField disabled={disabled} />
        <TravauxAmenagementReseauxDescriptionField disabled={disabled} />
        <AchatEquipementField disabled={disabled} />
        <AchatEquipementDescriptionField disabled={disabled} />
        <CoutEquipementField disabled={disabled} />
      </Flex>
    </Flex>
  );
};
