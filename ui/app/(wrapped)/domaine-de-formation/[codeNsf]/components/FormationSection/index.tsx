import { Container, Divider, Flex, Heading } from "@chakra-ui/react";

import { useFormationContext } from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/context/formationContext";
import type {
  FormationListItem,
  FormationsCounter,
  FormationTab,
} from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";

import { ListeFormations } from "./ListeFormations";
import { TabFilters } from "./TabFilters";
import { EtablissementsTab } from "./Tabs/EtablissementsTab";
import { IndicateursTab } from "./Tabs/IndicateursTab";

const TabContent = ({ tab }: { tab: FormationTab }) => {
  switch (tab) {
    case "etablissements":
      return <EtablissementsTab />;
    case "indicateurs":
    default:
      return <IndicateursTab />;
  }
};

export const FormationSection = ({
  formations,
  counter,
}: {
  formations: FormationListItem[];
  counter: FormationsCounter;
}) => {
  const { currentFilters, handleChangeCfd } = useFormationContext();

  return (
    <Container maxW={"container.xl"} as="section" id="formations" my={"32px"}>
      <Flex direction={"column"} gap={8}>
        <Heading as="h2" fontSize={"24px"} fontWeight={"bold"}>
          Offre de formation dans ce domaine
        </Heading>
        <Divider width="48px" />
        <TabFilters counter={counter} />
        <Flex direction="row" gap={8}>
          <ListeFormations formations={formations} selectCfd={handleChangeCfd} selectedCfd={currentFilters.cfd} />
          <TabContent tab={currentFilters.formationTab} />
        </Flex>
      </Flex>
    </Container>
  );
};
