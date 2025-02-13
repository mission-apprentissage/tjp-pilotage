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
  FiltersPilotageIntentions,
  FilterTracker,
  OrderPilotageIntentions,
  OrderQuadrantPilotageIntentions,  PilotageIntentions} from './types';
import { findDefaultRentreeScolaireForCampagne } from "./utils";

// export const PilotageNationalClient = () => {
//   const trackEvent = usePlausible();
//   const [searchParams, setSearchParams] = useStateParams<{
//     filters?: FiltersPilotageIntentions;
//     displayTypes?: Array<DisplayTypeEnum>;
//     order?: Partial<OrderPilotageIntentions>;
//   }>({
//     defaultValues: {
//       filters: {
//         scope: ScopeEnum["région"],
//         campagne: undefined,
//         coloration: undefined
//       },
//       displayTypes: [DisplayTypeEnum.repartition, DisplayTypeEnum.zone_geographique],
//     },
//   });

//   const filters = searchParams.filters ?? {
//     scope: ScopeEnum["région"],
//     campagne: undefined,
//     coloration: undefined
//   };
//   const order = searchParams.order ?? { order: "asc" };

//   const filterTracker: FilterTracker = (filterName, options = {}) => {
//     trackEvent("pilotage-transformation:filtre", {
//       props: { filter_name: filterName, options },
//     });
//   };

//   const setFilters = (filters: FiltersPilotageIntentions) => {
//     setSearchParams({
//       ...searchParams,
//       filters,
//     });
//   };

//   const displayRepartition = () =>
//     setSearchParams({
//       ...searchParams,
//       displayTypes: [DisplayTypeEnum.repartition, searchParams.displayTypes?.[1] ?? DisplayTypeEnum.zone_geographique],
//     });

//   const displayQuadrant = () =>
//     setSearchParams({
//       ...searchParams,
//       displayTypes: [DisplayTypeEnum.quadrant, searchParams.displayTypes?.[1] ?? DisplayTypeEnum.zone_geographique],
//     });

//   const displayZonesGeographiques = () =>
//     setSearchParams({
//       ...searchParams,
//       displayTypes: [searchParams.displayTypes?.[0] ?? DisplayTypeEnum.repartition, DisplayTypeEnum.zone_geographique],
//     });

//   const displayDomaines = () =>
//     setSearchParams({
//       ...searchParams,
//       displayTypes: [searchParams.displayTypes?.[0] ?? DisplayTypeEnum.repartition, DisplayTypeEnum.domaine],
//     });

//   const { data, isLoading: isLoading } = client
//     .ref("[GET]/pilotage-intentions")
//     .useQuery({
//       query: { ...filters, ...order },
//     });

//   const { data: nationalData, isLoading: isLoadingNationalRepartition } = client
//     .ref("[GET]/pilotage-intentions")
//     .useQuery({
//       query: {
//         ...filters,
//         scope: ScopeEnum["national"],
//         ...order
//       },
//     });

//   const setDefaultFilters = (repartition?: PilotageIntentions) => {
//     if (!repartition) return;
//     const rentreeScolaire = findDefaultRentreeScolaireForCampagne(
//       repartition.campagne.annee,
//       repartition.filters.rentreesScolaires
//     );
//     const statut = _.values(DemandeStatutEnum).filter(
//       (statut) =>
//         statut !== DemandeStatutEnum["supprimée"] &&
//         statut !== DemandeStatutEnum["brouillon"] &&
//         statut !== DemandeStatutEnum["refusée"]
//     ) as Exclude<DemandeStatutType, "supprimée" | "brouillon" | "refusée">[];

//     setFilters({
//       campagne: repartition.campagne.annee,
//       rentreeScolaire: rentreeScolaire ? [rentreeScolaire] : undefined,
//       statut,
//       codeRegion: undefined,
//       codeAcademie: undefined,
//       codeDepartement: undefined,
//       codeNsf: undefined,
//       codeNiveauDiplome: undefined,
//       CPC: undefined,
//       scope: ScopeEnum["région"],
//       secteur: undefined,
//       coloration: undefined,
//     });
//   };

//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const tauxTransfoDefinitionModalTracker = (open: boolean) => {
//     trackEvent("pilotage-transformation:definition-modal", {
//       props: { open },
//     });
//   };

//   const onOpenTauxTransfoDefinition = () => {
//     tauxTransfoDefinitionModalTracker(true);
//     onOpen();
//   };

//   return (
//     <Box bg="blueecume.950">
//       <DefinitionTauxTransfoModal isOpen={isOpen} onClose={onClose} />
//       <Container maxWidth={"container.xl"}>
//         <VStack gap={8}>
//           <FiltersSection
//             filters={filters}
//             setFilters={setFilters}
//             filterTracker={filterTracker}
//             data={data}
//             setDefaultFilters={() => setDefaultFilters(data)}
//           />
//           <HeaderSection
//             data={data}
//             nationalData={nationalData}
//             filters={filters}
//             setFilters={setFilters}
//             filterTracker={filterTracker}
//             onOpenTauxTransfoDefinition={onOpenTauxTransfoDefinition}
//             isLoading={isLoading}
//           />
//           <MainSection
//             displayTypes={searchParams.displayTypes ?? [DisplayTypeEnum.repartition, DisplayTypeEnum.zone_geographique]}
//             filters={filters}
//             scopeFilters={data?.filters}
//             displayRepartition={displayRepartition}
//             displayQuadrant={displayQuadrant}
//             displayZonesGeographiques={displayZonesGeographiques}
//             displayDomaines={displayDomaines}
//             data={data}
//             isLoading={isLoading}
//             order={order}
//             setSearchParams={setSearchParams}
//           />
//         </VStack>
//       </Container>
//     </Box>
//   );
// };

export const PilotageNationalClient = () => {
  const trackEvent = usePlausible();
  const [searchParams, setSearchParams] = useStateParams<{
    filters?: FiltersPilotageIntentions;
    displayTypes?: Array<DisplayTypeEnum>;
    order?: Partial<OrderPilotageIntentions>;
    orderQuadrant?: Partial<OrderQuadrantPilotageIntentions>;
  }>({
    defaultValues: {
      filters: {
        scope: ScopeEnum["région"],
        campagne: undefined,
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
  const orderQuadrant = searchParams.orderQuadrant ?? { orderQuadrant: "asc" };

  const filterTracker: FilterTracker = (filterName, options = {}) => {
    trackEvent("pilotage-transformation:filtre", {
      props: { filter_name: filterName, options },
    });
  };

  const setFilters = (filters: FiltersPilotageIntentions) => {
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

  const { data, isLoading } = client
    .ref("[GET]/pilotage-intentions")
    .useQuery({
      query: { ...filters, ...order },
    },
    {
      onSuccess: (data) => {
        if (!filters.campagne) {
          setDefaultFilters(data);
        }
      },
    });

  const setDefaultFilters = (data: PilotageIntentions | undefined) => {
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
            setDefaultFilters={() => setDefaultFilters(data)}
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
            displayTypes={searchParams.displayTypes ?? [DisplayTypeEnum.repartition, DisplayTypeEnum.zone_geographique]}
            filters={filters}
            displayRepartition={displayRepartition}
            displayQuadrant={displayQuadrant}
            displayZonesGeographiques={displayZonesGeographiques}
            displayDomaines={displayDomaines}
            data={data}
            isLoading={isLoading}
            order={order}
            orderQuadrant={orderQuadrant}
            setFilters={setFilters}
            setSearchParams={setSearchParams}
          />
        </VStack>
      </Container>
    </Box>
  );
};
