import {
  Box,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";

import { GlossaireShortcut } from "../../../../../components/GlossaireShortcut";
import { TooltipIcon } from "../../../../../components/TooltipIcon";
import { displayPercentage } from "../../../../../utils/displayPercent";
import { roundNumber } from "../../../../../utils/roundNumber";
import { useGlossaireContext } from "../../../glossaire/glossaireContext";
import { StatsFormations } from "../../types";
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
          <Text style={{ textWrap: "pretty" }}>
            Retrouvez ici les principaux indicateurs sur votre territoire (Voie
            scolaire, Chiffres {CURRENT_RENTREE}).{" "}
            <GlossaireShortcut
              display={"inline"}
              marginInline={1}
              iconSize={"16px"}
            />
          </Text>
        </Flex>
        <Img
          alignSelf={"end"}
          src="/design_search.svg"
          objectFit="cover"
          width={"auto"}
          height={"100%"}
          mt={"1rem"}
        />
      </Flex>
      <SimpleGrid spacing={3} columns={[1, 3, 3]} flex={2}>
        <StatCard
          label={`Nombre de formations dans votre ${
            typeTerritoire === "region" ? "région" : "département"
          }`}
          value={stats?.nbFormations ?? "-"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box display="inline">
                  <Text>
                    Dans Orion, une formation s’entend pour un niveau de diplôme
                    et une durée donnés
                  </Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire()}
            />
          }
        />
        <StatCard
          label={`Nombre total d’élèves dans votre ${
            typeTerritoire === "region" ? "région" : "département"
          }`}
          value={stats?.effectifTotal ? stats.effectifTotal : "-"}
          sub={
            stats?.effectifEntree
              ? `dont effectif en entrée ${stats.effectifEntree}`
              : undefined
          }
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box display="inline">
                  <Text>
                    Nombre total d’élèves, toutes années de formation confondues
                  </Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("effectifs")}
            />
          }
        />
        <StatCard
          label={`Taux de remplissage dans votre ${
            typeTerritoire === "region" ? "région" : "département"
          }`}
          value={
            stats?.tauxRemplissage
              ? roundNumber(stats.tauxRemplissage * 100, 0)
              : undefined
          }
          tooltip={
            stats?.tauxRemplissage
              ? displayPercentage(stats?.tauxRemplissage)
              : "-"
          }
          type={"percentage"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box>
                  <Text>
                    Le ratio entre l’effectif d’entrée en formation et sa
                    capacité.
                  </Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("taux-de-remplissage")}
            />
          }
        />
        <StatCard
          label={`Taux de devenir favorable dans votre région`}
          value={
            stats?.tauxDevenirFavorable
              ? roundNumber(stats.tauxDevenirFavorable * 100, 0)
              : undefined
          }
          tooltip={
            stats?.tauxDevenirFavorable
              ? displayPercentage(stats?.tauxDevenirFavorable)
              : "-"
          }
          type={"percentage"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box display="inline">
                  <Text>
                    (nombre d'élèves inscrits en formation + nombre d'élèves en
                    emploi) / nombre d'élèves en entrée en dernière année de
                    formation.
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
          value={
            stats?.tauxPoursuite
              ? roundNumber(stats.tauxPoursuite * 100, 0)
              : undefined
          }
          tooltip={
            stats?.tauxPoursuite ? displayPercentage(stats?.tauxPoursuite) : "-"
          }
          type={"percentage"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box>
                  <Text>
                    Tout élève inscrit à N+1 (réorientation et redoublement
                    compris).
                  </Text>
                  <Text>Cliquez pour plus d'infos.</Text>
                </Box>
              }
              onClick={() => openGlossaire("taux-poursuite-etudes")}
            />
          }
        />
        <StatCard
          label="Taux d'emploi à 6 mois dans votre région"
          value={
            stats?.tauxInsertion
              ? roundNumber(stats.tauxInsertion * 100, 0)
              : undefined
          }
          tooltip={
            stats?.tauxInsertion ? displayPercentage(stats?.tauxInsertion) : "-"
          }
          type={"percentage"}
          glossaire={
            <TooltipIcon
              ml="1"
              label={
                <Box>
                  <Text>
                    La part de ceux qui sont en emploi 6 mois après leur sortie
                    d’étude.
                  </Text>
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
