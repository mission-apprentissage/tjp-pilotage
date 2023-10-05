import { Box, Flex, FormLabel, LightMode, Skeleton } from "@chakra-ui/react";

import { Multiselect } from "../../../../components/Multiselect";
import { Filters, StatsDemandes } from "../types";

export const PrimaryFiltersSection = ({
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
  data?: StatsDemandes;
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
        <Flex borderRadius={4} px={4} py={8} bg="blue.main" h="100%">
          <LightMode>
            <Flex
              justifyContent={"start"}
              flexDirection={"column"}
              gap={4}
              py={3}
            >
              <Flex justifyContent={"start"} gap={4}>
                <Box justifyContent={"start"}>
                  <FormLabel color="white">RENTRÉE SCOLAIRE</FormLabel>
                  <Multiselect
                    onClose={filterTracker("rentreeScolaire")}
                    width={"72"}
                    size="md"
                    variant={"newInput"}
                    onChange={(selected) =>
                      handleFilters("rentreeScolaire", selected)
                    }
                    options={data?.filters.rentreesScolaires}
                    value={activeFilters.rentreeScolaire ?? []}
                  >
                    TOUTES ({data?.filters.rentreesScolaires.length ?? 0})
                  </Multiselect>
                </Box>
                <Box justifyContent={"start"}>
                  <FormLabel color="white">RÉGION</FormLabel>
                  <Multiselect
                    onClose={filterTracker("codeRegion")}
                    width={"72"}
                    size="md"
                    variant={"newInput"}
                    onChange={(selected) =>
                      handleFilters("codeRegion", selected)
                    }
                    options={data?.filters.regions}
                    value={activeFilters.codeRegion ?? []}
                  >
                    TOUTES ({data?.filters.regions.length ?? 0})
                  </Multiselect>
                </Box>
              </Flex>
            </Flex>
          </LightMode>
        </Flex>
      )}
    </>
  );
};
