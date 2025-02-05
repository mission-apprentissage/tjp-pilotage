"use client";

import { Box, Container, Flex, SimpleGrid, useDisclosure } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import { useMemo } from "react";

import { client } from "@/api.client";
import { withAuth } from "@/utils/security/withAuth";
import { useStateParams } from "@/utils/useFilters";

import { CartoSection } from "./components/CartoSection";
import { DefinitionTauxTransformationCumuleModal } from "./components/DefinitionTauxTransformationCumuleModal";
import { EmptyDataBoard } from "./components/EmptyDataBoard";
import { EvolutionIndicateursClesSection } from "./components/EvolutionIndicateursClesSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { VueRegionAcademieSection } from "./components/VueRegionAcademieSection";
import type { Filters, FiltersRegions, Order } from "./types";


const usePilotageReformeHook = () => {
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const [searchParams, setSearchParams] = useStateParams<{filters: Filters, order: Order}>({
    defaultValues: {
      filters: {},
      order: { order: "asc" },
    },
  });
  const filters = searchParams.filters ?? {};
  const order = searchParams.order ?? { order: "asc", orderBy: 'libelleRegion' };

  const trackEvent = usePlausible();
  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("suivi-impact:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("suivi-impact:ordre", { props: { colonne: column } });
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

  const { data, isLoading } = client.ref("[GET]/suivi-impact/stats").useQuery(
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
    .ref("[GET]/suivi-impact/stats/regions")
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

  const displayEmptyDataBoard = useMemo(() => {
    return filters.codeNiveauDiplome && ["381", "481", "581", "241", "561", "461"].includes(filters.codeNiveauDiplome);
  }, [filters.codeNiveauDiplome]);

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
    nationalStats: data?.national,
    isModalOpen,
    onModalOpen,
    onModalClose,
    displayEmptyDataBoard
  };
};

export default withAuth("suivi-impact/lecture", function PilotageReforme() {
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
    isModalOpen,
    onModalOpen,
    onModalClose,
    displayEmptyDataBoard
  } = usePilotageReformeHook();

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
        {displayEmptyDataBoard ? (
          <EmptyDataBoard />
        ): (
          <Box>
            <Flex gap={8} mt={8} flexDirection={["column", null, "row"]}>
              <Box flex={1}>
                <IndicateursClesSection data={data} isLoading={isLoading} onModalOpen={onModalOpen} />
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
              />
            </Flex>
            <SimpleGrid spacing={5} columns={[1]} mt={14}>
              <VueRegionAcademieSection
                data={dataRegions}
                order={order}
                isLoading={isLoadingRegions}
                handleOrder={handleOrder}
                codeRegion={filters.codeRegion}
                nationalStats={nationalStats}
                onModalOpen={onModalOpen}
              />
            </SimpleGrid>
          </Box>
        )}
      </Container>
      <DefinitionTauxTransformationCumuleModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        rentreesScolaire={data?.rentreesScolaire ?? []}
      />
    </Box>
  );
});
