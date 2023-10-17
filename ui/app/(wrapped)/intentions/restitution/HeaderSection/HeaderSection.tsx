import { Flex, Skeleton } from "@chakra-ui/react";

import { CountStatsDemandes, Filters, StatsDemandes } from "../types";
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
  isLoading,
  data,
  countData,
}: {
  activeFilters: Filters;
  handleFilters: (type: keyof Filters, value: Filters[keyof Filters]) => void;
  filterTracker: (filterName: keyof Filters) => () => void;
  isLoading: boolean;
  data?: StatsDemandes;
  countData?: CountStatsDemandes;
}) => (
  <>
    {isLoading ? (
      <Loader />
    ) : (
      <Flex gap={8} flexDirection={"column"}>
        <Flex gap={4}>
          <PrimaryFiltersSection
            activeFilters={activeFilters}
            handleFilters={handleFilters}
            filterTracker={filterTracker}
            isLoading={isLoading}
            data={data}
          />
          <Flex flexDirection={"row"} gap={4} overflowY={"auto"} pb={2}>
            <CountersSection countData={countData} />
          </Flex>
        </Flex>
        <SecondaryFiltersSection
          activeFilters={activeFilters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          data={data}
        />
      </Flex>
    )}
  </>
);
