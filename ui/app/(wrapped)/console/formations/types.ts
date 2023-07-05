import { ApiType } from "shared";

import { api } from "@/api.client";
export type Query = Parameters<typeof api.getFormations>[0]["query"];

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

export type Line = ApiType<typeof api.getFormations>["formations"][number];

export type LineId = {
  codeDispositif?: string;
  cfd: string;
};
