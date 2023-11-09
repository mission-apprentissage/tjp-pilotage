import { ViewIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { ApiType } from "shared";

import { api } from "../../../../../api.client";
import { Cadran } from "../../../../../components/Cadran";
import { TableCadran } from "../../../../../components/TableCadran";
import { FormationTooltipContent } from "./FormationTooltipContent";

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
  const [typeVue, setTypeVue] = useState<"cadran" | "tableau">("cadran");

  const toggleTypeVue = () => {
    if (typeVue === "cadran") setTypeVue("tableau");
    else setTypeVue("cadran");
  };
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
        <Flex justify="space-between">
          <Flex>
            <Button onClick={() => toggleTypeVue()} variant="solid">
              <ViewIcon mr={2}></ViewIcon>
              {`Passer en vue ${typeVue === "cadran" ? "tableau" : "cadran"}`}
            </Button>
          </Flex>
          <Flex alignItems={"flex-end"}>
            <Text color="grey" fontSize="sm" textAlign="left">
              {filteredFormations?.length ?? "-"} certifications
            </Text>
            <Text ml="2" color="grey" fontSize="sm" textAlign="right">
              {filteredFormations?.reduce(
                (acc, { effectif }) => acc + (effectif ?? 0),
                0
              ) ?? "-"}{" "}
              élèves
            </Text>
          </Flex>
        </Flex>
        <AspectRatio ratio={1} mt={2}>
          <>
            {filteredFormations &&
              (typeVue === "cadran" ? (
                <Cadran
                  meanPoursuite={meanPoursuite}
                  meanInsertion={meanInsertion}
                  TooltipContent={FormationTooltipContent}
                  InfoTootipContent={InfoTooltipContent}
                  data={filteredFormations.map((formation) => ({
                    ...formation,
                    tauxInsertion: formation.tauxInsertion6mois,
                    tauxPoursuite: formation.tauxPoursuiteEtudes,
                  }))}
                  itemId={(item) => item.cfd + item.dispositifId}
                  effectifSizes={effectifSizes}
                />
              ) : (
                <TableCadran
                  formations={filteredFormations.map((formation) => ({
                    ...formation,
                    tauxInsertion: formation.tauxInsertion6mois,
                    tauxPoursuite: formation.tauxPoursuiteEtudes,
                  }))}
                />
              ))}
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
