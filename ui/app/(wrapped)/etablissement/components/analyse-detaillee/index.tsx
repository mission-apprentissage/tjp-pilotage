import { Grid, GridItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { client } from "@/api.client";

import Loading from "../../../components/Loading";
import { useEtablissementContext } from "../../context/etablissementContext";
import { Dashboard } from "./dashboard/Dashboard";
import { ListeFormations } from "./listeFormations/ListeFormations";

const EtablissementAnalyseDetaillee = () => {
  const { uai } = useEtablissementContext();

  const [offre, setOffre] = useState<string>("");

  const { data, isLoading: isLoading } = client
    .ref(`[GET]/etablissement/analyse-detaillee`)
    .useQuery(
      {
        query: {
          uai,
        },
      },
      {
        keepPreviousData: true,
        staleTime: 10000000,
      }
    );

  useEffect(() => {
    // if (!offre) setOffre(Object.keys(data?.formations ?? [])[0]);
    setOffre("0141687H40025214247scolaire");
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Grid templateColumns={"repeat(10, 1fr)"} gap={8}>
        <GridItem colSpan={4}>
          <ListeFormations
            formations={Object.values(data?.formations ?? {})}
            offre={offre}
            setOffre={setOffre}
          />
        </GridItem>
        <GridItem colSpan={6}>
          <Dashboard
            chiffresIj={data?.chiffresIj[offre]}
            chiffresEntree={data?.chiffresEntree[offre]}
          />
        </GridItem>
      </Grid>
    </>
  );
};

export { EtablissementAnalyseDetaillee };
