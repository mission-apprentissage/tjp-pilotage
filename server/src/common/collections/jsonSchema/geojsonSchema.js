import { object, string, array, number } from "./jsonSchemaTypes.js";

export const geojsonSchema = () => {
  const required = ["type", "geometry"];

  return object(
    {
      type: string(),
      geometry: object(
        {
          type: string(),
          coordinates: array(),
        },
        { required: ["type", "coordinates"] }
      ),
      properties: object({
        score: number(),
        source: string(),
      }),
    },
    { required }
  );
};
