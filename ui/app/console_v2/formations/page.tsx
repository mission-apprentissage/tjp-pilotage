"use client";

import { Box, Center, HStack, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

type DATA = {
  id: string;
  codeFormationDiplome: string;
  libelleDiplome: string;
  nbEtablissement: number;
  effectif: number;
  dispositifId: string;
};

const fetchFormations = async ({
  offset,
  limit,
}: {
  offset?: number;
  limit?: number;
}) =>
  (
    await axios.get("http://localhost/api/formations", {
      params: { offset, limit },
    })
  ).data.formations as DATA[];

const useFormations = () => {
  const [formations, setFormations] = useState<DATA[]>();

  useEffect(() => {
    (async () => {
      const fetchedFormations = await fetchFormations({ offset: 0, limit: 30 });
      setFormations(fetchedFormations);
    })();
  }, []);
  return formations;
};

export default function Home() {
  const formations = useFormations();
  if (!formations) return <Center py="4">load</Center>;
  return (
    <VStack align={"stretch"} mt="6">
      <HStack justify={"space-between"}>
        <Box px="2" width="25%">
          Libellé
        </Box>
        <Box px="2" width="25%">
          codeFormationDiplome
        </Box>
        <Box px="2" width="25%">
          nbEtablissement
        </Box>
        <Box px="2" width="25%">
          effectif
        </Box>
      </HStack>
      {formations.map(
        ({
          id,
          libelleDiplome,
          codeFormationDiplome,
          effectif,
          nbEtablissement,
          dispositifId,
        }) => (
          <HStack justify={"space-between"} key={`${id}_${dispositifId}`}>
            <Box px="2" width="25%">
              {libelleDiplome}
            </Box>
            <Box px="2" width="25%">
              {codeFormationDiplome}
            </Box>
            <Box px="2" width="25%">
              {nbEtablissement}
            </Box>
            <Box px="2" width="25%">
              {effectif}
            </Box>
          </HStack>
        )
      )}
    </VStack>
  );
}
