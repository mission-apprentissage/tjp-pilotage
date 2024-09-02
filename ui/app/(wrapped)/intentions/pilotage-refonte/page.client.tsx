"use client";

import { VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { ScopeEnum } from "shared";

import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { client } from "../../../../api.client";
import { themeDefinition } from "../../../../theme/theme";
import { useStateParams } from "../../../../utils/useFilters";
import { DisplayTypeEnum } from "./main/displayTypeEnum";
import { MainSection } from "./main/MainSection";
import { FiltersStatsPilotageIntentions } from "./types";

export const PilotageNationalClient = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    displayType?: DisplayTypeEnum;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });

  const setSearchParams = (params: { displayType?: DisplayTypeEnum }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const displayRepartition = () =>
    setSearchParams({
      ...searchParams,
      displayType: DisplayTypeEnum.repartition,
    });

  const displayQuadrant = () =>
    setSearchParams({
      ...searchParams,
      displayType: DisplayTypeEnum.quadrant,
    });

  const [filters, setFilters] = useStateParams<FiltersStatsPilotageIntentions>({
    defaultValues: {
      scope: ScopeEnum.region,
      campagne: undefined,
    },
  });

  const { data: repartitionData } = client
    .ref("[GET]/pilotage-intentions/repartition")
    .useQuery({
      query: { ...filters },
    });

  // const { data } = client.ref("[GET]/pilotage-intentions/stats").useQuery(
  //   {
  //     query: { ...filters },
  //   },
  //   {
  //     keepPreviousData: true,
  //     staleTime: 10000000,
  //     onSuccess: (data) => {
  //       if (!filters.campagne) {
  //         const rentreeScolaire = findDefaultRentreeScolaireForCampagne(
  //           data.campagne.annee,
  //           data.filters.rentreesScolaires
  //         );
  //         if (rentreeScolaire) {
  //           setFilters({
  //             ...filters,
  //             campagne: data.campagne.annee,
  //             rentreeScolaire: [rentreeScolaire],
  //           });
  //         } else {
  //           setFilters({ ...filters, campagne: data.campagne.annee });
  //         }
  //       }
  //     },
  //   }
  // );

  return (
    <VStack px="120px" backgroundColor={themeDefinition.colors.blueecume[950]}>
      {/* <HeaderSection filters={filters} setFilters={setFilters} data={data} /> */}
      <MainSection
        filters={filters}
        displayType={searchParams.displayType ?? DisplayTypeEnum.repartition}
        displayRepartition={displayRepartition}
        displayQuadrant={displayQuadrant}
        repartitionData={repartitionData}
      />
    </VStack>
  );
};
