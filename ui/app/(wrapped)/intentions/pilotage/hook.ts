import { usePlausible } from "next-plausible";
import { useCallback, useState } from "react";

import { client } from "@/api.client";

import { useStateParams } from "../../../../utils/useFilters";
import {
  Filters,
  FiltersEvents,
  IndicateurType,
  Order,
  SelectedScope,
} from "./types";

export const usePilotageIntentionsHook = () => {
  const [indicateur, setIndicateur] =
    useState<IndicateurType>("tauxTransformation");
  const [filters, setFilters] = useStateParams<Partial<Filters>>({
    defaultValues: {
      scope: "regions",
    },
  });
  const [order, setOrder] = useStateParams<Partial<Order>>({
    prefix: "ord",
    defaultValues: {
      order: "asc",
    },
  });

  const handleOrder = (column: Order["orderBy"]) => {
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
  const filterTracker = (filterName: FiltersEvents) => () => {
    trackEvent("pilotage-intentions:filtre", {
      props: { filter_name: filterName },
    });
  };

  const { data: datas, isLoading } = client
    .ref("[GET]/pilotage-transformation/stats")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
          scope: filters?.scope ?? "national",
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const {
    data: scopedTransformationsStats,
    isLoading: isLoadingScopedTransformationsStats,
  } = client
    .ref("[GET]/pilotage-transformation/get-scoped-transformations-stats")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
          scope: filters?.scope ?? "national",
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

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
    (additionalFilters: Partial<Filters>) =>
      setFilters({ ...filters, ...additionalFilters }),
    [setFilters]
  );

  return {
    datas,
    indicateur,
    indicateurOptions,
    handleIndicateurChange,
    filters,
    handleFilters,
    filterTracker,
    scope: { type: filters?.scope, value: filters?.code } as SelectedScope,
    order,
    handleOrder,
    isLoading: isLoading || isLoadingScopedTransformationsStats,
    scopedStats: scopedTransformationsStats,
  };
};
