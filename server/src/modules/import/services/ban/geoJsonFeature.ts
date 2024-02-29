export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    label: string;
    score: number;
    housenumber: string;
    id: number;
    type: "housenumber" | "street" | "locality" | "municipality";
    name: string;
    postcode: string;
    citycode: string;
    x: number;
    y: number;
    city: string;
    context: string;
    importance: number;
    street: string;
  };
}
