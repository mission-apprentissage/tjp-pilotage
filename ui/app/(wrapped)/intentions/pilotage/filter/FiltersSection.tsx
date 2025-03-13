import {ChevronDownIcon} from '@chakra-ui/icons';
import {Box, Button, Flex, Grid, GridItem, Menu, MenuButton, MenuItem, MenuList,Select, Text, VStack} from '@chakra-ui/react';
import { Icon } from "@iconify/react";
import _ from "lodash";
import { ScopeEnum } from "shared";
import { TypeFormationSpecifiqueEnum } from "shared/enum/formationSpecifiqueEnum";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type {
  FiltersPilotageIntentions,
  FilterTracker,
  PilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";
import { getDefaultRentreeScolaireForAnneeCampagne } from "@/app/(wrapped)/intentions/pilotage/utils";
import { getStickyNavHeight } from "@/app/(wrapped)/utils/getStickyNavOffset";
import {CampagneStatutTag} from '@/components/CampagneStatutTag';
import { Multiselect } from "@/components/Multiselect";
import { TooltipIcon } from "@/components/TooltipIcon";
import { themeDefinition } from "@/theme/theme";

export const FiltersSection = ({
  filters,
  setFilters,
  setDefaultFilters,
  filterTracker,
  data,
  isLoading
}: {
  filters: FiltersPilotageIntentions;
  setFilters: (filters: FiltersPilotageIntentions) => void;
  setDefaultFilters: () => void;
  filterTracker: FilterTracker;
  data?: PilotageIntentions;
  isLoading?: boolean;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const onUpdateFilter = <T,>({
    key,
    selected,
  }: {
    key: keyof FiltersPilotageIntentions;
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

    let newFilters: Partial<FiltersPilotageIntentions> = {
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
                <Box>
                  <Text>
                    Doit-on considérer ou non les colorations de places dans le taux de transformation ?
                  </Text>
                  <Text mt={4}>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              h={"24px"}
              onClick={() => openGlossaire("coloration")}
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
  );
};
