import type { BoxProps } from "@chakra-ui/react";
import { Box, Container, Divider, Flex, forwardRef, Heading } from "@chakra-ui/react";
import { useMemo } from "react";
import type {VoieType} from "shared";

import { useDomaineDeFormation } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/domaineDeFormationContext";
import { useFormationContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/formationContext";
import type {
  FormationListItem,
  FormationTab,
} from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { Loading } from "@/components/Loading";

import { ListeFormations } from "./ListeFormations";
import { TabFilters } from "./TabFilters";
import { EtablissementsTab } from "./Tabs/EtablissementsTab";
import { IndicateursTab } from "./Tabs/IndicateursTab";

type TabContentProps = BoxProps & {
  tab: FormationTab;
};

const TabContent = forwardRef<TabContentProps, "div">(({ tab, ...rest }, ref) => {
  const content = useMemo(() => {
    switch (tab) {
    case "etablissements":
      return <EtablissementsTab />;
    case "indicateurs":
    default:
      return <IndicateursTab />;
    }
  }, [tab]);

  return (
    <Box ref={ref} w={"60%"} h={"fit-content"} {...rest}>
      {content}
    </Box>
  );
});

const getFirstFormation =
  (formationsByLibelleNiveauDiplome: Record<string, FormationListItem[]>): { cfd: string, voies: VoieType[] } => {
    const libellesNiveauDiplome = Object.keys(formationsByLibelleNiveauDiplome);

    if (libellesNiveauDiplome.length === 0) {
      return {
        cfd: "",
        voies: []
      };
    }

    const firstFormation = formationsByLibelleNiveauDiplome[libellesNiveauDiplome[0]][0];
    return {
      cfd: firstFormation.cfd,
      voies: firstFormation.voies
    };
  };

export const FormationSection = () => {
  const { isLoading } = useDomaineDeFormation();
  const { currentFilters } = useFormationContext();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Container maxW={"container.xl"} as="section" id="formations" my={"32px"}>
      <Flex direction={"column"} gap={8}>
        <Heading as="h2" fontSize={"24px"} fontWeight={"bold"}>
          Offre de formation dans ce domaine
        </Heading>
        <Divider width="48px" />
        <TabFilters />
        <Flex direction="row" gap={8}>
          <ListeFormations />
          <TabContent tab={currentFilters.formationTab} />
        </Flex>
      </Flex>
    </Container>
  );
};
