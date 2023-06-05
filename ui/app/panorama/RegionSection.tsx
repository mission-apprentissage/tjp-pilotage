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

import { Breadcrumb } from "../../components/Breadcrumb";
import { Multiselect } from "../../components/Multiselect";
import { PanoramaStats } from "./type";

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
  onUAIChanged,
  UAIOptions,
  stats,
}: {
  codeRegion?: string;
  onCodeRegionChanged: (codeRegion: string) => void;
  regionOptions?: { label: string; value: string }[];
  onUAIChanged: (UAI: string[]) => void;
  UAIOptions?: { label: string; value: string }[];
  stats?: PanoramaStats;
}) => {
  const labelRegion = regionOptions?.find(
    (item) => item.value === codeRegion
  )?.label;

  return (
    <Container
      px="8"
      as="section"
      pb="12"
      pt="6"
      bg="#F9F8F6"
      maxWidth={"container.xl"}
    >
      <Breadcrumb
        pages={[
          { title: "Accueil", to: "/" },
          { title: "Panorama", to: "/panorama", active: true },
        ]}
      />
      <Stack mt="8" direction={["column", "row"]} spacing="16" align="center">
        <Flex direction="column" align="center" flex={1}>
          <FormControl maxW="300px">
            <FormLabel>Sélectionner une région</FormLabel>
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
            <FormLabel display="none" mt="4">
              Sélectionner un établissement
            </FormLabel>
            <Multiselect
              display="none"
              width="100%"
              onChange={onUAIChanged}
              options={UAIOptions}
            >
              Etablissement
            </Multiselect>
          </FormControl>
          <AspectRatio width="100%" maxW="300px" ratio={2.7} mt="4">
            <Img src="/graphs_statistics.png" objectFit="contain" />
          </AspectRatio>
        </Flex>
        <Box flex={1}>
          <Text>
            Retrouvez ici les principaux indicateurs et enjeux sur votre
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
              label="Taux d'insertion dans votre région"
              value={
                stats?.tauxInsertion12mois
                  ? `${stats.tauxInsertion12mois}%`
                  : undefined
              }
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
};
