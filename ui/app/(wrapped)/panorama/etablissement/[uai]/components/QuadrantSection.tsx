import { ViewIcon } from "@chakra-ui/icons";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Skeleton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import { useMemo, useState } from "react";

import { ExportMenuButton } from "@/components/ExportMenuButton";
import { Quadrant } from "@/components/Quadrant";
import { TableQuadrant } from "@/components/TableQuadrant";
import { downloadCsv, downloadExcel } from "@/utils/downloadExport";

import {
  OrderPanoramaEtablissement,
  PanoramaFormationEtablissement,
  PanoramaFormationsEtablissement,
} from "../../../types";
import { FormationTooltipContent } from "./FormationTooltipContent";

type RequiredFields<T, F extends keyof T> = T & Required<Pick<T, F>>;

const effectifSizes = [
  { max: 1, size: 10 },
  { max: 20, size: 20 },
  { max: 50, size: 30 },
  { max: 100, size: 40 },
];

const Loader = () => (
  <Center height="100%" width="100%">
    <Spinner size="xl" />
  </Center>
);
export const QuadrantSection = ({
  quadrantFormations,
  isLoading,
  meanPoursuite,
  meanInsertion,
  codeNiveauDiplome,
  rentreeScolaire,
  order,
  handleOrder,
}: {
  isLoading: boolean;
  quadrantFormations?: PanoramaFormationsEtablissement;
  meanPoursuite?: number;
  meanInsertion?: number;
  codeNiveauDiplome?: string[];
  rentreeScolaire?: string;
  order?: Partial<OrderPanoramaEtablissement>;
  handleOrder: (column: OrderPanoramaEtablissement["orderBy"]) => void;
}) => {
  const trackEvent = usePlausible();

  const [typeVue, setTypeVue] = useState<"quadrant" | "tableau">("quadrant");
  const [currentCfd, setFormationId] = useState<string | undefined>();

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
          PanoramaFormationEtablissement,
          "tauxInsertion" | "tauxPoursuite"
        > =>
          item.effectif !== undefined &&
          item.effectif > 0 &&
          item.tauxInsertion !== undefined &&
          item.tauxPoursuite !== undefined &&
          (!codeNiveauDiplome?.length ||
            codeNiveauDiplome.includes(item.codeNiveauDiplome))
      ),
    [codeNiveauDiplome, quadrantFormations]
  );

  const renderQuadrant = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (!filteredFormations) {
      return <Skeleton opacity="0.3" height="100%" />;
    }

    if (typeVue === "quadrant") {
      return (
        <Quadrant
          meanPoursuite={meanPoursuite}
          meanInsertion={meanInsertion}
          data={filteredFormations.map((f) => ({
            ...f,
            codeDispositif: f.codeDispositif ?? "",
          }))}
          InfoTootipContent={InfoTooltipContent}
          TooltipContent={FormationTooltipContent}
          currentFormationId={currentCfd}
          onClick={({ cfd, codeDispositif }) =>
            setFormationId(`${cfd}_${codeDispositif}`)
          }
          effectifSizes={effectifSizes}
        />
      );
    }

    return (
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
        handleClick={setFormationId}
        currentFormationId={currentCfd}
      />
    );
  };

  return (
    <Box as="section" py="6" mt="8" maxWidth={"container.xl"}>
      <Box pl={[null, null, "8"]} maxW={500} mb="6">
        <Heading fontWeight={"hairline"} as="h2">
          Indicateurs régionaux de vos formations
        </Heading>
        <Text fontSize="sm" color="grey" mt="2">
          Rentrée scolaire {rentreeScolaire ?? "-"}
        </Text>
      </Box>
      <Box px={[null, null, "16"]} maxW={800} m="auto">
        <Flex justify="space-between" flexDir={["column", null, "row"]} gap={2}>
          <Flex gap={2}>
            <Button onClick={() => toggleTypeVue()} variant="solid">
              <ViewIcon mr={2}></ViewIcon>
              {`Passer en vue ${
                typeVue === "quadrant" ? "tableau" : "quadrant"
              }`}
            </Button>
            <ExportMenuButton
              onExportCsv={async () => {
                if (!filteredFormations) return;
                trackEvent("panorama-etablissement:export");
                downloadCsv(
                  "formations_panorama_etablissement",
                  filteredFormations.map((formation) => ({
                    ...formation,
                  })),
                  {
                    libelleFormation: "Formation",
                    cfd: "CFD",
                    libelleDispositif: "Dispositif",
                    tauxInsertion: "Taux d'emploi",
                    tauxPoursuite: "Taux de poursuite",
                    tauxPression: "Taux de pression",
                    positionQuadrant: "Position dans le quadrant",
                  }
                );
              }}
              onExportExcel={async () => {
                if (!filteredFormations) return;
                trackEvent("panorama-etablissement:export-excel");
                downloadExcel(
                  "formations_panorama_etablissement",
                  filteredFormations.map((formation) => ({
                    ...formation,
                  })),
                  {
                    libelleFormation: "Formation",
                    cfd: "CFD",
                    libelleDispositif: "Dispositif",
                    tauxInsertion: "Taux d'emploi",
                    tauxPoursuite: "Taux de poursuite",
                    tauxPression: "Taux de pression",
                    positionQuadrant: "Position dans le quadrant",
                  }
                );
              }}
              variant="solid"
            />
          </Flex>
          <Flex alignItems={"flex-end"} justify="flex-end">
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
          {renderQuadrant()}
        </AspectRatio>
        <Text color="grey" mt="4" fontSize="xs">
          Données Inser Jeunes produites par la DEPP, les formations inférieures
          à 20 sortants sur deux ans, ne sont pas représentées dans ce quadrant
          pour des raisons statistiques
        </Text>
      </Box>
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
