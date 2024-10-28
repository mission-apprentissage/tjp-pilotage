"use client";

import { Box, Button, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";

import type { client } from "@/api.client";
import { themeDefinition } from "@/theme/theme";
import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { AsyncFormationSearch } from "./components/AsyncFormationSearch";
import { AsyncNsfSearch } from "./components/AsyncNsfSearch";
import { Metabase } from "./components/Metabase";

export type NsfOption = (typeof client.infer)["[GET]/nsf/search/:search"][number];

export type FormationOption = (typeof client.infer)["[GET]/nsf-diplome/search/:search"][number];

// test

const DashboardFormation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedNsf, setSelectedNsf] = useState<NsfOption | undefined>();
  const [selectedFormation, setSelectedFormation] = useState<FormationOption | undefined>();
  const trackEvent = usePlausible();

  useEffect(() => {
    const nsfSearchParam = searchParams.get("domaine_formation");
    const codeNsfSearchParam = searchParams.get("code_domaine_formation");
    const formationSearchParam = searchParams.get("formation");
    const codeFormationSearchParam = searchParams.get("code_formation");

    if (nsfSearchParam && codeNsfSearchParam && nsfSearchParam !== selectedNsf?.label) {
      setSelectedNsf({
        label: nsfSearchParam,
        value: codeNsfSearchParam,
      });
    } else if (!nsfSearchParam || !codeNsfSearchParam) {
      setSelectedNsf(undefined);
    }

    if (formationSearchParam && codeFormationSearchParam && formationSearchParam !== selectedFormation?.label) {
      setSelectedFormation({
        label: formationSearchParam,
        value: codeFormationSearchParam,
      });
    } else if (!formationSearchParam || !codeFormationSearchParam) {
      setSelectedFormation(undefined);
    }
  }, [searchParams]);

  const onUpdateNsf = (nsf?: NsfOption) => {
    trackEvent("lien-metier-formation/formation:select-nsf");
    router.replace(
      createParametrizedUrl(location.pathname, {
        domaine_formation: nsf ? encodeURI(nsf.label) : undefined,
        code_domaine_formation: nsf ? encodeURI(nsf.value) : undefined,
        formation: undefined,
        code_formation: undefined,
      })
    );
  };

  const onUpdateFormation = (formation?: FormationOption) => {
    trackEvent("lien-metier-formation/formation:select-formation");
    if (formation) {
      router.replace(
        createParametrizedUrl(location.pathname, {
          domaine_formation: selectedNsf ? encodeURI(selectedNsf.label) : undefined,
          code_domaine_formation: selectedNsf ? encodeURI(selectedNsf.value) : undefined,
          formation: encodeURI(formation.label),
          code_formation: encodeURI(formation.value),
        })
      );

      return;
    }

    if (selectedNsf) {
      router.replace(
        createParametrizedUrl(location.pathname, {
          domaine_formation: encodeURI(selectedNsf.label),
          code_domaine_formation: encodeURI(selectedNsf.value),
          formation: undefined,
          code_formation: undefined,
        })
      );
      return;
    }

    router.replace(
      createParametrizedUrl(location.pathname, {
        domaine_formation: undefined,
        code_domaine_formation: undefined,
        formation: undefined,
        code_formation: undefined,
      })
    );
  };

  const clear = () => {
    trackEvent("lien-metier-formation/formation:clear-filters");
    router.replace(location.pathname);
  };

  return (
    <VStack width="100%" alignItems="start" gap="16px">
      <Text>
        À partir d’une formation, visualisez tous les débouchés métiers et l’offre de formation sur le territoire
      </Text>
      <HStack alignItems="end" width="100%">
        <HStack>
          <Box width="300px">
            <AsyncNsfSearch onSelectNsf={onUpdateNsf} nsf={selectedNsf} />
          </Box>
          <Box width="300px">
            <AsyncFormationSearch
              codeNsf={selectedNsf?.value}
              onSelectFormation={onUpdateFormation}
              formation={selectedFormation}
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
      {selectedFormation && (
        <Metabase domaineFormation={selectedNsf?.label} formation={selectedFormation.label} dashboardId={98} />
      )}
    </VStack>
  );
};

export default DashboardFormation;
