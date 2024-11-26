import { Box, Center, Heading, Spinner, Text } from "@chakra-ui/react";
import { useMemo } from "react";

import type { PanoramaTopFlops } from "@/app/(wrapped)/panorama/types";

import { TopFlopChart } from "./TopFlopChart";

const Loader = () => (
  <Center height="100%" width="100%">
    <Spinner size="xl" />
  </Center>
);

export const TopFlopSection = ({ topFlops, isLoading }: { topFlops?: PanoramaTopFlops; isLoading: boolean }) => {
  const topFlopFormations = useMemo(() => {
    if (!topFlops) return;

    const nbTopFlop = Math.min(topFlops.length, 20) / 2;
    // @ts-expect-error TODO
    const sorted = topFlops.slice().sort((a, b) => (a.tauxDevenirFavorable < b.tauxDevenirFavorable ? 1 : -1));
    const top = sorted.slice().slice(0, Math.ceil(nbTopFlop));
    const flop = sorted.slice().reverse().slice(0, Math.floor(nbTopFlop));

    return { top, flop };
  }, [topFlops]);

  const RenderTopFlop = useMemo(() => {
    if (isLoading) {
      return <Loader />;
    }

    if (topFlopFormations && topFlops?.length) {
      return <TopFlopChart topFlopFormations={topFlopFormations} />;
    }

    return (
      <Center mt={20}>
        <Text>Aucune donnée à afficher pour les filtres sélectionnés</Text>
      </Center>
    );
  }, [topFlopFormations, isLoading, topFlops]);

  return (
    <Box as="section" py="24px" maxWidth={"container.xl"}>
      <Box width={"fit-content"}>
        <Heading fontWeight={"bold"} as="h2" fontSize={"28px"}>
          Examiner les formations
        </Heading>
        <Box w={"33%"} mt={"16px"}>
          <hr />
        </Box>
      </Box>
      {RenderTopFlop}
    </Box>
  );
};
