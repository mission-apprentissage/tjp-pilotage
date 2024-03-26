import { Divider, Grid, Stack, Text } from "@chakra-ui/react";

import { useEtablissementContext } from "../../context/etablissementContext";
import { CfdSelect } from "./components/CfdSelect";
import { ListeEtablissementsProches } from "./components/ListEtablissementsProches";
import { Map } from "./components/Map";
import { EtablissementMapContextProvider } from "./context/etablissementMapContext";

export const EtablissementMap = () => {
  const { uai } = useEtablissementContext();

  return (
    <EtablissementMapContextProvider>
      <Stack gap={8} mt={8}>
        <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
          L'offre de formations autour de l'établissement
        </Text>
        <Divider width="48px" />
        <Text>
          Visualisez l'offre de formations sur la carte régionale, et comparez
          les établissements selon les taux d'emploi et de devenir favorable.
        </Text>
        <CfdSelect />
        <Grid
          templateColumns={"repeat(2,50%)"}
          templateRows={"repeat(1,500px)"}
          gap="16px"
        >
          <ListeEtablissementsProches />
          <Map uai={uai} />
        </Grid>
      </Stack>
    </EtablissementMapContextProvider>
  );
};
