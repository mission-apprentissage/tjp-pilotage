import { Flex, Text } from "@chakra-ui/react";

import { Callout } from "@/components/Callout";

export const FormationAbsente = ({ nbEtablissements }: { nbEtablissements: number | undefined }) => {
  if (typeof nbEtablissements !== "number" || nbEtablissements > 0) {
    return null;
  }

  return (
    <Callout
      h={"fit-content"}
      body={
        <Flex gap={1} direction={"column"}>
          <Text fontWeight={"bold"}>Formation absente du territoire choisi</Text>
          <Text>Voici les établissements les plus proches qui proposent cette formation hors du territoire</Text>
        </Flex>
      }
    />
  );
};
