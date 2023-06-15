import {
  AspectRatio,
  Box,
  Card,
  CardBody,
  Center,
  Container,
  Flex,
  Img,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { Breadcrumb } from "../../../../components/Breadcrumb";
import { UaiForm } from "../UaiForm";

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

const getSign = (value: number) => {
  return value >= 0 ? "+" : "";
};

export const EtablissementSection = ({
  uai,
  etablissement,
  onUaiChanged,
}: {
  uai: string;
  etablissement?: ApiType<typeof api.getEtablissement>;
  onUaiChanged: (codeRegion: string) => void;
}) => {
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
          { title: "Panorama", to: "/panorama" },
        ]}
      />
      <Stack mt="8" direction={["column", "row"]} spacing="16" align="center">
        <Flex direction="column" align="center" flex={1}>
          <Box maxW="300px">
            <UaiForm defaultUai={uai} onUaiChanged={onUaiChanged} />
          </Box>
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
            <Center fontSize="lg" fontWeight="bold">
              {etablissement?.libelleEtablissement ?? "-"}
            </Center>
            <StatCard
              label="Valeur ajoutée"
              value={
                etablissement?.valeurAjoutee
                  ? `${getSign(etablissement.valeurAjoutee)}${
                      etablissement.valeurAjoutee
                    }`
                  : undefined
              }
            />
            <StatCard
              label="Nombre de formations"
              value={etablissement?.formations.length ?? "-"}
            />
            <StatCard
              label="Effectif d'entrée"
              value={
                etablissement?.formations.reduce(
                  (acc, cur) => acc + (cur.effectif ?? 0),
                  0
                ) ?? "-"
              }
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Container>
  );
};
