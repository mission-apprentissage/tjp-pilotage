import { Box, Flex, FormLabel, Select, Skeleton } from "@chakra-ui/react";

import type { Filters, PilotageReformeStats } from "@/app/(wrapped)/pilotage-reforme/types";
import { Multiselect } from "@/components/Multiselect";

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
        <Box borderRadius={4}>
          <Flex justifyContent={"start"} gap={8} py={3}>
            <Box justifyContent={"start"}>
              <FormLabel>Niveau de diplôme</FormLabel>
              <Multiselect
                onClose={filterTracker("codeNiveauDiplome")}
                width={["12rem", null, "72"]}
                size="md"
                variant="newInput"
                onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
                options={data?.filters.diplomes}
                value={activeFilters.codeNiveauDiplome ?? []}
              >
                TOUS
              </Multiselect>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Régions</FormLabel>
              <Select
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
                {/* @ts-expect-error TODO */}
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
