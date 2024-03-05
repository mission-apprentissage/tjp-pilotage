import { Container, Flex } from "@chakra-ui/react";

import { Multiselect } from "@/components/Multiselect";

import { FiltersPanoramaFormation } from "../types";
export const FiltersSection = ({
  handleFilters,
  activeFilters,
  libelleNsfOptions,
}: {
  handleFilters: (
    type: keyof FiltersPanoramaFormation,
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation]
  ) => void;
  activeFilters: Partial<FiltersPanoramaFormation>;
  libelleNsfOptions?: { value: string; label: string }[];
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
          onChange={(selected) => handleFilters("codeNsf", selected)}
          width={250}
          options={libelleNsfOptions}
          value={activeFilters.codeNsf ?? []}
          ml="2"
        >
          Domaine de formation (NSF)
        </Multiselect>
      </Flex>
    </Container>
  );
};
