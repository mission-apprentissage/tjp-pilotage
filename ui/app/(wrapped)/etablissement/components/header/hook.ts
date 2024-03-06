import { client } from "../../../../../api.client";

export const useEtablissementHeader = (uai: string) => {
  const { data } = client.ref("[GET]/etablissement/:uai/header").useQuery({
    params: { uai },
  });

  return {
    ...data,
  };
};
