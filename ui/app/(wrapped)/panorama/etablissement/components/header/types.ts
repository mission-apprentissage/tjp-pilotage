import type { client } from "@/api.client";

export type EtablissementHeader = (typeof client.infer)["[GET]/etablissement/:uai/header"];
export type Informations = EtablissementHeader["informations"];
export type Nsfs = EtablissementHeader["nsfs"];
export type Indicateurs = EtablissementHeader["indicateurs"];
export type Indicateur = NonNullable<Indicateurs["tauxPoursuite"]>;
export type CompareTo = NonNullable<Indicateur["compareTo"]>;
