import axios from "axios";
import { logger } from "../logger.js";
import { ApiError, apiRateLimiter } from "../utils/apiUtils.js";

// Cf Documentation : https://referentiel.apprentissage.beta.gouv.fr/
const executeWithRateLimiting = apiRateLimiter("apiReferentiel", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: axios.create({
    baseURL: "https://referentiel.apprentissage.beta.gouv.fr/api/v1",
    timeout: 5000,
  }),
});

class ApiReferentiel {
  getOrganisme(siret) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[Referentiel API] Search opco data ${siret}...`);
        let response = await client.get(`organismes/${siret}`);
        if (!response?.data) {
          throw new ApiError("Api Referentiel", `No data found for siret=${siret}`);
        }
        return response.data;
      } catch (e) {
        if (e.response.status === 404) {
          return null;
        } else {
          throw new ApiError("Api Referentiel", `${e.message} for siret=${siret}`, e.code || e.response.status);
        }
      }
    });
  }
}

export default new ApiReferentiel();
