import { client } from "../../../../../api.client";

export type EtablissementHeader =
  (typeof client.infer)["[GET]/etablissement/:uai/header"];
export type Informations = EtablissementHeader["informations"];
export type Filieres = EtablissementHeader["filieres"];
export type Indicateurs = EtablissementHeader["indicateurs"];
