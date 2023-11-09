"use client";

import { Box, Container, SimpleGrid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useContext, useEffect, useState } from "react";

import { CadranSection } from "@/app/(wrapped)/intentions/pilotage/components/CadranSection";

import { api } from "../../../../api.client";
import { createParametrizedUrl } from "../../../../utils/createParametrizedUrl";
import { withAuth } from "../../../../utils/security/withAuth";
import { CodeRegionFilterContext } from "../../../layoutClient";
import { CartoSection } from "./components/CartoSection";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { VueOuverturesFermeturesSection } from "./components/VueOuverturesFermeturesSection";
import { VueTauxTransformationSection } from "./components/VueTauxTransformationSection";
import {
  Filters,
  IndicateurType,
  Order,
  Scope,
  TerritoiresFilters,
} from "./types";

export default withAuth(
  "restitution-intentions/lecture",
  function PilotageIntentions() {
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

    const { codeRegionFilter, setCodeRegionFilter } = useContext(
      CodeRegionFilterContext
    );
    const [scope, setScope] = useState<{
      type: Scope;
      value: string | undefined;
    }>();
    const [territoiresFilters, setTerritoiresFilters] = useState<
      Partial<TerritoiresFilters>
    >({});
    const [indicateur, setIndicateur] =
      useState<IndicateurType>("tauxTransformation");

    const handleOrder = (column: Order["orderBy"]) => {
      trackEvent("pilotage-intentions:ordre", { props: { colonne: column } });
      if (order?.orderBy !== column) {
        setSearchParams({ order: { order: "desc", orderBy: column } });
        return;
      }
      setSearchParams({
        order: {
          order: order?.order === "asc" ? "desc" : "asc",
          orderBy: column,
        },
      });
    };

    const handleTerritoiresFilters = (
      type: keyof TerritoiresFilters,
      value: TerritoiresFilters[keyof TerritoiresFilters]
    ) => {
      setTerritoiresFilters({ [type]: value });
      setScope({ type, value });
      if (type === "regions" && value) setCodeRegionFilter(value);
    };

    const trackEvent = usePlausible();
    const filterTracker = (filterName: keyof Filters) => () => {
      trackEvent("pilotage-intentions:filtre", {
        props: { filter_name: filterName },
      });
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
      queryKey: ["pilotageTransfo", filters, order],
      queryFn: api.getTransformationStats({
        query: {
          ...filters,
          ...order,
        },
      }).call,
    });

    useEffect(() => {
      if (codeRegionFilter != "") {
        handleTerritoiresFilters("regions", codeRegionFilter);
      }
    }, []);

    const indicateurOptions = [
      {
        label: "Taux de transformation",
        value: "tauxTransformation",
        isDefault: true,
      },
      {
        label: "Ratio de fermetures",
        value: "ratioFermeture",
        isDefault: false,
      },
    ];

    const handleIndicateurChange = (indicateur: string): void => {
      setIndicateur(indicateur as IndicateurType);
    };

    return (
      <Container maxWidth={"100%"} bg="blue.faded">
        <Container maxWidth={"container.xl"} py="4">
          <FiltersSection
            activeTerritoiresFilters={territoiresFilters}
            handleTerritoiresFilters={handleTerritoiresFilters}
            activeFilters={filters}
            handleFilters={handleFilters}
            filterTracker={filterTracker}
            isLoading={isLoading}
            data={data}
          />
          <Box>
            <SimpleGrid spacing={8} columns={[2]} mt={8}>
              <Box>
                <IndicateursClesSection
                  data={data}
                  isLoading={isLoading}
                  scope={scope}
                />
              </Box>
              <CartoSection
                data={data}
                isLoading={isLoading}
                indicateur={indicateur}
                handleIndicateurChange={handleIndicateurChange}
                indicateurOptions={indicateurOptions}
                territoiresFilters={territoiresFilters}
                handleTerritoiresFilters={handleTerritoiresFilters}
              />
            </SimpleGrid>
            <Box mt={14}>
              <CadranSection
                scope={scope}
                parentFilters={filters}
                scopeFilters={data?.filters}
              />
            </Box>
            <SimpleGrid spacing={5} columns={[2]} mt={14}>
              <VueTauxTransformationSection
                data={data}
                isLoading={isLoading}
                codeRegion={territoiresFilters.regions}
                order={order}
                handleOrder={handleOrder}
              />
              <VueOuverturesFermeturesSection
                data={data}
                isLoading={isLoading}
                codeRegion={territoiresFilters.regions}
                order={order}
                handleOrder={handleOrder}
              />
            </SimpleGrid>
          </Box>
        </Container>
      </Container>
    );
  }
);
