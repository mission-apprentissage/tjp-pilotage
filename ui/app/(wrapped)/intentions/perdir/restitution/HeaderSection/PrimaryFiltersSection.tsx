import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Skeleton,
  Text,
} from "@chakra-ui/react";

import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { Multiselect } from "@/components/Multiselect";

import {
  DemandesRestitutionIntentions,
  FiltersDemandesRestitutionIntentions,
} from "../types";

export const PrimaryFiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  isLoading,
  data,
}: {
  activeFilters: FiltersDemandesRestitutionIntentions;
  handleFilters: (
    type: keyof FiltersDemandesRestitutionIntentions,
    value: FiltersDemandesRestitutionIntentions[keyof FiltersDemandesRestitutionIntentions]
  ) => void;
  filterTracker: (
    filterName: keyof FiltersDemandesRestitutionIntentions
  ) => () => void;
  isLoading: boolean;
  data?: DemandesRestitutionIntentions;
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
              gap={4}
              flexDirection={"column"}
              py={3}
              w="100%"
            >
              <Flex gap={4}>
                <Box justifyContent={"start"}>
                  <FormLabel color="white">CAMPAGNE</FormLabel>
                  <Flex direction={"column"} gap={1}>
                    <Menu gutter={0} matchWidth={true} autoSelect={false}>
                      <MenuButton
                        as={Button}
                        variant={"selectButton"}
                        rightIcon={<ChevronDownIcon />}
                        width={[null, null, "72"]}
                        size="md"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="grey.900"
                        bg={"white"}
                      >
                        <Flex direction="row">
                          <Text my={"auto"}>
                            {data?.filters.campagnes?.find(
                              (c) => c.value === activeFilters.campagne
                            )?.value ?? ""}
                          </Text>
                          {activeFilters.campagne && (
                            <CampagneStatutTag
                              statut={
                                data?.filters.campagnes?.find(
                                  (c) => c.value === activeFilters.campagne
                                )?.statut
                              }
                            />
                          )}
                        </Flex>
                      </MenuButton>
                      <MenuList py={0} borderTopRadius={0}>
                        {data?.filters.campagnes?.map((campagne) => (
                          <MenuItem
                            p={2}
                            key={campagne.value}
                            onClick={() =>
                              handleFilters("campagne", campagne.value)
                            }
                          >
                            <Flex direction="row">
                              <Text my={"auto"}>Campagne {campagne.value}</Text>
                              <CampagneStatutTag statut={campagne.statut} />
                            </Flex>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Flex>
                </Box>
                <Box justifyContent={"start"} flex={1}>
                  <FormLabel color="white">RENTRÉE SCOLAIRE</FormLabel>
                  <Select
                    width={[null, null, "72"]}
                    size="md"
                    variant={"newInput"}
                    value={activeFilters.rentreeScolaire?.toString() ?? ""}
                    onChange={(e) =>
                      handleFilters("rentreeScolaire", e.target.value)
                    }
                    borderBottomColor={
                      activeFilters.rentreeScolaire != undefined
                        ? "info.525"
                        : ""
                    }
                    placeholder={`TOUTES (${data?.filters.rentreesScolaires?.length})`}
                  >
                    {data?.filters.rentreesScolaires?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Box>
              </Flex>
              <Flex gap={4} display={["none", null, "flex"]}>
                <Box justifyContent={"start"} flex={1}>
                  <FormLabel color="white">RÉGION</FormLabel>
                  <Multiselect
                    onClose={filterTracker("codeRegion")}
                    width={["100%", null, "72"]}
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
          </LightMode>
        </Flex>
      )}
    </>
  );
};