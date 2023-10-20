import { Box, Flex, FormLabel, Select, Skeleton } from "@chakra-ui/react";

import {
  Filters,
  PilotageTransformationStats,
  TerritoiresFilters,
} from "../types";

export const FiltersSection = ({
  activeFilters,
  handleFilters,
  activeTerritoiresFilters,
  handleTerritoiresFilters,
  isLoading,
  data,
}: {
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  activeTerritoiresFilters: TerritoiresFilters;
  handleTerritoiresFilters: (
    type: keyof TerritoiresFilters,
    value: TerritoiresFilters[keyof TerritoiresFilters]
  ) => void;
  isLoading: boolean;
  data?: PilotageTransformationStats;
}) => {
  return (
    <>
      {isLoading ? (
        <Box height={24}>
          <Skeleton
            opacity="0.3"
            width="100%"
            height={"100%"}
            py={4}
            px={8}
          ></Skeleton>
        </Box>
      ) : (
        <Box borderRadius={4}>
          <Flex justifyContent={"start"} gap={8} py={3}>
            <Box justifyContent={"start"}>
              <FormLabel>Rentrées scolaires</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeFilters.rentreeScolaire ?? ""}
                onChange={(e) =>
                  handleFilters(
                    "rentreeScolaire",
                    Number.parseInt(e.target.value)
                  )
                }
                placeholder="TOUTES"
              >
                <option value={"2024"}>2024</option>
                <option value={"2025"}>2025</option>
                <option value={"2026"}>2026</option>
                <option value={"2027"}>2027</option>
              </Select>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Régions</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.codeRegion ?? ""}
                onChange={(e) =>
                  handleTerritoiresFilters("codeRegion", e.target.value)
                }
                placeholder="TOUTES"
              >
                {data?.filters?.regions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Académies</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.codeAcademie ?? ""}
                onChange={(e) =>
                  handleTerritoiresFilters("codeAcademie", e.target.value)
                }
                placeholder="TOUTES"
              >
                {data?.filters?.academies?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Départements</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.codeDepartement ?? ""}
                onChange={(e) =>
                  handleTerritoiresFilters("codeDepartement", e.target.value)
                }
                placeholder="TOUS"
              >
                {data?.filters?.departements?.map((option) => (
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
