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

export const FormationSection = ({
  formations,
  counter,
}: {
  formations: FormationListItem[];
  counter: FormationsCounter;
}) => {
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
            formations={formations}
            selectCfd={handleCfdChange}
            selectedCfd={currentFilters.cfd}
            h={tabContentHeight}
          />
          <TabContent tab={currentFilters.formationTab} ref={tabContentRef} />
        </Flex>
      </Flex>
    </Container>
  );
};
