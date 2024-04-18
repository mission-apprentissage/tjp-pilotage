import { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/demandes/expe"]["query"];
export type Filters = Pick<Query, "statut" | "campagne">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes =
  (typeof client.infer)["[GET]/demandes/expe"]["campagnes"];
export type Campagne =
  (typeof client.infer)["[GET]/demande/expe/:numero"]["campagne"];
