import { Button, Flex, Select } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import type { OptionSchema } from "shared/schema/optionSchema";

import type { Filters } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";

export const FiltersSection = ({
  onRegionChange,
  regionOptions,
  academieOptions,
  onAcademieChange,
  departementOptions,
  onDepartementChange,
  resetFilters,
  filters,
}: {
  regionOptions: OptionSchema[];
  onRegionChange: (codeRegion: string) => void;
  academieOptions: OptionSchema[];
  onAcademieChange: (codeAcademie: string) => void;
  departementOptions: OptionSchema[];
  onDepartementChange: (codeDepartement: string) => void;
  resetFilters: () => void;
  filters: Filters;
}) => {
  return (
    <Flex justify="space-between" gap={"1rem"} my={"24px"} align="center">
      <Flex gap={"1rem"} w={"60%"}>
        {/* REGION */}
        <Select
          placeholder="Région: Toutes"
          onChange={(e) => onRegionChange(e.target.value)}
          bgColor={"white"}
          value={filters.codeRegion}
          autoFocus={true}
          borderWidth={"1px"}
          borderStyle={"solid"}
          borderColor={"grey.900"}
          aria-label="Sélectionner une région"
        >
          {regionOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {/* ACADEMIE */}
        <Select
          placeholder="Académie: Toutes"
          onChange={(e) => onAcademieChange(e.target.value)}
          bgColor={"white"}
          value={filters.codeAcademie}
          autoFocus={true}
          borderWidth={"1px"}
          borderStyle={"solid"}
          borderColor={"grey.900"}
          aria-label="Sélectionner une académie"
        >
          {academieOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {/* DEPARTEMENT */}
        <Select
          placeholder="Département: Tous"
          onChange={(e) => onDepartementChange(e.target.value)}
          bgColor={"white"}
          value={filters.codeDepartement}
          autoFocus={true}
          borderWidth={"1px"}
          borderStyle={"solid"}
          borderColor={"grey.900"}
          aria-label="Sélectionner un département"
        >
          {departementOptions?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Flex>
      <Button
        variant="externalLink"
        border={"none"}
        leftIcon={<Icon icon={"ri:refresh-line"} />}
        mt={"auto"}
        onClick={resetFilters}
      >
        Réinitialiser
      </Button>
      <Button
        variant="primary"
        leftIcon={<Icon icon="ri:search-line" height={"16px"} />}
        as={NextLink}
        href="/panorama/domaine-de-formation"
      >
        Rechercher un autre domaine
      </Button>
    </Flex>
  );
};
