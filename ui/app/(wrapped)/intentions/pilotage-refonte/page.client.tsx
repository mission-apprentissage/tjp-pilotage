"use client";

import { VStack } from "@chakra-ui/react";
import { ScopeEnum } from "shared";

import { client } from "../../../../api.client";
import { themeDefinition } from "../../../../theme/theme";
import { useStateParams } from "../../../../utils/useFilters";
import { FiltersSection } from "./components/FiltersSection";
import { IndicateursClesSection } from "./components/IndicateursClesSection";
import { FiltersStatsPilotageIntentions } from "./types";
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
          const rentreeScolaire = findDefaultRentreeScolaireForCampagne(
            data.campagne.annee,
            data.filters.rentreesScolaires
          );
          if (rentreeScolaire) {
            setFilters({
              ...filters,
              campagne: data.campagne.annee,
              rentreeScolaire: [rentreeScolaire],
            });
          } else {
            setFilters({ ...filters, campagne: data.campagne.annee });
          }
        }
      },
    }
  );

  return (
    <VStack px="120px" backgroundColor={themeDefinition.colors.blueecume[950]}>
      <FiltersSection filters={filters} setFilters={setFilters} data={data} />
      <IndicateursClesSection data={data} />
    </VStack>
  );
};
