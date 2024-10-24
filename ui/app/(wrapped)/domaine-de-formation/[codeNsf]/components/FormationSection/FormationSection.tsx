import { Container, Divider, Flex, Heading } from "@chakra-ui/react";

import { Filters, Formation, FormationTab, Presence, Voie } from "../../types";
import { ListeFormations } from "./ListeFormations";
import { TabFilters } from "./TabFilters";
import { EtablissementsTab } from "./Tabs/EtablissementsTab";
import { IndicateursTab } from "./Tabs/IndicateursTab/IndicateursTab";
import { TableauComparatifTab } from "./Tabs/TableauComparatifTab";

const TabContent = ({ tab }: { tab: FormationTab }) => {
  switch (tab) {
    case "etablissements":
      return <EtablissementsTab />;
    case "tableauComparatif":
      return <TableauComparatifTab />;
    case "indicateurs":
      return <IndicateursTab />;
  }
};

export const FormationSection = ({
  filters,
  formations,
  onChangePresence,
  onChangeVoie,
  changeTab,
  selectCfd,
}: {
  filters: Filters;
  formations: Formation[];
  onChangePresence: (value: Presence) => void;
  onChangeVoie: (value: Voie) => void;
  changeTab: (tab: FormationTab) => void;
  selectCfd: (cfd: string) => void;
}) => {
  return (
    <Container maxW={"container.xl"} as="section" id="formations" my={"32px"}>
      <Flex direction={"column"} gap={8}>
        <Heading as="h2" fontSize={"24px"} fontWeight={"bold"}>
          Offre de formation dans ce domaine
        </Heading>
        <Divider width="48px" />
        <TabFilters
          presenceValue={filters.presence ?? ""}
          onChangePresence={onChangePresence}
          voieValue={filters.voie ?? ""}
          onChangeVoie={onChangeVoie}
          selectedTab={filters.formationTab ?? "indicateurs"}
          changeTab={changeTab}
        />
        <Flex direction="row" gap={8}>
          <ListeFormations
            formations={formations}
            selectCfd={selectCfd}
            selectedCfd={filters.cfd ?? ""}
          />
          <TabContent tab={filters.formationTab} />
        </Flex>
      </Flex>
    </Container>
  );
};
