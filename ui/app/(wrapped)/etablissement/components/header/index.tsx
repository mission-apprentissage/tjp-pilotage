import { Grid } from "@chakra-ui/react";

import { useEtablissementContext } from "../../context/etablissementContext";
import { AccesRapide } from "./accesRapide";
import { Coordonnees } from "./coordonnees";
import { DonneesIncompletes } from "./donneesIncompletes";
import { Filieres } from "./filieres";
import { useEtablissementHeader } from "./hook";
import { Indicateurs } from "./indicateurs";
import { Libelle } from "./libelle";
import { SearchInput } from "./searchInput";

export const EtablissementHeader = () => {
  const { uai } = useEtablissementContext();
  const { filieres, informations, search } = useEtablissementHeader(uai) || {};

  return (
    <Grid templateColumns={"repeat(12,1fr)"}>
      <Libelle informations={informations} />
      <SearchInput search={search} />
      <Coordonnees informations={informations} />
      <Filieres filieres={filieres} />
      <AccesRapide uai={uai} />
      <Indicateurs millessimes={["2022", "2023"]} />
      <DonneesIncompletes isMissingDatas={true} />
    </Grid>
  );
};
