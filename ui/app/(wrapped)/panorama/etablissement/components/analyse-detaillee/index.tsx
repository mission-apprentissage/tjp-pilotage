import { Center, Divider, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useEffect, useMemo } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { useAnalyseDetaillee } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/hook";
import { Loading } from "@/components/Loading";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { useEtablissementContext } from "../../context/etablissementContext";
import { Dashboard } from "./dashboard/Dashboard";
import { FiltersSection } from "./filters/FiltersSection";
import { ListeFormations } from "./listeFormations/ListeFormations";
import { QuadrantSection } from "./quadrant/QuadrantSection";
import { TabsSection } from "./tabs/TabsSection";
import { Filters } from "./types";

const QUADRANT_FEATURE_FLAG = true;

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
  const { uai, analyseDetaillee, setAnalyseDetaillee } =
    useEtablissementContext();
  const displayDashboard = () => {
    setSearchParams({ ...searchParams, displayType: "dashboard" });
  };

  const displayQuadrant = () => {
    setSearchParams({ ...searchParams, displayType: "quadrant" });
  };

  const { isLoading, ...data } = useAnalyseDetaillee(uai, filters) || {};
  const {
    etablissement,
    formations,
    chiffresIJ,
    chiffresEntree,
    statsSortie,
    filters: filtersData,
  } = data;

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
      !Object.keys(formations ?? {}).includes(searchParams.offre)
    )
      setOffreFilter(Object.keys(formations ?? [])[0]);
    else if (!searchParams.offre && !isLoading)
      setOffreFilter(Object.keys(formations ?? [])[0]);
  }, [formations]);

  const setOffreFilter = (offre: string) => {
    filterTracker("offre", offre);
    setSearchParams({
      ...searchParams,
      offre,
    });
  };

  const offre = useMemo(() => searchParams.offre ?? "", [searchParams.offre]);

  const displayType = useMemo(
    () => searchParams.displayType ?? "dashboard",
    [searchParams.displayType]
  );

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

  const filterTracker =
    (filterName: keyof Filters | string, filterValue?: string | number) =>
    () => {
      trackEvent("analyse-detailee-etablissement:filtre", {
        props: { filter_name: filterName, filter_value: filterValue },
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
      {QUADRANT_FEATURE_FLAG && (
        <TabsSection
          displayDashboard={displayDashboard}
          displayQuadrant={displayQuadrant}
          displayType={searchParams.displayType ?? displayType}
        />
      )}
      {Object.values(formations ?? {}).length ? (
        <Flex direction={"column"} gap={8}>
          <FiltersSection
            filtersData={filtersData}
            filters={filters}
            handleFilters={handleFilters}
            filterTracker={filterTracker}
          />
          <Divider />
          <Grid templateColumns={"repeat(10, 1fr)"} gap={8}>
            <GridItem colSpan={4}>
              <ListeFormations
                formations={Object.values(formations ?? {})}
                offre={searchParams.offre ?? offre}
                setOffre={setOffreFilter}
                nbOffres={
                  filtersData?.diplomes.reduce(
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
              {QUADRANT_FEATURE_FLAG ? (
                <>
                  {displayType === "dashboard" ? (
                    <Dashboard
                      formation={
                        formations && formations[searchParams.offre ?? offre]
                      }
                      chiffresIJOffre={
                        chiffresIJ && chiffresIJ[searchParams.offre ?? offre]
                      }
                      chiffresEntreeOffre={
                        chiffresEntree &&
                        chiffresEntree[searchParams.offre ?? offre]
                      }
                    />
                  ) : (
                    <QuadrantSection
                      formations={Object.values(formations ?? {})}
                      currentFormation={
                        formations && formations[searchParams.offre ?? offre]
                      }
                      etablissement={etablissement}
                      chiffresIJ={chiffresIJ}
                      chiffresEntree={chiffresEntree}
                      statsSortie={statsSortie}
                      offre={searchParams.offre ?? offre}
                      setOffre={setOffreFilter}
                    />
                  )}
                </>
              ) : (
                <Dashboard
                  formation={
                    formations && formations[searchParams.offre ?? offre]
                  }
                  chiffresIJOffre={
                    chiffresIJ && chiffresIJ[searchParams.offre ?? offre]
                  }
                  chiffresEntreeOffre={
                    chiffresEntree &&
                    chiffresEntree[searchParams.offre ?? offre]
                  }
                />
              )}
            </GridItem>
          </Grid>
        </Flex>
      ) : (
        <Center my={16}>
          <Text fontSize={25}>
            {`Aucune formation trouvée pour l'établissement ${
              etablissement?.libelleEtablissement ?? ""
            } (${etablissement?.uai ?? uai})`}
          </Text>
        </Center>
      )}
      <Divider />
    </Flex>
  );
};

export { EtablissementAnalyseDetaillee };
