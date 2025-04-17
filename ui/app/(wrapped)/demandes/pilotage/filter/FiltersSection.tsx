import {ArrowForwardIcon, ChevronDownIcon} from '@chakra-ui/icons';
import {Button, Flex, Grid, GridItem, Highlight, ListItem, Menu, MenuButton, MenuItem, MenuList, Modal,ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, OrderedList, Select, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, VStack} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import _ from "lodash";
import { ScopeEnum } from "shared";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import type {
  FiltersPilotage,
  FilterTracker,
  Pilotage,
} from "@/app/(wrapped)/demandes/pilotage/types";
import { getDefaultRentreeScolaireForAnneeCampagne } from "@/app/(wrapped)/demandes/pilotage/utils";
import { getStickyNavHeight } from "@/app/(wrapped)/utils/getStickyNavOffset";
import {CampagneStatutTag} from '@/components/CampagneStatutTag';
import { Multiselect } from "@/components/Multiselect";
import { TooltipIcon } from '@/components/TooltipIcon';
import { themeDefinition } from "@/theme/theme";

export const FiltersSection = ({
  filters,
  setFilters,
  setDefaultFilters,
  filterTracker,
  data,
  isLoading
}: {
  filters: FiltersPilotage;
  setFilters: (filters: FiltersPilotage) => void;
  setDefaultFilters: () => void;
  filterTracker: FilterTracker;
  data?: Pilotage;
  isLoading?: boolean;
}) => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const onUpdateFilter = <T,>({
    key,
    selected,
  }: {
    key: keyof FiltersPilotage;
    selected: T | T[] | null;
  }) => {
    let value = undefined;

    filterTracker(key, { value });

    if (selected instanceof Array) {
      value = selected as Array<T>;
    } else if (selected !== null && selected !== undefined) {
      value = selected as T;
    } else {
      value = undefined;
    }

    let newFilters: Partial<FiltersPilotage> = {
      [key]: value,
    };

    if (key === "campagne" && typeof value === "string") {
      const defaultRentreeScolaire = getDefaultRentreeScolaireForAnneeCampagne(
        value,
      );
      newFilters = {
        ...newFilters,
        rentreeScolaire: defaultRentreeScolaire ? [defaultRentreeScolaire] : undefined,
      };
    }

    // Valeurs par défaut pour les codes
    switch (key) {
    case "scope":
      if (value === ScopeEnum["région"]) {
        newFilters = {
          ...newFilters,
          codeAcademie: undefined,
          codeDepartement: undefined,
        };
      }
      if (value === ScopeEnum["académie"]) {
        newFilters = {
          ...newFilters,
          codeRegion: undefined,
          codeDepartement: undefined,
        };
      }
      if (value === ScopeEnum["département"]) {
        newFilters = {
          ...newFilters,
          codeRegion: undefined,
          codeAcademie: undefined,
        };
      }
      break;
    case "codeAcademie":
      if (value !== undefined) {
        newFilters = {
          ...newFilters,
          scope: ScopeEnum["académie"],
          codeRegion: undefined,
          codeDepartement: undefined,
        };
      }
      break;
    case "codeRegion":
      if (value !== undefined) {
        newFilters = {
          ...newFilters,
          scope: ScopeEnum["région"],
          codeDepartement: undefined,
          codeAcademie: undefined,
        };
      }
      break;
    case "codeDepartement":
      if (value !== undefined) {
        newFilters = {
          ...newFilters,
          scope: ScopeEnum["département"],
          codeRegion: undefined,
          codeAcademie: undefined,
        };
      }
      break;
    }

    setFilters({ ...filters, ...newFilters });
  };

  return (
    <>
      <Flex
        width="100vw"
        position={"sticky"}
        top={getStickyNavHeight()}
        zIndex={"docked"}
        bgColor="blueecume.950"
        boxShadow={`0px 1px 0px 0px ${themeDefinition.colors.grey[850]}`}
        justify={"center"}
      >
        <Grid
          gap={4}
          mt={4}
          paddingTop={4}
          paddingBottom={3}
          templateColumns="repeat(6, minmax(0, 1fr))"
          w={"container.xl"}
        >
          <GridItem>
            <Text as="label" htmlFor="select-campagne">Campagne</Text>
            <Menu gutter={0} matchWidth={true} autoSelect={false}>
              <MenuButton
                as={Button}
                variant={"selectButton"}
                rightIcon={<ChevronDownIcon />}
                width={"100%"}
                size="md"
                bg={"white"}
                isLoading={isLoading}
              >
                <Flex direction="row" gap={2}>
                  <Text my={"auto"} bgColor="white">
                    {data?.filters.campagnes?.find((campagne) => campagne.annee === filters.campagne)?.annee ?? "Sélectionner une campagne"}
                  </Text>
                  {filters.campagne && (
                    <CampagneStatutTag
                      statut={data?.filters.campagnes?.find((campagne) => campagne.annee === filters.campagne)?.statut}
                    />
                  )}
                </Flex>
              </MenuButton>
              <MenuList py={0}>
                {data?.filters.campagnes?.map((campagne) => (
                  <MenuItem
                    p={2}
                    key={campagne.id}
                    onClick={() => onUpdateFilter({ key: "campagne", selected: campagne.annee })}
                  >
                    <Flex direction="row" gap={2}>
                      <Text my={"auto"}>Campagne {campagne.annee}</Text>
                      <CampagneStatutTag statut={campagne.statut} />
                    </Flex>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </GridItem>
          <GridItem>
            <Text>Rentrée scolaire</Text>
            <Multiselect
              size="md"
              width={"100%"}
              variant="newInput"
              onChange={(selected) => onUpdateFilter({ key: "rentreeScolaire", selected })}
              options={data?.filters.rentreesScolaires}
              value={filters.rentreeScolaire ?? []}
              gutter={0}
            >
            Rentrée scolaire
            </Multiselect>
          </GridItem>
          <GridItem>
            <Text as="label" htmlFor="select-granularite">Granularité</Text>
            <Select
              id="select-granularite"
              width={"100%"}
              size="md"
              variant="newInput"
              value={filters.scope ?? ""}
              onChange={(e) => {
                onUpdateFilter({ key: "scope", selected: e.target.value });
              }}
            >
              {Object.keys(ScopeEnum)
                .filter((s) => s !== ScopeEnum.national)
                .map((scope) => (
                  <option key={scope} value={scope}>
                    {_.capitalize(scope)}
                  </option>
                ))}
            </Select>
          </GridItem>
          <GridItem>
            <Text as="label" htmlFor="select-region">Région</Text>
            <Select
              id="select-region"
              width={"100%"}
              size="md"
              variant="newInput"
              value={filters.codeRegion ?? ""}
              onChange={(e) => {
                onUpdateFilter({ key: "codeRegion", selected: e.target.value });
              }}
              placeholder="Tous"
            >
              {data?.filters.regions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </Select>
          </GridItem>
          <GridItem>
            <Text as="label" htmlFor="select-academie">Académie</Text>
            <Select
              id="select-academie"
              width={"100%"}
              size="md"
              variant="newInput"
              value={filters.codeAcademie ?? ""}
              onChange={(e) => {
                onUpdateFilter({
                  key: "codeAcademie",
                  selected: e.target.value,
                });
              }}
              placeholder="Tous"
            >
              {data?.filters.academies.map((academie) => (
                <option key={academie.value} value={academie.value}>
                  {academie.label}
                </option>
              ))}
            </Select>
          </GridItem>
          <GridItem>
            <Text as="label" htmlFor="select-departement">Département</Text>
            <Select
              id="select-departement"
              width={"100%"}
              size="md"
              variant="newInput"
              value={filters.codeDepartement ?? ""}
              onChange={(e) => {
                onUpdateFilter({
                  key: "codeDepartement",
                  selected: e.target.value,
                });
              }}
              placeholder="Tous"
            >
              {data?.filters.departements.map((departement) => (
                <option key={departement.value} value={departement.value}>
                  {departement.label}
                </option>
              ))}
            </Select>
          </GridItem>
          <GridItem>
            <Text>Diplôme</Text>
            <Multiselect
              width={"100%"}
              size="md"
              variant="newInput"
              onChange={(selected) => onUpdateFilter({ key: "codeNiveauDiplome", selected })}
              options={data?.filters.niveauxDiplome}
              value={filters.codeNiveauDiplome ?? []}
              gutter={0}
            >
            Tous
            </Multiselect>
          </GridItem>
          <GridItem>
            <Text>Domaine (NSF)</Text>
            <Multiselect
              width={"100%"}
              size="md"
              variant="newInput"
              onChange={(selected) => onUpdateFilter({ key: "codeNsf", selected })}
              options={data?.filters.nsfs}
              value={filters.codeNsf ?? []}
              gutter={0}
            >
            Tous
            </Multiselect>
          </GridItem>
          <GridItem>
            <Text>Statut de la demande</Text>
            <Multiselect
              width={"100%"}
              size="md"
              variant="newInput"
              onChange={(selected) => onUpdateFilter({ key: "statut", selected })}
              options={data?.filters.statuts}
              value={filters.statut ?? []}
              gutter={0}
            >
            Tous
            </Multiselect>
          </GridItem>
          <GridItem>
            <Text as="label" htmlFor="select-coloration" fontWeight={500} mb={1}>
            Coloration
              <TooltipIcon
                ms={2}
                label={
                  <Flex gap={4} direction={"column"}>
                    <Text>
                      Le taux de transformation peut être établi avec ou sans considérer les colorations de formation.
                    </Text>
                    <Text>
                      Cliquez pour plus d'infos
                    </Text>
                  </Flex>
                }
                onClick={onOpen}
              />
            </Text>
            <Select
              id="select-coloration"
              width={"100%"}
              size="md"
              variant={"newInput"}
              value={filters.coloration?.toString() ?? ""}
              onChange={(e) => onUpdateFilter({key: "coloration", selected: e.target.value})}
              borderBottomColor={filters.coloration != undefined ? "info.525" : ""}
              placeholder="Avec"
            >
              <option key={"false"} value={"false"}>
              Sans
              </option>
            </Select>
          </GridItem>
          <GridItem>
            <Text>Public / Privé</Text>
            <Multiselect
              width={"100%"}
              size="md"
              variant="newInput"
              onChange={(selected) => onUpdateFilter({ key: "secteur", selected })}
              options={data?.filters.secteurs}
              value={filters.secteur ?? []}
              gutter={0}
            >
            Tous
            </Multiselect>
          </GridItem>
          <GridItem>
            <Text>Formations spécifiques</Text>
            <Multiselect
              width={"100%"}
              size="md"
              variant="newInput"
              onChange={(selected) => onUpdateFilter({ key: "formationSpecifique", selected })}
              options={[
                {
                  label: TypeFormationSpecifiqueEnum["Action prioritaire"],
                  value: TypeFormationSpecifiqueEnum["Action prioritaire"],
                },
                {
                  label: TypeFormationSpecifiqueEnum["Transition démographique"],
                  value: TypeFormationSpecifiqueEnum["Transition démographique"],
                },
                {
                  label: TypeFormationSpecifiqueEnum["Transition écologique"],
                  value: TypeFormationSpecifiqueEnum["Transition écologique"],
                },
                {
                  label: TypeFormationSpecifiqueEnum["Transition numérique"],
                  value: TypeFormationSpecifiqueEnum["Transition numérique"],
                },
              ]}
              hasDefaultValue={false}
              value={filters.formationSpecifique ?? []}
              gutter={0}
            >
            Toutes
            </Multiselect>
          </GridItem>
          <GridItem>
            <VStack width="100%" height="100%" justifyContent="end">
              <Button
                leftIcon={<Icon icon="ri:refresh-line" />}
                variant="ghost"
                color="bluefrance.113"
                onClick={() => setDefaultFilters()}
              >
              Réinitialiser les filtres
              </Button>
            </VStack>
          </GridItem>
        </Grid>
      </Flex>
      <FiltreColorationModal onClose={onClose} isOpen={isOpen} />
    </>
  );
};


const FiltreColorationModal = ({
  onClose,
  isOpen,
} : {
  onClose: () => void;
  isOpen: boolean;
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size={{
      sm: "full",
      lg: "half",
    }}
  >
    <ModalOverlay />
    <ModalContent px="32px" paddingTop="32px" paddingBottom="40px">
      <ModalCloseButton />
      <ModalHeader>
        Taux de transformation sans coloration
      </ModalHeader>
      <ModalBody>
        <Flex direction="column" gap={2} my={3} mx={2}>
          <Text>
            <Highlight
              query={["avec", "sans"]}
              styles={{
                fontWeight: "bold",
              }}
            >
            Le taux de transformation peut être établi avec ou sans
            considérer les colorations de formation.
            </Highlight>
          </Text>
          <Text>
            Dans le cas où les colorations ne sont pas incluses (filtre coloration à «Sans»)
            dans le taux de transformation les impacts sont doubles :
          </Text>
          <OrderedList>
            <ListItem>
              <Highlight
                query={["places colorées ouvertes", "plus considérées"]}
                styles={{
                  fontWeight: "bold",
                }}
              >
              Les places colorées ouvertes ne sont plus considérées dans les places transformées
              </Highlight>
            </ListItem>
            <ListItem>
              <Highlight
                query={["places ouvertes non colorées", "réintégrées"]}
                styles={{
                  fontWeight: "bold",
                }}
              >
              Les places ouvertes non colorées (ignorées dans certains cas particuliers* dans
              les demandes faisant l’objet d’une coloration) sont réintégrées dans les places transformées
              </Highlight>
            </ListItem>
          </OrderedList>
          <Text mt={6}>
            <Highlight
              query={["augmentation", "5", "10"]}
              styles={{
                fontWeight: "bold",
              }}
            >
            * exemple : dans le cas d’une demande de type augmentation,
            si on augmente les places ouvertes de 5 et les places colorées ouvertes de 10,
            on augmentera les places transformées de 10.
            </Highlight>
          </Text>
          <TableContainer my={3}>
            <Table
              variant={"unstyled"}
              size={"sm"}
              border={"1px solid"}
            >
              <Thead>
                <Tr>
                  <Th border={"1px solid"} textAlign={"center"}>Augmentation de places</Th>
                  <Th border={"1px solid"} textAlign={"center"}>Augmentation de places colorées</Th>
                  <Th border={"1px solid"} textAlign={"center"}>Places transformées</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td border={"1px solid"} textAlign={"center"}>
                    10
                    <ArrowForwardIcon />
                    15
                    (+5)
                  </Td>
                  <Td border={"1px solid"} textAlign={"center"}>
                    0
                    <ArrowForwardIcon />
                    10
                    <Highlight query={"+10"} styles={{textDecoration: "underline"}}> (+10)</Highlight>
                  </Td>
                  <Td border={"1px solid"} textAlign={"center"}>
                    <Highlight query={"+10"} styles={{textDecoration: "underline"}}>+10</Highlight>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Text>
            <Highlight
              query={["5", "10"]}
              styles={{
                fontWeight: "bold",
              }}
            >
            Ainsi, si l’on n’inclut pas la coloration dans les calculs de taux de transformation,
            on réintègrera 5 places dans les places ouvertes incluses dans les places transformées.
            </Highlight>
          </Text>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);
