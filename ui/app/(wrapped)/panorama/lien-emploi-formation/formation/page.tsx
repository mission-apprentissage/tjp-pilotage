"use client";

import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { client } from "@/api.client";

import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { AsyncFormationSearch } from "./components/AsyncFormationSearch";
import { AsyncNsfSearch } from "./components/AsyncNsfSearch";
import { Metabase } from "./components/Metabase";

export type NsfOption =
  (typeof client.infer)["[GET]/nsf/search/:search"][number];
export type FormationOption =
  (typeof client.infer)["[GET]/nsf-diplome/search/:search"][number];

// test

const DashboardFormation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedNsf, setSelectedNsf] = useState<NsfOption | undefined>();
  const [selectedFormation, setSelectedFormation] = useState<
    FormationOption | undefined
  >();

  useEffect(() => {
    const nsfSearchParam = searchParams.get("domaine_formation");
    const codeNsfSearchParam = searchParams.get("code_domaine_formation");
    const formationSearchParam = searchParams.get("formation");
    const codeFormationSearchParam = searchParams.get("code_formation");

    if (
      nsfSearchParam &&
      codeNsfSearchParam &&
      nsfSearchParam !== selectedNsf?.label
    ) {
      setSelectedNsf({
        label: nsfSearchParam,
        value: codeNsfSearchParam,
      });
    } else if (!nsfSearchParam) {
      setSelectedNsf(undefined);
    }

    if (
      formationSearchParam &&
      codeFormationSearchParam &&
      formationSearchParam !== selectedFormation?.label
    ) {
      setSelectedFormation({
        label: formationSearchParam,
        value: codeFormationSearchParam,
      });
    } else {
      setSelectedFormation(undefined);
    }
  }, [searchParams]);

  const onUpdateNsf = (nsf?: NsfOption) => {
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
    if (selectedNsf) {
      router.replace(
        createParametrizedUrl(location.pathname, {
          domaine_formation: encodeURI(selectedNsf.label),
          code_domaine_formation: encodeURI(selectedNsf.value),
          formation: formation ? encodeURI(formation.label) : undefined,
          code_formation: formation ? encodeURI(formation.value) : undefined,
        })
      );
    }
  };

  return (
    <VStack width="100%" alignItems="start" gap="16px">
      <Text>
        À partir d’une formation, visualisez l’offre de formation sur le
        territoire et tous les débouchés métiers
      </Text>
      <HStack justifyContent="start" width="100%">
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
      <Divider />
      {selectedFormation && (
        <Metabase
          domaineFormation={selectedNsf?.label}
          formation={selectedFormation.label}
          dashboardId={98}
        />
      )}
    </VStack>
  );
};

export default DashboardFormation;
