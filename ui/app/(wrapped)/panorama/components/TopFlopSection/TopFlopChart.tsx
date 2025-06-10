import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { CURRENT_IJ_MILLESIME } from "shared";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { PanoramaTopFlops } from "@/app/(wrapped)/panorama/types";
import { BadgeMillesimes } from "@/components/BadgeMillesimes";
import { TooltipIcon } from "@/components/TooltipIcon";

import { TopFlopChartItem } from "./TopFlopChartItem";

export const TopFlopChart = ({
  topFlopFormations,
}: {
  topFlopFormations: { top: PanoramaTopFlops; flop: PanoramaTopFlops };
}) => {
  const { openGlossaire } = useGlossaireContext();
  return (
    <Box>
      <Flex direction={"row"} justify={"start"} alignItems={"center"} gap={2}>
        <Text my="32px" fontSize="medium">
          Les dix formations présentant le <strong>meilleur taux de devenir favorable</strong>
        </Text>
        <BadgeMillesimes millesimes={CURRENT_IJ_MILLESIME}/>
        <TooltipIcon
          ml="2"
          label="(nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en dernière année de formation"
          onClick={() => openGlossaire("taux-de-devenir-favorable")}
        />
      </Flex>
      <VStack alignItems="stretch" spacing="1" ml={"100px"}>
        {topFlopFormations.top.map((item) => (
          <TopFlopChartItem
            key={`${item.cfd}_${item.codeDispositif}`}
            formation={item}
            value={item.tauxDevenirFavorable}
          />
        ))}
      </VStack>
      <Flex direction={"row"} justify={"start"} alignItems={"center"} mt={10} gap={2}>
        <Text my="32px" fontSize={"medium"}>
          Les dix formations à examiner, par <strong>taux de devenir favorable</strong>
        </Text>
        <BadgeMillesimes millesimes={CURRENT_IJ_MILLESIME}/>
        <TooltipIcon
          ml="2"
          label="(nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en dernière année de formation"
          onClick={() => openGlossaire("taux-de-devenir-favorable")}
        />
      </Flex>
      <VStack alignItems="stretch" spacing="1" ml={"100px"}>
        {topFlopFormations.flop
          .slice()
          .reverse()
          .map((item) => (
            <TopFlopChartItem
              key={`${item.cfd}_${item.codeDispositif}_`}
              formation={item}
              color={"grey.425"}
              value={item.tauxDevenirFavorable}
            />
          ))}
      </VStack>
    </Box>
  );
};
