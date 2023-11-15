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

import { api } from "../../../../../api.client";
import { TooltipIcon } from "../../../../../components/TooltipIcon";
import { UaiForm } from "../UaiForm";

const StatCard = ({
  label,
  value,
  isValeurAjoutee = false,
  color = "inherit",
}: {
  label: string;
  value?: string | number;
  isValeurAjoutee?: boolean;
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
        {isValeurAjoutee && (
          <TooltipIcon
            ml="3"
            label="Capacité de l’établissement à insérer, en prenant en compte le profil social des élèves et le taux de chômage de la zone d’emploi, comparativement au taux de référence d’établissements similaires."
          />
        )}
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
      bg="grey.975"
      maxWidth={"container.xl"}
    >
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
              <Text _firstLetter={{ textTransform: "capitalize" }}>
                {etablissement?.libelleEtablissement ?? "-"}
              </Text>
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
              isValeurAjoutee
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
