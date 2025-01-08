"use client";

import { Box, Container, useDisclosure, VStack } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import { ScopeEnum } from "shared";

import { client } from "@/api.client";
import { DefinitionTauxTransfoModal } from "@/app/(wrapped)/components/DefinitionTauxTransfoModal";
import { useStateParams } from "@/utils/useFilters";

import { FiltersSection } from "./filter/FiltersSection";
import { HeaderSection } from "./header/HeaderSection";
import { DisplayTypeEnum } from "./main/displayTypeEnum";
import { MainSection } from "./main/MainSection";
import type {
  FiltersStatsPilotageIntentions,
  FilterTracker,
  OrderRepartitionPilotageIntentions,
  StatsPilotageIntentions,
} from "./types";
import { findDefaultRentreeScolaireForCampagne } from "./utils";

export const PilotageNationalClient = () => {
  const trackEvent = usePlausible();
  const [searchParams, setSearchParams] = useStateParams<{
    filters?: FiltersStatsPilotageIntentions;
    displayTypes?: Array<DisplayTypeEnum>;
    order?: Partial<OrderRepartitionPilotageIntentions>;
  }>({
    defaultValues: {
      filters: {
        scope: ScopeEnum["région"],
        campagne: undefined,
        withColoration: "true",
      },
      displayTypes: [DisplayTypeEnum.repartition, DisplayTypeEnum.zone_geographique],
    },
  });

  const filters = searchParams.filters ?? {
    scope: ScopeEnum["région"],
    campagne: undefined,
    withColoration: "true",
  };
  const order = searchParams.order ?? { order: "asc" };

  const filterTracker: FilterTracker = (filterName, options = {}) => {
    trackEvent("pilotage-transformation:filtre", {
      props: { filter_name: filterName, options },
    });
  };

  const setFilters = (filters: FiltersStatsPilotageIntentions) => {
    setSearchParams({
      ...searchParams,
      filters,
    });
  };

  const displayRepartition = () =>
    setSearchParams({
      ...searchParams,
      displayTypes: [DisplayTypeEnum.repartition, searchParams.displayTypes?.[1] ?? DisplayTypeEnum.zone_geographique],
    });

  const displayQuadrant = () =>
    setSearchParams({
      ...searchParams,
      displayTypes: [DisplayTypeEnum.quadrant, searchParams.displayTypes?.[1] ?? DisplayTypeEnum.zone_geographique],
    });

  const displayZonesGeographiques = () =>
    setSearchParams({
      ...searchParams,
      displayTypes: [searchParams.displayTypes?.[0] ?? DisplayTypeEnum.repartition, DisplayTypeEnum.zone_geographique],
    });

  const displayDomaines = () =>
    setSearchParams({
      ...searchParams,
      displayTypes: [searchParams.displayTypes?.[0] ?? DisplayTypeEnum.repartition, DisplayTypeEnum.domaine],
    });

  const { data: repartitionData, isLoading: isLoadingRepartition } = client
    .ref("[GET]/pilotage-intentions/repartition")
    .useQuery({
      query: { ...filters, ...order },
    });

  const { data, isLoading: isLoadingStats } = client.ref("[GET]/pilotage-intentions/stats").useQuery(
    {
      query: { ...filters },
    },
    {
      onSuccess: (data) => {
        if (!filters.campagne) {
          setDefaultFilters(data);
        }
      },
    },
  );

  const setDefaultFilters = (data: StatsPilotageIntentions | undefined) => {
    if (!data) return;
    const rentreeScolaire = findDefaultRentreeScolaireForCampagne(data.campagne.annee, data.filters.rentreesScolaires);

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

  const tauxTransfoDefinitionModalTracker = (open: boolean) => {
    trackEvent("pilotage-transformation:definition-modal", {
      props: { open },
    });
  };

  const onOpenTauxTransfoDefinition = () => {
    tauxTransfoDefinitionModalTracker(true);
    onOpen();
  };

  return (
    <Box bg="blueecume.950">
      <DefinitionTauxTransfoModal isOpen={isOpen} onClose={onClose} />
      <Container maxWidth={"container.xl"}>
        <VStack gap={8}>
          <FiltersSection
            filters={filters}
            setFilters={setFilters}
            filterTracker={filterTracker}
            data={data}
            setDefaultFilters={() => setDefaultFilters(data)}
          />
          <HeaderSection
            data={data}
            filters={filters}
            setFilters={setFilters}
            filterTracker={filterTracker}
            onOpenTauxTransfoDefinition={onOpenTauxTransfoDefinition}
            isLoading={isLoadingStats}
          />
          <MainSection
            displayTypes={searchParams.displayTypes ?? [DisplayTypeEnum.repartition, DisplayTypeEnum.zone_geographique]}
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
