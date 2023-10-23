import { Box, Flex, FormLabel, Select, Skeleton } from "@chakra-ui/react";

import { PilotageTransformationStats, TerritoiresFilters } from "../types";

export const FiltersSection = ({
  activeTerritoiresFilters,
  handleTerritoiresFilters,
  isLoading,
  data,
}: {
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
              <FormLabel>Rentrée scolaire</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                placeholder="2024"
                isDisabled={true}
              ></Select>
            </Box>
            <Box justifyContent={"start"}>
              <FormLabel>Région</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.regions ?? ""}
                onChange={(e) =>
                  handleTerritoiresFilters("regions", e.target.value)
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
              <FormLabel>Académie</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.academies ?? ""}
                onChange={(e) =>
                  handleTerritoiresFilters("academies", e.target.value)
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
              <FormLabel>Département</FormLabel>
              <Select
                width={"72"}
                size="md"
                variant="newInput"
                value={activeTerritoiresFilters.departements ?? ""}
                onChange={(e) =>
                  handleTerritoiresFilters("departements", e.target.value)
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
