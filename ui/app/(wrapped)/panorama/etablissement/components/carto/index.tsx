import { Divider, Grid, Stack, Text } from "@chakra-ui/react";
import _ from "lodash";

import { client } from "../../../../../../api.client";
import { useEtablissementContext } from "../../context/etablissementContext";
import { ListeEtablissementsProches } from "./components/ListEtablissementsProches";
import { Map } from "./components/Map";

export const EtablissementMap = () => {
  const { uai, analyseDetaillee } = useEtablissementContext();
  const cfd =
    analyseDetaillee !== undefined
      ? _.uniq(Object.values(analyseDetaillee.formations).map((f) => f.cfd))
      : undefined;

  const { data: etablissement } = client
    .ref("[GET]/etablissement/:uai/map")
    .useQuery({
      params: { uai },
      query: {},
    });

  return (
    <Stack gap={8} mt={8}>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
        L'offre de formations autour de l'établissement
      </Text>
      <Divider width="48px" />
      <Text>
        Visualisez l'offre de formations sur la carte régionale, et comparez les
        établissements selon les taux d'emploi et de devenir favorable.
      </Text>
      <Grid height="500px" templateColumns={"repeat(2,1fr)"}>
        <ListeEtablissementsProches />
        <Map uai={uai} cfd={cfd} initialZoom={etablissement?.initialZoom} />
      </Grid>
    </Stack>
  );
};
