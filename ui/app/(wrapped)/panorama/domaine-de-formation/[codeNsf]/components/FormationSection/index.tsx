import type { BoxProps } from "@chakra-ui/react";
import { Box, Container, Divider, Flex, forwardRef, Heading } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

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

const getFirstFormation = (formationsByLibelleNiveauDiplome: Record<string, FormationListItem[]>) => {
  const libellesNiveauDiplome = Object.keys(formationsByLibelleNiveauDiplome);

  if (libellesNiveauDiplome.length === 0) {
    return "";
  }

  const firstFormation = formationsByLibelleNiveauDiplome[libellesNiveauDiplome[0]][0];
  return firstFormation.cfd;
};

const useFormationSection = (
  formations: FormationListItem[],
  formationsByLibelleNiveauDiplome: Record<string, FormationListItem[]>
) => {
  const { currentFilters, handleCfdChange } = useFormationContext();
  const tabContentRef = useRef<HTMLDivElement>(null);
  const [tabContentHeight, setTabContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTabContentHeight(entry.contentRect.height);
      }
    });

    if (tabContentRef.current) {
      observer.observe(tabContentRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [tabContentRef]);

  useEffect(() => {
    if (currentFilters.cfd !== "") {
      const cfdInListOfFormations = formations.find((f) => f.cfd === currentFilters.cfd);

      if (!cfdInListOfFormations) {
        handleCfdChange(getFirstFormation(formationsByLibelleNiveauDiplome));
      }
    } else if (currentFilters.cfd === "" && Object.keys(formationsByLibelleNiveauDiplome).length > 0) {
      handleCfdChange(getFirstFormation(formationsByLibelleNiveauDiplome));
    }
  }, [currentFilters, formations, handleCfdChange, formationsByLibelleNiveauDiplome]);

  return {
    currentFilters,
    handleCfdChange,
    tabContentRef,
    tabContentHeight,
  };
};

export const FormationSection = () => {
  const { formations, formationsByLibelleNiveauDiplome, isLoading } = useDomaineDeFormation();
  const { currentFilters, tabContentRef, tabContentHeight } = useFormationSection(
    formations,
    formationsByLibelleNiveauDiplome
  );

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
          <ListeFormations
            h={tabContentHeight}
          />
          <TabContent tab={currentFilters.formationTab} ref={tabContentRef} />
        </Flex>
      </Flex>
    </Container>
  );
};
