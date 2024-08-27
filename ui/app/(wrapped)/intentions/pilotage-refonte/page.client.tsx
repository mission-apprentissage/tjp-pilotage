"use client";

import { Container, useDisclosure, VStack } from "@chakra-ui/react";
import { ScopeEnum } from "shared";

import { client } from "../../../../api.client";
import { useStateParams } from "../../../../utils/useFilters";
import { DefinitionTauxTransfoModal } from "../../components/TauxTransformationCard";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import {
  FiltersStatsPilotageIntentions,
  StatsPilotageIntentions,
} from "./types";
import { findDefaultRentreeScolaireForCampagne } from "./utils";

export const PilotageNationalClient = () => {
  const [filters, setFilters] = useStateParams<FiltersStatsPilotageIntentions>({
    defaultValues: {
      scope: ScopeEnum.region,
      campagne: undefined,
    },
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
    <>
      <DefinitionTauxTransfoModal isOpen={isOpen} onClose={onClose} />
      <Container maxWidth={"container.xl"}>
        <VStack>
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
        </VStack>
      </Container>
    </>
  );
};
