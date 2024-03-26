import { usePlausible } from "next-plausible";
import { useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { CURRENT_IJ_MILLESIME } from "shared";
import { CURRENT_RENTREE } from "shared/time/CURRENT_RENTREE";

import { client } from "../../../../../../api.client";
import { useStateParams } from "../../../../../../utils/useFilters";
import { useEtablissementContext } from "../../context/etablissementContext";
import { ChiffresEntree, ChiffresIJ, Filters, Formations } from "./types";

function selectFormationWithMostValues(
  formations: Formations,
  chiffresIJ: ChiffresIJ,
  chiffresEntree: ChiffresEntree
): string {
  const offres = Object.keys(formations);

  if (offres.length === 0) {
    return "";
  }

  if (offres.length === 1) {
    return offres[0];
  }
  const numberOfValuesPerFormation: Record<string, number> = {};

  for (const formation of offres) {
    let numberOfValues = 0;

    if (chiffresIJ[formation]?.[CURRENT_IJ_MILLESIME]) {
      ["tauxInsertion", "tauxPoursuite", "tauxDevenirFavorable"].forEach(
        (key) => {
          if (key in chiffresIJ[formation][CURRENT_IJ_MILLESIME]) {
            numberOfValues += 1;
          }
        }
      );
    }

    if (chiffresEntree[formation]?.[CURRENT_RENTREE]) {
      [
        "premiersVoeux",
        "capacite",
        "effectifEntree",
        "tauxRemplissage",
        "tauxPression",
      ].forEach((key) => {
        if (key in chiffresEntree[formation][CURRENT_RENTREE]) {
          numberOfValues += 1;
        }
      });
    }

    numberOfValuesPerFormation[formation] = numberOfValues;
  }

  const [formationWithMostValues] = Object.entries(
    numberOfValuesPerFormation
  ).sort((a, b) => b[1] - a[1]);

  return formationWithMostValues[0];
}

export const useAnalyseDetaillee = () => {
  const trackEvent = usePlausible();
  const { uai } = useEtablissementContext();

  const [searchParams, setSearchParams] = useStateParams<{
    filters: Filters;
    offre: string;
    displayType: "dashboard" | "quadrant";
  }>({
    defaultValues: {
      filters: {},
      offre: "",
      displayType: "dashboard",
    },
  });

  const { data, isLoading: isLoading } = client
    .ref(`[GET]/etablissement/:uai/analyse-detaillee`)
    .useQuery(
      {
        params: { uai },
        query: searchParams.filters,
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  const displayDashboard = () =>
    setSearchParams({ ...searchParams, displayType: "dashboard" });

  const displayQuadrant = () =>
    setSearchParams({ ...searchParams, displayType: "quadrant" });

  const setOffre = (offre: string) => {
    filterTracker("offre", offre);
    setSearchParams({
      ...searchParams,
      offre,
    });
  };

  const handleFilters = (
    type: keyof Filters,
    value: Filters[keyof Filters]
  ) => {
    unstable_batchedUpdates(() => {
      setSearchParams({
        ...searchParams,
        filters: { ...searchParams.filters, [type]: value },
      });
    });
  };

  const filterTracker =
    (filterName: keyof Filters | string, filterValue?: string | number) =>
    () => {
      trackEvent("analyse-detailee-etablissement:filtre", {
        props: { filter_name: filterName, filter_value: filterValue },
      });
    };

  useEffect(() => {
    if (data?.formations && !searchParams.offre) {
      setSearchParams({
        ...searchParams,
        offre: selectFormationWithMostValues(
          data?.formations,
          data?.chiffresIJ,
          data?.chiffresEntree
        ),
      });
    }
  }, [data, searchParams]);

  return {
    ...data,
    isLoading,
    displayDashboard,
    displayQuadrant,
    searchParams,
    handleFilters,
    offre: searchParams.offre,
    displayType: searchParams.displayType,
    activeFilters: searchParams.filters,
    filterTracker,
    setOffre,
    uai,
    formationFounds: Object.values(data?.formations ?? {}).length,
  };
};
