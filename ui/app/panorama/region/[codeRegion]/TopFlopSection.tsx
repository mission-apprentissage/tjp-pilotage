import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { FormationTooltipContent } from "./FormationTooltipContent";
import { PanoramaFormation, PanoramaFormations } from "./type";

export const TopFlopSection = ({
  cadranFormations,
  codeNiveauDiplome,
  libelleFiliere,
}: {
  cadranFormations?: PanoramaFormations;
  meanPoursuite?: number;
  meanInsertion?: number;
  codeNiveauDiplome?: string[];
  libelleFiliere?: string[];
}) => {
  const topFlopFormations = useMemo(() => {
    if (!cadranFormations) return;
    const filtered = cadranFormations.filter((item) => {
      if (
        libelleFiliere?.length &&
        (!item.libelleFiliere || !libelleFiliere.includes(item.libelleFiliere))
      )
        return false;
      if (
        codeNiveauDiplome?.length &&
        !codeNiveauDiplome.includes(item.codeNiveauDiplome)
      )
        return false;
      return item.dispositifId && !["253", "240"].includes(item.dispositifId);
    });
    const nbTopFlop = Math.min(filtered.length, 20) / 2;
    const sorted = filtered
      .slice()
      .sort((a, b) =>
        a.tauxInsertion12mois + a.tauxPoursuiteEtudes <
        b.tauxInsertion12mois + b.tauxPoursuiteEtudes
          ? 1
          : -1
      );

    const top = sorted.slice().slice(0, Math.ceil(nbTopFlop));
    const flop = sorted.slice().reverse().slice(0, Math.floor(nbTopFlop));

    return { top, flop };
  }, [cadranFormations, codeNiveauDiplome, libelleFiliere]);

  return (
    <Container as="section" py="6" maxWidth={"container.xl"}>
      <Box ml="6" mb={4}>
        <Heading fontWeight={"hairline"} maxWidth={250} as="h2" mb="4">
          Examiner les formations
        </Heading>
        <Text>
          Retrouvez les 10 formations avec un devenir favorable et les 10
          formations à examiner
        </Text>
      </Box>
      {topFlopFormations && (
        <TopFlopChart topFlopFormations={topFlopFormations} />
      )}
    </Container>
  );
};

const TopFlopChart = ({
  topFlopFormations,
}: {
  topFlopFormations: { top: PanoramaFormations; flop: PanoramaFormations };
}) => {
  return (
    <Box bg="#F9F8F6" p="8" mt="4">
      <Text mb="4" color="grey" fontSize="sm" textAlign="right">
        Taux d'emploi + Taux de poursuite d'études
      </Text>
      <VStack alignItems="stretch" spacing="1">
        {topFlopFormations.top.map((item) => (
          <TopItem
            key={`${item.codeFormationDiplome}_${item.dispositifId}`}
            formation={item}
            value={(item.tauxInsertion12mois + item.tauxPoursuiteEtudes) / 2}
          />
        ))}
      </VStack>
      <Divider pt="4" mb="4" />
      <VStack alignItems="stretch" spacing="1">
        {topFlopFormations.flop
          .slice()
          .reverse()
          .map((item) => (
            <TopItem
              key={`${item.codeFormationDiplome}_${item.dispositifId}`}
              formation={item}
              color={"#FD8E81"}
              value={(item.tauxInsertion12mois + item.tauxPoursuiteEtudes) / 2}
            />
          ))}
      </VStack>
    </Box>
  );
};

const TopItem = ({
  formation,
  value,
  color = "#8585F6",
}: {
  formation: PanoramaFormation;
  value: number;
  color?: string;
}) => {
  return (
    <Popover>
      <Flex gap="8" align="center">
        <Box
          flex={1}
          textAlign="right"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
        >
          {formation.libelleDiplome}
        </Box>
        <Box flex={1}>
          <PopoverTrigger>
            <Flex
              cursor="pointer"
              transition="opacity 250ms"
              _hover={{ opacity: 0.9 }}
              align={"center"}
              bg={color}
              color={"white"}
              px="2"
              pr="1"
              height={"24px"}
              width={`${value}%`}
              fontSize={11}
              whiteSpace="nowrap"
            >
              {`${formation.tauxInsertion12mois.toFixed(
                0
              )}% + ${formation.tauxPoursuiteEtudes.toFixed(0)}%`}
            </Flex>
          </PopoverTrigger>
        </Box>
      </Flex>

      <PopoverContent _focusVisible={{ outline: "none" }} p="3" width="250px">
        <PopoverCloseButton />
        <FormationTooltipContent formation={formation} />
      </PopoverContent>
    </Popover>
  );
};
