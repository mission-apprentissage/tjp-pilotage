import { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/intentions"]["query"];
export type Filters = Pick<Query, "statut" | "suivies" | "campagne">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/intentions"]["campagnes"];
export type Campagne =
  (typeof client.infer)["[GET]/intention/:numero"]["campagne"];
