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

import { TooltipIcon } from "../../../../components/TooltipIcon";
import { PanoramaFormation, PanoramaFormations } from "../types";
import { FormationTooltipContent } from "./FormationTooltipContent";

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
        a.tauxDevenirFavorable < b.tauxDevenirFavorable ? 1 : -1
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
      <Flex justify={"flex-end"}>
        <Text mb="4" color="grey" fontSize="sm">
          Taux de devenir favorable
        </Text>
        <TooltipIcon
          ml="2"
          label="Part des jeunes en emploi ou en poursuite d’étude"
        />
      </Flex>
      <VStack alignItems="stretch" spacing="1">
        {topFlopFormations.top.map((item) => (
          <TopItem
            key={`${item.codeFormationDiplome}_${item.dispositifId}`}
            formation={item}
            value={item.tauxDevenirFavorable}
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
              color={"#666666"}
              value={item.tauxDevenirFavorable}
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
              {`${formation.tauxDevenirFavorable.toFixed(0)}%`}
            </Flex>
          </PopoverTrigger>
        </Box>
      </Flex>

      <PopoverContent _focusVisible={{ outline: "none" }} p="3" width="280px">
        <PopoverCloseButton />
        <FormationTooltipContent formation={formation} />
      </PopoverContent>
    </Popover>
  );
};
