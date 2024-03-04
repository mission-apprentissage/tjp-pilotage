import {
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Img,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import qs from "qs";
import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";

import { client } from "@/api.client";
import { Multiselect } from "@/components/Multiselect";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import Loading from "../../../components/Loading";
import { useEtablissementContext } from "../../context/etablissementContext";
import { Dashboard } from "./dashboard/Dashboard";
import { ListeFormations } from "./listeFormations/ListeFormations";

type Query =
  (typeof client.inferArgs)["[GET]/etablissement/analyse-detaillee"]["query"];

type Filters = Pick<Query, "codeNiveauDiplome">;

const EtablissementAnalyseDetaillee = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });
  const setSearchParams = (params: { filters?: typeof filters }) => {
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
    if (!offre) setOffre(Object.keys(data?.formations ?? [])[0]);
    // setOffre("0141687H40025214247scolaire");
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

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

  return (
    <Flex direction={"column"} mx={"5%"} gap={8}>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
        Analyse des formations
      </Text>
      <Divider width="48px" />
      <Tabs
        isLazy={true}
        display="flex"
        flex="1"
        flexDirection="column"
        variant="enclosed-colored"
        minHeight="0"
        width={"100%"}
      >
        <TabList>
          <Tab
            as={Button}
            onClick={() => displayDashboard()}
            width="100%"
            minH={"54px"}
            color={"black"}
          >
            {displayType === "dashboard" ? (
              <Img src={`/icons/dashboard_selected.svg`} alt="" me={2} />
            ) : (
              <Img src={`/icons/dashboard.svg`} alt="" me={2} />
            )}
            Tableau de bord
          </Tab>
          <Tab
            as={Button}
            onClick={() => displayQuadrant()}
            width="100%"
            minH={"54px"}
            color={"black"}
          >
            {displayType === "quadrant" ? (
              <Img src={`/icons/quadrant_selected.svg`} alt="" me={2} />
            ) : (
              <Img src={`/icons/quadrant.svg`} alt="" me={2} />
            )}
            Quadrant des formations
          </Tab>
        </TabList>
      </Tabs>
      <Flex direction={"column"} gap={4}>
        <Text fontSize={14} fontWeight={400} lineHeight={"24px"}>
          Diplôme
        </Text>
        <Multiselect
          onClose={filterTracker("codeNiveauDiplome")}
          width="24rem"
          variant={"newInput"}
          onChange={(selected) => handleFilters("codeNiveauDiplome", selected)}
          options={data?.filters.diplomes ?? []}
          value={filters.codeNiveauDiplome ?? []}
        >
          Tous
        </Multiselect>
      </Flex>
      <Divider pt="4" mb="4" />
      <Grid templateColumns={"repeat(10, 1fr)"} gap={8}>
        <GridItem colSpan={4}>
          <ListeFormations
            formations={Object.values(data?.formations ?? {})}
            offre={offre}
            setOffre={setOffre}
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
              chiffresIj={data?.chiffresIj[offre]}
              chiffresEntree={data?.chiffresEntree[offre]}
            />
          ) : (
            <Text>Quadrant des formations</Text>
          )}
        </GridItem>
      </Grid>
    </Flex>
  );
};

export { EtablissementAnalyseDetaillee };
