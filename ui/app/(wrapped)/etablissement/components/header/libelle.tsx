import { GridItem, Heading } from "@chakra-ui/react";

import { Informations } from "./types";

export const Libelle = ({ informations }: { informations: Informations }) => {
  return (
    <GridItem colSpan={7}>
      <Heading as="h3" size="lg" fontSize={{ base: "24px", md: "28px" }}>
        {informations?.libelleEtablissement}
      </Heading>
    </GridItem>
  );
};
