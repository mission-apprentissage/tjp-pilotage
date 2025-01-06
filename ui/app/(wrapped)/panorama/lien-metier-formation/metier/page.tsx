"use client";

import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";

import type { client } from "@/api.client";
import { themeDefinition } from "@/theme/theme";
import { createParameterizedUrl } from "@/utils/createParameterizedUrl";

import { AsyncDomaineProfessionnelSearch } from "./components/AsyncDomaineProfessionnelSearch";
import AsyncMetierSearch from "./components/AsyncMetierSearch";
import { Metabase } from "./components/Metabase";

export type DomaineProfessionnelOption = (typeof client.infer)["[GET]/domaine-professionnel/search/:search"][number];
export type MetierOption = (typeof client.infer)["[GET]/metier/search/:search"][number];

const DashboardMetier = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedDomaineProfessionnel, setSelectedDomaineProfessionnel] = useState<
    DomaineProfessionnelOption | undefined
  >();
  const [selectedMetier, setSelectedMetier] = useState<MetierOption | undefined>();
  const trackEvent = usePlausible();

  useEffect(() => {
    const domaineProfessionnelSearchParam = searchParams.get("domaine_pro");
    const codeDomaineProfessionnelSearchParam = searchParams.get("code_domaine_pro");
    const metierSearchParam = searchParams.get("metier");
    const codeMetierSearchParam = searchParams.get("code_metier");

    if (
      domaineProfessionnelSearchParam &&
      codeDomaineProfessionnelSearchParam &&
      domaineProfessionnelSearchParam !== selectedDomaineProfessionnel?.label
    ) {
      setSelectedDomaineProfessionnel({
        label: domaineProfessionnelSearchParam,
        value: codeDomaineProfessionnelSearchParam,
      });
    } else if (!domaineProfessionnelSearchParam || !codeDomaineProfessionnelSearchParam) {
      setSelectedDomaineProfessionnel(undefined);
    }

    if (metierSearchParam && codeMetierSearchParam && metierSearchParam !== selectedMetier?.label) {
      setSelectedMetier({
        label: metierSearchParam,
        value: codeMetierSearchParam,
      });
    } else if (!metierSearchParam || !codeMetierSearchParam) {
      setSelectedMetier(undefined);
    }
  }, [searchParams]);

  const onUpdateDomaineProfessionnel = (domaineProfessionnel?: DomaineProfessionnelOption) => {
    trackEvent("lien-metier-formation/metier:select-domaine-professionnel");
    router.replace(
      createParameterizedUrl(location.pathname, {
        domaine_pro: domaineProfessionnel ? encodeURI(domaineProfessionnel.label) : undefined,
        code_domaine_pro: domaineProfessionnel ? encodeURI(domaineProfessionnel.value) : undefined,
        metier: undefined,
        code_metier: undefined,
      })
    );
  };

  const onUpdateMetier = (metier?: MetierOption) => {
    trackEvent("lien-metier-formation/metier:select-metier");
    const domaineProfessionnelSearchParam = searchParams.get("domaine_pro");
    const codeDomaineProfessionnelSearchParam = searchParams.get("code_domaine_pro");

    if (metier) {
      router.replace(
        createParameterizedUrl(location.pathname, {
          domaine_pro: domaineProfessionnelSearchParam ? encodeURI(domaineProfessionnelSearchParam) : undefined,
          code_domaine_pro: codeDomaineProfessionnelSearchParam
            ? encodeURI(codeDomaineProfessionnelSearchParam)
            : undefined,
          metier: encodeURI(metier.label),
          code_metier: encodeURI(metier.value),
        })
      );

      return;
    }

    if (selectedDomaineProfessionnel) {
      router.replace(
        createParameterizedUrl(location.pathname, {
          domaine_pro: encodeURI(selectedDomaineProfessionnel.label),
          code_domaine_pro: encodeURI(selectedDomaineProfessionnel.value),
          metier: undefined,
          code_metier: undefined,
        })
      );

      return;
    }

    router.replace(
      createParameterizedUrl(location.pathname, {
        domaine_formation: undefined,
        code_domaine_formation: undefined,
        formation: undefined,
        code_formation: undefined,
      })
    );
  };

  const clear = () => {
    trackEvent("lien-metier-formation/metier:clear-filters");
    router.replace(location.pathname);
  };

  return (
    <VStack width="100%" alignItems="start" gap="16px">
      <Text>À partir d’un métier, visualisez les formations y conduisant</Text>
      <HStack width="100%" alignItems="end">
        <HStack>
          <Box width="300px">
            <AsyncDomaineProfessionnelSearch
              onSelectDomaineProfessionnel={onUpdateDomaineProfessionnel}
              domaineProfessionnel={selectedDomaineProfessionnel}
            />
          </Box>
          <Box width="300px">
            <AsyncMetierSearch
              codeDomaineProfessionnel={selectedDomaineProfessionnel?.value}
              onSelectMetier={onUpdateMetier}
              metier={selectedMetier}
            />
          </Box>
        </HStack>
        <Button
          backgroundColor="transparent"
          color={themeDefinition.colors.bluefrance[113]}
          fontWeight={400}
          onClick={() => clear()}
        >
          <Box pr="4px">
            <Icon icon="ri:refresh-line" />
          </Box>
          <Text>Réinitialiser les filtres</Text>
        </Button>
      </HStack>
      <Divider />
      {selectedMetier && (
        <Metabase
          domaineProfessionnel={selectedDomaineProfessionnel?.label}
          metier={selectedMetier.label}
          dashboardId={100}
        />
      )}
    </VStack>
  );
};

export default DashboardMetier;
