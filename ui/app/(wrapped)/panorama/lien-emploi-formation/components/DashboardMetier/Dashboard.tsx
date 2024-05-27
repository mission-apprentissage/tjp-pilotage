import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { client } from "@/api.client";

import { AsyncDomaineProfessionnelSearch } from "./AsyncDomaineProfessionnelSearch";
import AsyncMetierSearch from "./AsyncMetierSearch";
import { Metabase } from "./Metabase";

export type DomaineProfessionnelOption =
  (typeof client.infer)["[GET]/domaine-professionnel/search/:search"][number];
export type MetierOption =
  (typeof client.infer)["[GET]/metier/search/:search"][number];

const DashboardMetier = () => {
  const [selectedDomainePRofessionnel, setSelectedDomaineProfessionnel] =
    useState<DomaineProfessionnelOption | undefined>();
  const [selectedMetier, setSelectedMetier] = useState<
    MetierOption | undefined
  >();

  useEffect(() => {
    setSelectedMetier(undefined);
  }, [selectedDomainePRofessionnel]);

  return (
    <VStack width="100%" alignItems="start" gap="16px">
      <Text>
        À partir d’un métier, visualisez les formations y conduisant et l’offre
        de formation correspondante sur le territoire
      </Text>
      <HStack justifyContent="start" width="100%">
        <Box width="300px">
          <AsyncDomaineProfessionnelSearch
            onSelectDomaineProfessionnel={setSelectedDomaineProfessionnel}
            domaineProfessionnel={selectedDomainePRofessionnel}
          />
        </Box>
        <Box width="300px">
          <AsyncMetierSearch
            codeDomaineProfessionnel={selectedDomainePRofessionnel?.value}
            onSelectMetier={setSelectedMetier}
            metier={selectedMetier}
          />
        </Box>
      </HStack>
      <Divider />
      {selectedDomainePRofessionnel && selectedMetier && (
        <Metabase
          domaineProfessionnel={selectedDomainePRofessionnel.label}
          metier={selectedMetier.label}
          dashboardId={100}
        />
      )}
    </VStack>
  );
};

export { DashboardMetier };
