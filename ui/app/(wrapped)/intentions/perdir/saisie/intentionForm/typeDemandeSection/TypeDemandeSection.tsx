import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { RefObject } from "react";

import { SCROLL_OFFSET } from "../../SCROLL_OFFSETS";
import { Campagne } from "../../types";
import { CapaciteSection } from "./capaciteSection/CapaciteSection";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";
export const TypeDemandeSection = ({
  disabled,
  campagne,
  typeDemandeRef,
}: {
  disabled: boolean;
  campagne?: Campagne;
  typeDemandeRef: RefObject<HTMLDivElement>;
}) => {
  return (
    <Flex
      ref={typeDemandeRef}
      scrollMarginTop={SCROLL_OFFSET}
      direction={"column"}
      gap={6}
    >
      <Heading as="h2" fontSize="xl">
        <Flex direction={"row"} gap={3}>
          <Icon
            icon="ri:article-line"
            color="black"
            style={{ marginTop: "auto" }}
          />
          Type de demande
        </Flex>
      </Heading>
      <Divider />
      <RentreeScolaireField disabled={disabled} campagne={campagne} />
      <TypeDemandeField disabled={disabled} />
      <CapaciteSection disabled={disabled} />
    </Flex>
  );
};
