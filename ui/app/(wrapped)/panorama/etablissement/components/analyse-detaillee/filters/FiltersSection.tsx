import { Flex, Text } from "@chakra-ui/react";

import { Multiselect } from "@/components/Multiselect";

import { AnalyseDetaillee, Filters } from "../types";
export const FiltersSection = ({
  data,
  filters,
  handleFilters,
  filterTracker,
}: {
  data?: AnalyseDetaillee;
  filters: Filters;
  handleFilters: (key: keyof Filters, value: string[]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
}) => {
  return (
    <Flex direction={"column"} gap={4}>
      <Text fontSize={14} fontWeight={400} lineHeight={"24px"}>
        Diplôme
      </Text>
      <Multiselect
        onClose={filterTracker("codeNiveauDiplome")}
        width="24rem"
        variant={"newInput"}
        onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
        options={data?.filters.diplomes ?? []}
        value={filters.codeNiveauDiplome ?? []}
      >
        Tous
      </Multiselect>
    </Flex>
  );
};
