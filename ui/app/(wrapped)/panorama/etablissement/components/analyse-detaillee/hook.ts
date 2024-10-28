import { uniq } from "lodash";
import { usePlausible } from "next-plausible";
import { useEffect, useState } from "react";
import { CURRENT_IJ_MILLESIME, VoieEnum } from "shared";
import { CURRENT_RENTREE } from "shared/time/CURRENT_RENTREE";

import { client } from "@/api.client";
import { useEtablissementContext } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";
import { useStateParams } from "@/utils/useFilters";

import { DisplayTypeEnum } from "./tabs/displayTypeEnum";
import type {
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

function countValues(data: ChiffresEntreeOffreRentree | ChiffresIJOffreMillesime, keys: string[]): number {
  return keys.reduce((count, key) => (key in data ? count + 1 : count), 0);
}

function selectFormationWithMostValues(
  formations: Formations,
  chiffresIJ: ChiffresIJ,
  chiffresEntree: ChiffresEntree
): string {
  const offres = Object.keys(formations);

  if (offres.length <= 1) {
    return offres[0] ?? "";
  }

  const numberOfValuesPerFormation: Record<string, number> = {};

  for (const formation of offres) {
    const ijData = chiffresIJ[formation]?.[CURRENT_IJ_MILLESIME];
    const entreeData = chiffresEntree[formation]?.[CURRENT_RENTREE];

    const ijKeys = ["tauxInsertion", "tauxPoursuite", "tauxDevenirFavorable"];
    const entreeKeys = ["premiersVoeux", "capacite", "effectifEntree", "tauxRemplissage", "tauxPression"];

    const numberOfValues =
      (ijData ? countValues(ijData, ijKeys) : 0) + (entreeData ? countValues(entreeData, entreeKeys) : 0);

    numberOfValuesPerFormation[formation] = numberOfValues;
  }

  const [formationWithMostValues] = Object.entries(numberOfValuesPerFormation).sort((a, b) => b[1] - a[1]);

  return formationWithMostValues[0];
}

function setDefaultVoieFilter(filters: Filters, data?: AnalyseDetaillee) {
  if (filters.voie.length > 0) {
    return filters.voie;
  }

  if (!data?.formations) {
    return [];
  }
  // @ts-expect-error TODO
  const hasAnyScolaireFormation = Object.values(data.formations).some((f) => f.voie === VoieEnum.scolaire);

  if (hasAnyScolaireFormation) {
    return [VoieEnum.scolaire];
  }
  // @ts-expect-error TODO
  const hasAnyApprentissageFormation = Object.values(data.formations).some((f) => f.voie === VoieEnum.apprentissage);

  if (hasAnyApprentissageFormation) {
    return [VoieEnum.apprentissage];
  }
  return [];
}

function filterFormations(data: AnalyseDetaillee, filters: Filters) {
  const { codeNiveauDiplome, voie } = filters;
  return Object.values(data.formations ?? {}).reduce((acc, f) => {
    if (
      // @ts-expect-error TODO
      ((codeNiveauDiplome ?? []).length === 0 || codeNiveauDiplome?.includes(f.codeNiveauDiplome)) &&
      // @ts-expect-error TODO
      ((voie ?? []).length === 0 || voie?.includes("all") || voie?.includes(f.voie))
    ) {
      // @ts-expect-error TODO
      acc[f.offre] = f;
    }
    return acc;
  }, {} as Formations);
}

function shouldSelectDefaultFormation(params: Params, formations?: Formations) {
  return !params.offre || formations?.[params.offre] === undefined;
}

export const useAnalyseDetaillee = () => {
  const trackEvent = usePlausible();
  const { uai, setAnalyseDetaillee } = useEtablissementContext();
  const [filteredDatas, setFilteredDatas] = useState<AnalyseDetaillee | null>();
  const [searchParams, setSearchParams] = useStateParams<Params>({
    defaultValues: {
      filters: {
        codeNiveauDiplome: [],
        voie: [],
      },
      offre: "",
      displayType: DisplayTypeEnum.dashboard,
    },
  });

  const { data, isLoading } = client.ref("[GET]/etablissement/:uai/analyse-detaillee").useQuery(
    {
      params: { uai },
    },
    {
      keepPreviousData: true,
      staleTime: 10000000,
    }
  );

  const displayDashboard = () =>
    setSearchParams({
      ...searchParams,
      displayType: DisplayTypeEnum.dashboard,
    });

  const displayQuadrant = () => setSearchParams({ ...searchParams, displayType: DisplayTypeEnum.quadrant });

  const setOffre = (offre: string) => {
    filterTracker("offre", offre);
    setSearchParams({
      ...searchParams,
      offre,
    });
  };

  const handleFilters = (type: keyof Filters, value: Filters[keyof Filters]) => {
    setSearchParams({
      ...searchParams,
      filters: { ...searchParams.filters, [type]: value },
    });
  };

  const filterTracker = (filterName: keyof Filters | string, filterValue?: string | number) => () => {
    trackEvent("analyse-detailee-etablissement:filtre", {
      props: { filter_name: filterName, filter_value: filterValue },
    });
  };

  // Définie un filtre par défaut sur la voie
  useEffect(() => {
    handleFilters("voie", setDefaultVoieFilter(searchParams.filters, data));
  }, [data]);

  // Choix de la selection de la formation par défaut
  useEffect(() => {
    if (Object.keys(filteredDatas?.formations ?? {}).length > 0) {
      if (shouldSelectDefaultFormation(searchParams, filteredDatas?.formations)) {
        setSearchParams({
          ...searchParams,
          offre: selectFormationWithMostValues(filteredDatas!.formations, data!.chiffresIJ, data!.chiffresEntree),
        });
      }
    }
  }, [filteredDatas, searchParams]);

  // Filtre les formations disponibles en fonction des filters : voie et code niveau diplome
  useEffect(() => {
    if (data) {
      const filteredFormations = filterFormations(data, searchParams.filters);

      setFilteredDatas({
        ...data,
        formations: filteredFormations,
      });
    }
  }, [data, searchParams]);

  useEffect(() => {
    if (!isLoading && filteredDatas) {
      setAnalyseDetaillee(filteredDatas);
    }
  }, [filteredDatas, isLoading]);

  return {
    ...filteredDatas,
    filters: {
      diplomes: filteredDatas?.filters?.diplomes ?? [],
      // @ts-expect-error TODO
      voies: uniq(Object.values(data?.formations ?? {}).map((f) => f.voie)),
    },
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
