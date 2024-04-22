import { usePlausible } from "next-plausible";
import { useCallback, useState } from "react";
import { ScopeEnum } from "shared";

import { client } from "@/api.client";

import { useStateParams } from "../../../../utils/useFilters";
import {
  FiltersEventsStatsPilotageIntentions,
  FiltersStatsPilotageIntentions,
  IndicateurType,
  OrderStatsPilotageIntentions,
  SelectedScope,
  StatsPilotageIntentions,
} from "./types";

export const usePilotageIntentionsHook = () => {
  const [indicateur, setIndicateur] =
    useState<IndicateurType>("tauxTransformation");
  const [filters, setFilters] = useStateParams<
    Partial<FiltersStatsPilotageIntentions>
  >({
    defaultValues: {
      scope: ScopeEnum.region,
      campagne: undefined,
    },
  });
  const [order, setOrder] = useStateParams<
    Partial<OrderStatsPilotageIntentions>
  >({
    prefix: "ord",
    defaultValues: {
      order: "asc",
    },
  });

  const handleOrder = (column: OrderStatsPilotageIntentions["orderBy"]) => {
    trackEvent("pilotage-intentions:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setOrder({ order: "asc", orderBy: column });
    } else {
      setOrder({
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      });
    }
  };

  const trackEvent = usePlausible();
  const filterTracker =
    (filterName: FiltersEventsStatsPilotageIntentions) => () => {
      trackEvent("pilotage-intentions:filtre", {
        props: { filter_name: filterName },
      });
    };

  const {
    data: scopedTransformationsStats,
    isLoading: isLoadingScopedTransformationsStats,
  } = client.ref("[GET]/pilotage-intentions/stats").useQuery(
    {
      query: {
        ...filters,
        ...order,
        scope: filters.scope!,
      },
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

  const findDefaultRentreeScolaireForCampagne = (
    annee: string,
    rentreesScolaires: StatsPilotageIntentions["filters"]["rentreesScolaires"]
  ) => {
    if (rentreesScolaires) {
      const rentreeScolaire = rentreesScolaires.find(
        (r) => parseInt(r.value) === parseInt(annee) + 1
      );

      if (rentreeScolaire) return rentreeScolaire.value;
    }

    return undefined;
  };

  const indicateurOptions = [
    {
      label: "Taux de transformation",
      value: "tauxTransformation",
      isDefault: true,
    },
    {
      label: "Ratio de fermetures",
      value: "ratioFermeture",
      isDefault: false,
    },
  ];

  const handleIndicateurChange = useCallback(
    (indicateur: string): void => {
      setIndicateur(indicateur as IndicateurType);
    },
    [setIndicateur]
  );

  const handleFilters = useCallback(
    (additionalFilters: Partial<FiltersStatsPilotageIntentions>) =>
      setFilters({ ...filters, ...additionalFilters }),
    [setFilters]
  );

  return {
    indicateur,
    indicateurOptions,
    handleIndicateurChange,
    filters,
    handleFilters,
    filterTracker,
    scope: { type: filters?.scope, value: filters?.code } as SelectedScope,
    order,
    handleOrder,
    isLoading: isLoadingScopedTransformationsStats,
    scopedStats: scopedTransformationsStats,
    findDefaultRentreeScolaireForCampagne: (campagne: string) =>
      findDefaultRentreeScolaireForCampagne(
        campagne,
        scopedTransformationsStats?.filters.rentreesScolaires || []
      ),
  };
};
