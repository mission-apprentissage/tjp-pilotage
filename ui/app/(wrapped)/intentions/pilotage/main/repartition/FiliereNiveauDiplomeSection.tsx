import { Button, Divider, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { PositiveNegativeBarChart } from "../../components/PositiveNegativeBarChart";
import { RepartitionPilotageIntentions } from "../../types";

export const FiliereNiveauDiplomeSection = ({
  repartitionData,
}: {
  repartitionData?: RepartitionPilotageIntentions;
}) => {
  return (
    <Flex direction={"column"} gap={6}>
      <Flex direction={"row"} justify={"space-between"}>
        <Heading as="h3" fontWeight={700} fontSize={20}>
          Par filière et niveau de diplôme
        </Heading>
        <Button
          variant={"ghost"}
          color={"bluefrance.113"}
          leftIcon={<Icon icon="ri:download-line" />}
          as={Link}
          href={"__TODO__"}
          isDisabled
          target="_blank"
        >
          Exporter
        </Button>
      </Flex>
      <Divider w={"100%"} />
      <SimpleGrid columns={2} gap={20} height={400}>
        <PositiveNegativeBarChart
          title="10 DOMAINES LES PLUS TRANSFORMÉS"
          type="domaines"
          data={repartitionData?.top10Domaines}
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
