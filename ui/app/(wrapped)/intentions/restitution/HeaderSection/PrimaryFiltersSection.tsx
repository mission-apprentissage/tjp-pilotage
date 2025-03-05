import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Tag,
  Text,
} from "@chakra-ui/react";

import type {
  DemandesRestitutionIntentions,
  FiltersDemandesRestitutionIntentions,
} from "@/app/(wrapped)/intentions/restitution/types";
import { CampagneStatutTag } from "@/components/CampagneStatutTag";
import { Multiselect } from "@/components/Multiselect";

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
  filterTracker: (filterName: keyof FiltersDemandesRestitutionIntentions) => () => void;
  isLoading: boolean;
  data?: DemandesRestitutionIntentions;
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
                  <Text color="white" mb={2} fontWeight={500}>CAMPAGNE</Text>
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
                        <Flex direction="row" gap={2}>
                          <Text my={"auto"}>
                            {data?.filters.campagnes?.find((campagne) => campagne.annee === activeFilters.campagne)?.annee ?? ""}
                          </Text>
                          {activeFilters.campagne && (
                            <CampagneStatutTag
                              statut={
                                data?.filters.campagnes?.find(
                                  (campagne) => campagne.annee === activeFilters.campagne
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
                            key={campagne.annee}
                            onClick={() => handleFilters("campagne", campagne.annee)}
                          >
                            <Flex direction="row" gap={2}>
                              <Text my={"auto"}>Campagne {campagne.annee}</Text>
                              <CampagneStatutTag statut={campagne.statut} />
                            </Flex>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  </Flex>
                </Box>
                <Box justifyContent={"start"} flex={1}>
                  <Text color="white" mb={2} fontWeight={500}>RENTRÉE SCOLAIRE</Text>
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
                            {
                              data?.filters.rentreesScolaires?.find(
                                (rentreeScolaire) => rentreeScolaire.value === activeFilters.rentreeScolaire)?.value ??
                              `Toutes (${data?.filters.rentreesScolaires?.length})`
                            }
                          </Text>
                          {(
                            activeFilters.rentreeScolaire ===
                              data?.filters.campagnes?.find(
                                (campagne) => campagne.annee === activeFilters.campagne
                              )?.annee
                          )
                            && (
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
                          (rentreeScolaire) => (
                            <MenuItem
                              p={2}
                              key={rentreeScolaire.value}
                              onClick={() => handleFilters("rentreeScolaire", rentreeScolaire.value)}
                            >
                              <Flex direction="row">
                                <Text my={"auto"}>{rentreeScolaire.label}</Text>
                                {
                                  (
                                    rentreeScolaire.value ===
                                    data?.filters.campagnes?.find(
                                      (campagne) => campagne.annee === activeFilters.campagne
                                    )?.annee
                                  ) && (
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
                  <Text color="white" mb={2} fontWeight={500}>RÉGION</Text>
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
                  <Text color="white" mb={2} fontWeight={500}>ACADÉMIE</Text>
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
