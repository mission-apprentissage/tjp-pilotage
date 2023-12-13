"use client";

import { Box, Container, Flex } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useContext, useEffect, useState } from "react";

import { client } from "@/api.client";
import { QuadrantSection } from "@/app/(wrapped)/intentions/pilotage/components/QuadrantSection";

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
  "pilotage-intentions/lecture",
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

    const { data, isLoading: isLoading } = client
      .ref("[GET]/pilotage-transformation/stats")
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
      <Box bg="blueecume.950">
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
            <Flex gap={8} mt={10} flexDirection={["column", null, "row"]}>
              <Box flex={1}>
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
            </Flex>
            <Box mt={14} display={["none", null, "block"]}>
              <QuadrantSection
                scope={scope}
                parentFilters={filters}
                scopeFilters={data?.filters}
              />
            </Box>
            <Flex
              gap={5}
              flexDirection={["column", null, "row"]}
              mt={14}
              mb={20}
            >
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
            </Flex>
          </Box>
        </Container>
      </Box>
    );
  }
);
