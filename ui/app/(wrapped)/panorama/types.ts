import { client } from "@/api.client";

export type PanoramaFormationRegion =
  (typeof client.infer)["[GET]/panorama/stats/region"]["formations"][number];
export type PanoramaFormationsRegion =
  (typeof client.infer)["[GET]/panorama/stats/region"]["formations"];

export type PanoramaFormationDepartement =
  (typeof client.infer)["[GET]/panorama/stats/departement"]["formations"][number];
export type PanoramaFormationsDepartement =
  (typeof client.infer)["[GET]/panorama/stats/departement"]["formations"];

export type PanoramaFormation =
  | PanoramaFormationRegion
  | PanoramaFormationDepartement;
export type PanoramaFormations =
  | PanoramaFormationsRegion
  | PanoramaFormationsDepartement;

export type StatsFormationsRegion =
  (typeof client.infer)["[GET]/region/:codeRegion"];
export type StatsFormationsDepartement =
  (typeof client.infer)["[GET]/departement/:codeDepartement"];
export type StatsFormations =
  | StatsFormationsRegion
  | StatsFormationsDepartement;
