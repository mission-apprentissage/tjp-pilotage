import { Box, Flex, FormLabel, Select, Skeleton } from "@chakra-ui/react";

import { Filters, PilotageTransformationStats } from "../types";

export const FiltersSection = ({
  activeFilters,
  handleFilters,
  isLoading,
  data,
}: {
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
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
                {/* {data?.filters.rentreesScolaire?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))} */}
                <option value={"2024"}>2024</option>
                <option value={"2025"}>2025</option>
              </Select>
            </Box>
          </Flex>
        </Box>
      )}
    </>
  );
};
