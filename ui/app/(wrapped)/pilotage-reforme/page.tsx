"use client";

import { Box, Container, Flex, SimpleGrid } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useState } from "react";

import { client } from "@/api.client";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";
import { withAuth } from "@/utils/security/withAuth";

import { CartoSection } from "./components/CartoSection";
import { EvolutionIndicateursClesSection } from "./components/EvolutionIndicateursClesSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { VueRegionAcademieSection } from "./components/VueRegionAcademieSection";
import type { Filters, FiltersRegions, IndicateurType, Order } from "./types";

export default withAuth("pilotage_reforme/lecture", function PilotageReforme() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    order?: Partial<Order>;
  } = qs.parse(queryParams.toString());

  const filters = searchParams.filters ?? {};
  const order = searchParams.order ?? { order: "asc" };

  const setSearchParams = (params: { filters?: typeof filters; order?: typeof order }) => {
    router.replace(createParameterizedUrl(location.pathname, { ...searchParams, ...params }));
  };

  const trackEvent = usePlausible();
  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("pilotage-reforme:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("pilotage-reforme:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setSearchParams({ order: { order: "desc", orderBy: column } });
      return;
    }
    setSearchParams({
      ...filters,
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  const handleFilters = (type: keyof Filters | keyof FiltersRegions, value: Filters[keyof Filters]) => {
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const { data, isLoading } = client.ref("[GET]/pilotage-reforme/stats").useQuery(
    {
      query: {
        ...filters,
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

  const indicateurOptions = [
    {
      label: "Taux d'emploi à 6 mois",
      value: "tauxInsertion",
      isDefault: true,
    },
    {
      label: "Taux de poursuite d'études",
      value: "tauxPoursuite",
      isDefault: false,
    },
  ];

  const [indicateur, setIndicateur] = useState<IndicateurType>("tauxInsertion");

  const handleIndicateurChange = (indicateur: string): void => {
    if (indicateur === "tauxInsertion" || indicateur === "tauxPoursuite") setIndicateur(indicateur);
  };

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
                indicateur={indicateur}
                handleIndicateurChange={handleIndicateurChange}
                indicateurOptions={indicateurOptions}
              />
            </Box>
            <CartoSection
              data={dataRegions}
              isLoading={isLoadingRegions}
              indicateur={indicateur}
              handleIndicateurChange={handleIndicateurChange}
              indicateurOptions={indicateurOptions}
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
            ></VueRegionAcademieSection>
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
});
