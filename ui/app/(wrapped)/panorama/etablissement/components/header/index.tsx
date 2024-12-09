import { Grid, GridItem } from "@chakra-ui/react";

import { Loading } from "@/components/Loading";

import { AccesRapideSection } from "./components/AccesRapideSection";
import { Coordonnees } from "./components/Coordonnees";
import { Filieres } from "./components/Filieres";
import { IndicateursSection } from "./components/IndicateursSection";
import { Libelle } from "./components/Libelle";
import { SearchInput } from "./components/SearchInput";
import { useEtablissementHeader } from "./hook";

export const EtablissementHeader = () => {
  const { nsfs, informations, indicateurs, isLoading, uai } = useEtablissementHeader();

  if (isLoading) {
    return <Loading my={16} size="xl" />;
  }

  return (
    <Grid templateColumns={"repeat(12,1fr)"} py={"32px"}>
      <Libelle informations={informations} />
      <SearchInput uai={uai} />
      <AccesRapideSection uai={uai} />
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
