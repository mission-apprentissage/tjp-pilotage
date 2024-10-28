import type { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/etablissements"]["query"];

export type Line = (typeof client.infer)["[GET]/etablissements"]["etablissements"][number];

export type Etablissements = (typeof client.infer)["[GET]/etablissements"];

export type FiltersList = Etablissements["filters"];

export type Filters = Query;

export type Order = Pick<Query, "order" | "orderBy">;

export type LineId = {
  codeDispositif?: string;
  cfd: string;
  uai: string;
};
