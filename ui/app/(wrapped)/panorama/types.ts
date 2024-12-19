import type { client } from "@/api.client";

export const DEFAULT_SEARCH_PARAMS = {
  // Sélection automatique des BAC PRO pour pré-filtrer les pages panorama
  codeNiveauDiplome: ["400"],
};

export type QueryPanoramaFormation =
  | (typeof client.inferArgs)["[GET]/panorama/stats/region"]["query"]
  | (typeof client.inferArgs)["[GET]/panorama/stats/departement"]["query"];

export type PanoramaFormationRegion = (typeof client.infer)["[GET]/panorama/stats/region"]["formations"][number];
export type PanoramaFormationsRegion = (typeof client.infer)["[GET]/panorama/stats/region"]["formations"];

export type PanoramaFormationDepartement =
  (typeof client.infer)["[GET]/panorama/stats/departement"]["formations"][number];
export type PanoramaFormationsDepartement = (typeof client.infer)["[GET]/panorama/stats/departement"]["formations"];

export type PanoramaFormation = PanoramaFormationRegion | PanoramaFormationDepartement;

export type PanoramaFormations = PanoramaFormationsRegion | PanoramaFormationsDepartement;

export type PanoramaStatsTauxPoursuite = (typeof client.infer)["[GET]/panorama/stats/region"]["tauxPoursuite"];
export type PanoramaStatsTauxInsertion = (typeof client.infer)["[GET]/panorama/stats/region"]["tauxInsertion"];

export type PanoramaTopFlops = (typeof client.infer)["[GET]/panorama/stats/region"]["topFlops"];
export type PanoramaTopFlop = (typeof client.infer)["[GET]/panorama/stats/region"]["topFlops"][number];

export type StatsFormationsRegion = (typeof client.infer)["[GET]/region/:codeRegion"];
export type StatsFormationsDepartement = (typeof client.infer)["[GET]/departement/:codeDepartement"];
export type StatsFormations = StatsFormationsRegion | StatsFormationsDepartement;

export type OrderPanoramaFormation = Pick<QueryPanoramaFormation, "order" | "orderBy">;
export type Order = OrderPanoramaFormation;

export type FiltersPanoramaFormation = Omit<QueryPanoramaFormation, "codeDepartement" | "codeRegion">;
