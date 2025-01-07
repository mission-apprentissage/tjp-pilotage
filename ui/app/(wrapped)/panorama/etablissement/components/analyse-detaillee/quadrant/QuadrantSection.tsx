import {
  AspectRatio,
  Badge,
  Box,
  Flex,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useMemo } from "react";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import type {
  ChiffresEntree,
  ChiffresIJ,
  Etablissement,
  Formation,
  StatsSortie,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { Quadrant } from "@/components/Quadrant";

import { DonneesDisponiblesSection } from "./DonneesDisponiblesSection";
import { DonneesIndisponiblesSection } from "./DonneesIndisponiblesSection";
import { FormationTooltipContent } from "./FormationTooltipContent";
const effectifSizes = [
  { max: 1, size: 10 },
  { max: 20, size: 20 },
  { max: 50, size: 30 },
  { max: 100, size: 40 },
];

export const QuadrantSection = ({
  etablissement,
  formations,
  currentFormation,
  chiffresEntree,
  chiffresIJ,
  statsSortie,
  offre,
  setOffre,
}: {
  etablissement?: Etablissement;
  formations: Formation[];
  currentFormation?: Formation;
  chiffresEntree?: ChiffresEntree;
  chiffresIJ?: ChiffresIJ;
  statsSortie?: StatsSortie;
  offre: string;
  setOffre: (offre: string) => void;
}) => {
  const filteredFormations = Object.values(formations)
    .map((formation) => ({
      ...formation,
      tauxPoursuite: chiffresIJ?.[formation.offre]?.[CURRENT_IJ_MILLESIME]?.tauxPoursuite ?? 0,
      tauxInsertion: chiffresIJ?.[formation.offre]?.[CURRENT_IJ_MILLESIME]?.tauxInsertion ?? 0,
      tauxPoursuiteRegional: chiffresIJ?.[formation.offre]?.[CURRENT_IJ_MILLESIME]?.tauxPoursuiteRegional ?? 0,
      tauxInsertionRegional: chiffresIJ?.[formation.offre]?.[CURRENT_IJ_MILLESIME]?.tauxInsertionRegional ?? 0,
      positionQuadrant: chiffresIJ?.[formation.offre]?.[CURRENT_IJ_MILLESIME]?.positionQuadrant,
      effectif: chiffresEntree?.[formation.offre]?.[CURRENT_RENTREE]?.effectifEntree,
      continum: chiffresIJ?.[formation.offre]?.[CURRENT_IJ_MILLESIME]?.continuum,
    }))
    .filter((formation) => (formation.tauxPoursuite || formation.tauxInsertion) && formation.effectif);

  const getOffreDimensions = (): Array<"tauxPoursuite" | "tauxInsertion"> | undefined => {
    const dimensions: Array<"tauxPoursuite" | "tauxInsertion"> = [];
    if (chiffresIJ?.[offre]?.[CURRENT_IJ_MILLESIME]?.tauxPoursuite) {
      dimensions.push("tauxPoursuite");
    }
    if (chiffresIJ?.[offre]?.[CURRENT_IJ_MILLESIME]?.tauxInsertion) {
      dimensions.push("tauxInsertion");
    }
    return dimensions.length ? dimensions : undefined;
  };

  const offresDimensions: Array<"tauxPoursuite" | "tauxInsertion"> | undefined = useMemo(
    () => getOffreDimensions(),
    [offre]
  );

  return (
    <Flex direction={"column"} gap={4}>
      <Flex direction="row" justify={"space-between"}>
        <Text fontSize={14} fontWeight={700} textTransform={"uppercase"}>
          Quadrant
        </Text>
        <Badge variant="info" maxH={5} mt="auto">
          Millésimes 2021+2022
        </Badge>
      </Flex>
      <Text fontSize={14} color={"grey.200"}>
        Comparez les taux d'emploi et de poursuite d'études des formations de l'établissement avec les taux moyens de la
        région
      </Text>
      <Flex direction={"row"} gap={2} h={10}>
        <GlossaireShortcut
          label="Comprendre le quadrant"
          glossaireEntryKey="quadrant"
          color={"grey.425"}
          textDecorationLine={"underline"}
        />
      </Flex>
      <DonneesDisponiblesSection
        formations={formations}
        filteredFormations={filteredFormations}
        chiffresEntree={chiffresEntree}
      />
      <Flex direction={"column"} m={12} mt={4} gap={2}>
        <Flex direction={"row"} justify="space-between">
          <Flex justify="flex-start" ms={10}>
            <Text color="black" fontSize={14} fontWeight={700}>
              {`${filteredFormations?.length ?? "-"} formations -
              ${filteredFormations.reduce((acc, { effectif }) => acc + (effectif ?? 0), 0) ?? 0}
              élèves`}
            </Text>
          </Flex>
          <Flex>
            <Popover>
              <PopoverTrigger>
                <Flex cursor="pointer">
                  <Icon icon="ri:eye-line" color="grey.425" width={"14px"} />
                  <Text ms={2} color="grey.425" textDecoration={"underline"} lineHeight={"14px"}>
                    Légende
                  </Text>
                </Flex>
              </PopoverTrigger>
              <PopoverContent _focusVisible={{ outline: "none" }} p="3">
                <>
                  <PopoverCloseButton />
                  <InfoTooltipContent />
                </>
              </PopoverContent>
            </Popover>
          </Flex>
        </Flex>
        <AspectRatio ratio={1} w={"100%"} h={"100%"}>
          {filteredFormations &&
          filteredFormations.length &&
          statsSortie?.tauxPoursuite &&
          statsSortie?.tauxInsertion ? (
              <Quadrant
                meanPoursuite={statsSortie.tauxPoursuite}
                meanInsertion={statsSortie.tauxInsertion}
                data={filteredFormations.map((formation) => ({
                  ...formation,
                  codeDispositif: formation.codeDispositif ?? "",
                }))}
                currentFormationId={`${currentFormation?.cfd}_${currentFormation?.codeDispositif}`}
                TooltipContent={FormationTooltipContent}
                onClick={(formation: (typeof filteredFormations)[number]) => {
                  if (offre !== formation.offre) setOffre(formation.offre);
                }}
                effectifSizes={effectifSizes}
                dimensions={offresDimensions}
              />
            ) : (
              <Flex>
                <Text>Aucune donnée à afficher pour les filtres sélectionnés</Text>
              </Flex>
            )}
        </AspectRatio>
      </Flex>
      <DonneesIndisponiblesSection
        dimensions={offresDimensions}
        currentFormation={currentFormation}
        etablissement={etablissement}
      />
    </Flex>
  );
};

const InfoTooltipContent = () => (
  <>
    <Text mt="4" mb="2" fontSize="sm" fontWeight="bold">
      Légende:
    </Text>
    <Flex direction="column" justify={"flex-start"} gap={2}>
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
    </Flex>
  </>
);
