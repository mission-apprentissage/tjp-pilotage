import { usePlausible } from "next-plausible";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { useCallback, useEffect, useState } from "react";

import { client } from "@/api.client";

import { createParametrizedUrl } from "../../../../utils/createParametrizedUrl";
import {
  Filters,
  IndicateurType,
  Order,
  PilotageTransformationStatsByScope,
  SelectedScope,
} from "./types";

export const usePilotageIntentionsHook = () => {
  const router = useRouter();
  const queryParams = useSearchParams();
  const searchParams: {
    filters?: Partial<Filters>;
    order?: Partial<Order>;
  } = qs.parse(queryParams.toString());

  const filters = searchParams.filters ?? {};
  const order = searchParams.order ?? { order: "asc" };

  const [globalDatas, setGlobalDatas] =
    useState<PilotageTransformationStatsByScope>();
  const [scope, setScope] = useState<SelectedScope>({
    type: "national",
    value: "national",
  });
  const [indicateur, setIndicateur] =
    useState<IndicateurType>("tauxTransformation");

  const setSearchParams = (params: {
    filters?: typeof filters;
    order?: typeof order;
  }) => {
    router.replace(
      createParametrizedUrl(location.pathname, { ...searchParams, ...params })
    );
  };

  const handleOrder = (column: Order["orderBy"]) => {
    trackEvent("pilotage-intentions:ordre", { props: { colonne: column } });
    if (order?.orderBy !== column) {
      setSearchParams({ order: { order: "desc", orderBy: column } });
      return;
    }
    setSearchParams({
      order: {
        order: order?.order === "asc" ? "desc" : "asc",
        orderBy: column,
      },
    });
  };

  const trackEvent = usePlausible();
  const filterTracker = (filterName: keyof Filters) => () => {
    trackEvent("pilotage-intentions:filtre", {
      props: { filter_name: filterName },
    });
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    setSearchParams({
      filters: { ...filters, [type]: value },
    });
  };

  const { data: scopedData, isLoading: isLoadingScopedData } = client
    .ref("[GET]/pilotage-transformation/stats")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
          scope: scope?.type ?? "national",
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const { data: nationalData, isLoading: isLoadingNationalData } = client
    .ref("[GET]/pilotage-transformation/stats")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
          scope: "national",
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const { data: visualScopeData, isLoading: isLoadingVisualScopeData } = client
    .ref("[GET]/pilotage-transformation/stats")
    .useQuery(
      {
        query: {
          ...filters,
          ...order,
          scope: scope?.type ?? "national",
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  useEffect(() => {
    if (scopedData) {
      const { filters: scopedFilters, ...datas } = scopedData;
      setGlobalDatas((prev) => ({
        ...prev,
        [scope.type]: datas,
        filters: scopedFilters,
      }));
    }
  }, [scopedData]);

  useEffect(() => {
    if (visualScopeData) {
      const { filters, ...datas } = visualScopeData;
      setGlobalDatas((prev) => ({
        ...prev,
        [scope?.type]: datas,
      }));
    }
  }, [scopedData]);

  useEffect(() => {
    if (visualScopeData) {
      const { filters, ...datas } = visualScopeData;
      setGlobalDatas((prev) => ({
        ...prev,
        [scope?.type]: datas,
      }));
    }
  }, [visualScopeData]);

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

  const resetScope = useCallback(() => {
    setScope({
      type: "national",
      value: "national",
    });
  }, [setScope]);

  console.log(`Scope: ${scope.type}, Code: ${scope.value}`);

  return {
    data: globalDatas,
    indicateur,
    indicateurOptions,
    handleIndicateurChange,
    filters,
    handleFilters,
    filterTracker,
    scope,
    setScope,
    order,
    handleOrder,
    isLoading: isLoadingScopedData,
    resetScope,
  };
};
