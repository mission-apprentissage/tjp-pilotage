import { Stack, Text } from "@chakra-ui/react";

import { client } from "../../../../../../api.client";
import { useEtablissementContext } from "../../context/etablissementContext";
import { ListeEtablissementsProches } from "./components/ListeEtablissementsProches";
import { Map } from "./components/Map";

export const EtablissementMap = () => {
  const { uai } = useEtablissementContext();
  const { data: etablissement } = client
    .ref("[GET]/etablissement/:uai/map")
    .useQuery({
      params: { uai },
      query: {},
    });

  console.log(etablissement);

  return (
    <Stack>
      <Text as={"h2"} fontSize={"20px"} fontWeight={700}>
        L'offre de formations autour de l'établissement
      </Text>
      <Text>
        Visualisez l'offre de formations sur la carte régionale, et comparez les
        établissements selon les taux d'emploi et de devenir favorable.
      </Text>
      <ListeEtablissementsProches />
      <Map />
    </Stack>
  );
};
