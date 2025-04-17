import type { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/demandes"]["query"];
export type Filters = Pick<Query, "statut" | "suivies" | "campagne" | "codeAcademie" | "codeNiveauDiplome" | "search">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/demandes"]["filters"]["campagnes"];

export type Demandes = (typeof client.infer)["[GET]/demandes"]["demandes"];

export type Avis = (typeof client.infer)["[GET]/demandes"]["demandes"][number]["avis"][number];

export type Filiere = (typeof client.infer)["[GET]/filiere/search/:search"][number];
export type Campus = (typeof client.infer)["[GET]/campus/search/:search"][number];
