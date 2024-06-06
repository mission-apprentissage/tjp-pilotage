import { client } from "@/api.client";

export type Intention = (typeof client.infer)["[GET]/intention/:numero"];

export type ChangementsStatut = Intention["changementsStatut"];
export type Aviss = Intention["avis"];

export type ChangementStatut = Exclude<
  ChangementsStatut,
  typeof undefined
>[number];

export type Avis = Exclude<Aviss, typeof undefined>[number];

export type Query = (typeof client.inferArgs)["[GET]/intentions"]["query"];
export type Filters = Pick<Query, "statut" | "suivies" | "campagne">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/intentions"]["campagnes"];
export type Campagne =
  (typeof client.infer)["[GET]/intention/:numero"]["campagne"];
