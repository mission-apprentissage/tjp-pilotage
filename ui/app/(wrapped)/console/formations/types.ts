import type { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/formations"]["query"];

export type Filters = Omit<Query, "order" | "orderBy" | "offset" | "limit">;

export type Order = Pick<Query, "order" | "orderBy">;

export type Formations = (typeof client.infer)["[GET]/formations"];
export type FiltersList = Formations["filters"];

export type Formation = (typeof client.infer)["[GET]/formations"]["formations"][number];

export type LineId = {
  codeDispositif?: string;
  cfd: string;
};

export type RequetesEnregistrees = (typeof client.infer)["[GET]/requetes"];
export type RequetesSuggerees = Array<{
  nom: string;
  couleur?: string;
  filtres: Partial<Filters>;
  active?: boolean;
  conditions: Array<keyof Partial<Filters>>;
}>;
