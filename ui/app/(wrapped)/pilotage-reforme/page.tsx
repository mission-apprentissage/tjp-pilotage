"use client";

import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useState } from "react";

import { api } from "../../../api.client";
import { createParametrizedUrl } from "../../../utils/createParametrizedUrl";
import { withAuth } from "../../../utils/security/withAuth";
import { CartoSection } from "./components/CartoSection";
import { EvolutionIndicateursClesSection } from "./components/EvolutionIndicateursClesSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { VueRegionAcademieSection } from "./components/VueRegionAcademieSection";
import { Filters, FiltersRegions, IndicateurType, Order } from "./types";

export default withAuth("pilotage_reforme/lecture", function PilotageReforme() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    order?: Partial<Order>;
  } = qs.parse(queryParams.toString());

  const filters = searchParams.filters ?? {};
  const order = searchParams.order ?? { order: "asc" };

  const setSearchParams = (params: {
    filters?: typeof filters;
    order?: typeof order;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
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

  const handleFilters = (
    type: keyof Filters | keyof FiltersRegions,
    value: Filters[keyof Filters]
  ) => {
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const { data, isLoading: isLoading } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["pilotageReforme", filters],
    queryFn: api.getPilotageReformeStats({
      query: {
        ...filters,
      },
    }).call,
  });

  const { data: dataRegions, isLoading: isLoadingRegions } = useQuery({
    keepPreviousData: true,
    staleTime: 10000000,
    queryKey: ["pilotageReformeRegions", filters, order],
    queryFn: api.getPilotageReformeStatsRegions({
      query: {
        ...filters,
        ...order,
      },
    }).call,
  });

  const isFiltered = filters.codeRegion;

  const indicateurOptions = [
    {
      label: "Taux d'emploi à 6 mois",
      value: "insertion",
      isDefault: true,
    },
    {
      label: "Taux de poursuite d'études",
      value: "poursuite",
      isDefault: false,
    },
  ];

  const [indicateur, setIndicateur] = useState<IndicateurType>("insertion");

  const handleIndicateurChange = (indicateur: string): void => {
    if (indicateur === "insertion" || indicateur === "poursuite")
      setIndicateur(indicateur);
  };

  return (
    <Container maxWidth={"100%"} bg="blue.faded">
      <Container maxWidth={"container.xl"} py="4">
        <FiltersSection
          activeFilters={filters}
          handleFilters={handleFilters}
          filterTracker={filterTracker}
          isLoading={isLoading}
          data={data}
        ></FiltersSection>
        <Box>
          <SimpleGrid spacing={8} columns={[2]} mt={8}>
            <Box>
              <IndicateursClesSection
                data={data}
                isLoading={isLoading}
              ></IndicateursClesSection>
              <EvolutionIndicateursClesSection
                data={data}
                isLoading={isLoading}
                isFiltered={isFiltered}
                codeRegion={filters.codeRegion}
                indicateur={indicateur}
                handleIndicateurChange={handleIndicateurChange}
                indicateurOptions={indicateurOptions}
              ></EvolutionIndicateursClesSection>
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
          </SimpleGrid>
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
    </Container>
  );
});
