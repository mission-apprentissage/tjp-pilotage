"use client";

import { Box, Container, useDisclosure, VStack } from "@chakra-ui/react";
import { usePlausible } from "next-plausible";
import { ScopeEnum } from "shared";

import { client } from "@/api.client";
import { DefinitionTauxTransfoModal } from "@/app/(wrapped)/components/DefinitionTauxTransfoModal";
import { useCurrentCampagne } from "@/utils/security/useCurrentCampagne";
import { useStateParams } from "@/utils/useFilters";

import { FiltersSection } from "./filter/FiltersSection";
import { HeaderSection } from "./header/HeaderSection";
import { DisplayTypeEnum } from "./main/displayTypeEnum";
import { MainSection } from "./main/MainSection";
import type {
  FiltersPilotageIntentions,
  FilterTracker,
  OrderFormationsPilotageIntentions,
  OrderPilotageIntentions
} from './types';
import { getDefaultRentreeScolaireForAnneeCampagne } from './utils';

export const PilotageNationalClient = () => {
  const { campagne } = useCurrentCampagne();
  const trackEvent = usePlausible();
  const [searchParams, setSearchParams] = useStateParams<{
    filters?: FiltersPilotageIntentions;
    displayTypes: Array<DisplayTypeEnum>;
    order?: Partial<OrderPilotageIntentions>;
    orderFormations?: Partial<OrderFormationsPilotageIntentions>;
  }>({
    defaultValues: {
      filters: {
        scope: ScopeEnum["région"],
        campagne: campagne?.annee,
        rentreeScolaire: campagne ?
          [getDefaultRentreeScolaireForAnneeCampagne(campagne?.annee)] : undefined,
        coloration: undefined
      },
      displayTypes: [DisplayTypeEnum.repartition, DisplayTypeEnum.zone_geographique],
    },
  });

  const filters = searchParams.filters ?? {
    scope: ScopeEnum["région"],
    campagne: undefined,
    coloration: undefined
  };
  const order = searchParams.order ?? { order: "asc" };
  const orderFormations = searchParams.orderFormations ?? { orderFormations: "asc" };

  const filterTracker: FilterTracker = (filterName, options = {}) => {
    trackEvent("pilotage-transformation:filtre", {
      props: { filter_name: filterName, options },
    });
  };

  const setFilters = (filters: FiltersPilotageIntentions) => {
    setSearchParams({
      ...searchParams,
      filters
    });
  };

  const setOrder = (order: OrderPilotageIntentions) => {
    setSearchParams({
      ...searchParams,
      order
    });
  };

  const setOrderFormations = (orderFormations: OrderFormationsPilotageIntentions) => {
    setSearchParams({
      ...searchParams,
      orderFormations
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

  const { data, isLoading } = client.ref("[GET]/pilotage-intentions").useQuery(
    {
      query: { ...filters, ...order },
    }
  );

  const { data: { formations, stats } = {} } = client.ref("[GET]/pilotage-intentions/formations").useQuery(
    {
      query: { ...filters, ...orderFormations },
    },
  );

  const setDefaultFilters = () => {
    if (!campagne) return;
    const rentreeScolaire = getDefaultRentreeScolaireForAnneeCampagne(
      campagne.annee,
    );

    setFilters({
      campagne: campagne.annee,
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
            data={data}
            filters={filters}
            setFilters={setFilters}
            filterTracker={filterTracker}
            setDefaultFilters={() => setDefaultFilters()}
            isLoading={isLoading}
          />
          <HeaderSection
            data={data}
            filters={filters}
            setFilters={setFilters}
            filterTracker={filterTracker}
            onOpenTauxTransfoDefinition={onOpenTauxTransfoDefinition}
            isLoading={isLoading}
          />
          <MainSection
            displayTypes={searchParams.displayTypes}
            filters={filters}
            setFilters={setFilters}
            displayRepartition={displayRepartition}
            displayQuadrant={displayQuadrant}
            displayZonesGeographiques={displayZonesGeographiques}
            displayDomaines={displayDomaines}
            data={data}
            formations={formations}
            statsSortie={stats}
            isLoading={isLoading}
            order={order}
            orderFormations={orderFormations}
            setOrder={setOrder}
            setOrderFormations={setOrderFormations}
          />
        </VStack>
      </Container>
    </Box>
  );
};
