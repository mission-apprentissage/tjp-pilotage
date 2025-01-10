import { Box, Flex, Heading, HStack, Img, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";

import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { StatsFormations } from "@/app/(wrapped)/panorama/types";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatNumber, formatPercentage } from "@/utils/formatUtils";

import { StatCard } from "./StatCard";

export const IndicateursSection = ({
  libelleDiplome,
  libelleTerritoire,
  stats,
  typeTerritoire = "region",
}: {
  libelleTerritoire?: string;
  libelleDiplome?: string;
  stats?: StatsFormations;
  typeTerritoire?: "region" | "departement";
}) => {
  const { openGlossaire } = useGlossaireContext();
  return (
    <Stack
      px={[4, null, "32px"]}
      mx={[-4, null, 0]}
      as="section"
      py={[8, null, "24px"]}
      my={[0, null, "16px"]}
      bg="grey.975"
      maxWidth={"container.xl"}
      direction={["column", "row"]}
      gap={[0, null, "16px"]}
    >
      <Flex direction="column" align="space-between" flex={1}>
        <Box>
          <Heading as={"h1"} fontSize={"28px"}>
            {libelleTerritoire}
          </Heading>
          <Heading as={"h2"} fontSize={"28px"}>
            {libelleDiplome}
          </Heading>
        </Box>
        <Flex direction={"row"} mt={"8px"}>
          <Flex style={{ textWrap: "pretty" }}>
            Retrouvez ici les principaux indicateurs sur votre territoire (Voie scolaire, Chiffres {CURRENT_RENTREE}).{" "}
          </Flex>
        </Flex>
        <Img alignSelf={"end"} src="/design_search.svg" objectFit="cover" width={"auto"} height={"100%"} mt={"1rem"} alt=""/>
      </Flex>
      <SimpleGrid spacing={3} columns={[1, 3, 3]} flex={2}>
        <StatCard
          label={`Nombre de formations dans votre ${typeTerritoire === "region" ? "région" : "département"}`}
          value={stats?.nbFormations ?? "-"}
        />
        <StatCard
          label={`Nombre total d’élèves dans votre ${typeTerritoire === "region" ? "région" : "département"}`}
          value={stats?.effectifTotal ? stats.effectifTotal : "-"}
          sub={
            stats?.effectifEntree ? (
              <HStack>
                <Text fontSize={"12px"} color={"grey.425"}>
                  dont effectif en entrée {stats.effectifEntree}{" "}
                </Text>
                <GlossaireShortcut
                  glossaireEntryKey="effectif-en-entree"
                  ml={0.5}
                  color="grey.425"
                  tooltip={
                    <Box>
                      <Text>Effectifs en entrée en première année de formation.</Text>
                      <Text>Cliquez pour plus d'infos.</Text>
                    </Box>
                  }
                />
              </HStack>
            ) : undefined
          }
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box display="inline">
                  <Text>Nombre total d’élèves, toutes années de formation confondues</Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("nombre-deleves")}
            />
          }
        />
        <StatCard
          label={`Taux de remplissage dans votre ${typeTerritoire === "region" ? "région" : "département"}`}
          value={stats?.tauxRemplissage ? formatNumber(stats.tauxRemplissage * 100, 0) : undefined}
          tooltip={stats?.tauxRemplissage ? formatPercentage(stats?.tauxRemplissage, 2) : "-"}
          type={"percentage"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box>
                  <Text>Le ratio entre l’effectif d’entrée en formation et sa capacité.</Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("taux-de-remplissage")}
            />
          }
        />
        <StatCard
          label={`Taux de devenir favorable dans votre région`}
          value={stats?.tauxDevenirFavorable ? formatNumber(stats.tauxDevenirFavorable * 100, 0) : undefined}
          tooltip={stats?.tauxDevenirFavorable ? formatPercentage(stats?.tauxDevenirFavorable, 2) : "-"}
          type={"percentage"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box display="inline">
                  <Text>
                    (nombre d'élèves inscrits en formation + nombre d'élèves en emploi) / nombre d'élèves en entrée en
                    dernière année de formation.
                  </Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("taux-de-devenir-favorable")}
            />
          }
        />
        <StatCard
          label="Taux de poursuite d'études dans votre région"
          value={stats?.tauxPoursuite ? formatNumber(stats.tauxPoursuite * 100, 0) : undefined}
          tooltip={stats?.tauxPoursuite ? formatPercentage(stats?.tauxPoursuite, 2) : "-"}
          type={"percentage"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box>
                  <Text>Tout élève inscrit à N+1 (réorientation et redoublement compris).</Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("taux-poursuite-etudes")}
            />
          }
        />
        <StatCard
          label="Taux d'emploi à 6 mois dans votre région"
          value={stats?.tauxInsertion ? formatNumber(stats.tauxInsertion * 100, 0) : undefined}
          tooltip={stats?.tauxInsertion ? formatPercentage(stats?.tauxInsertion, 2) : "-"}
          type={"percentage"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box>
                  <Text>La part de ceux qui sont en emploi 6 mois après leur sortie d’études.</Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("taux-emploi-6-mois")}
            />
          }
        />
      </SimpleGrid>
    </Stack>
  );
};
