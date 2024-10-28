import type { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/intentions"]["query"];
export type Filters = Pick<Query, "statut" | "suivies" | "campagne" | "codeAcademie" | "codeNiveauDiplome">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/intentions"]["campagnes"];
export type Campagne = (typeof client.infer)["[GET]/intention/:numero"]["campagne"];

export type Avis = (typeof client.infer)["[GET]/intentions"]["intentions"][number]["avis"][number];
