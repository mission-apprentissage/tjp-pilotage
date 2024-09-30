"use client";

import { Box, Container, useDisclosure, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { ScopeEnum } from "shared";

import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { client } from "../../../../api.client";
import { useStateParams } from "../../../../utils/useFilters";
import { DefinitionTauxTransfoModal } from "../../components/TauxTransformationCard";
import { FiltersSection } from "./filter/FiltersSection";
import { HeaderSection } from "./header/HeaderSection";
import { DisplayTypeEnum } from "./main/displayTypeEnum";
import { MainSection } from "./main/MainSection";
import {
  FiltersStatsPilotageIntentions,
  OrderRepartitionPilotageIntentions,
  StatsPilotageIntentions,
} from "./types";
import { findDefaultRentreeScolaireForCampagne } from "./utils";

export const PilotageNationalClient = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    displayTypes?: Array<DisplayTypeEnum>;
    filters?: Partial<FiltersStatsPilotageIntentions>;
    order?: Partial<OrderRepartitionPilotageIntentions>;
  } = qs.parse(queryParams.toString(), { arrayLimit: Infinity });
  const order = searchParams.order ?? { order: "asc" };

  const setSearchParams = (params: typeof searchParams) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const displayRepartition = () =>
    setSearchParams({
      ...searchParams,
      displayTypes: [
        DisplayTypeEnum.repartition,
        searchParams.displayTypes?.[1] ?? DisplayTypeEnum.zone_geographique,
      ],
    });

  const displayQuadrant = () =>
    setSearchParams({
      ...searchParams,
      displayTypes: [
        DisplayTypeEnum.quadrant,
        searchParams.displayTypes?.[1] ?? DisplayTypeEnum.zone_geographique,
      ],
    });

  const displayZonesGeographiques = () =>
    setSearchParams({
      ...searchParams,
      displayTypes: [
        searchParams.displayTypes?.[0] ?? DisplayTypeEnum.repartition,
        DisplayTypeEnum.zone_geographique,
      ],
    });

  const displayDomaines = () =>
    setSearchParams({
      ...searchParams,
      displayTypes: [
        searchParams.displayTypes?.[0] ?? DisplayTypeEnum.repartition,
        DisplayTypeEnum.domaine,
      ],
    });

  const [filters, setFilters] = useStateParams<FiltersStatsPilotageIntentions>({
    defaultValues: {
      scope: ScopeEnum["région"],
      campagne: undefined,
      withColoration: "true",
    },
  });

  const { data: repartitionData, isLoading: isLoadingRepartition } = client
    .ref("[GET]/pilotage-intentions/repartition")
    .useQuery({
      query: { ...filters, ...order },
    });

  const { data, isLoading: isLoadingStats } = client
    .ref("[GET]/pilotage-intentions/stats")
    .useQuery(
      {
        query: { ...filters },
      },

      {
        keepPreviousData: true,
        staleTime: 10000000,
        onSuccess: (data) => {
          if (!filters.campagne) {
            setDefaultFilters(data);
          }
        },
      }
    );

  const setDefaultFilters = (data: StatsPilotageIntentions | undefined) => {
    if (!data) return;
    const rentreeScolaire = findDefaultRentreeScolaireForCampagne(
      data.campagne.annee,
      data.filters.rentreesScolaires
    );

    setFilters({
      campagne: data.campagne.annee,
      rentreeScolaire: rentreeScolaire ? [rentreeScolaire] : undefined,
      codeRegion: undefined,
      codeAcademie: undefined,
      codeDepartement: undefined,
      codeNsf: undefined,
      codeNiveauDiplome: undefined,
      CPC: undefined,
      scope: ScopeEnum["région"],
      secteur: undefined,
      statut: undefined,
    });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="blueecume.950">
      <DefinitionTauxTransfoModal isOpen={isOpen} onClose={onClose} />
      <Container maxWidth={"container.xl"}>
        <VStack gap={8}>
          <FiltersSection
            filters={filters}
            setFilters={setFilters}
            data={data}
            setDefaultFilters={() => setDefaultFilters(data)}
            isLoading={isLoadingStats}
          />
          <HeaderSection
            data={data}
            filters={filters}
            setFilters={setFilters}
            onOpenTauxTransfoDefinition={onOpen}
            isLoading={isLoadingStats}
          />
          <MainSection
            displayTypes={
              searchParams.displayTypes ?? [
                DisplayTypeEnum.repartition,
                DisplayTypeEnum.zone_geographique,
              ]
            }
            filters={filters}
            displayRepartition={displayRepartition}
            displayQuadrant={displayQuadrant}
            displayZonesGeographiques={displayZonesGeographiques}
            displayDomaines={displayDomaines}
            quadrantData={data}
            repartitionData={repartitionData}
            isLoading={isLoadingRepartition}
            order={order}
            setSearchParams={setSearchParams}
          />
        </VStack>
      </Container>
    </Box>
  );
};
