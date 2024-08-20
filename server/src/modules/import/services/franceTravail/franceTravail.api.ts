import axios, { AxiosError } from "axios";
import rateLimit from "axios-rate-limit";
import axiosRetry, { isNetworkError } from "axios-retry";

import { config } from "../../../../../config/config";

let loggingIn = false;

const instance = rateLimit(
  axios.create({
    baseURL: "https://entreprise.francetravail.fr",
    responseType: "json",
  }),
  {
    maxRPS: 10,
  }
);

const setInstanceBearerToken = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const retryCondition = async (error: AxiosError) => {
  const response = error?.response;

  if (isNetworkError(error)) {
    return true;
  }

  if (![401, undefined].includes(response?.status)) {
    console.log(`[ERROR] unknown.`, JSON.stringify(response));
  }

  if (!loggingIn) {
    loggingIn = true;
    console.log("--- Refreshing insertjeunes API token");
    const token = await login();
    setInstanceBearerToken(token);
    console.log("--- Refreshed insertjeunes API token");
    loggingIn = false;
  } else {
    console.log(
      "--- Already refreshing insertjeunes API token, triggering a 10s delay"
    );
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  return true;
};

export const login = async () => {
  const response = await instance.post(
    "/connexion/oauth2/access_token?realm=%2Fpartenaire",
    undefined,
    {
      headers: {
        username: config.PILOTAGE_INSERJEUNES_USERNAME,
        password: config.PILOTAGE_INSERJEUNES_PASSWORD,
      },
    }
  );
  const { access_token: token } = response.data;
  return token;
};

axiosRetry(instance, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition,
  shouldResetTimeout: true,
});
