import { useRouter } from "next/navigation";

import { client } from "@/api.client";
import { useEtablissementContext } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";

export const useEtablissementHeader = () => {
  const { uai } = useEtablissementContext();
  const router = useRouter();

  const { data, isLoading, isError, error } = client.ref("[GET]/etablissement/:uai/header").useQuery({
    params: { uai },
  });

  if (isError) {
    console.error(error);
    router.push("/panorama/etablissement?wrongUai=" + uai);
  }

  return {
    ...data,
    isLoading,
    uai,
  };
};
