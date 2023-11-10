import { DownloadIcon, ViewIcon } from "@chakra-ui/icons";
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
import { Quadrant } from "../../../../../components/Quadrant";
import { TableQuadrant } from "../../../../../components/TableQuadrant";
import { downloadCsv } from "../../../../../utils/downloadCsv";
import { OrderPanoramaEtablissement } from "../../types";
import { FormationTooltipContent } from "./FormationTooltipContent";

type RequiredFields<T, F extends keyof T> = T & Required<Pick<T, F>>;

const effectifSizes = [
  { max: 1, size: 10 },
  { max: 20, size: 20 },
  { max: 50, size: 30 },
  { max: 100, size: 40 },
];

export const QuadrantSection = ({
  quadrantFormations,
  meanPoursuite,
  meanInsertion,
  codeNiveauDiplome,
  rentreeScolaire,
  order,
  handleOrder,
}: {
  quadrantFormations?: ApiType<typeof api.getEtablissement>["formations"];
  meanPoursuite?: number;
  meanInsertion?: number;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
  order?: Partial<OrderPanoramaEtablissement>;
  handleOrder: (column: OrderPanoramaEtablissement["orderBy"]) => void;
}) => {
  const [typeVue, setTypeVue] = useState<"quadrant" | "tableau">("quadrant");

  const toggleTypeVue = () => {
    if (typeVue === "quadrant") setTypeVue("tableau");
    else setTypeVue("quadrant");
  };
  const filteredFormations = useMemo(
    () =>
      quadrantFormations?.filter(
        (
          item
        ): item is RequiredFields<
          ApiType<typeof api.getEtablissement>["formations"][number],
          "tauxInsertion" | "tauxPoursuite"
        > =>
          item.tauxInsertion !== undefined &&
          item.tauxPoursuite !== undefined &&
          (!codeNiveauDiplome?.length ||
            codeNiveauDiplome.includes(item.codeNiveauDiplome))
      ),
    [codeNiveauDiplome, quadrantFormations]
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
              {`Passer en vue ${
                typeVue === "quadrant" ? "tableau" : "quadrant"
              }`}
            </Button>
            <Button
              ml="2"
              aria-label="csv"
              variant="solid"
              onClick={async () => {
                if (!filteredFormations) return;
                downloadCsv(
                  "formations_panorama.csv",
                  filteredFormations.map((formation) => ({
                    ...formation,
                  })),
                  {
                    libelleDiplome: "Formation",
                    libelleDispositif: "Dispositif",
                    tauxInsertion: "Taux d'emploi",
                    tauxPoursuite: "Taux de poursuite",
                    tauxPression: "Taux de pression",
                    positionQuadrant: "Position dans le quadrant",
                  }
                );
              }}
            >
              <DownloadIcon mr="2" />
              Exporter en csv
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
              (typeVue === "quadrant" ? (
                <Quadrant
                  meanPoursuite={meanPoursuite}
                  meanInsertion={meanInsertion}
                  TooltipContent={FormationTooltipContent}
                  InfoTootipContent={InfoTooltipContent}
                  data={filteredFormations.map((formation) => ({
                    ...formation,
                    tauxInsertion: formation.tauxInsertion,
                    tauxPoursuite: formation.tauxPoursuite,
                  }))}
                  itemId={(item) =>
                    item.codeFormationDiplome + item.dispositifId
                  }
                  effectifSizes={effectifSizes}
                />
              ) : (
                <TableQuadrant
                  formations={filteredFormations.map((formation) => ({
                    ...formation,
                    tauxInsertion: formation.tauxInsertion,
                    tauxPoursuite: formation.tauxPoursuite,
                  }))}
                  order={order}
                  handleOrder={(column?: string) =>
                    handleOrder(column as OrderPanoramaEtablissement["orderBy"])
                  }
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
