import { Flex, Skeleton } from "@chakra-ui/react";

import type {
  DemandesRestitution,
  FiltersDemandesRestitution,
  StatsRestitution,
} from "@/app/(wrapped)/demandes/restitution/types";

import { CountersSection } from "./CountersSection";
import { ModeComptabilisationSection } from "./ModeComptabilisationSection";
import { PrimaryFiltersSection } from "./PrimaryFiltersSection";
import { SecondaryFiltersSection } from "./SecondaryFiltersSection";

const Loader = () => (
  <Flex gap={8} direction={"column"} mb={10}>
    <Flex gap={2} direction={"column"}>
      <Flex h="42px" w="100%" gap={4}>
        <Flex minW="490px" />
        <Flex minW="784px">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
      </Flex>
      <Flex w="100%" gap={4}>
        <Flex h="176px" w="100%" gap={4}>
          <Flex minW="490px">
            <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
          </Flex>
          <Flex minW="72">
            <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
          </Flex>
          <Flex minW="72">
            <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
          </Flex>
          <Flex minW="72">
            <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
    <Flex w="100%" gap={4}>
      <Flex h="154px" w="100%">
        <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
      </Flex>
    </Flex>
  </Flex>
);

export const HeaderSection = ({
  activeFilters,
  handleFilters,
  filterTracker,
  resetFilters,
  isLoading,
  data,
  countData,
}: {
  activeFilters: FiltersDemandesRestitution;
  handleFilters: (
    type: keyof FiltersDemandesRestitution,
    value: FiltersDemandesRestitution[keyof FiltersDemandesRestitution]
  ) => void;
  filterTracker: (filterName: keyof FiltersDemandesRestitution) => () => void;
  resetFilters: () => void;
  isLoading: boolean;
  data?: DemandesRestitution;
  countData?: StatsRestitution;
}) => (
  <>
    {isLoading ? (
      <Loader />
    ) : (
      <Flex gap={8} flexDirection={"column"}>
        <Flex gap={4} flexDir={["column", null, "row"]}>
          <PrimaryFiltersSection
            activeFilters={activeFilters}
            handleFilters={handleFilters}
            filterTracker={filterTracker}
            isLoading={isLoading}
            data={data}
          />
          <Flex direction={"column"}>
            <ModeComptabilisationSection
              activeFilters={activeFilters}
              handleFilters={handleFilters}
              filterTracker={filterTracker}
            />
            <CountersSection countData={countData} />
          </Flex>
        </Flex>
        <SecondaryFiltersSection
          activeFilters={activeFilters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          resetFilters={resetFilters}
          data={data}
        />
      </Flex>
    )}
  </>
);
