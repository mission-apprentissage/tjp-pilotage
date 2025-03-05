import type { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/intentions"]["query"];
export type Filters = Pick<Query, "statut" | "suivies" | "campagne" | "codeAcademie" | "codeNiveauDiplome" | "search">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/intentions"]["filters"]["campagnes"];

export type Intentions = (typeof client.infer)["[GET]/intentions"]["intentions"];

export type Avis = (typeof client.infer)["[GET]/intentions"]["intentions"][number]["avis"][number];

export type Filiere = (typeof client.infer)["[GET]/filiere/search/:search"][number];
export type Campus = (typeof client.infer)["[GET]/campus/search/:search"][number];
