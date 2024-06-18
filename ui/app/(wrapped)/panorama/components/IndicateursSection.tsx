import {
  AspectRatio,
  Box,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Img,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";

import { GlossaireShortcut } from "../../../../components/GlossaireShortcut";
import { FiltersPanoramaFormation, StatsFormations } from "../types";
import { StatCard } from "./StatCard";

export const IndicateursSection = ({
  code,
  onCodeChanged,
  options,
  stats,
  handleFilters,
  activeFilters,
  diplomeOptions,
  typeTerritoire = "region",
}: {
  code?: string;
  onCodeChanged: (code: string) => void;
  handleFilters: (
    type: keyof FiltersPanoramaFormation,
    value: FiltersPanoramaFormation[keyof FiltersPanoramaFormation]
  ) => void;
  activeFilters: Partial<FiltersPanoramaFormation>;
  options?: { label: string; value: string }[];
  stats?: StatsFormations;
  diplomeOptions?: { value: string; label: string }[];
  typeTerritoire?: "region" | "departement";
}) => {
  const labelRegion = options?.find((item) => item.value === code)?.label;

  return (
    <Box
      px={[4, null, 8]}
      mx={[-4, null, 0]}
      as="section"
      pb={[8, null, 12]}
      pt={[0, null, 6]}
      bg="grey.975"
      maxWidth={"container.xl"}
    >
      <Stack mt="8" direction={["column", "row"]} spacing="16" align="center">
        <Flex direction="column" align="center" flex={1}>
          <FormControl maxW="300px">
            <FormLabel>
              Choisissez{" "}
              {typeTerritoire === "region" ? "une région" : "un département"}
            </FormLabel>
            <Select
              onChange={(e) => onCodeChanged(e.target.value)}
              variant="input"
              value={code}
              autoFocus={true}
            >
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <FormLabel mt="4">Diplôme</FormLabel>
            <Select
              variant="input"
              onChange={(e) => {
                if (e.target.value) {
                  handleFilters("codeNiveauDiplome", [e.target.value]);
                }
              }}
              width="100%"
              value={activeFilters.codeNiveauDiplome?.[0] ?? ""}
              size="md"
            >
              {diplomeOptions?.map((diplome) => (
                <option key={diplome.value} value={diplome.value}>
                  {diplome.label}
                </option>
              ))}
            </Select>
          </FormControl>
          <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
            <Img src="/graphs_statistics.png" objectFit="contain" />
          </AspectRatio>
        </Flex>
        <Box flex={1}>
          <Flex direction={"row"}>
            <Text>
              Retrouvez ici les principaux indicateurs (chiffres{" "}
              {CURRENT_RENTREE}) sur votre territoire.
            </Text>
            <GlossaireShortcut
              display={"inline"}
              marginInline={1}
              iconSize={"16px"}
            />
          </Flex>
          <SimpleGrid spacing={3} columns={[2]} mt="4">
            <Center fontSize="2xl" fontWeight="bold">
              {labelRegion ?? "-"}
            </Center>
            <StatCard
              label="Taux poursuite étude dans votre région"
              value={
                stats?.tauxPoursuite
                  ? `${Math.round(stats.tauxPoursuite * 100)}%`
                  : undefined
              }
            />
            <StatCard
              label={`Taux de remplissage dans votre ${
                typeTerritoire === "region" ? "région" : "département"
              }`}
              value={
                stats?.tauxRemplissage
                  ? `${Math.round(stats.tauxRemplissage * 100)}%`
                  : undefined
              }
            />
            <StatCard
              label="Taux d'emploi à 6 mois dans votre région"
              value={
                stats?.tauxInsertion
                  ? `${Math.round(stats.tauxInsertion * 100)}%`
                  : undefined
              }
            />
            <StatCard
              label={`Nombre de formations dans votre ${
                typeTerritoire === "region" ? "région" : "département"
              }`}
              value={stats?.nbFormations ?? "-"}
            />
            <StatCard
              label={`Effectif en entrée dans votre ${
                typeTerritoire === "region" ? "région" : "département"
              }`}
              value={stats?.effectif ? stats.effectif : "-"}
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Box>
  );
};
