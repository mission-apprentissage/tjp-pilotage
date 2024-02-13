import {
  AspectRatio,
  Box,
  Center,
  Flex,
  Img,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { client } from "@/api.client";

import { StatCard } from "../../components/StatCard";
import { UaiForm } from "../UaiForm";

const getSign = (value: number) => {
  return value >= 0 ? "+" : "";
};

export const EtablissementSection = ({
  uai,
  etablissement,
  onUaiChanged,
}: {
  uai: string;
  etablissement?: (typeof client.infer)["[GET]/panorama/stats/etablissement/:uai"];
  onUaiChanged: (codeRegion: string) => void;
}) => {
  return (
    <Box
      px={[4, null, "8"]}
      mx={[-4, null, 0]}
      as="section"
      pb="12"
      pt="6"
      bg="grey.975"
      maxWidth={"container.xl"}
    >
      <Stack mt="8" direction={["column", "row"]} spacing="16" align="center">
        <Flex direction="column" align="center" flex={1}>
          <Box maxW="300px">
            <UaiForm uai={uai} onUaiChanged={onUaiChanged} inError={false} />
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
                  : "-"
              }
              isValeurAjoutee
            />
            <StatCard
              label="Nombre de formations"
              value={etablissement?.nbFormations ?? "-"}
            />
            <StatCard
              label="Effectif d'entrée"
              value={etablissement?.effectif ?? "-"}
            />
          </SimpleGrid>
        </Box>
      </Stack>
    </Box>
  );
};
