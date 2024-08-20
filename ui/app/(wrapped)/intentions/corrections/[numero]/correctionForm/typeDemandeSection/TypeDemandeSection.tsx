import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { Campagne, Intention } from "../types";
import { RentreeScolaireField } from "./RentreeScolaireField";
import { TypeDemandeField } from "./TypeDemandeField";

export const TypeDemandeSection = ({
  demande,
  campagne,
}: {
  demande: Intention;
  campagne?: Campagne;
}) => {
  return (
    <Flex direction={"column"} gap={6}>
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
      <RentreeScolaireField demande={demande} />
      <Divider />
      <TypeDemandeField
        demande={demande}
        campagne={campagne}
        maxWidth="752px"
      />
    </Flex>
  );
};
