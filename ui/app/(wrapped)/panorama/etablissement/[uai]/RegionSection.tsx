import { Box, Container, Heading, HStack, Text } from "@chakra-ui/react";

import { client } from "@/api.client";

export const RegionSection = ({
  regionsStats,
}: {
  regionsStats?: (typeof client.infer)["[GET]/region/:codeRegion"];
}) => {
  const formatedLibelleRegion = (libelleRegion: string): string => {
    const voyelles = "aeiiîouAEIÎOU";
    return voyelles.indexOf(libelleRegion[0]) !== -1
      ? `d'${libelleRegion}`
      : `de ${libelleRegion}`;
  };

  return (
    <Container as="section" py="6" mt="12" maxWidth={"container.xl"}>
      <HStack justify="flex-end" align="center">
        <Heading
          fontWeight={"hairline"}
          maxWidth={300}
          as="h2"
          ml="6"
          mr="auto"
        >
          Chiffres clefs{" "}
          {formatedLibelleRegion(regionsStats?.libelleRegion ?? "votre région")}
        </Heading>
        <StatCard
          value={regionsStats?.tauxRemplissage}
          label="Taux de remplissage dans la région"
        />
        <StatCard
          value={regionsStats?.tauxPoursuite}
          label="Taux de poursuite d’étude dans la région"
        />
        <StatCard
          value={regionsStats?.tauxInsertion}
          label="Taux d’emploi à 6 mois dans la région"
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
