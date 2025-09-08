import type { client } from "@/api.client";

import type { FORMATION_ETABLISSEMENT_COLUMNS, FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED } from "./FORMATION_ETABLISSEMENT_COLUMNS";

export type Query = (typeof client.inferArgs)["[GET]/etablissements"]["query"];

export type Line = (typeof client.infer)["[GET]/etablissements"]["etablissements"][number];

export type Etablissements = (typeof client.infer)["[GET]/etablissements"];

export type FiltersList = Etablissements["filters"];

export type Filters = Omit<Query, "order" | "orderBy" | "offset" | "limit">;

export type Order = Pick<Query, "order" | "orderBy">;

export type LineId = {
  codeDispositif?: string;
  cfd: string;
  uai: string;
};

export type RequetesEnregistrees = (typeof client.infer)["[GET]/requetes"];
export type RequetesSuggerees = Array<{
  nom: string;
  couleur?: string;
  filtres: Partial<Filters>;
  active?: boolean;
  conditions: Array<keyof Partial<Filters>>;
}>;

export type FORMATION_ETABLISSEMENT_COLUMNS_KEYS = (
  keyof typeof FORMATION_ETABLISSEMENT_COLUMNS |
  keyof typeof FORMATION_ETABLISSEMENT_COLUMNS_CONNECTED
);

export enum DisplayTypeEnum {
  synthese = "synthese",
  evolutionDesTaux = "evolutionDesTaux",
  suiviTransformation = "suiviTransformation",
}

