import {
  AspectRatio,
  Box,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Img,
  Select,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { Multiselect } from "../../../../components/Multiselect";
import { PanoramaFormation } from "./type";

const StatCard = ({
  label,
  value,
  color = "inherit",
}: {
  label: string;
  value?: string | number;
  color?: string;
}) => (
  <Card>
    <CardBody
      color={color}
      py="2"
      px="3"
      alignItems={"center"}
      display={"flex"}
    >
      <Box mr="4" flex={1}>
        {label}
      </Box>
      <Box fontWeight="bold" fontSize="2xl">
        {value ?? "-"}
      </Box>
    </CardBody>
  </Card>
);

export const RegionSection = ({
  codeRegion,
  onCodeRegionChanged,
  regionOptions,
  stats,
  codeDiplome,
  onDiplomeChanged,
  formations,
}: {
  onDiplomeChanged?: (diplome: string[]) => void;
  codeDiplome?: string[];
  codeRegion?: string;
  onCodeRegionChanged: (codeRegion: string) => void;
  regionOptions?: { label: string; value: string }[];
  stats?: ApiType<typeof api.getRegionStats>;
  formations?: PanoramaFormation[];
}) => {
  const labelRegion = regionOptions?.find(
    (item) => item.value === codeRegion
  )?.label;

  const diplomeOptions = Object.values(
    formations?.reduce((acc, cur) => {
      return {
        ...acc,
        [cur.codeNiveauDiplome]: {
          value: cur.codeNiveauDiplome,
          label: cur.libelleNiveauDiplome as string,
        },
      };
    }, {} as Record<string, { value: string; label: string }>) ?? {}
  );

  return (
    <Container
      px="8"
      as="section"
      pb="12"
      pt="6"
      bg="#F9F8F6"
      maxWidth={"container.xl"}
    >
      <Stack mt="8" direction={["column", "row"]} spacing="16" align="center">
        <Flex direction="column" align="center" flex={1}>
          <FormControl maxW="300px">
            <FormLabel>Choisissez une région</FormLabel>
            <Select
              onChange={(e) => onCodeRegionChanged(e.target.value)}
              variant="input"
              value={codeRegion}
            >
              {regionOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <FormLabel mt="4">Diplôme</FormLabel>
            <Multiselect
              onChange={onDiplomeChanged}
              width="100%"
              options={diplomeOptions}
              value={codeDiplome ?? []}
              size="md"
            >
              Diplôme
            </Multiselect>
          </FormControl>
          <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
            <Img src="/graphs_statistics.png" objectFit="contain" />
          </AspectRatio>
        </Flex>
        <Box flex={1}>
          <Text>
            Retrouvez ici les principaux indicateurs (chiffres 2022) sur votre
            territoire.
          </Text>
          <SimpleGrid spacing={3} columns={[2]} mt="4">
            <Center fontSize="2xl" fontWeight="bold">
              {labelRegion ?? "-"}
            </Center>
            <StatCard
              label="Taux poursuite étude dans votre région"
              value={
                stats?.tauxPoursuiteEtudes
                  ? `${stats.tauxPoursuiteEtudes}%`
                  : undefined
              }
            />
            <StatCard
              label="Taux de remplissage dans votre région"
              value={
                stats?.tauxRemplissage ? `${stats.tauxRemplissage}%` : undefined
              }
            />
            <StatCard
              label="Taux d'emploi à 6 mois dans votre région"
              value={
                stats?.tauxInsertion6mois
                  ? `${stats.tauxInsertion6mois}%`
                  : undefined
              }
            />
            <StatCard
              label="Nombre de formations dans votre région"
              value={stats?.nbFormations ?? "-"}
            />
            <StatCard
              label="Effectif en entrée dans votre région"
              value={stats?.effectif ?? "-"}
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
};
