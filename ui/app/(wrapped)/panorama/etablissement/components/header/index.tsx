import { Grid } from "@chakra-ui/react";

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

  const { nsfs, informations, indicateurs } = useEtablissementHeader(uai) || {};

  return (
    <Grid templateColumns={"repeat(12,1fr)"} py={"32px"}>
      <Libelle informations={informations} />
      <SearchInput uai={uai} />
      <Coordonnees informations={informations} />
      <Filieres nsfs={nsfs} />
      <AccesRapide uai={uai} />
      <IndicateursSection
        indicateurs={indicateurs}
        codeRegion={informations?.codeRegion}
      />
    </Grid>
  );
};
