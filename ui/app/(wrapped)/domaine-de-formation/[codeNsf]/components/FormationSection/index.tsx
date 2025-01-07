import type { BoxProps } from "@chakra-ui/react";
import { Box, Container, Divider, Flex, forwardRef, Heading } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

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

export const FormationSection = ({
  formations,
  counter,
  formationsByLibelleNiveauDiplome,
}: {
  formations: FormationListItem[];
  counter: FormationsCounter;
  formationsByLibelleNiveauDiplome: Record<string, FormationListItem[]>;
}) => {
  const { currentFilters, handleCfdChange, tabContentRef, tabContentHeight } = useFormationSection(
    formations,
    formationsByLibelleNiveauDiplome
  );

  return (
    <Container maxW={"container.xl"} as="section" id="formations" my={"32px"}>
      <Flex direction={"column"} gap={8}>
        <Heading as="h2" fontSize={"24px"} fontWeight={"bold"}>
          Offre de formation dans ce domaine
        </Heading>
        <Divider width="48px" />
        <TabFilters counter={counter} />
        <Flex direction="row" gap={8}>
          <ListeFormations
            selectCfd={handleCfdChange}
            selectedCfd={currentFilters.cfd}
            h={tabContentHeight}
            formationsByLibelleNiveauDiplome={formationsByLibelleNiveauDiplome}
          />
          <TabContent tab={currentFilters.formationTab} ref={tabContentRef} />
        </Flex>
      </Flex>
    </Container>
  );
};
