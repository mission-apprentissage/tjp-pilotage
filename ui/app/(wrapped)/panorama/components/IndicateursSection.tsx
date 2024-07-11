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

import { GlossaireShortcut } from "../../../../components/GlossaireShortcut";
import { displayPercentage } from "../../../../utils/displayPercent";
import { roundNumber } from "../../../../utils/roundNumber";
import { StatsFormations } from "../types";
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
            Retrouvez ici les principaux indicateurs sur votre territoire
            (chiffres {CURRENT_RENTREE}).{" "}
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
        />
        <StatCard
          label={`Nombre d’élèves dans votre ${
            typeTerritoire === "region" ? "région" : "département"
          }`}
          value={stats?.effectif ? stats.effectif : "-"}
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
              ? displayPercentage(stats?.tauxRemplissage, 3)
              : "-"
          }
          type={"percentage"}
        />
        <StatCard
          label={`Taux de devenir favorable dans votre ${
            typeTerritoire === "region" ? "région" : "département"
          }`}
          value={
            stats?.tauxDevenirFavorable
              ? roundNumber(stats.tauxDevenirFavorable * 100, 0)
              : undefined
          }
          tooltip={
            stats?.tauxDevenirFavorable
              ? displayPercentage(stats?.tauxDevenirFavorable, 3)
              : "-"
          }
          type={"percentage"}
        />
        <StatCard
          label="Taux de poursuite d'études dans votre région"
          value={
            stats?.tauxPoursuite
              ? roundNumber(stats.tauxPoursuite * 100, 0)
              : undefined
          }
          tooltip={
            stats?.tauxPoursuite
              ? displayPercentage(stats?.tauxPoursuite, 3)
              : "-"
          }
          type={"percentage"}
        />
        <StatCard
          label="Taux d'emploi à 6 mois dans votre région"
          value={
            stats?.tauxInsertion
              ? roundNumber(stats.tauxInsertion * 100, 0)
              : undefined
          }
          tooltip={
            stats?.tauxInsertion
              ? displayPercentage(stats?.tauxInsertion, 3)
              : "-"
          }
          type={"percentage"}
        />
      </SimpleGrid>
    </Stack>
  );
};
