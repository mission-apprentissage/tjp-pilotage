import { client } from "../../../../../api.client";

export const useEtablissementHeader = (uai: string) => {
  console.log("useEtablissementHeader", uai);

  const { data } = client.ref("[GET]/etablissement/:uai/header").useQuery({
    params: { uai },
  });

  return {
    ...data,
    search: (value: string) => {
      console.log(`search ${value}`);
    },
  };
};
