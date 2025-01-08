import type { AxiosError } from "axios";
import axios from "axios";
import rateLimit from "axios-rate-limit";
import axiosRetry, { exponentialDelay, isNetworkError } from "axios-retry";

import config from "@/config";

import type { FranceTravailStatsPerspectiveRecrutementResponse } from "./franceTravailResponse";

let loggingIn = false;

const instance = rateLimit(
  axios.create({
    baseURL: "https://api.francetravail.io",
  }),
  {
    maxRPS: 10,
  },
);

const retryCondition = async (error: AxiosError) => {
  const response = error?.response;

  if (isNetworkError(error)) {
    console.warn(`[WARN] Network error, status: ${response?.status}`);
    return true;
  }

  if (![401, undefined].includes(response?.status)) {
    console.error(`[ERROR] unknown.`, JSON.stringify(response));
    return false;
  }

  if (response?.status === 429) {
    console.warn(`[WARN] Too many requests`);
    return true;
  }

  if (!loggingIn) {
    loggingIn = true;
    console.log("--- Refreshing FranceTravail API token");
    const token = await login();
    setInstanceBearerToken(token);
    console.log("--- Refreshed FranceTravail API token");
    loggingIn = false;
  } else {
    console.log("--- Already refreshing insertjeunes API token, triggering a 10s delay");
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return true;
};

axiosRetry(instance, {
  retries: 3,
  retryCondition,
  shouldResetTimeout: true,
  retryDelay: exponentialDelay,
});

const setInstanceBearerToken = (token: string) => {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const login = async () => {
  const response = await axios.post<{ access_token: string }>(
    "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire",
    {
      grant_type: "client_credentials",
      client_id: config.franceTravail.client,
      client_secret: config.franceTravail.secret,
      scope: "api_stats-offres-demandes-emploiv1 offresetdemandesemploi",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  console.log({ status: response.status, data: response.data });

  const { access_token } = response.data;

  return access_token;
};

export const getStatsPerspectivesRecrutement = async (codeRome: string) => {
  const response = await instance.post<FranceTravailStatsPerspectiveRecrutementResponse>(
    `/partenaire/stats-offres-demandes-emploi/v1/indicateur/stat-perspective-employeur`,
    {
      codeTypeTerritoire: "NAT",
      codeTerritoire: "FR",
      codeTypeActivite: "ROME",
      codeActivite: codeRome,
      codeTypePeriode: "ANNEE",
      codeTypeNomenclature: "TYPE_TENSION",
    },
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  return response.data?.listeValeursParPeriode;
};

export const getStatsPerspectivesRecrutementRegion = async (codeRome: string, codeRegion: string) => {
  const response = await instance.post<FranceTravailStatsPerspectiveRecrutementResponse>(
    `/partenaire/stats-offres-demandes-emploi/v1/indicateur/stat-perspective-employeur`,
    {
      codeTypeTerritoire: "REG",
      codeTerritoire: codeRegion,
      codeTypeActivite: "ROME",
      codeActivite: codeRome,
      codeTypePeriode: "ANNEE",
      codeTypeNomenclature: "TYPE_TENSION",
    },
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  return response.data?.listeValeursParPeriode;
};

export const getStatsPerspectivesRecrutementDepartement = async (codeRome: string, codeDepartement: string) => {
  const response = await instance.post<FranceTravailStatsPerspectiveRecrutementResponse>(
    `/partenaire/stats-offres-demandes-emploi/v1/indicateur/stat-perspective-employeur`,
    {
      codeTypeTerritoire: "DEP",
      codeTerritoire: codeDepartement,
      codeTypeActivite: "ROME",
      codeActivite: codeRome,
      codeTypePeriode: "ANNEE",
      codeTypeNomenclature: "TYPE_TENSION",
    },
  );

  return response.data?.listeValeursParPeriode;
};
