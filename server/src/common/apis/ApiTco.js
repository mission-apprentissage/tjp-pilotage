import axios from "axios";
import { logger } from "../logger.js";
import { ApiError, apiRateLimiter } from "../utils/apiUtils.js";

// Cf Documentation : https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1/docs/
const executeWithRateLimiting = apiRateLimiter("apiTco", {
  //2 requests per second
  nbRequests: 2,
  durationInSeconds: 1,
  client: axios.create({
    baseURL: "https://tables-correspondances.apprentissage.beta.gouv.fr/api/v1",
    timeout: 5000,
  }),
});

class ApiTco {
  findCfd(cfd) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[TCO API] Search cfd data ${cfd}...`);
        let response = await client.post(`cfd`, {
          cfd,
        });
        return response;
      } catch (e) {
        throw new ApiError("Api Tco", `${e.message} for cfd=${cfd}`, e.code || e.response.status);
      }
    });
  }
  findRncp(rncp) {
    return executeWithRateLimiting(async (client) => {
      try {
        logger.debug(`[TCO API] Search rncp data ${rncp}...`);
        let response = await client.post(`rncp`, {
          rncp,
        });
        return response;
      } catch (e) {
        throw new ApiError("Api Tco", `${e.message} for rncp=${rncp}`, e.code || e.response.status);
      }
    });
  }
}

export default new ApiTco();
