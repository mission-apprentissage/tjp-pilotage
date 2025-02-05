"use client";

import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";

import { client } from "@/api.client";
import { withAuth } from "@/utils/security/withAuth";
import { useStateParams } from "@/utils/useFilters";

import { CartoSection } from "./components/CartoSection";
import { EvolutionIndicateursClesSection } from "./components/EvolutionIndicateursClesSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { VueRegionAcademieSection } from "./components/VueRegionAcademieSection";
import type { Filters, FiltersRegions, Order } from "./types";


const usePilotageReformHook = () => {
  const [searchParams, setSearchParams] = useStateParams<{filters: Filters, order: Order}>({
    defaultValues: {
      filters: {},
      order: { order: "asc" },
    },
  });
  const filters = searchParams.filters ?? {};
  const order = searchParams.order ?? { order: "asc" };

  const trackEvent = usePlausible();
  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("pilotage-reforme:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("pilotage-reforme:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setSearchParams({ ...searchParams, order: { order: "desc", orderBy: column } });
      return;
    }
    setSearchParams({
      ...searchParams,
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  const handleFilters = (type: keyof Filters | keyof FiltersRegions, value: Filters[keyof Filters]) => {
    setSearchParams({
      ...searchParams,
      filters: { ...searchParams.filters, [type]: value },
    });
  };

  const { data, isLoading } = client.ref("[GET]/pilotage-reforme/stats").useQuery(
    {
      query: {
        ...searchParams.filters,
      },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const { data: dataRegions, isLoading: isLoadingRegions } = client
    .ref("[GET]/pilotage-reforme/stats/regions")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const isFiltered = filters.codeRegion;

  return {
    filters,
    order,
    handleFilters,
    handleOrder,
    isFiltered,
    data,
    isLoading,
    filterTracker,
    dataRegions,
    isLoadingRegions,
    nationalStats: {
      tauxTransformationCumule: (data?.tauxTransformationCumule ?? 0) / 100,
      tauxPoursuite: (data?.annees[0].scoped.tauxPoursuite ?? 0),
      tauxInsertion: (data?.annees[0].scoped.tauxInsertion ?? 0),
      tauxChomage: (dataRegions?.statsRegions.reduce((acc, region) => acc + (region.tauxChomage ?? 0), 0) ?? 0) / (dataRegions?.statsRegions.length ?? 1),
    }
  };
};

export default withAuth("pilotage_reforme/lecture", function PilotageReforme() {
  const {
    filters,
    order,
    handleFilters,
    handleOrder,
    isFiltered,
    data,
    isLoading,
    filterTracker,
    dataRegions,
    isLoadingRegions,
    nationalStats,
  } = usePilotageReformHook();

  return (
    <Box bg="blueecume.950">
      <Container maxWidth={"container.xl"} py="4">
        <FiltersSection
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          isLoading={isLoading}
          data={data}
        />
        <Box>
          <Flex gap={8} mt={8} flexDirection={["column", null, "row"]}>
            <Box flex={1}>
              <IndicateursClesSection data={data} isLoading={isLoading} />
              <EvolutionIndicateursClesSection
                data={data}
                isLoading={isLoading}
                isFiltered={isFiltered}
                codeRegion={filters.codeRegion}
              />
            </Box>
            <CartoSection
              data={dataRegions}
              isLoading={isLoadingRegions}
              activeFilters={filters}
              handleFilters={handleFilters}
            ></CartoSection>
          </Flex>
          <SimpleGrid spacing={5} columns={[1]} mt={14}>
            <VueRegionAcademieSection
              data={dataRegions}
              order={order}
              isLoading={isLoadingRegions}
              handleOrder={handleOrder}
              codeRegion={filters.codeRegion}
              nationalStats={nationalStats}
            />
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
});
