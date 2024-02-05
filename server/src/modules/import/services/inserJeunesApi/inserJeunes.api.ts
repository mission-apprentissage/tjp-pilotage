import axios from "axios";
import http from "http";
import https from "https";

import { config } from "../../../../../config/config";
import { formatRegionData } from "./formatRegionData";
import { formatUaiData } from "./formatUaiData";

const httpAgent = new http.Agent({ maxSockets: 1000 });
const httpsAgent = new https.Agent({ maxSockets: 1000 });

const instance = axios.create({
  baseURL: "https://www.inserjeunes.education.gouv.fr/api/v1.0",
  responseType: "json",
  timeout: 20000,
  httpAgent: httpAgent,
  httpsAgent: httpsAgent,
});

export const login = async () => {
  const response = await instance.post("/login", undefined, {
    headers: {
      username: config.PILOTAGE_INSERJEUNES_USERNAME,
      password: config.PILOTAGE_INSERJEUNES_PASSWORD,
    },
  });
  const { access_token: token } = response.data;
  return token;
};

instance.interceptors.response.use(
  (config) => config,
  async (err) => {
    const { config, response } = err;

    if (
      response &&
      (config.retried || ![500, 401, undefined].includes(response?.status))
    ) {
      return Promise.reject(err);
    }

    config.retried = true;

    if (response?.status === "401") {
      console.log("Retry with new token");
    }
    const token = await login();
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
    return axios(config);
  }
);

export const getUaiData = async ({
  uai,
  millesime,
}: {
  uai: string;
  millesime: string;
}) => {
  try {
    const response = await instance.get(`/UAI/${uai}/millesime/${millesime}`);
    const data = JSON.parse(response.data);
    return formatUaiData(data);
  } catch (e) {
    if (axios.isAxiosError(e)) return undefined;
    throw e;
  }
};

export const getRegionData = async ({
  codeRegionIj,
  millesime,
}: {
  codeRegionIj: string;
  millesime: string;
}) => {
  try {
    const response = await instance.get(
      `/region/${codeRegionIj}/millesime/${millesime}`
    );
    return formatRegionData(response.data);
  } catch (e) {
    if (axios.isAxiosError(e)) return undefined;
    throw e;
  }
};

export const inserJeunesApi = { getUaiData, getRegionData };

// if (
//   response &&
//   (config.retried || ![500, 401, undefined].includes(response?.status))
// ) {
//   return Promise.reject(err);
// }
// if (!response) {
//   process.stdout.write(`\rNo response from InserJeunes`);
//   await new Promise((resolve) => setTimeout(resolve, 10000));
//   config.retried = true;
//   return axios({
//     ...config,
//     headers: {
//       ...config.headers,
//     },
//   });
// } else if (!config.retried) {
//   // process.stdout.write(`\rRetry with new token`);
//   config.retried = true;
//   const token = await login();
//   instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//   await new Promise((resolve) => setTimeout(resolve, 10000));
//   return axios({
//     ...config,
//     headers: {
//       ...config.headers,
//       Authorization: `Bearer ${token}`,
//     },
//   });
// }
