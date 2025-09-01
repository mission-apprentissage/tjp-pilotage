import type { client } from "@/api.client";

import type { DEMANDES_COLUMNS_OPTIONAL } from "./DEMANDES_COLUMNS";

export type Query = (typeof client.inferArgs)["[GET]/demandes"]["query"];
export type Filters = Pick<Query, "statut" | "suivies" | "campagne" | "codeAcademie" | "codeNiveauDiplome" | "search">;
export type Order = Pick<Query, "order" | "orderBy">;

export type Campagnes = (typeof client.infer)["[GET]/demandes"]["filters"]["campagnes"];

export type DataDemande = (typeof client.infer)["[GET]/demandes"];

export type Demandes = (typeof client.infer)["[GET]/demandes"]["demandes"];

export type Demande = (typeof client.infer)["[GET]/demandes"]["demandes"][number];

export type Avis = (typeof client.infer)["[GET]/demandes"]["demandes"][number]["avis"][number];

export type DEMANDES_COLUMNS_KEYS = keyof typeof DEMANDES_COLUMNS_OPTIONAL;
