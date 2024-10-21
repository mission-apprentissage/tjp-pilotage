import { Button, Flex, Select } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { OptionSchema } from "shared/schema/optionSchema";

import { SelectNsf } from "../../../../panorama/domaine-de-formation/components/selectNsf";
import { NsfOption, NsfOptions } from "../../types";

export const FiltersSection = ({
  codeRegion,
  onRegionChange,
  regionOptions,
  academieOptions,
  codeAcademie,
  onAcademieChange,
  departementOptions,
  codeDepartement,
  onDepartementChange,
  resetFilters,
  nsfs,
  currentNsfOption,
}: {
  regionOptions: OptionSchema[];
  codeRegion: string;
  onRegionChange: (codeRegion: string) => void;
  academieOptions: OptionSchema[];
  codeAcademie: string;
  onAcademieChange: (codeAcademie: string) => void;
  departementOptions: OptionSchema[];
  codeDepartement: string;
  onDepartementChange: (codeDepartement: string) => void;
  resetFilters: () => void;
  nsfs: NsfOptions;
  currentNsfOption: NsfOption | null;
}) => {
  return (
    <Flex justify="space-between" gap={"1rem"} my={"24px"} align="center">
      <Flex gap={"1rem"} w={"60%"}>
        {/* REGION */}
        <Select
          placeholder="Région: Toutes"
          onChange={(e) => onRegionChange(e.target.value)}
          bgColor={"white"}
          value={codeRegion}
          autoFocus={true}
          borderWidth={"2px"}
          borderColor={"bluefrance.113"}
          borderStyle={"solid"}
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
          value={codeAcademie}
          autoFocus={true}
          borderWidth={"2px"}
          borderColor={"bluefrance.113"}
          borderStyle={"solid"}
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
          value={codeDepartement}
          autoFocus={true}
          borderWidth={"2px"}
          borderColor={"bluefrance.113"}
          borderStyle={"solid"}
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
      <SelectNsf
        defaultNsfs={nsfs}
        defaultSelected={currentNsfOption}
        hideLabel={true}
        w={"25%"}
      />
    </Flex>
  );
};
