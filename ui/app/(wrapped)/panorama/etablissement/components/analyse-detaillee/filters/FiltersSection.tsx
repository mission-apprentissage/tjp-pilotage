import { Flex, Text } from "@chakra-ui/react";
import { Voie, VoieEnum } from "shared";

import { Multiselect } from "@/components/Multiselect";

import { Filters, FiltersData } from "../types";

const extractVoieOptions = (voies?: Voie[]) => {
  const options = [];

  if (!voies?.length || voies.includes(VoieEnum.scolaire)) {
    options.push({ value: VoieEnum.scolaire, label: "Scolaire" });
  }

  if (!voies?.length || voies.includes(VoieEnum.apprentissage)) {
    options.push({ value: VoieEnum.apprentissage, label: "Apprentissage" });
  }

  return options;
};

export const FiltersSection = ({
  filtersData,
  filters,
  handleFilters,
  filterTracker,
}: {
  filtersData?: FiltersData;
  filters: Filters;
  handleFilters: (key: keyof Filters, value: string[]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
}) => {
  return (
    <Flex gap={"16px"} mt={"24px"} mb={"-12px"}>
      <Flex direction={"column"} gap={"8px"}>
        <Text fontSize={14} fontWeight={400} lineHeight={"24px"}>
          Diplôme
        </Text>
        <Multiselect
          onClose={filterTracker("codeNiveauDiplome")}
          width="24rem"
          variant={"newInput"}
          onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
          options={filtersData?.diplomes ?? []}
          value={filters.codeNiveauDiplome ?? []}
          size="md"
        >
          Tous
        </Multiselect>
      </Flex>

      <Flex direction={"column"} gap={"8px"}>
        <Text fontSize={14} fontWeight={400} lineHeight={"24px"}>
          Voie
        </Text>
        <Multiselect
          onClose={filterTracker("voie")}
          width="20rem"
          variant={"newInput"}
          onChange={(selected) => handleFilters("voie", selected)}
          options={extractVoieOptions(filtersData?.voies)}
          value={filters.voie ?? []}
          size="md"
        >
          Toutes
        </Multiselect>
      </Flex>
    </Flex>
  );
};
