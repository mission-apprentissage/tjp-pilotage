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
    } else if (
      !domaineProfessionnelSearchParam ||
      !codeDomaineProfessionnelSearchParam
    ) {
      setSelectedDomaineProfessionnel(undefined);
      setSelectedMetier(undefined);
      return;
    }

    if (
      metierSearchParam &&
      codeMetierSearchParam &&
      metierSearchParam !== selectedMetier?.label
    ) {
      setSelectedMetier({
        label: metierSearchParam,
        value: codeMetierSearchParam,
        data: {
          codeDomaineProfessionnel: codeDomaineProfessionnelSearchParam,
          libelleDomaineProfessionnel: domaineProfessionnelSearchParam,
        },
      });
    } else if (!metierSearchParam || !codeMetierSearchParam) {
      setSelectedMetier(undefined);
    }
  }, [searchParams]);

  const onUpdateDomaineProfessionnel = (
    domaineProfessionnel?: DomaineProfessionnelOption
  ) => {
    router.replace(
      createParametrizedUrl(location.pathname, {
        domaine_pro: domaineProfessionnel
          ? encodeURI(domaineProfessionnel.label)
          : undefined,
        code_domaine_pro: domaineProfessionnel
          ? encodeURI(domaineProfessionnel.value)
          : undefined,
        metier: undefined,
        code_metier: undefined,
      })
    );
  };

  const onUpdateMetier = (metier?: MetierOption) => {
    if (metier) {
      router.replace(
        createParametrizedUrl(location.pathname, {
          domaine_pro: encodeURI(metier.data.libelleDomaineProfessionnel),
          code_domaine_pro: encodeURI(metier.data.codeDomaineProfessionnel),
          metier: encodeURI(metier.label),
          code_metier: encodeURI(metier.value),
        })
      );

      return;
    }

    if (selectedDomaineProfessionnel) {
      router.replace(
        createParametrizedUrl(location.pathname, {
          domaine_pro: encodeURI(selectedDomaineProfessionnel.label),
          code_domaine_pro: encodeURI(selectedDomaineProfessionnel.value),
          metier: undefined,
          code_metier: undefined,
        })
      );

      return;
    }
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
