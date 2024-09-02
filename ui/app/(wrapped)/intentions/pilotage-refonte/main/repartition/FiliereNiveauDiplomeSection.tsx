import { Divider, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

import { PositiveNegativeBarChart } from "../../components/PositiveNegativeBarChart";
import { RepartitionPilotageIntentions } from "../../types";

export const FiliereNiveauDiplomeSection = ({
  repartitionData,
}: {
  repartitionData?: RepartitionPilotageIntentions;
}) => {
  return (
    <Flex direction={"column"} gap={4}>
      <Flex direction={"row"} justify={"space-between"}>
        <Heading as="h3" fontWeight={700} fontSize={20}>
          Par filière et niveau de diplôme
        </Heading>
        <Flex direction={"row"} color={"bluefrance.113"} gap={2} mt={"auto"}>
          <Icon icon={"ri:download-line"} />
          <Text>Exporter</Text>
        </Flex>
      </Flex>
      <Divider w={"100%"} my={6} />
      <SimpleGrid columns={2} gap={20} height={400}>
        <PositiveNegativeBarChart
          title="10 DOMAINES LES PLUS TRANSFORMÉS"
          type="domaines"
          data={repartitionData?.domaines}
        />
        <PositiveNegativeBarChart
          title="TRANSFORMATIONS PAR DIPLÔME"
          type="diplomes"
          data={repartitionData?.niveauxDiplome}
        />
      </SimpleGrid>
    </Flex>
  );
};
