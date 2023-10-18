import { ApiType } from "shared";

import { api } from "@/api.client";

export type PanoramaFormationRegion = ApiType<typeof api.getDataForPanoramaRegion>["formations"][number]
export type PanoramaFormationsRegion = ApiType<typeof api.getDataForPanoramaRegion>["formations"]

export type PanoramaFormationDepartement = ApiType<typeof api.getDataForPanoramaDepartement>["formations"][number]
export type PanoramaFormationsDepartement = ApiType<typeof api.getDataForPanoramaDepartement>["formations"]

export type PanoramaFormation = PanoramaFormationRegion | PanoramaFormationDepartement;
export type PanoramaFormations = PanoramaFormationsRegion | PanoramaFormationsDepartement;

export type StatsFormationsRegion = ApiType<typeof api.getRegionStats>;
export type StatsFormationsDepartement = ApiType<typeof api.getDepartementStats>;
export type StatsFormations = StatsFormationsRegion | StatsFormationsDepartement;
