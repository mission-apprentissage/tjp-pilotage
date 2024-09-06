import { Flex } from "@chakra-ui/react";

import { FiltersSection } from "@/app/(wrapped)/intentions/pilotage-refonte/components/FiltersSection";

import {
  FiltersStatsPilotageIntentions,
  StatsPilotageIntentions,
} from "../types";

export const HeaderSection = ({
  filters,
  setFilters,
  data,
}: {
  filters: FiltersStatsPilotageIntentions;
  setFilters: (filters: FiltersStatsPilotageIntentions) => void;
  data?: StatsPilotageIntentions;
}) => {
  return (
    <Flex direction={"column"} gap={6}>
      <FiltersSection filters={filters} setFilters={setFilters} data={data} />
      {/* <IndicateursClesSection data={data} filters={filters} /> */}
    </Flex>
  );
};
