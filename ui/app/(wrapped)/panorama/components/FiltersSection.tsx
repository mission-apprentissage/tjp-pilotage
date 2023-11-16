import { Container, Flex } from "@chakra-ui/react";

import { Multiselect } from "@/components/Multiselect";

import { FiltersPanoramaFormation } from "../types";
export const FiltersSection = ({
  handleFilters,
  activeFilters,
  libelleFiliereOptions,
}: {
  handleFilters: (
    type: keyof FiltersPanoramaFormation,
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation]
  ) => void;
  activeFilters: Partial<FiltersPanoramaFormation>;
  libelleFiliereOptions?: { value: string; label: string }[];
}) => {
  return (
    <Container
      py="4"
      maxW="container.xl"
      position="sticky"
      bg="white"
      top="0"
      borderBottom="1px solid"
      borderColor="grey.900"
      zIndex="2"
    >
      <Flex justify="flex-end">
        <Multiselect
          onChange={(selected) => handleFilters("libelleFiliere", selected)}
          width={250}
          options={libelleFiliereOptions}
          value={activeFilters.libelleFiliere ?? []}
          ml="2"
        >
          Secteur d’activité
        </Multiselect>
      </Flex>
    </Container>
  );
};
