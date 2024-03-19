import { client } from "../../../../../../api.client";
import { useEtablissementContext } from "../../context/etablissementContext";

export const useEtablissementHeader = () => {
  const { uai } = useEtablissementContext();

  const { data, isLoading } = client
    .ref("[GET]/etablissement/:uai/header")
    .useQuery({
      params: { uai },
    });

  return {
    ...data,
    isLoading,
    uai,
  };
};
