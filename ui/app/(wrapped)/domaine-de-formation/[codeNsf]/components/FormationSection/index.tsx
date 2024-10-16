import { Container, Divider, Flex, Heading } from "@chakra-ui/react";
import type { ScopeZone } from "shared";

import type {
  Filters,
  FiltersNumberOfFormations,
  FormationListItem,
  FormationTab,
  Presence,
  Voie,
} from "@/app/(wrapped)/domaine-de-formation/[codeNsf]/types";

import { ListeFormations } from "./ListeFormations";
import { TabFilters } from "./TabFilters";
import { EtablissementsTab } from "./Tabs/EtablissementsTab";
import { IndicateursTab } from "./Tabs/IndicateursTab";

const TabContent = ({
  tab,
  filters,
  scope,
  codeNsf,
}: {
  tab: FormationTab;
  filters: Filters;
  scope: ScopeZone;
  codeNsf: string;
}) => {
  switch (tab) {
    case "etablissements":
      return <EtablissementsTab filters={filters} />;
    case "indicateurs":
    default:
      return <IndicateursTab filters={filters} scope={scope} codeNsf={codeNsf} />;
  }
};

export const FormationSection = ({
  filters,
  filtersNumberOfFormations,
  formations,
  onChangePresence,
  onChangeVoie,
  changeTab,
  selectCfd,
  scope,
  codeNsf,
}: {
  filters: Filters;
  formations: FormationListItem[];
  onChangePresence: (value: Presence) => void;
  onChangeVoie: (value: Voie) => void;
  changeTab: (tab: FormationTab) => void;
  selectCfd: (cfd: string) => void;
  scope: ScopeZone;
  filtersNumberOfFormations: FiltersNumberOfFormations;
  codeNsf: string;
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
          filtersNumberOfFormations={filtersNumberOfFormations}
        />
        <Flex direction="row" gap={8}>
          <ListeFormations formations={formations} selectCfd={selectCfd} selectedCfd={filters.cfd ?? ""} />
          <TabContent tab={filters.formationTab} filters={filters} scope={scope} codeNsf={codeNsf} />
        </Flex>
      </Flex>
    </Container>
  );
};
