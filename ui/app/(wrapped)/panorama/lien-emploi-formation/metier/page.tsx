"use client";

import { Box, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { client } from "@/api.client";

import { createParametrizedUrl } from "../../../../../utils/createParametrizedUrl";
import { AsyncDomaineProfessionnelSearch } from "./components/AsyncDomaineProfessionnelSearch";
import AsyncMetierSearch from "./components/AsyncMetierSearch";
import { Metabase } from "./components/Metabase";

export type DomaineProfessionnelOption =
  (typeof client.infer)["[GET]/domaine-professionnel/search/:search"][number];
export type MetierOption =
  (typeof client.infer)["[GET]/metier/search/:search"][number];

const DashboardMetier = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedDomaineProfessionnel, setSelectedDomaineProfessionnel] =
    useState<DomaineProfessionnelOption | undefined>();
  const [selectedMetier, setSelectedMetier] = useState<
    MetierOption | undefined
  >();

  useEffect(() => {
    const domaineProfessionnelSearchParam = searchParams.get("domaine_pro");
    const codeDomaineProfessionnelSearchParam =
      searchParams.get("code_domaine_pro");
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
    } else if (!domaineProfessionnelSearchParam) {
      setSelectedDomaineProfessionnel(undefined);
    }

    if (
      metierSearchParam &&
      codeMetierSearchParam &&
      metierSearchParam !== selectedMetier?.label
    ) {
      setSelectedMetier({
        label: metierSearchParam,
        value: codeMetierSearchParam,
      });
    } else if (!metierSearchParam) {
      setSelectedMetier(undefined);
    }
  }, [searchParams]);

  const onUpdateDomaineProfessionnel = (
    domaineProfessionnel?: DomaineProfessionnelOption
  ) => {
    setSelectedDomaineProfessionnel(domaineProfessionnel ?? undefined);
    setSelectedMetier(undefined);
    router.replace(
      createParametrizedUrl(location.pathname, {
        domaine_pro: domaineProfessionnel
          ? encodeURI(domaineProfessionnel.label)
          : undefined,
        code_domaine_pro: domaineProfessionnel
          ? encodeURI(domaineProfessionnel.value)
          : undefined,
        metier: selectedMetier ? encodeURI(selectedMetier.label) : undefined,
        code_metier: selectedMetier
          ? encodeURI(selectedMetier.value)
          : undefined,
      })
    );
  };

  const onUpdateMetier = (metier?: MetierOption) => {
    setSelectedMetier(metier ?? undefined);
    router.replace(
      createParametrizedUrl(location.pathname, {
        domaine_pro: selectedDomaineProfessionnel
          ? encodeURI(selectedDomaineProfessionnel.label)
          : undefined,
        code_domaine_pro: selectedDomaineProfessionnel
          ? encodeURI(selectedDomaineProfessionnel.value)
          : undefined,
        metier: metier ? encodeURI(metier.label) : undefined,
        code_metier: metier ? encodeURI(metier.value) : undefined,
      })
    );
  };

  return (
    <VStack width="100%" alignItems="start" gap="16px">
      <Text>
        À partir d’un métier, visualisez les formations y conduisant et l’offre
        de formation correspondante sur le territoire
      </Text>
      <HStack justifyContent="start" width="100%">
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
