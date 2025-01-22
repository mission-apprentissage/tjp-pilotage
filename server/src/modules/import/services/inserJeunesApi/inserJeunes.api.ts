import type { AxiosError } from "axios";
import axiosRetry, { exponentialDelay, isNetworkError } from "axios-retry";

import config from "@/config";

import { formatRegionData } from "./formatRegionData";
import { formatUaiData } from "./formatUaiData";
import { instance, setInstanceBearerToken } from "./inserJeunes.provider";

let loggingIn = false;
let lockTimeout: NodeJS.Timeout | null = null;

function clearLockAfterTimeout() {
  if (lockTimeout) {
    clearTimeout(lockTimeout);
  }
  lockTimeout = setTimeout(() => {
    if (loggingIn) {
      console.log("--- Force releasing lock after 30s timeout");
      loggingIn = false;
    }
  }, 30000);
}


async function retryCondition(error: AxiosError) {
  const response = error?.response;

  console.error(`Error (${response?.status})`, (response?.data as { msg: string })?.msg);

  if (isNetworkError(error)) {
    return true;
  }

  if (![401, 500, undefined].includes(response?.status)) {
    console.log(`[ERROR] unknown.`, JSON.stringify(response));
    return false;
  }

  if (!loggingIn) {
    loggingIn = true;
    clearLockAfterTimeout(); // Ajouter le timeout quand on prend le lock
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
  retryDelay: exponentialDelay,
  retryCondition,
  shouldResetTimeout: true,
});

export const login = async () => {
  const response = await instance.post("/login", undefined, {
    headers: {
      username: config.inserJeunes.username,
      password: config.inserJeunes.password,
    },
  });
  const { access_token: token } = response.data;
  return token;
};

export const getUaiData = async ({ uai, millesime }: { uai: string; millesime: string }) => {
  const response = await instance.get(`/UAI/${uai}/millesime/${millesime}`);

  if (response) {
    return formatUaiData(response?.data);
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
