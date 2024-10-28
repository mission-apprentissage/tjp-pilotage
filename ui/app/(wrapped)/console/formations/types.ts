import type { client } from "@/api.client";

export type Query = (typeof client.inferArgs)["[GET]/formations"]["query"];

export type Filters = Query;

export type Order = Pick<Query, "order" | "orderBy">;

export type Formations = (typeof client.infer)["[GET]/formations"];

export type Line = (typeof client.infer)["[GET]/formations"]["formations"][number];

export type LineId = {
  codeDispositif?: string;
  cfd: string;
};
