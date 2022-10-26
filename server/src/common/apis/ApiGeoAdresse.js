import axios from "axios";
import { logger } from "../logger.js";
import { ApiError, apiRateLimiter } from "../utils/apiUtils.js";
import queryString from "query-string";

class ApiGeoAdresse {
  constructor(options = {}) {
    // Cf Documentation : https://geo.api.gouv.fr/adresse
    this.executeWithRateLimiting = apiRateLimiter("apiAdresse", {
      nbRequests: 25,
      durationInSeconds: 1,
      client:
        options.axios ||
        axios.create({
          baseURL: "https://api-adresse.data.gouv.fr",
          timeout: 5000,
        }),
    });
  }

  async search(q, options = {}) {
    return this.executeWithRateLimiting(async (client) => {
      try {
        let params = queryString.stringify({ q, ...options });
        logger.debug(`[Adresse API] Searching adresse with parameters ${params}...`);
        const response = await client.get(`search/?${params}`);
        return response.data;
      } catch (e) {
        throw new ApiError("apiGeoAdresse", e.message, e.code || e.response.status);
      }
    });
  }

  async reverse(lon, lat, options = {}) {
    return this.executeWithRateLimiting(async (client) => {
      try {
        let params = queryString.stringify({ lon, lat, ...options });
        logger.debug(`[Adresse API] Reverse geocode with parameters ${params}...`);
        const response = await client.get(`reverse/?${params}`);
        return response.data;
      } catch (e) {
        throw new ApiError("apiGeoAdresse", e.message, e.code || e.response.status);
      }
    });
  }

  async searchMunicipalityByCode(code, options = {}) {
    return this.executeWithRateLimiting(async (client) => {
      try {
        let query = `${options.isCityCode ? "citycode=" : ""}${code}`;
        if (options.codeInsee) {
          query = `${code}&citycode=${options.codeInsee}`;
        }
        logger.debug(`[Adresse API] Searching municipality with query ${query}...`);
        const response = await client.get(`search/?limit=1&q=${query}&type=municipality`);
        return response.data;
      } catch (e) {
        throw new ApiError("apiGeoAdresse", e.message, e.code || e.response.status);
      }
    });
  }
}

export default ApiGeoAdresse;
