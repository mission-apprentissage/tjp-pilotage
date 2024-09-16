"use client";

import { Box, Container, useDisclosure, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { ScopeEnum } from "shared";

import { createParametrizedUrl } from "@/utils/createParametrizedUrl";

import { client } from "../../../../api.client";
import { useStateParams } from "../../../../utils/useFilters";
import { DefinitionTauxTransfoModal } from "../../components/TauxTransformationCard";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
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
    displayType?: DisplayTypeEnum;
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
      query: { ...filters, ...order },
    });

  const { data } = client.ref("[GET]/pilotage-intentions/stats").useQuery(
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
      scope: ScopeEnum.region,
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
          />
          <IndicateursClesSection
            data={data}
            filters={filters}
            setFilters={setFilters}
            onOpenTauxTransfoDefinition={onOpen}
          />
          <MainSection
            displayType={
              searchParams.displayType ?? DisplayTypeEnum.repartition
            }
            filters={filters}
            displayRepartition={displayRepartition}
            displayQuadrant={displayQuadrant}
            quadrantData={data}
            repartitionData={repartitionData}
            order={order}
            setSearchParams={setSearchParams}
          />
        </VStack>
      </Container>
    </Box>
  );
};
