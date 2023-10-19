"use client";

import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useState } from "react";

import { api } from "../../../../api.client";
import { createParametrizedUrl } from "../../../../utils/createParametrizedUrl";
import { withAuth } from "../../../../utils/security/withAuth";
import { CartoSection } from "./components/CartoSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { Filters, IndicateurType } from "./types";

export default withAuth(
  "restitution-intentions/lecture",
  function PilotageIntentions() {
    const router = useRouter();
    const queryParams = useSearchParams();
    const searchParams: {
      filters?: Partial<Filters>;
    } = qs.parse(queryParams.toString());

    const filters = searchParams.filters ?? {};

    const setSearchParams = (params: { filters?: typeof filters }) => {
      router.replace(
        createParametrizedUrl(location.pathname, { ...searchParams, ...params })
      );
    };

    const handleFilters = (
      type: keyof Filters,
      value: Filters[keyof Filters]
    ) => {
      setSearchParams({
        filters: { ...filters, [type]: value },
      });
    };

    const { data, isLoading: isLoading } = useQuery({
      keepPreviousData: true,
      staleTime: 10000000,
      queryKey: ["pilotageTransfo", filters],
      queryFn: api.getTransformationStats({
        query: {
          ...filters,
        },
      }).call,
    });

    const indicateurOptions = [
      {
        label: "Taux de transformation",
        value: "tauxTransformation",
        isDefault: true,
      },
    ];

    const [indicateur, setIndicateur] =
      useState<IndicateurType>("tauxTransformation");

    const handleIndicateurChange = (indicateur: string): void => {
      setIndicateur(indicateur as IndicateurType);
    };

    return (
      <Container maxWidth={"100%"} bg="blue.faded">
        <Container maxWidth={"container.xl"} py="4">
          <FiltersSection
            activeFilters={filters}
            handleFilters={handleFilters}
            isLoading={isLoading}
            data={data}
          ></FiltersSection>
          <Box>
            <SimpleGrid spacing={8} columns={[2]} mt={8}>
              <Box>
                <IndicateursClesSection data={data} isLoading={isLoading} />
              </Box>
              <CartoSection
                data={data}
                isLoading={isLoading}
                indicateur={indicateur}
                handleIndicateurChange={handleIndicateurChange}
                indicateurOptions={indicateurOptions}
              ></CartoSection>
            </SimpleGrid>
            {/* <SimpleGrid spacing={5} columns={[1]} mt={14}>
              <VueRegionAcademieSection
                data={dataRegions}
                order={order}
                isLoading={isLoadingRegions}
                handleOrder={handleOrder}
                codeRegion={filters.codeRegion}
              ></VueRegionAcademieSection>
            </SimpleGrid> */}
          </Box>
        </Container>
      </Container>
    );
  }
);
