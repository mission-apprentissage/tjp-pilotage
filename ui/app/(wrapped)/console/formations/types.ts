import { client } from "@/api.client";
export type Query = (typeof client.inferArgs)["[GET]/formations"]["query"];

export type Filters = Pick<
  Query,
  | "cfd"
  | "cfdFamille"
  | "codeAcademie"
  | "codeDepartement"
  | "codeDiplome"
  | "codeRegion"
  | "commune"
  | "CPC"
  | "CPCSecteur"
  | "CPCSousSecteur"
  | "libelleFiliere"
  | "codeDispositif"
>;

export type Order = Pick<Query, "order" | "orderBy">;

export type Line =
  (typeof client.infer)["[GET]/formations"]["formations"][number];

export type LineId = {
  codeDispositif?: string;
  cfd: string;
};
