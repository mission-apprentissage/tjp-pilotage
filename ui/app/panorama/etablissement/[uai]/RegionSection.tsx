import { Box, Container, Heading, HStack, Text } from "@chakra-ui/react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";

export const RegionSection = ({
  regionsStats,
}: {
  regionsStats?: ApiType<typeof api.getDataForPanorama>["stats"];
}) => {
  return (
    <Container as="section" py="6" mt="6" maxWidth={"container.xl"}>
      <Heading fontWeight={"hairline"} maxWidth={300} as="h2" ml="6" mb={12}>
        Chiffres clefs de votre région
      </Heading>
      <HStack justify="flex-end">
        <Box mr="auto">
          Retrouver les indicateurs clefs sur votre territoire.
        </Box>
        <StatCard
          value={regionsStats?.tauxPoursuiteEtudes}
          label="Taux de remplissage dans la région"
        />
        <StatCard
          value={regionsStats?.tauxInsertion12mois}
          label="Taux de poursuite d’étude dans la région"
        />
        <StatCard
          value={regionsStats?.tauxRemplissage}
          label="Taux d’emploi à 12 mois dans la région"
        />
      </HStack>
    </Container>
  );
};

const StatCard = ({ value, label }: { value?: number; label: string }) => {
  return (
    <Box
      p="4"
      bg="grey.975"
      borderBottom="2px solid"
      borderBottomColor="bluefrance.113"
      maxWidth={240}
    >
      <Text fontSize="lg" fontWeight="bold">
        {value !== undefined ? `${value}%` : "-"}
      </Text>
      <Text>{label}</Text>
    </Box>
  );
};
