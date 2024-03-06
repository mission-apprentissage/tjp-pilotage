import { client } from "../../../../../api.client";

export type EtablissementHeader =
  (typeof client.infer)["[GET]/etablissement/:uai/header"];
export type Informations = EtablissementHeader["informations"];
export type Nsfs = EtablissementHeader["nsfs"];
export type Indicateurs = EtablissementHeader["indicateurs"];
export type Indicateur = EtablissementHeader["indicateurs"]["tauxPoursuite"];
