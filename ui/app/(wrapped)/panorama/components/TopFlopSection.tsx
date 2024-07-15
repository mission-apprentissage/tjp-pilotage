import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { TooltipIcon } from "../../../../components/TooltipIcon";
import { useGlossaireContext } from "../../glossaire/glossaireContext";
import { PanoramaTopFlop, PanoramaTopFlops } from "../types";
import { FormationTooltipContent } from "./FormationTooltipContent";

const Loader = () => (
  <Center height="100%" width="100%">
    <Spinner size="xl" />
  </Center>
);

export const TopFlopSection = ({
  topFlops,
  isLoading,
}: {
  topFlops?: PanoramaTopFlops;
  isLoading: boolean;
}) => {
  const topFlopFormations = useMemo(() => {
    if (!topFlops) return;

    const nbTopFlop = Math.min(topFlops.length, 20) / 2;
    const sorted = topFlops
      .slice()
      .sort((a, b) =>
        a.tauxDevenirFavorable < b.tauxDevenirFavorable ? 1 : -1
      );
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
    <Box as="section" py="6" maxWidth={"container.xl"}>
      <Box width={"fit-content"} mb={"32px"}>
        <Heading fontWeight={"bold"} as="h2" fontSize={"28px"}>
          Examiner les formations
        </Heading>
        <Box w={"33%"} mt={"16px"}>
          <hr />
        </Box>
      </Box>
      <Text>
        Retrouvez les 10 formations avec un devenir favorable et les 10
        formations à examiner
      </Text>
      {RenderTopFlop}
    </Box>
  );
};

const TopFlopChart = ({
  topFlopFormations,
}: {
  topFlopFormations: { top: PanoramaTopFlops; flop: PanoramaTopFlops };
}) => {
  const { openGlossaire } = useGlossaireContext();
  return (
    <Box bg="grey.975" p="8" mt="4">
      <Flex justify={"flex-end"}>
        <Text mb="4" color="grey" fontSize="sm">
          Taux de devenir favorable
        </Text>
        <TooltipIcon
          ml="2"
          label="(nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en dernière année de formation"
          onClick={() => openGlossaire("taux-de-devenir-favorable")}
        />
      </Flex>
      <VStack alignItems="stretch" spacing="1">
        {topFlopFormations.top.map((item) => (
          <TopItem
            key={`${item.cfd}_${item.codeDispositif}`}
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

const TopItem = ({
  formation,
  value,
  color = "bluefrance.625",
}: {
  formation: PanoramaTopFlop;
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
          {formation.libelleFormation}
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
              width={`${value * 100}%`}
              fontSize={11}
              whiteSpace="nowrap"
            >
              {`${(formation.tauxDevenirFavorable * 100).toFixed()}%`}
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
