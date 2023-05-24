import {
  Box,
  Card,
  CardBody,
  Center,
  Container,
  FormControl,
  FormLabel,
  Select,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

import { api } from "../../api.client";

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
}: {
  codeRegion?: string;
  onCodeRegionChanged: (codeRegion: string) => void;
  regionOptions?: { label: string; value: string }[];
}) => {
  const { data } = useQuery(["regionStatsForCadran", { codeRegion }], () => {
    if (!codeRegion) return;
    return api.getRegionStatsForCadran({ query: { codeRegion } }).call();
  });

  return (
    <Container
      px="36"
      as="section"
      py="12"
      bg="#fbf6ed"
      maxWidth={"container.xl"}
    >
      <Stack direction={["column", "row"]} spacing="16">
        <Box flex={1}>
          <FormControl>
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
          </FormControl>
        </Box>
        <Box flex={2}>
          {
            <SimpleGrid spacing={3} columns={[2]}>
              <Center fontSize="2xl" fontWeight="bold">
                Occitanie
              </Center>
              <StatCard
                label="Tx poursuite étude dans votre région"
                value={
                  data?.tauxPoursuiteEtudes
                    ? `${data.tauxPoursuiteEtudes}%`
                    : undefined
                }
              />
              <StatCard
                color="#FF9575"
                label="Formations à examiner dans votre région"
                value={data?.nbFormationsDefavorables}
              />
              <StatCard
                label="Taux d'insertion dans votre région"
                value={
                  data?.tauxInsertion12mois
                    ? `${data.tauxInsertion12mois}%`
                    : undefined
                }
              />
              <StatCard
                color="bluefrance.113"
                label="Formations avec un devenir favorable"
                value={data?.nbFormationsFavorables}
              />
              <StatCard
                label="Taux de remplissage dans votre région"
                value={
                  data?.tauxRemplissage ? `${data.tauxRemplissage}%` : undefined
                }
              />
            </SimpleGrid>
          }
        </Box>
      </Stack>
    </Container>
  );
};
