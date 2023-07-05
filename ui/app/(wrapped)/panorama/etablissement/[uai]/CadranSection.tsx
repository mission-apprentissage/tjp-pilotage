import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Heading,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { InfoBlock } from "../../../../../components/InfoBlock";
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
  rentreeScolaire,
}: {
  cadranFormations?: ApiType<typeof api.getEtablissement>["formations"];
  meanPoursuite?: number;
  meanInsertion?: number;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
}) => {
  const filteredFormations = useMemo(
    () =>
      cadranFormations?.filter(
        (
          item
        ): item is RequiredFields<
          ApiType<typeof api.getEtablissement>["formations"][number],
          "tauxInsertion6mois" | "tauxPoursuiteEtudes"
        > =>
          item.tauxInsertion6mois !== undefined &&
          item.tauxPoursuiteEtudes !== undefined &&
          (!codeNiveauDiplome?.length ||
            codeNiveauDiplome.includes(item.codeNiveauDiplome))
      ),
    [codeNiveauDiplome, cadranFormations]
  );

  return (
    <Container as="section" py="6" mt="8" maxWidth={"container.xl"}>
      <Box pl="8" maxW={500} mb="6">
        <Heading fontWeight={"hairline"} as="h2">
          Indicateurs régionaux de vos formations
        </Heading>
        <Text fontSize="sm" color="grey" mt="2">
          Rentrée scolaire {rentreeScolaire ?? "-"}
        </Text>
      </Box>
      <Box px="16" maxW={800} m="auto">
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
        <Text color="grey" mt="4" fontSize="xs">
          Données Inser Jeunes produites par la DEPP, les formations inférieures
          à 20 sortants sur deux ans, ne sont pas représentées dans ce quadrant
          pour des raisons statistiques
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
        label="Effectif de l'établissement:"
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
        value={`${formation.tauxInsertion6mois}%`}
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
