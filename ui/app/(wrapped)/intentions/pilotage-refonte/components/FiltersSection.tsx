import {
  Button,
  FormLabel,
  Grid,
  GridItem,
  Select,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import _ from "lodash";
import { ScopeEnum } from "shared";

import { Multiselect } from "../../../../../components/Multiselect";
import {
  FiltersStatsPilotageIntentions,
  StatsPilotageIntentions,
} from "../types";

const findDefaultRentreeScolaireForCampagne = (
  annee: string,
  rentreesScolaires: StatsPilotageIntentions["filters"]["rentreesScolaires"]
) => {
  if (rentreesScolaires) {
    const rentreeScolaire = rentreesScolaires.find(
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
        rentreeScolaire: defaultRentreeScolaire
          ? [defaultRentreeScolaire]
          : undefined,
      };
    }

    // Valeurs par défaut pour les codes
    switch (key) {
      case "codeAcademie":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            scope: ScopeEnum.academie,
          };
        }
        break;
      case "codeRegion":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            scope: ScopeEnum.region,
          };
        }
        break;
      case "codeDepartement":
        if (value !== undefined) {
          newFilters = {
            ...newFilters,
            scope: ScopeEnum.departement,
          };
        }
        break;
    }

    setFilters({ ...filters, ...newFilters });
  };

  return (
    <Grid
      gap="16px"
      paddingTop="16px"
      paddingBottom="8px"
      templateColumns="repeat(6, minmax(0, 1fr))"
      width="100%"
    >
      <GridItem>
        <FormLabel>Campagne</FormLabel>
        <Select
          width={"100%"}
          size="md"
          variant="newInput"
          value={filters.campagne ?? ""}
          onChange={(e) => {
            onUpdateFilter({ key: "campagne", selected: e.target.value });
          }}
          placeholder="Choisir une Campagne"
        >
          {data?.filters.campagnes.map((campagne) => (
            <option key={campagne.value} value={campagne.value}>
              {_.capitalize(campagne.label)}
            </option>
          ))}
        </Select>
      </GridItem>
      <GridItem>
        <FormLabel>Rentrée scolaire</FormLabel>
        <Multiselect
          size="md"
          width={"100%"}
          variant="newInput"
          onChange={(selected) =>
            onUpdateFilter({ key: "rentreeScolaire", selected })
          }
          options={data?.filters.rentreesScolaires}
          value={filters.rentreeScolaire ?? []}
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
          {data?.filters.regions.map((region) => (
            <option key={region.value} value={region.value}>
              {_.capitalize(region.label)}
            </option>
          ))}
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
            onUpdateFilter({ key: "codeAcademie", selected: e.target.value });
          }}
          placeholder="Tous"
        >
          {data?.filters.academies.map((academie) => (
            <option key={academie.value} value={academie.value}>
              {_.capitalize(academie.label)}
            </option>
          ))}
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
          {data?.filters.departements.map((departement) => (
            <option key={departement.value} value={departement.value}>
              {_.capitalize(departement.label)}
            </option>
          ))}
        </Select>
      </GridItem>
      <GridItem>
        <FormLabel>Diplôme</FormLabel>
        <Multiselect
          width={"100%"}
          size="md"
          variant="newInput"
          onChange={(selected) =>
            onUpdateFilter({ key: "codeNiveauDiplome", selected })
          }
          options={data?.filters.diplomes}
          value={filters.codeNiveauDiplome ?? []}
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
          options={data?.filters.libellesNsf}
          value={filters.codeNsf ?? []}
        >
          Tous
        </Multiselect>
      </GridItem>
      <GridItem>
        <FormLabel>Public / Privé</FormLabel>
        <Multiselect
          width={"100%"}
          size="md"
          variant="newInput"
          onChange={(selected) => onUpdateFilter({ key: "secteur", selected })}
          options={data?.filters.secteurFilters}
          value={filters.secteur ?? []}
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
          options={data?.filters.statutFilters}
          value={filters.statut ?? []}
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
  );
};
