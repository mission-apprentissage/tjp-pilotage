import { Box, Flex, Select, Skeleton, Text } from '@chakra-ui/react';

import type { Filters, PilotageReformeStats } from "@/app/(wrapped)/suivi-impact/types";

export const FiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  isLoading,
  data,
}: {
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
  isLoading: boolean;
  data?: PilotageReformeStats;
}) => {
  return (
    <>
      {isLoading ? (
        <Box height={24}>
          <Skeleton opacity="0.3" width="100%" height={"100%"} py={4} px={8} />
        </Box>
      ) : (
        <Box borderRadius={4} zIndex="9" position="sticky" top={"52px"} left={0} bg="blueecume.950">
          <Flex justifyContent={"start"} gap={8} py={3}>
            <Box justifyContent={"start"}>
              <Text>Niveau de diplôme</Text>
              <Select
                id="select-region"
                width={["12rem", null, "72"]}
                size="md"
                variant="newInput"
                borderBottomColor={activeFilters.codeNiveauDiplome != undefined ? "info.525" : ""}
                value={activeFilters.codeNiveauDiplome ?? ""}
                onChange={(e) => {
                  handleFilters("codeNiveauDiplome", e.target.value);
                  filterTracker("codeNiveauDiplome");
                }}
                placeholder="TOUS"
              >
                {data?.filters.diplomes?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box justifyContent={"start"}>
              <Text as="label" htmlFor="select-region">Régions</Text>
              <Select
                id="select-region"
                width={["12rem", null, "72"]}
                size="md"
                variant="newInput"
                borderBottomColor={activeFilters.codeRegion != undefined ? "info.525" : ""}
                value={activeFilters.codeRegion ?? ""}
                onChange={(e) => {
                  handleFilters("codeRegion", e.target.value);
                  filterTracker("codeRegion");
                }}
                placeholder="TOUTES"
              >
                {data?.filters.regions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};
