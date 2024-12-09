import { Flex, Select, Text } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import type { Voie } from "shared";
import { VoieEnum } from "shared";

import type { Filters, FiltersData } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { Multiselect } from "@/components/Multiselect";

const extractVoieOptions = (voies?: Voie[]) => {
  const options = [];

  if (!voies?.length || voies.includes(VoieEnum.scolaire)) {
    options.push({ value: VoieEnum.scolaire, label: "Scolaire" });
  }

  if (!voies?.length || voies.includes(VoieEnum.apprentissage)) {
    options.push({ value: VoieEnum.apprentissage, label: "Apprentissage" });
  }

  if (voies?.includes(VoieEnum.scolaire) && voies?.includes(VoieEnum.apprentissage)) {
    options.push({ value: "all", label: "Toutes" });
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
  const trackEvent = usePlausible();

  const onChangeFilter = (type: keyof Filters, value: string[]) => {
    handleFilters(type, value);
    trackEvent("analyse-detailee-etablissement:interaction", {
      props: {
        type: "filter",
        value: value,
      },
    });
  };

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
          onChange={(selected) => onChangeFilter("codeNiveauDiplome", selected)}
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
        <Select
          value={filters.voie?.[0] ?? "all"}
          onChange={(e) => onChangeFilter("voie", [e.target.value])}
          width="24rem"
        >
          {extractVoieOptions(filtersData?.voies).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Flex>
    </Flex>
  );
};
