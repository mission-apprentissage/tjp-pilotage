import { usePlausible } from "next-plausible";
import { useEffect } from "react";
import { CURRENT_IJ_MILLESIME, VoieEnum } from "shared";
import { CURRENT_RENTREE } from "shared/time/CURRENT_RENTREE";

import { client } from "../../../../../../api.client";
import { useStateParams } from "../../../../../../utils/useFilters";
import { useEtablissementContext } from "../../context/etablissementContext";
import {
  AnalyseDetaillee,
  ChiffresEntree,
  ChiffresEntreeOffreRentree,
  ChiffresIJ,
  ChiffresIJOffreMillesime,
  Filters,
  Formations,
} from "./types";

type Params = {
  filters: Filters;
  offre: string;
  displayType: "dashboard" | "quadrant";
};

function countValues(
  data: ChiffresEntreeOffreRentree | ChiffresIJOffreMillesime,
  keys: string[]
): number {
  return keys.reduce((count, key) => (key in data ? count + 1 : count), 0);
}

function selectFormationWithMostValues(
  formations: Formations,
  chiffresIJ: ChiffresIJ,
  chiffresEntree: ChiffresEntree
): string {
  console.debug(
    "SelectFormationWithMostValues",
    formations,
    chiffresIJ,
    chiffresEntree
  );
  const offres = Object.keys(formations);

  if (offres.length <= 1) {
    return offres[0] ?? "";
  }

  const numberOfValuesPerFormation: Record<string, number> = {};

  for (const formation of offres) {
    const ijData = chiffresIJ[formation]?.[CURRENT_IJ_MILLESIME];
    const entreeData = chiffresEntree[formation]?.[CURRENT_RENTREE];

    const ijKeys = ["tauxInsertion", "tauxPoursuite", "tauxDevenirFavorable"];
    const entreeKeys = [
      "premiersVoeux",
      "capacite",
      "effectifEntree",
      "tauxRemplissage",
      "tauxPression",
    ];

    const numberOfValues =
      (ijData ? countValues(ijData, ijKeys) : 0) +
      (entreeData ? countValues(entreeData, entreeKeys) : 0);

    numberOfValuesPerFormation[formation] = numberOfValues;
  }

  const [formationWithMostValues] = Object.entries(
    numberOfValuesPerFormation
  ).sort((a, b) => b[1] - a[1]);

  return formationWithMostValues[0];
}

function shouldSelectDefaultFormation(params: Params, data?: AnalyseDetaillee) {
  const hasFormations =
    data?.formations && Object.keys(data.formations).length > 0;
  const hasCodeNiveauDiplomeFilter =
    (params.filters.codeNiveauDiplome?.length || 0) > 0;
  const hasVoieFilter = (params.filters.voie?.length || 0) > 0;

  if (
    hasFormations &&
    (!params.offre || hasCodeNiveauDiplomeFilter || hasVoieFilter)
  ) {
    const isOffreInFilteredListOfFormations = Object.values(
      data.formations
    ).some(
      (f) =>
        (params.filters.codeNiveauDiplome?.includes(f.codeNiveauDiplome) ||
          params.filters.voie?.includes(f.voie)) &&
        f.offre === params.offre
    );

    return !isOffreInFilteredListOfFormations;
  }

  return false;
}

export const useAnalyseDetaillee = () => {
  const trackEvent = usePlausible();
  const { uai, setAnalyseDetaillee } = useEtablissementContext();

  const [searchParams, setSearchParams] = useStateParams<Params>({
    defaultValues: {
      filters: {
        codeNiveauDiplome: [],
        voie: [VoieEnum.scolaire],
      },
      offre: "",
      displayType: "dashboard",
    },
  });

  const { data, isLoading: isLoading } = client
    .ref("[GET]/etablissement/:uai/analyse-detaillee")
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
    setSearchParams({
      ...searchParams,
      filters: { ...searchParams.filters, [type]: value },
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
    console.debug("useEffect", { searchParams, data });
    if (shouldSelectDefaultFormation(searchParams, data)) {
      const { codeNiveauDiplome, voie } = searchParams.filters;
      const filteredFormations = Object.values(data!.formations).reduce(
        (acc, f) => {
          if (
            (codeNiveauDiplome?.length === 0 ||
              codeNiveauDiplome?.includes(f.codeNiveauDiplome)) &&
            (voie?.length === 0 || voie?.includes(f.voie))
          ) {
            acc[f.offre] = f;
          }
          return acc;
        },
        {} as Formations
      );

      const selectedOffre = selectFormationWithMostValues(
        filteredFormations,
        data!.chiffresIJ,
        data!.chiffresEntree
      );

      console.debug("useEffect", { filteredFormations, selectedOffre });

      setSearchParams({
        ...searchParams,
        offre: selectedOffre,
      });
    }
  }, [data, searchParams]);

  useEffect(() => {
    if (!isLoading && data) {
      setAnalyseDetaillee(data as AnalyseDetaillee);
    }
  }, [data, isLoading]);

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
