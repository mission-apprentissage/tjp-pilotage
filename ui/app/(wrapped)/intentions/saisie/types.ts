import type { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/demandes"]["query"];
export type Filters = Pick<Query, "statut" | "campagne" | "codeAcademie" | "codeNiveauDiplome" | "suivies" | "search">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/demandes"]["filters"]["campagnes"];

export type Demandes = (typeof client.infer)["[GET]/demandes"]["demandes"];

export type Demande = (typeof client.infer)["[GET]/demande/:numero"];
export type DemandeMetadata = Demande["metadata"];
