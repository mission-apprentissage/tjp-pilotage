import { Divider, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { client } from "@/api.client";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import Loading from "../../../components/Loading";
import { useEtablissementContext } from "../../context/etablissementContext";
import { Dashboard } from "./dashboard/Dashboard";
import { FiltersSection } from "./filters/FiltersSection";
import { LiensUtilesSection } from "./liens-utiles/LiensUtilesSection";
import { ListeFormations } from "./listeFormations/ListeFormations";
import { QuadrantSection } from "./quadrant/QuadrantSection";
import { TabsSection } from "./tabs/TabsSection";
import { Filters } from "./types";

const EtablissementAnalyseDetaillee = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    offre?: string;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });
  const setSearchParams = (params: {
    filters?: typeof filters;
    offre?: string;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const trackEvent = usePlausible();
  const filters = searchParams.filters ?? {};
  const { uai } = useEtablissementContext();

  const [offre, setOffre] = useState<string>("");
  const [displayType, setDisplayType] = useState<"dashboard" | "quadrant">(
    "dashboard"
  );

  const displayDashboard = () => {
    setDisplayType("dashboard");
  };

  const displayQuadrant = () => {
    setDisplayType("quadrant");
  };

  const { data, isLoading: isLoading } = client
    .ref(`[GET]/etablissement/analyse-detaillee`)
    .useQuery(
      {
        query: {
          uai,
          ...filters,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  useEffect(() => {
    if (searchParams.offre) setOffre(searchParams.offre);
    else {
      setOffre(Object.keys(data?.formations ?? [])[0]);
    }
  }, [data]);

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    unstable_batchedUpdates(() => {
      setSearchParams({
        filters: { ...filters, [type]: value },
      });
    });
  };

  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("analyse-detailee-etablissement:filtre", {
      props: { filter_name: filterName },
    });
  };

  const setOffreFilter = (offre: string) => {
    setOffre(offre);
    setSearchParams({
      filters,
      offre,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex direction={"column"} mx={"1%"} gap={8}>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
        Analyse des formations
      </Text>
      <Divider width="48px" />
      <TabsSection
        displayDashboard={displayDashboard}
        displayQuadrant={displayQuadrant}
        displayType={displayType}
      />
      <FiltersSection
        data={data}
        filters={filters}
        handleFilters={handleFilters}
        filterTracker={filterTracker}
      />
      <Divider />
      <Grid templateColumns={"repeat(10, 1fr)"} gap={8}>
        <GridItem colSpan={4}>
          <ListeFormations
            formations={Object.values(data?.formations ?? {})}
            offre={offre}
            setOffre={setOffreFilter}
            nbOffres={
              data?.filters.diplomes.reduce(
                (acc, diplome) => {
                  acc[diplome.label] = diplome.nbOffres;
                  return acc;
                },
                {} as Record<string, number>
              ) ?? {}
            }
          />
        </GridItem>
        <GridItem colSpan={6}>
          {displayType === "dashboard" ? (
            <Dashboard
              formation={data?.formations[offre]}
              chiffresIJOffre={data?.chiffresIJ[offre]}
              chiffresEntreeOffre={data?.chiffresEntree[offre]}
            />
          ) : (
            <QuadrantSection
              _formations={Object.values(data?.formations ?? {})}
              _chiffresIJ={data?.chiffresIJ}
              _chiffresEntree={data?.chiffresEntree}
              _offre={offre}
              _setOffre={setOffreFilter}
            />
          )}
        </GridItem>
      </Grid>
      <Divider />
      <LiensUtilesSection
        codeDepartement={data?.etablissement.codeDepartement}
        codeRegion={data?.etablissement.codeRegion}
      />
    </Flex>
  );
};

export { EtablissementAnalyseDetaillee };
