import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

import { api } from "../../api.client";
import { Multiselect } from "../../components/Multiselect";

type CadranFormations = Awaited<
  ReturnType<ReturnType<typeof api.getRegionStatsForCadran>["call"]>
>["formations"];

export const TopFlopSection = ({
  diplomeOptions,
  cadranFormations,
}: {
  diplomeOptions?: { label: string; value: string }[];
  cadranFormations?: CadranFormations;
  meanPoursuite?: number;
  meanInsertion?: number;
}) => {
  const [codeNiveauDiplome, setCodeNiveauDiplome] = useState<string[]>();

  const topFlopFormations = useMemo(() => {
    if (!cadranFormations) return;
    const filtered = cadranFormations.filter(
      (item) =>
        !codeNiveauDiplome?.length ||
        codeNiveauDiplome.includes(item.codeNiveauDiplome)
    );
    const top = filtered
      .slice()
      .sort((a, b) =>
        a.tauxInsertion12mois + a.tauxPoursuiteEtudes <
        b.tauxInsertion12mois + b.tauxPoursuiteEtudes
          ? 1
          : -1
      )
      .slice(0, 10);

    const flop = filtered
      .slice()
      .sort((a, b) =>
        a.tauxInsertion12mois + a.tauxPoursuiteEtudes >
        b.tauxInsertion12mois + b.tauxPoursuiteEtudes
          ? 1
          : -1
      )
      .slice(0, 10);

    return { top, flop };
  }, [cadranFormations, codeNiveauDiplome]);

  return (
    <Container as="section" py="6" maxWidth={"container.xl"}>
      <Box ml="6" mb={4}>
        <Heading fontWeight={"hairline"} maxWidth={250} as="h2" mb="4">
          Examiner les formations
        </Heading>
        <Text>
          Retrouvez les 10 formations avec un devenir favorable et les 10
          formations à examiner <br />
          (Sur la base du calcul Taux d’emploi à 12 mois + Taux de poursuite
          d’étude)
        </Text>
      </Box>
      <HStack spacing={2} justifyContent="flex-end">
        <Multiselect
          flex={1}
          maxW={250}
          onChange={(value) => setCodeNiveauDiplome(value)}
          options={diplomeOptions}
        >
          Niveau
        </Multiselect>
      </HStack>
      {topFlopFormations && (
        <TopFlopChart topFlopFormations={topFlopFormations} />
      )}
    </Container>
  );
};

const TopFlopChart = ({
  topFlopFormations,
}: {
  topFlopFormations: { top: CadranFormations; flop: CadranFormations };
}) => {
  console.log(topFlopFormations);
  return (
    <Box bg="#F9F8F6" p="8" mt="4">
      <VStack alignItems="stretch" spacing="1">
        {topFlopFormations.top.map((item) => (
          <TopItem
            key={item.codeFormationDiplome}
            label={item.libelleDiplome}
            value={(item.tauxInsertion12mois + item.tauxPoursuiteEtudes) / 2}
          />
        ))}
      </VStack>
      <Divider py="4" />
      <VStack alignItems="stretch" spacing="1">
        {topFlopFormations.flop
          .slice()
          .reverse()
          .map((item) => (
            <TopItem
              key={item.codeFormationDiplome}
              label={item.libelleDiplome}
              color={"#FD8E81"}
              value={(item.tauxInsertion12mois + item.tauxPoursuiteEtudes) / 2}
            />
          ))}
      </VStack>
    </Box>
  );
};

const TopItem = ({
  label,
  value,
  color = "#8585F6",
}: {
  label: string;
  value: number;
  color?: string;
}) => {
  return (
    <Flex gap="8" align="center">
      <Box
        flex={1}
        textAlign="right"
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
      >
        {label}
      </Box>
      <Box flex={1}>
        <Flex
          align={"center"}
          bg={color}
          color={"white"}
          px="4"
          height={"24px"}
          width={`${value}%`}
          fontSize={13}
        >
          {`${value.toFixed(0)}%`}
        </Flex>
      </Box>
    </Flex>
  );
};
