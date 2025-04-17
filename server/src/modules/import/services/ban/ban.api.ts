import axios, { isAxiosError } from "axios";
import rateLimit from "axios-rate-limit";

import type { BANResponse } from "./banResponse";

const instance = rateLimit(
  axios.create({
    baseURL: "https://api-adresse.data.gouv.fr/search/",
    responseType: "json",
  }),
  { maxRPS: 50 }
);

export const findAddress = async ({
  search,
  lat,
  lon,
  limit,
}: {
  search: string;
  limit?: number;
  lat?: string;
  lon?: string;
}) => {
  const params = new URLSearchParams();
  params.append("q", search);

  if (limit) {
    params.append("limit", limit.toString());
  }

  if (lat) {
    params.append("lat", lat);
  }

  if (lon) {
    params.append("lon", lon);
  }

  console.log(`--- Recherche de l'adresse: ${search}`);

  try {
    const response = await instance.get<BANResponse>(`?${params.toString()}`);
    console.log(`---- Adresse trouvée: ${search}`);
    return response.data;
  } catch (err) {
    console.error(`Une erreur est survenue lors de la recherche de l'adresse: ${search}`);
    if (isAxiosError(err)) {
      console.error(err.message);
    }
    return null;
  }
};
