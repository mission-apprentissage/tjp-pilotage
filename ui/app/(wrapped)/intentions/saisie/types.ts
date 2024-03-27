import { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/demandes"]["query"];
export type Filters = Pick<Query, "statut" | "campagne">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/demandes"]["campagnes"];
