import type { GeoJSONFeature } from "./geoJsonFeature";

export interface BANResponse {
  type: "FeatureCollection";
  version: string;
  features: GeoJSONFeature[];
}
