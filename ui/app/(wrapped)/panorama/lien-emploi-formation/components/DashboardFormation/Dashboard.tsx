import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { client } from "@/api.client";

import { AsyncFormationSearch } from "./AsyncFormationSearch";
import { AsyncNsfSearch } from "./AsyncNsfSearch";
import { Metabase } from "./Metabase";

export type NsfOption =
  (typeof client.infer)["[GET]/nsf/search/:search"][number];
export type FormationOption =
  (typeof client.infer)["[GET]/nsf-diplome/search/:search"][number];

const DashboardFormation = () => {
  const [selectedNsf, setSelectedNsf] = useState<NsfOption | undefined>();
  const [selectedFormation, setSelectedFormation] = useState<
    FormationOption | undefined
  >();

  useEffect(() => {
    setSelectedFormation(undefined);
  }, [selectedNsf]);

  return (
    <VStack width="100%" alignItems="start" gap="16px">
      <Text>
        À partir d’une formation, visualisez l’offre de formation sur le
        territoire et tous les débouchés métiers
      </Text>
      <HStack justifyContent="start" width="100%">
        <Box width="300px">
          <AsyncNsfSearch onSelectNsf={setSelectedNsf} nsf={selectedNsf} />
        </Box>
        <Box width="300px">
          <AsyncFormationSearch
            codeNsf={selectedNsf?.value}
            onSelectFormation={setSelectedFormation}
            formation={selectedFormation}
          />
        </Box>
      </HStack>
      <Divider />
      {selectedNsf && selectedFormation && (
        <Metabase
          domaineFormation={selectedNsf.label}
          formation={selectedFormation.label}
          dashboardId={98}
        />
      )}
    </VStack>
  );
};

export { DashboardFormation };
