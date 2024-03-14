import { client } from "../../../../../../api.client";
import { Filters } from "./types";

export const useAnalyseDetaillee = (uai: string, filters: Filters) => {
  const { data, isLoading: isLoading } = client
    .ref(`[GET]/etablissement/:uai/analyse-detaillee`)
    .useQuery(
      {
        params: { uai },
        query: filters,
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  return {
    ...data,
    isLoading,
  };
};
