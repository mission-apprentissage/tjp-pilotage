import { InfoIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Center,
  Container,
  Flex,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { InfoBlock } from "../../../../components/InfoBlock";
import { Cadran } from "../../components/Cadran";

type RequiredFields<T, F extends keyof T> = T & Required<Pick<T, F>>;

const effectifSizes = [
  { max: 1, size: 10 },
  { max: 20, size: 20 },
  { max: 50, size: 30 },
  { max: 100, size: 40 },
];

export const CadranSection = ({
  cadranFormations,
  meanPoursuite,
  meanInsertion,
  codeNiveauDiplome,
}: {
  cadranFormations?: ApiType<typeof api.getEtablissement>["formations"];
  meanPoursuite?: number;
  meanInsertion?: number;
  codeNiveauDiplome?: string[];
}) => {
  const filteredFormations = useMemo(
    () =>
      cadranFormations?.filter(
        (
          item
        ): item is RequiredFields<
          ApiType<typeof api.getEtablissement>["formations"][number],
          "tauxInsertion12mois" | "tauxPoursuiteEtudes"
        > =>
          item.tauxInsertion12mois !== undefined &&
          item.tauxPoursuiteEtudes !== undefined &&
          (!codeNiveauDiplome?.length ||
            codeNiveauDiplome.includes(item.codeNiveauDiplome))
      ),
    [codeNiveauDiplome, cadranFormations]
  );

  return (
    <Container as="section" py="6" mt="6" maxWidth={"container.xl"}>
      <Box px="8">
        <Flex justify="flex-end">
          <Text color="grey" fontSize="sm" textAlign="left">
            {filteredFormations?.length ?? "-"} formations
          </Text>
          <Text ml="2" color="grey" fontSize="sm" textAlign="right">
            {filteredFormations?.reduce(
              (acc, { effectif }) => acc + (effectif ?? 0),
              0
            ) ?? "-"}{" "}
            élèves
          </Text>
        </Flex>
        <AspectRatio ratio={1}>
          <>
            {filteredFormations && (
              <Cadran
                meanPoursuite={meanPoursuite}
                meanInsertion={meanInsertion}
                TooltipContent={FormationTooltipContent}
                InfoTootipContent={InfoTooltipContent}
                data={filteredFormations}
                effectifSizes={effectifSizes}
              />
            )}
            {!filteredFormations && <Skeleton opacity="0.3" height="100%" />}
          </>
        </AspectRatio>
        <Text color="grey" textAlign="right" mt="4" fontSize="xs">
          Données Inser Jeunes produites par la DEPP, les formations inférieures
          à 20 élèves ne sont pas représentées
        </Text>
      </Box>
    </Container>
  );
};

const FormationTooltipContent = ({
  formation,
}: {
  formation: ApiType<typeof api.getEtablissement>["formations"][number];
}) => {
  return (
    <Box bg="white" fontSize="xs">
      <InfoBlock
        mb="2"
        label="Formation concernée:"
        value={formation.libelleDiplome}
      />
      <InfoBlock
        mb="2"
        label="Dispositif concerné:"
        value={formation.libelleDispositif}
      />
      <InfoBlock
        mb="2"
        label="Effectifs de l'établissement:"
        value={formation.effectif ?? "-"}
      />
      <InfoBlock
        mb="2"
        label="Taux de pression de l'établissement:"
        value={formation.tauxPression ? formation?.tauxPression / 100 : "-"}
      />
      <InfoBlock
        mb="2"
        label="Taux d'emploi régional:"
        value={`${formation.tauxInsertion12mois}%`}
      />
      <InfoBlock
        label="Taux de pousuite d'études régional:"
        value={`${formation.tauxPoursuiteEtudes}%`}
      />
    </Box>
  );
};

const InfoTooltipContent = () => (
  <>
    <Text mb="2" fontSize="sm" fontWeight="bold">
      Effectif:
    </Text>
    <Flex align="center">
      <Center p="4">
        <InfoIcon fontSize={30} />
      </Center>
      <Text flex={1} ml="4" fontSize="sm">
        Les formations inférieures à 20 élèves ne sont pas représentées dans ce
        quadrant.
      </Text>
    </Flex>
    <Text mt="4" mb="2" fontSize="sm" fontWeight="bold">
      Légende:
    </Text>
    <VStack align="flex-start" spacing={2}>
      {effectifSizes.map(({ max, size }, i) => (
        <Flex key={max} align="center">
          <Box
            borderRadius={100}
            width={`${size}px`}
            height={`${size}px`}
            mx={`${22 - size / 2}px`}
            border="1px solid black"
          />
          <Text flex={1} ml="4" fontSize="sm">
            {max !== 1000000 && (
              <>
                Effectif {"<"} {max}
              </>
            )}
            {max === 1000000 && (
              <>
                Effectif {">"} {effectifSizes[i - 1].max}
              </>
            )}
          </Text>
        </Flex>
      ))}
    </VStack>
  </>
);
