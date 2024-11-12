import { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/demandes"]["query"];
export type Filters = Pick<
  Query,
  | "statut"
  | "campagne"
  | "codeAcademie"
  | "codeNiveauDiplome"
  | "suivies"
  | "search"
>;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/demandes"]["campagnes"];
export type Campagne =
  (typeof client.infer)["[GET]/demande/:numero"]["campagne"];

export type Demande = (typeof client.infer)["[GET]/demande/:numero"];
