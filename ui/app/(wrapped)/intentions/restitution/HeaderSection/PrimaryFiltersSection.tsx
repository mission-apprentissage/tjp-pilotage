// @ts-nocheck -- TODO

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
  Skeleton,
  Tag,
  Text,
} from "@chakra-ui/react";

import type { FiltersRestitutionIntentions, RestitutionIntentions } from "@/app/(wrapped)/intentions/restitution/types";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { Multiselect } from "@/components/Multiselect";

export const PrimaryFiltersSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  isLoading,
  data,
}: {
  activeFilters: FiltersRestitutionIntentions;
  handleFilters: (
    type: keyof FiltersRestitutionIntentions,
    value: FiltersRestitutionIntentions[keyof FiltersRestitutionIntentions]
  ) => void;
  filterTracker: (filterName: keyof FiltersRestitutionIntentions) => () => void;
  isLoading: boolean;
  data?: RestitutionIntentions;
}) => {
  return (
    <>
      {isLoading ? (
        <Box height={24}>
          <Skeleton opacity="0.3" width="100%" height={"100%"} py={4} px={8}></Skeleton>
        </Box>
      ) : (
        <Flex borderRadius={5} px={4} py={2} mb={2} bg="blueecume.400_hover" h="100%">
          <LightMode>
            <Flex justifyContent={"start"} gap={4} flexDirection={"column"} py={3} w="100%">
              <Flex gap={4}>
                <Box justifyContent={"start"}>
                  <FormLabel color="white">CAMPAGNE</FormLabel>
                  <Flex direction={"column"} gap={1}>
                    <Menu gutter={0} matchWidth={true} autoSelect={false}>
                      <MenuButton
                        as={Button}
                        variant={"selectButton"}
                        rightIcon={<ChevronDownIcon />}
                        width={[null, null, "64"]}
                        size="md"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="grey.900"
                        bg={"white"}
                      >
                        <Flex direction="row">
                          <Text my={"auto"}>
                            {data?.filters.campagnes?.find((c) => c.value === activeFilters.campagne)?.value ?? ""}
                          </Text>
                          {activeFilters.campagne && (
                            <CampagneStatutTag
                              statut={data?.filters.campagnes?.find((c) => c.value === activeFilters.campagne)?.statut}
                            />
                          )}
                        </Flex>
                      </MenuButton>
                      <MenuList py={0} borderTopRadius={0}>
                        {data?.filters.campagnes?.map((campagne) => (
                          <MenuItem
                            p={2}
                            key={campagne.value}
                            onClick={() => handleFilters("campagne", campagne.value)}
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
                  <Flex direction={"column"} gap={1}>
                    <Menu gutter={0} matchWidth={true} autoSelect={false}>
                      <MenuButton
                        as={Button}
                        variant={"selectButton"}
                        rightIcon={<ChevronDownIcon />}
                        width={[null, null, "64"]}
                        size="md"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="grey.900"
                        bg={"white"}
                      >
                        <Flex direction="row">
                          <Text my={"auto"}>
                            {data?.filters.rentreesScolaires?.find((c) => c.value === activeFilters.rentreeScolaire)
                              ?.value ?? `Toutes (${data?.filters.rentreesScolaires?.length})`}
                          </Text>
                          {(activeFilters.rentreeScolaire ===
                            data?.filters.campagnes?.find((c) => c.value === activeFilters.campagne)?.value ??
                            "") && (
                            <Tag mx={3} colorScheme="red">
                              Ajustement RS {activeFilters.rentreeScolaire}
                            </Tag>
                          )}
                        </Flex>
                      </MenuButton>
                      <MenuList py={0} borderTopRadius={0}>
                        <MenuItem p={2} onClick={() => handleFilters("rentreeScolaire", undefined)}>
                          <Flex direction="row">
                            <Text my={"auto"}>{`Toutes (${data?.filters.rentreesScolaires?.length})`}</Text>
                          </Flex>
                        </MenuItem>
                        {data?.filters.rentreesScolaires?.map(
                          // @ts-expect-error TODO
                          (rentreeScolaire) => (
                            <MenuItem
                              p={2}
                              key={rentreeScolaire.value}
                              onClick={() => handleFilters("rentreeScolaire", rentreeScolaire.value)}
                            >
                              <Flex direction="row">
                                <Text my={"auto"}>{rentreeScolaire.label}</Text>
                                {
                                  // @ts-expect-error TODO
                                  (rentreeScolaire.value ===
                                    data?.filters.campagnes?.find(
                                      // @ts-expect-error TODO
                                      (c) => c.value === activeFilters.campagne
                                    )?.value ??
                                    "") && (
                                    <Tag mx={3} colorScheme="red">
                                      Ajustement RS {rentreeScolaire.value}
                                    </Tag>
                                  )
                                }
                              </Flex>
                            </MenuItem>
                          )
                        )}
                      </MenuList>
                    </Menu>
                  </Flex>
                </Box>
              </Flex>
              <Flex gap={4} display={["none", null, "flex"]}>
                <Box justifyContent={"start"} flex={1}>
                  <FormLabel color="white">RÉGION</FormLabel>
                  <Multiselect
                    onClose={filterTracker("codeRegion")}
                    width={["100%", null, "64"]}
                    size="md"
                    variant={"newInput"}
                    onChange={(selected) => handleFilters("codeRegion", selected)}
                    options={data?.filters.regions}
                    value={activeFilters.codeRegion ?? []}
                  >
                    Toutes ({data?.filters.regions.length ?? 0})
                  </Multiselect>
                </Box>
                <Box justifyContent={"start"}>
                  <FormLabel color="white">ACADÉMIE</FormLabel>
                  <Multiselect
                    onClose={filterTracker("codeAcademie")}
                    width={"64"}
                    size="md"
                    variant={"newInput"}
                    onChange={(selected) => handleFilters("codeAcademie", selected)}
                    options={data?.filters.academies}
                    value={activeFilters.codeAcademie ?? []}
                    disabled={data?.filters.academies.length === 0}
                  >
                    Toutes ({data?.filters.academies.length ?? 0})
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
