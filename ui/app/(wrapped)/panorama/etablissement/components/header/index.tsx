import { Grid, GridItem } from "@chakra-ui/react";

import { Loading } from "@/components/Loading";

import { useEtablissementContext } from "../../context/etablissementContext";
import { AccesRapide } from "./components/accesRapide";
import { Coordonnees } from "./components/coordonnees";
import { Filieres } from "./components/filieres";
import { IndicateursSection } from "./components/indicateurs";
import { Libelle } from "./components/libelle";
import { SearchInput } from "./components/searchInput";
import { useEtablissementHeader } from "./hook";

export const EtablissementHeader = () => {
  const { uai } = useEtablissementContext();

  const { nsfs, informations, indicateurs, isLoading } =
    useEtablissementHeader(uai) || {};

  if (isLoading) {
    return <Loading my={16} size="xl" />;
  }

  return (
    <Grid templateColumns={"repeat(12,1fr)"} py={"32px"}>
      <Libelle informations={informations} />
      <SearchInput uai={uai} />
      <AccesRapide uai={uai} />
      <GridItem colSpan={12} mt={"48px"} mb={"32px"}>
        <Grid templateColumns={"repeat(12,1fr)"}>
          <Coordonnees informations={informations} />
          <Filieres nsfs={nsfs} />
        </Grid>
      </GridItem>
      <IndicateursSection indicateurs={indicateurs} />
    </Grid>
  );
};
