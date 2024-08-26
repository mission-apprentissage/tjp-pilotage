"use client";

import { FormLabel, Grid, GridItem, Select } from "@chakra-ui/react";
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
  data,
}: {
  filters: FiltersStatsPilotageIntentions;
  setFilters: (filters: FiltersStatsPilotageIntentions) => void;
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
          placeholder="Choisir une région"
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
          placeholder="Choisir une Académie"
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
          placeholder="Choisir un département"
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
          Diplôme
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
          Domaine (NSF)
        </Multiselect>
      </GridItem>
      {/* <CustomInput label="Statut demandes" />
      <CustomInput
        label="Inclure colorations"
        options={[true, false].map((includeColoration) => ({
          label: _.capitalize(includeColoration ? "Oui" : "Non"),
          value: includeColoration,
        }))}
      />
      <CustomInput label="Secteur Public/Privé" /> */}
    </Grid>
  );
};
