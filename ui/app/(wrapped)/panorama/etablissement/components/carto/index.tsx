import { Box, Divider, Grid, HStack, Stack, Text } from "@chakra-ui/react";
import { createRef, useEffect, useState } from "react";

import { useEtablissementContext } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";

import { CenterMap } from "./components/CenterMap";
import { CfdSelect } from "./components/CfdSelect";
import { ExportList } from "./components/ExportList";
import { ListeEtablissementsProches } from "./components/ListEtablissementsProches";
import { Map } from "./components/Map";
import { EtablissementMapContextProvider } from "./context/etablissementMapContext";

export const EtablissementMap = () => {
  const { uai } = useEtablissementContext();
  const mapContainer = createRef<HTMLDivElement>();
  const [mapDimensions, setMapDimensions] = useState<{
    height: number;
    width: number;
  }>({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    if (mapContainer.current) {
      setMapDimensions({
        height: mapContainer.current.clientHeight,
        width: mapContainer.current.clientWidth,
      });
    }
  }, []);

  return (
    <EtablissementMapContextProvider>
      <Stack gap={8} mt={8} id="carte">
        <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
          L'offre de formation autour de l'établissement
        </Text>
        <Divider width="48px" />
        <Text>
          Visualisez l'offre de formation sur la carte régionale, et comparez les établissements selon les taux d'emploi
          et de devenir favorable.
        </Text>
        <HStack gap="16px" alignItems="end" justifyContent="space-between" width="100%">
          <Box flexGrow={1}>
            <CfdSelect />
          </Box>
          <CenterMap />
          <ExportList />
        </HStack>
        <Grid templateColumns={"repeat(2,50%)"} templateRows={"repeat(1,500px)"} gap="16px">
          <ListeEtablissementsProches />
          <Box ref={mapContainer}>
            {mapDimensions.height !== 0 && mapDimensions.width !== 0 && <Map uai={uai} {...mapDimensions} />}
          </Box>
        </Grid>
      </Stack>
    </EtablissementMapContextProvider>
  );
};
