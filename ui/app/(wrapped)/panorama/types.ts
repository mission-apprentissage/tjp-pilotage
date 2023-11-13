import { ApiType } from "shared";

import { api } from "@/api.client";

export type QueryPanoramaFormation = Parameters<typeof api.getDataForPanoramaRegion>[0]["query"] | Parameters<typeof api.getDataForPanoramaDepartement>[0]["query"];
export type QueryPanoramaEtablissement = Parameters<typeof api.getEtablissement>[0]["query"];

export type PanoramaFormationRegion = ApiType<
  typeof api.getDataForPanoramaRegion
>["formations"][number];
export type PanoramaFormationsRegion = ApiType<
  typeof api.getDataForPanoramaRegion
>["formations"];

export type PanoramaFormationDepartement = ApiType<
  typeof api.getDataForPanoramaDepartement
>["formations"][number];
export type PanoramaFormationsDepartement = ApiType<
  typeof api.getDataForPanoramaDepartement
>["formations"];

export type PanoramaFormationEtablissement = ApiType<
  typeof api.getEtablissement
>["formations"][number];
export type PanoramaFormationsEtablissement = ApiType<
  typeof api.getEtablissement
>["formations"];

export type PanoramaFormation =
  | PanoramaFormationRegion
  | PanoramaFormationDepartement;

export type PanoramaFormations =
  | PanoramaFormationsRegion
  | PanoramaFormationsDepartement;


export type StatsFormationsRegion = ApiType<typeof api.getRegionStats>;
export type StatsFormationsDepartement = ApiType<
  typeof api.getDepartementStats
>;
export type StatsFormations =
  | StatsFormationsRegion
  | StatsFormationsDepartement;


export type OrderPanoramaFormation = Pick<QueryPanoramaFormation, "order" | "orderBy">;
export type OrderPanoramaEtablissement = Pick<QueryPanoramaEtablissement, "order" | "orderBy">;
export type Order = OrderPanoramaEtablissement | OrderPanoramaFormation;


export type FiltersPanoramaFormation = Pick<
  QueryPanoramaFormation,
  | "codesNiveauxDiplomes"
  | "libellesFilieres"
>;
