import { Flex, Skeleton } from "@chakra-ui/react";

import type { FiltersRestitutionIntentions, RestitutionIntentions } from "@/app/(wrapped)/intentions/restitution/types";

import { CountersSection } from "./CountersSection";
import { PrimaryFiltersSection } from "./PrimaryFiltersSection";
import { SecondaryFiltersSection } from "./SecondaryFiltersSection";

const Loader = () => (
  <Flex gap={8} flexDirection={"column"}>
    <Flex w="100%" gap={4} mb="8">
      <Flex h="182px" w="100%" gap={4}>
        <Flex minW="532px">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
        <Flex minW="52">
          <Skeleton opacity="0.3" width="100%" height={"100%"}></Skeleton>
        </Flex>
      </Flex>
    </Flex>
    <Flex w="100%" gap={4} mb="8">
      <Flex h="140px" w="100%">
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
}: {
  activeFilters: FiltersRestitutionIntentions;
  handleFilters: (
    type: keyof FiltersRestitutionIntentions,
    value: FiltersRestitutionIntentions[keyof FiltersRestitutionIntentions]
  ) => void;
  filterTracker: (filterName: keyof FiltersRestitutionIntentions) => () => void;
  resetFilters: () => void;
  isLoading: boolean;
  data?: RestitutionIntentions;
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
          <CountersSection stats={data?.stats} />
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
