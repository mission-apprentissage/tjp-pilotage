import {
  Box,
  Flex,
  FormLabel,
  LightMode,
  Select,
  Skeleton,
} from "@chakra-ui/react";

import { Multiselect } from "../../../../../components/Multiselect";
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
        <Flex
          borderRadius={5}
          px={4}
          py={2}
          mb={2}
          bg="blueecume.400_hover"
          h="100%"
        >
          <LightMode>
            <Flex
              justifyContent={"start"}
              flexDirection={"column"}
              gap={4}
              py={3}
            >
              <Flex justifyContent={"start"} gap={4} flexDirection={"column"}>
                <Flex gap={4}>
                  <Box justifyContent={"start"}>
                    <FormLabel color="white">RENTRÉE SCOLAIRE</FormLabel>
                    <Select
                      width={"72"}
                      size="md"
                      variant={"newInput"}
                      value={activeFilters.rentreeScolaire?.toString() ?? ""}
                      onChange={(e) =>
                        handleFilters("rentreeScolaire", e.target.value)
                      }
                      placeholder="TOUTES"
                    >
                      {data?.filters.rentreesScolaires?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
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
                <Flex gap={4}>
                  <Box justifyContent={"start"}>
                    <FormLabel color="white">ACADÉMIE</FormLabel>
                    <Multiselect
                      onClose={filterTracker("codeAcademie")}
                      width={"72"}
                      size="md"
                      variant={"newInput"}
                      onChange={(selected) =>
                        handleFilters("codeAcademie", selected)
                      }
                      options={data?.filters.academies}
                      value={activeFilters.codeAcademie ?? []}
                      disabled={data?.filters.academies.length === 0}
                    >
                      TOUTES ({data?.filters.academies.length ?? 0})
                    </Multiselect>
                  </Box>
                  <Box justifyContent={"start"}>
                    <FormLabel color="white">DÉPARTEMENT</FormLabel>
                    <Multiselect
                      onClose={filterTracker("codeDepartement")}
                      width={"72"}
                      size="md"
                      variant={"newInput"}
                      onChange={(selected) =>
                        handleFilters("codeDepartement", selected)
                      }
                      options={data?.filters.departements}
                      value={activeFilters.codeDepartement ?? []}
                      disabled={data?.filters.departements.length === 0}
                    >
                      TOUS ({data?.filters.departements.length ?? 0})
                    </Multiselect>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </LightMode>
        </Flex>
      )}
    </>
  );
};
