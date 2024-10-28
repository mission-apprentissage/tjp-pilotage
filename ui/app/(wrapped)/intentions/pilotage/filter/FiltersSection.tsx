import { Box, Button, Flex, FormLabel, Grid, GridItem, Select, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import _ from "lodash";
import { ScopeEnum } from "shared";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type {
  FiltersStatsPilotageIntentions,
  StatsPilotageIntentions,
} from "@/app/(wrapped)/intentions/pilotage/types";
import { getStickyNavHeight } from "@/app/(wrapped)/utils/getStickyNavOffset";
import { Multiselect } from "@/components/Multiselect";
import { TooltipIcon } from "@/components/TooltipIcon";
import { themeDefinition } from "@/theme/theme";

const findDefaultRentreeScolaireForCampagne = (
  annee: string,
  rentreesScolaires: StatsPilotageIntentions["filters"]["rentreesScolaires"]
) => {
  if (rentreesScolaires) {
    const rentreeScolaire = rentreesScolaires.find(
      // @ts-expect-error TODO
      (r) => parseInt(r.value) === parseInt(annee) + 1
    );

    if (rentreeScolaire) return rentreeScolaire.value;
  }

  return undefined;
};

export const FiltersSection = ({
  filters,
  setFilters,
  setDefaultFilters,
  data,
}: {
  filters: FiltersStatsPilotageIntentions;
  setFilters: (filters: FiltersStatsPilotageIntentions) => void;
  setDefaultFilters: () => void;
  data: StatsPilotageIntentions | undefined;
}) => {
  const { openGlossaire } = useGlossaireContext();
  const onUpdateFilter = <T,>({
    key,
    selected,
  }: {
    key: keyof FiltersStatsPilotageIntentions;
    selected: T | T[] | null;
  }) => {
    let value = undefined;

    if (selected instanceof Array) {
      value = selected as Array<T>;
    } else if (selected !== null && selected !== undefined) {
      value = selected as T;
    } else {
      value = undefined;
    }

    let newFilters: Partial<FiltersStatsPilotageIntentions> = {
      [key]: value,
    };

    if (key === "campagne" && typeof value === "string") {
      const defaultRentreeScolaire = findDefaultRentreeScolaireForCampagne(
        value,
        data?.filters?.rentreesScolaires ?? []
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
      zIndex={"sticky"}
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
          <FormLabel>Campagne</FormLabel>
          <Select
            width={"100%"}
            size="md"
            variant="newInput"
            value={filters.campagne ?? ""}
            data-has-value={!!filters.campagne}
            onChange={(e) => {
              onUpdateFilter({ key: "campagne", selected: e.target.value });
            }}
            placeholder="Choisir une campagne"
          >
            {data?.filters.campagnes.map(
              // @ts-expect-error TODO
              (campagne) => (
                <option key={campagne.value} value={campagne.value}>
                  {_.capitalize(campagne.label)}
                </option>
              )
            )}
          </Select>
        </GridItem>
        <GridItem>
          <FormLabel>Rentrée scolaire</FormLabel>
          <Multiselect
            size="md"
            width={"100%"}
            variant="newInput"
            onChange={(selected) => onUpdateFilter({ key: "rentreeScolaire", selected })}
            options={data?.filters.rentreesScolaires}
            value={filters.rentreeScolaire ?? []}
            gutter={0}
            menuZIndex={"sticky"}
          >
            Rentrée scolaire
          </Multiselect>
        </GridItem>
        <GridItem>
          <FormLabel>Granularité</FormLabel>
          <Select
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
          <FormLabel>Région</FormLabel>
          <Select
            width={"100%"}
            size="md"
            variant="newInput"
            value={filters.codeRegion ?? ""}
            onChange={(e) => {
              onUpdateFilter({ key: "codeRegion", selected: e.target.value });
            }}
            placeholder="Tous"
          >
            {data?.filters.regions.map(
              // @ts-expect-error TODO
              (region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              )
            )}
          </Select>
        </GridItem>
        <GridItem>
          <FormLabel>Académie</FormLabel>
          <Select
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
            {data?.filters.academies.map(
              // @ts-expect-error TODO
              (academie) => (
                <option key={academie.value} value={academie.value}>
                  {academie.label}
                </option>
              )
            )}
          </Select>
        </GridItem>
        <GridItem>
          <FormLabel>Département</FormLabel>
          <Select
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
            {data?.filters.departements.map(
              // @ts-expect-error TODO
              (departement) => (
                <option key={departement.value} value={departement.value}>
                  {departement.label}
                </option>
              )
            )}
          </Select>
        </GridItem>
        <GridItem>
          <FormLabel>Diplôme</FormLabel>
          <Multiselect
            width={"100%"}
            size="md"
            variant="newInput"
            onChange={(selected) => onUpdateFilter({ key: "codeNiveauDiplome", selected })}
            options={data?.filters.niveauxDiplome}
            value={filters.codeNiveauDiplome ?? []}
            gutter={0}
            menuZIndex={"sticky"}
          >
            Tous
          </Multiselect>
        </GridItem>
        <GridItem>
          <FormLabel>Domaine (NSF)</FormLabel>
          <Multiselect
            width={"100%"}
            size="md"
            variant="newInput"
            onChange={(selected) => onUpdateFilter({ key: "codeNsf", selected })}
            options={data?.filters.nsfs}
            value={filters.codeNsf ?? []}
            gutter={0}
            menuZIndex={"sticky"}
          >
            Tous
          </Multiselect>
        </GridItem>
        <GridItem>
          <FormLabel>Statut de la demande</FormLabel>
          <Multiselect
            width={"100%"}
            size="md"
            variant="newInput"
            onChange={(selected) => onUpdateFilter({ key: "statut", selected })}
            options={data?.filters.statuts}
            value={filters.statut ?? []}
            gutter={0}
            menuZIndex={"sticky"}
          >
            Tous
          </Multiselect>
        </GridItem>
        <GridItem>
          <FormLabel>
            Inclure colorations
            <TooltipIcon
              ms={2}
              label={
                <Box>
                  <Text>
                    Dans Orion, à partir de la campagne 2024, on désigne comme “Colorations” le fait de colorer des
                    places existantes sans augmentation de capacité.
                  </Text>
                  <Text mt={4}>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              h={"24px"}
              onClick={() => openGlossaire("coloration")}
            />
          </FormLabel>
          <Select
            width={"100%"}
            size="md"
            variant="newInput"
            value={filters.withColoration}
            onChange={(e) => {
              onUpdateFilter({
                key: "withColoration",
                selected: e.target.value,
              });
            }}
          >
            <option value={"true"}>Oui</option>
            <option value={"false"}>Non</option>
          </Select>
        </GridItem>
        <GridItem>
          <FormLabel>Public / Privé</FormLabel>
          <Multiselect
            width={"100%"}
            size="md"
            variant="newInput"
            onChange={(selected) => onUpdateFilter({ key: "secteur", selected })}
            options={data?.filters.secteurs}
            value={filters.secteur ?? []}
            gutter={0}
            menuZIndex={"sticky"}
          >
            Tous
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
