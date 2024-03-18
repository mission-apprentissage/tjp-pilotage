import { Center, Divider, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useEffect, useMemo } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { client } from "@/api.client";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import Loading from "../../../../components/Loading";
import { useEtablissementContext } from "../../context/etablissementContext";
import { Dashboard } from "./dashboard/Dashboard";
import { FiltersSection } from "./filters/FiltersSection";
import { ListeFormations } from "./listeFormations/ListeFormations";
import { Filters } from "./types";

const EtablissementAnalyseDetaillee = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    offre?: string;
    displayType?: "dashboard" | "quadrant";
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });
  const setSearchParams = (params: {
    filters?: typeof filters;
    offre?: string;
    displayType?: "dashboard" | "quadrant";
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const trackEvent = usePlausible();
  const filters = searchParams.filters ?? {};
  const { uai, setAnalyseDetaillee, analyseDetaillee } =
    useEtablissementContext();
  // PAGE ETAB V2 AVEC QUADRANT FF
  // const displayDashboard = () => {
  //   setSearchParams({ ...searchParams, displayType: "dashboard" });
  // };

  // const displayQuadrant = () => {
  //   setSearchParams({ ...searchParams, displayType: "quadrant" });
  // };

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
    if (!isLoading && data) {
      setAnalyseDetaillee(data);
    }
  }, [data, isLoading]);

  // Si l'offre n'est pas dans la liste des formations (changement de filtre par exemple),
  // on la remplace par la première formation de la nouvelle liste
  useEffect(() => {
    if (
      searchParams.offre &&
      !isLoading &&
      !Object.keys(data?.formations ?? {}).includes(searchParams.offre)
    )
      setOffreFilter(Object.keys(data?.formations ?? [])[0]);
    else if (!searchParams.offre && !isLoading)
      setOffreFilter(Object.keys(data?.formations ?? [])[0]);
  }, [data]);

  const setOffreFilter = (offre: string) => {
    setSearchParams({
      ...searchParams,
      offre,
    });
  };

  const offre = useMemo(() => searchParams.offre ?? "", [searchParams.offre]);

  // PAGE ETAB V2 AVEC QUADRANT FF
  // const displayType = useMemo(
  //   () => searchParams.displayType ?? "dashboard",
  //   [searchParams.displayType]
  // );

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

  if (isLoading || !analyseDetaillee) {
    return <Loading my={16} size="xl" />;
  }

  return (
    <Flex direction={"column"} gap={8} id={"analyse-detaille"}>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
        Analyse des formations
      </Text>
      <Divider width="48px" />
      {/* // PAGE ETAB V2 AVEC QUADRANT FF */}
      {/* <TabsSection
        displayDashboard={displayDashboard}
        displayQuadrant={displayQuadrant}
        displayType={searchParams.displayType ?? displayType}
      /> */}
      {Object.values(analyseDetaillee?.formations ?? {}).length ? (
        <Flex direction={"column"} gap={8}>
          <FiltersSection
            data={analyseDetaillee}
            filters={filters}
            handleFilters={handleFilters}
            filterTracker={filterTracker}
          />
          <Divider />
          <Grid templateColumns={"repeat(10, 1fr)"} gap={8}>
            <GridItem colSpan={4}>
              <ListeFormations
                formations={Object.values(analyseDetaillee?.formations ?? {})}
                offre={searchParams.offre ?? offre}
                setOffre={setOffreFilter}
                nbOffres={
                  analyseDetaillee?.filters.diplomes.reduce(
                    (acc, diplome) => {
                      if (!filters.codeNiveauDiplome)
                        acc[diplome.label] = diplome.nbOffres;
                      if (filters.codeNiveauDiplome?.includes(diplome.value))
                        acc[diplome.label] = diplome.nbOffres;
                      return acc;
                    },
                    {} as Record<string, number>
                  ) ?? {}
                }
              />
            </GridItem>
            <GridItem colSpan={6}>
              {/* // PAGE ETAB V2 AVEC QUADRANT FF */}
              {/* {displayType === "dashboard" ? ( */}
              <Dashboard
                formation={
                  analyseDetaillee?.formations[searchParams.offre ?? offre]
                }
                chiffresIJOffre={
                  analyseDetaillee?.chiffresIJ[searchParams.offre ?? offre]
                }
                chiffresEntreeOffre={
                  analyseDetaillee?.chiffresEntree[searchParams.offre ?? offre]
                }
              />
              {/* ) : (
                <QuadrantSection
                  formations={Object.values(data?.formations ?? {})}
                  chiffresIJ={data?.chiffresIJ}
                  chiffresEntree={data?.chiffresEntree}
                  statsSortie={data?.statsSortie}
                  offre={searchParams.offre ?? offre}
                  setOffre={setOffreFilter}
                />
               )} */}
            </GridItem>
          </Grid>
        </Flex>
      ) : (
        <Center my={16}>
          <Text fontSize={25}>
            {`Aucune formation trouvée pour l'établissement ${
              analyseDetaillee?.etablissement.libelleEtablissement ?? ""
            } (${analyseDetaillee?.etablissement.uai ?? uai})`}
          </Text>
        </Center>
      )}
      <Divider />
    </Flex>
  );
};

export { EtablissementAnalyseDetaillee };
