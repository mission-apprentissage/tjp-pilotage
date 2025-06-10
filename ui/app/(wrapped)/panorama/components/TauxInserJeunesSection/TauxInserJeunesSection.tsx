import { Box, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { CURRENT_IJ_MILLESIME } from "shared";

import type { PanoramaStatsTauxInsertion, PanoramaStatsTauxPoursuite } from "@/app/(wrapped)/panorama/types";
import { BarGraph } from "@/app/(wrapped)/suivi-impact/components/BarGraph";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";
import { formatMillesime } from "@/utils/formatLibelle";

export const TauxInserJeunesSection = ({
  region,
  tauxPoursuite,
  tauxInsertion,
}: {
  region?: string;
  tauxPoursuite?: PanoramaStatsTauxPoursuite;
  tauxInsertion?: PanoramaStatsTauxInsertion;
}) => {
  return (
    <Box as="section" py="6" mt="6" maxWidth={"container.xl"} height={"475px"}>
      <Box width={"fit-content"} mb={"32px"}>
        <Heading fontWeight={"bold"} as="h2" fontSize={"28px"}>
          Évolution des taux InserJeunes
        </Heading>
        <Box w={"33%"} mt={"16px"}>
          <hr />
        </Box>
        <Flex color={"grey.200"} my={"24px"}>
          <Text>Comparez les principaux indicateurs régionaux sur les derniers millésimes</Text>
          <GlossaireShortcut ml={"8px"} glossaireEntryKey="millesime" />
        </Flex>
      </Box>
      <HStack>
        {/* TAUX EMPLOI A 6 MOIS */}
        <Box w={"50%"}>
          <Flex>
            <Text fontWeight={"bold"} color="grey.200">
              TAUX D'EMPLOI À 6 MOIS
            </Text>
            <GlossaireShortcut
              ml={2}
              tooltip={
                <Flex direction="column" gap={2}>
                  <Text>
                    La part de ceux qui sont en emploi 6 mois après leur sortie d’étude
                    (millésimes {formatMillesime(CURRENT_IJ_MILLESIME)}).
                  </Text>
                  <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                </Flex>
              }
              glossaireEntryKey="taux-emploi-6-mois"
            />
          </Flex>
          <BarGraph graphData={tauxInsertion} isFiltered={true} libelleRegion={region} />
        </Box>

        {/* TAUX POURSUITE ETUDE */}
        <Box w={"50%"}>
          <Flex>
            <Text fontWeight={"bold"} color="grey.200" my={"8px"}>
              TAUX DE POURSUITE D'ÉTUDES
            </Text>
            <GlossaireShortcut
              ml={2}
              tooltip={
                <Flex direction="column" gap={2}>
                  <Text>
                    Tout élève inscrit à N+1 (réorientation et redoublement compris)
                    (millésimes {formatMillesime(CURRENT_IJ_MILLESIME)}).
                  </Text>
                  <Text fontWeight={700}>Cliquez pour plus d'infos.</Text>
                </Flex>
              }
              glossaireEntryKey="taux-poursuite-etudes"
            />
          </Flex>
          <BarGraph graphData={tauxPoursuite} isFiltered={true} libelleRegion={region} />
        </Box>
      </HStack>
    </Box>
  );
};
