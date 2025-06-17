import { Box, Flex, Heading, HStack, Img, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { CURRENT_IJ_MILLESIME, CURRENT_RENTREE } from "shared";

import { TooltipDefinitionTauxDevenirFavorable } from "@/app/(wrapped)/components/definitions/DefinitionTauxDevenirFavorable";
import { TooltipDefinitionTauxEmploi6Mois } from "@/app/(wrapped)/components/definitions/DefinitionTauxEmploi6Mois";
import { TooltipDefinitionTauxPoursuiteEtudes } from "@/app/(wrapped)/components/definitions/DefinitionTauxPoursuiteEtudes";
import { TooltipDefinitionTauxRemplissage } from "@/app/(wrapped)/components/definitions/DefinitionTauxRemplissage";
import { useGlossaireContext } from "@/app/(wrapped)/glossaire/glossaireContext";
import type { StatsFormations } from "@/app/(wrapped)/panorama/types";
import { BadgeMillesimes } from "@/components/BadgeMillesimes";
import { BadgeRentreeScolaire } from "@/components/BadgeRentreeScolaire";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { TooltipIcon } from "@/components/TooltipIcon";
import { formatNumberToString, formatPercentage } from "@/utils/formatUtils";

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
            {libelleTerritoire}&nbsp;<br/>
            {libelleDiplome}
          </Heading>
        </Box>
        <Flex direction={"row"} mt={"8px"}>
          <Flex style={{ textWrap: "pretty" }}>
            Retrouvez ici les principaux indicateurs sur votre territoire (voie scolaire).
          </Flex>
        </Flex>
        <Img alignSelf={"end"} src="/design_search.svg" objectFit="cover" width={"auto"} height={"100%"} mt={"1rem"} alt=""/>
      </Flex>
      <SimpleGrid spacing={3} columns={[1, 3, 3]} flex={2}>
        <StatCard
          label={`Nombre de formations dans votre ${typeTerritoire === "region" ? "région" : "département"}`}
          badge={<BadgeRentreeScolaire rentreeScolaire={CURRENT_RENTREE} />}
          value={stats?.nbFormations ?? "-"}
        />
        <StatCard
          label={`Nombre total d’élèves dans votre ${typeTerritoire === "region" ? "région" : "département"}`}
          value={formatNumberToString(stats?.effectifTotal, 0, "-")}
          sub={
            stats?.effectifEntree ? (
              <HStack>
                <Text fontSize={12} color={"grey.425"}>
                  dont effectif en entrée {stats.effectifEntree}{" "}
                </Text>
                <GlossaireShortcut
                  glossaireEntryKey="effectif-en-entree"
                  ml={0.5}
                  color="grey.425"
                  tooltip={
                    <Flex direction="column" gap={2}>
                      <Text>Effectifs en entrée en première année de formation.</Text>
                      <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                    </Flex>
                  }
                />
              </HStack>
            ) : undefined
          }
          badge={<BadgeRentreeScolaire rentreeScolaire={CURRENT_RENTREE} />}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Flex direction="column" gap={2}>
                  <Text>Nombre total d’élèves, toutes années de formation confondues</Text>
                  <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                </Flex>
              }
              onClick={() => openGlossaire("nombre-deleves")}
            />
          }
        />
        <StatCard
          label={`Taux de remplissage dans votre ${typeTerritoire === "region" ? "région" : "département"}`}
          value={formatPercentage(stats?.tauxRemplissage, 0, "-")}
          tooltip={formatPercentage(stats?.tauxRemplissage, 2, "-")}
          type={"percentage"}
          glossaire={<TooltipDefinitionTauxRemplissage />}
          badge={<BadgeRentreeScolaire rentreeScolaire={CURRENT_RENTREE} />}
        />
        <StatCard
          label={`Taux de devenir favorable dans votre région`}
          value={formatPercentage(stats?.tauxDevenirFavorable, 0, "-")}
          tooltip={formatPercentage(stats?.tauxDevenirFavorable, 2, "-")}
          type={"percentage"}
          glossaire={<TooltipDefinitionTauxDevenirFavorable />}
          badge={<BadgeMillesimes millesimes={CURRENT_IJ_MILLESIME} />}
        />
        <StatCard
          label="Taux de poursuite d'études dans votre région"
          value={formatPercentage(stats?.tauxPoursuite, 0, "-")}
          tooltip={formatPercentage(stats?.tauxPoursuite, 2, "-")}
          type={"percentage"}
          glossaire={<TooltipDefinitionTauxPoursuiteEtudes />}
          badge={<BadgeMillesimes millesimes={CURRENT_IJ_MILLESIME} />}
        />
        <StatCard
          label="Taux d'emploi à 6 mois dans votre région"
          value={formatPercentage(stats?.tauxInsertion, 0, "-")}
          tooltip={formatPercentage(stats?.tauxInsertion, 2, "-")}
          type={"percentage"}
          glossaire={<TooltipDefinitionTauxEmploi6Mois />}
          badge={<BadgeMillesimes millesimes={CURRENT_IJ_MILLESIME} />}
        />
      </SimpleGrid>
    </Stack>
  );
};
