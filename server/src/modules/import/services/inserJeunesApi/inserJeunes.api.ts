import type { AxiosError } from "axios";
import axiosRetry, { isNetworkError } from "axios-retry";

import config from "@/config";

import { formatRegionData } from "./formatRegionData";
import { formatUaiData } from "./formatUaiData";
import { instance, setInstanceBearerToken } from "./inserJeunes.provider";

let loggingIn = false;

async function retryCondition(error: AxiosError) {
  const response = error?.response;

  if (isNetworkError(error)) {
    return true;
  }

  if (![401, undefined].includes(response?.status)) {
    console.log(`[ERROR] unknown.`, JSON.stringify(response));
    return false;
  }

  if (!loggingIn) {
    loggingIn = true;
    console.log("--- Refreshing insertjeunes API token");
    const token = await login();
    setInstanceBearerToken(token);
    console.log("--- Refreshed insertjeunes API token");
    loggingIn = false;
  } else {
    console.log("--- Already refreshing insertjeunes API token, triggering a 10s delay");
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  return true;
}

axiosRetry(instance, {
  retries: 20,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition,
  shouldResetTimeout: true,
});

export const login = async () => {
  const response = await instance.post("/login", undefined, {
    headers: {
      username: config.INSERJEUNES_USERNAME,
      password: config.INSERJEUNES_PASSWORD,
    },
  });
  const { access_token: token } = response.data;
  return token;
};

export const getUaiData = async ({ uai, millesime }: { uai: string; millesime: string }) => {
  const response = await instance.get(`/UAI/${uai}/millesime/${millesime}`);

  if (response) {
    const data = JSON.parse(response?.data);
    return formatUaiData(data);
  }

  throw new Error("no data");
};

export const getRegionData = async ({ codeRegionIj, millesime }: { codeRegionIj: string; millesime: string }) => {
  const response = await instance.get(`/region/${codeRegionIj}/millesime/${millesime}`);

  if (response) {
    return formatRegionData(response?.data);
  }

  throw new Error("no data");
};

export const inserJeunesApi = { getUaiData, getRegionData };
