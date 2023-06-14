import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";

import { Cadran } from "../../../components/Cadran";
import { PanoramaFormations } from "./type";

export const CadranSection = ({
  cadranFormations,
  meanPoursuite,
  meanInsertion,
  codeNiveauDiplome,
}: {
  cadranFormations?: PanoramaFormations;
  meanPoursuite?: number;
  meanInsertion?: number;
  codeNiveauDiplome?: string[];
}) => {
  const filteredFormations = useMemo(
    () =>
      cadranFormations?.filter(
        (item) =>
          !codeNiveauDiplome?.length ||
          codeNiveauDiplome.includes(item.codeNiveauDiplome)
      ),
    [codeNiveauDiplome, cadranFormations]
  );

  return (
    <Container as="section" py="6" mt="6" maxWidth={"container.xl"}>
      <Box px="8">
        <Flex justify="flex-end">
          <Text color="grey" fontSize="sm" textAlign="left">
            {filteredFormations?.length ?? "-"} formations
          </Text>
          <Text ml="2" color="grey" fontSize="sm" textAlign="right">
            {filteredFormations?.reduce(
              (acc, { effectif }) => acc + (effectif ?? 0),
              0
            ) ?? "-"}{" "}
            élèves
          </Text>
        </Flex>
        <AspectRatio ratio={1}>
          <>
            {filteredFormations && (
              <Cadran
                meanPoursuite={meanPoursuite}
                meanInsertion={meanInsertion}
                data={filteredFormations}
              />
            )}
            {!filteredFormations && <Skeleton opacity="0.3" height="100%" />}
          </>
        </AspectRatio>
        <Text color="grey" textAlign="right" mt="4" fontSize="xs">
          Données Inser Jeunes produites par la DEPP, les formations inférieures
          à 20 élèves ne sont pas représentées
        </Text>
      </Box>
    </Container>
  );
};
